const cheerio = require("cheerio");
const fetch = require("node-fetch");

const fs = require("fs");
const FileSystemCache_1 = require("file-system-cache");

const playlistoptions = {
  basePath: "./.cache/playlist", // Optional. Path where cache files are stored (default).
  ns: "playlist", // Optional. A grouping namespace for items.
};
// fs.writeFileSync()
// const videoOptions = {
//   basePath: "./.cache/videos", // Optional. Path where cache files are stored (default).
//   ns: "videos", // Optional. A grouping namespace for items.
// };
const playlistCache = new FileSystemCache_1.FileSystemCache(playlistoptions);
// const videoCache = new FileSystemCache_1.FileSystemCache(videoOptions);

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

const PORT = process.env.PORT || 8081;
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/build"));
const { scrapePage } = require("./scraper").default;
// const { title } = require("process");

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

const main = async (url, q) => {
  const { list, playListName } = await gettingVideosURL(url);
  return { list, playListName };

  let i = 1;

  if (!q || !VALID_Q.includes(q)) {
    q = "480";
  }

  const videoList = [];
  for (let lis of list) {
    let title = await getData(lis);
    title = title.replace(regExURL, " ");

    const isExist = fs.existsSync(`${playListName}/${title}.mp4`);
    if (isExist) {
      console.log(`${title} already exist`);
      continue;
    }

    let data = {};

    if (await videoCache.fileExists(lis)) {
      data = await videoCache.get(lis);
    } else {
      data = await GetVideo(lis, q);
      videoCache.set(lis, data);
    }
    // .then(async (data) => {
    // let title = data.title;

    const downURL = data.urlDown;
    console.log(i, ": ", downURL);
    i++;

    if (downURL === "Error") {
      console.log("deteced", title);
      continue;
    }

    try {
      const res = await mainDownload(playListName, downURL, title, "video");
      console.log("completed");
    } catch (err) {
      console.log("error: ", err);
    }
    // videoList.push({ downURL, title });
    // await mainDownload(playListName, downURL, title, "video");
    // });
  }
  // console.log('videoList: ',videoList)
  // for (let videoli of videoList) {

  // }
};

// const cacheClearStatus = fs.readFileSync("playlist/clear_cache.txt").toString();

// const str1 = fs.readFileSync("playlist/" + "playlist.txt").toString();

app.post("/getList", async (req, res) => {
  const { str } = req.body;
  const str1 = str;
  console.log("body: ", str1);
  // res.json("done");
  // return;
  if (str1.length == 0) {
    console.log(
      "Please start typing playlist links separated by space or new line"
    );
    res.status(400).json("URL field was empty ");
  } else {
    // const str2 = fs.readFileSync("playlist/" + "quality.txt").toString();
    const list1 = str1.split(/\s+/g);
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
        list: obj.list,
        playListName: obj.playListName,
      });
      x++;
    }

    res.status(200).json(playlistVideoURLs);
  }
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
