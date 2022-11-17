const cheerio = require("cheerio");
const fetch = require("node-fetch");

const GetVideo = require("./GetVideo");
const GetAudio = require("./GetAudio");

const fs = require("fs");
const FileSystemCache_1 = require("file-system-cache");

const playlistoptions = {
  basePath: "./.cache/playlist", // Optional. Path where cache files are stored (default).
  ns: "playlist", // Optional. A grouping namespace for items.
};
// fs.writeFileSync()

const promiseSetTimeOut = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
const playlistCache = new FileSystemCache_1.FileSystemCache(playlistoptions);

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const VALID_Q = ["144", "240", "360", "480", "720", "1080"];

const regExURL = /[?:&"\/|]+/g;

const getData = async (url) => {
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text() ||
    $('meta[name="title"]').attr("content");
  return title;
};

// app.use(express.static(__dirname + "/public"));
const { scrapePage } = require("./scraper");
const { generateAudioDownloadURLS } = require("./getAudioList");

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
  let list = [];
  if (await playlistCache.fileExists(url)) {
    list = await playlistCache.get(url);
  } else {
    list = await scrapePage(url);
    await playlistCache.set(url, list);
  }

  return { list, playListName };
};

const generateVideoDownloadURLS = async (playListName, list, q) => {
  let i = 1;

  if (!q || !VALID_Q.includes(q)) {
    q = "480";
  }

  const videoOptions = {
    basePath: "./.cache/videos", // Optional. Path where cache files are stored (default).
    ns: `videos_${q}`, // Optional. A grouping namespace for items.
  };

  const videoCache = new FileSystemCache_1.FileSystemCache(videoOptions);

  const videoList = [];
  for (let lis of list) {
    let title = await getData(lis);
    title = title.replace(regExURL, " ");

    let data = {};

    if (await videoCache.fileExists(lis)) {
      data = await videoCache.get(lis);
      const downURL = data.urlDown;
      console.log(i, ": ", downURL);
      videoList.push({ downURL, title });
    } else {
      data = await GetVideo(lis, q);

      const downURL = data.urlDown;
      console.log(i, ": ", downURL);

      if (downURL === "Error") {
        console.log("deteced", title);
        // continue;
      } else {
        videoCache.set(lis, data);
      }

      await promiseSetTimeOut(1000);
      videoList.push({ downURL, title });
    }
    i++;
    // .then(async (data) => {
    // let title = data.title;

    // await mainDownload(playListName, downURL, title, "video");
    // });
  }

  return videoList;
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

const mainAudio = async (url) => {
  const { list, playListName } = await gettingVideosURL(url);
  const audioList = await generateAudioDownloadURLS(playListName, list);

  return { playListName, audioList };
};

const getList = async (req, res) => {
  const { playlistURL, quality, type } = req.body;

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
      const obj = await main(lis, "");
      playlistVideoURLs.push({
        videoList: obj.videoList,
        playListName: obj.playListName,
      });
      x++;
    }

    res.status(200).json(playlistVideoURLs);
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
