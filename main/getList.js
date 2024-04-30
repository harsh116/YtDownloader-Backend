const cheerio = require("cheerio");
const fetch = require("node-fetch");

// const GetVideo = require("./GetVideo");
// const GetAudio = require("./GetAudio");
const { generateVideoDownloadURLS } = require("./generateVideoDownloadURLS");
const { generateAudioDownloadURLS } = require("./generateAudioDownloadURLS");
const { getData } = require("../helpers/getData");
const { getExpiryTimeInHours } = require("../helpers/helper");
const { redisClient } = require("../states/redis");
const responseState = require("../states/responseState");

// const fs = require("fs");
const FileSystemCache_1 = require("../states/FileSystemCache_1");

const playlistoptions = {
  basePath: "/tmp/playlist", // Optional. Path where cache files are stored (default).
  ns: "playlist", // Optional. A grouping namespace for items.
};
// fs.writeFileSync()

// const promiseSetTimeOut = (time) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, time);
//   });
// };

const playlistCache = new FileSystemCache_1.FileSystemCache(playlistoptions);

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// const VALID_Q = ["144", "240", "360", "480", "720", "1080"];

const regExURL = /[?:&"\/|]+/g;

// app.use(express.static(__dirname + "/public"));
// const { scrapePage } = require("./scraper");

const { getPlayListURLS } = require("../helpers/playlist");

const gettingVideosURL = async (url) => {
  let playListName = await getData(url);
  if (!playListName || playListName == "null") {
    console.log(
      "Error in accesing playlist. Make sure to have your playlist visibility is unlisted or public"
    );
    return;
  }
  playListName = playListName.replace(regExURL, " ");
  console.log("playlist name: ", playListName);
  let obj = {};
  const elsePart = async () => {
    console.log("playlistdata  not found in cache");
    // const list = await scrapePage(url);

    // now using ytpl instead of directly scraping from web
    // const list = await scrapePage(url);
    const list = await getPlayListURLS(url);

    obj["expiry_time"] = getExpiryTimeInHours(1);

    // list contains url of al videos in a playlist
    obj["list"] = list;
    await playlistCache.set(url, obj);
  };
  if (await playlistCache.fileExists(url)) {
    // if (false) {
    obj = await playlistCache.get(url);
    console.log("found playlistCache: ", obj);

    if (obj.expiry_time < Date.now()) {
      playlistCache.remove(url);

      await elsePart();
    }
  } else {
    await elsePart();
  }

  return { list: obj.list, playListName };
};

const main = async (url, q) => {
  const { list, playListName } = await gettingVideosURL(url);
  const videoList = await generateVideoDownloadURLS(playListName, list, q);

  return { playListName, videoList };

  // return { list, playListName };

  // console.log('videoList: ',videoList)
  // for (let videoli of videoList) {

  // }
};

const mainAudio = async (url, q = "128") => {
  const { list, playListName } = await gettingVideosURL(url);
  const audioList = await generateAudioDownloadURLS(playListName, list, q);

  return { playListName, audioList };
};

const getList = async (req, res) => {
  redisClient.on("connect", () => {
    console.log("redis connected");
  });

  let { playlistURL, quality, type } = req.body;
  playlistURL = playlistURL.trimStart();
  playlistURL = playlistURL.trimEnd();

  console.log("playlistURL: ", playlistURL);
  // res.json("done");
  // return;
  if (playlistURL.length == 0) {
    console.log(
      "Please start typing playlist links separated by space or new line"
    );
    res.status(400).json("URL field was empty ");
  } else {
    // const str2 = fs.readFileSync("playlist/" + "quality.txt").toString();
    const list1 = playlistURL.split(/\s+/g);
    // const list2 = str2.split(/\s+/g);

    let x = 0;
    const playlistVideoURLs = [];

    const mainTask = async () => {
      for (let lis of list1) {
        if (
          lis.length == 0 ||
          !(lis.length > 4 && lis.substr(0, 4).toLowerCase() === "http")
        ) {
          console.log("Invalid url");
          playlistVideoURLs.push({ list: "Error", playListName: "NULL" });
          continue;
        }
        console.log("lis: ", lis);

        if (type === "video") {
          const obj = await main(lis, quality);
          console.log("🚀 ~ file: getList.js ~ line 131 ~ mainTask ~ obj", obj);
          playlistVideoURLs.push({
            videoList: obj.videoList,
            playListName: obj.playListName,
          });
        } else {
          const obj = await mainAudio(lis, quality);
          console.log("🚀 ~ file: getList.js ~ line 138 ~ mainTask ~ obj", obj);
          playlistVideoURLs.push({
            audioList: obj.audioList,
            playListName: obj.playListName,
          });
        }

        x++;
      }

      console.log(
        "🚀 ~ file: getList.js ~ line 150 ~ mainTask ~ playlistVideoURLs",
        playlistVideoURLs
      );
      responseState.setState(true);
      responseState.setData(playlistVideoURLs);
    };

    responseState.setState(false);
    responseState.setData(null);

    mainTask();

    res.json("getting List");
    // res.status(200).json(playlistVideoURLs);
  }
};

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// module.exports = allowCors(getList);
module.exports = { getList: allowCors(getList) };

// const cacheClearStatus = fs.readFileSync("playlist/clear_cache.txt").toString();

// const playlistURL = fs.readFileSync("playlist/" + "playlist.txt").toString();
