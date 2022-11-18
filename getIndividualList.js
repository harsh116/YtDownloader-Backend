const cheerio = require("cheerio");
const fetch = require("node-fetch");

// const GetVideo = require("./GetVideo");
// const GetAudio = require("./GetAudio");
const {
  generateIndividualVideoDownloadURL,
} = require("./generateVideoDownloadURLS");
const {
  generateIndividualAudioDownloadURL,
} = require("./generateAudioDownloadURLS");
// const { getData } = require("./getData");

// const fs = require("fs");

const main = async (url, q, playListName = "videos") => {
  const { videoURL, title } = await generateIndividualVideoDownloadURL(
    playListName,
    url,
    q
  );

  return { playListName, videoURL, title };

  // return { list, playListName };

  // console.log('videoList: ',videoList)
  // for (let videoli of videoList) {

  // }
};

const mainAudio = async (url, playListName = "audios") => {
  const { audioURL, title } = await generateIndividualAudioDownloadURL(
    playListName,
    url
  );

  return { playListName, audioURL, title };
};

const getIndividualList = async (req, res) => {
  const { urls, type, quality } = req.body;

  // res.json("done");
  // return;
  if (urls.length == 0) {
    console.log("Please start typing video links separated by commas");
    res.status(400).json("URL field was empty ");
  } else {
    // const str2 = fs.readFileSync("playlist/" + "quality.txt").toString();
    const list1 = urls.split(",");
    // const list2 = str2.split(/\s+/g);

    let x = 0;
    const videosURLs = [];
    for (let lis of list1) {
      lis = lis.trimStart();
      lis = lis.trimEnd();
      if (
        lis.length == 0 ||
        !(lis.length > 4 && lis.substr(0, 4).toLowerCase() === "http")
      ) {
        console.log("Invalid url");
        videosURLs.push({ list: "Error", playListName: "NULL" });
        continue;
      }
      console.log("lis: ", lis);

      if (type === "video") {
        const { playListName, videoURL, title } = await main(lis, quality);
        videosURLs.push({
          playListName,
          videoURL,
          title,
        });
      } else {
        const { audioURL, playListName, title } = await mainAudio(lis);
        videosURLs.push({
          playListName,
          audioURL,
          title,
        });
      }

      x++;
    }

    res.status(200).json(videosURLs);
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
module.exports = { getIndividualList: allowCors(getIndividualList) };
