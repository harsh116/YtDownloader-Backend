const GetAudio = require("./GetAudio");
const { getData } = require("./getData");
const FileSystemCache_1 = require("file-system-cache");
const { promiseSetTimeOut } = require("./helper");

const regExURL = /[?:&"\/|]+/g;

const generateAudioDownloadURLS = async (playListName, list) => {
  let i = 1;

  const audioOptions = {
    basePath: "./.cache/audio", // Optional. Path where cache files are stored (default).
    ns: `audio`, // Optional. A grouping namespace for items.
  };

  const audioCache = new FileSystemCache_1.FileSystemCache(audioOptions);

  const audioList = [];
  for (let lis of list) {
    let title = await getData(lis);
    title = title.replace(regExURL, " ");

    let data = {};

    if (await audioCache.fileExists(lis)) {
      data = await audioCache.get(lis);
      const downURL = data.urlDown;
      console.log(i, ": ", downURL);
      audioList.push({ downURL, title });
    } else {
      data = await GetAudio(lis);

      const downURL = data.urlDown;
      console.log(i, ": ", downURL);

      if (downURL === "Error") {
        console.log("deteced", title);
        // continue;
      } else {
        audioCache.set(lis, data);
      }

      await promiseSetTimeOut(1000);
      audioList.push({ downURL, title });
    }
    i++;
    // .then(async (data) => {
    // let title = data.title;

    // await mainDownload(playListName, downURL, title, "video");
    // });
  }

  return audioList;
};

const generateIndividualAudioDownloadURL = async (playListName, lis) => {
  let i = 1;

  const audioOptions = {
    basePath: "./.cache/audio", // Optional. Path where cache files are stored (default).
    ns: `audio`, // Optional. A grouping namespace for items.
  };

  const audioCache = new FileSystemCache_1.FileSystemCache(audioOptions);

  // const audioList = [];
  // for (let lis of list) {
  let title = await getData(lis);
  title = title.replace(regExURL, " ");

  let data = {};

  if (await audioCache.fileExists(lis)) {
    data = await audioCache.get(lis);
    const downURL = data.urlDown;
    console.log(i, ": ", downURL);
    return { audioURL: downURL, title };
  } else {
    data = await GetAudio(lis);

    const downURL = data.urlDown;
    console.log(i, ": ", downURL);

    if (downURL === "Error") {
      console.log("deteced", title);
      // continue;
    } else {
      audioCache.set(lis, data);
    }

    await promiseSetTimeOut(1000);
    return { audioURL: downURL, title };
  }
  i++;
  // .then(async (data) => {
  // let title = data.title;

  // await mainDownload(playListName, downURL, title, "video");
  // });
  // }

  return audioList;
};

module.exports = {
  generateAudioDownloadURLS,
  generateIndividualAudioDownloadURL,
};
