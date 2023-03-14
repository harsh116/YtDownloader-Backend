const GetAudio = require("./GetAudio");
const { getData } = require("./getData");
const FileSystemCache_1 = require("./FileSystemCache_1");
const { promiseSetTimeOut, getExpiryTimeInHours } = require("./helper");

const ONE_DAY_IN_SECONDS = 3600 * 24;

const regExURL = /[?:&"\/|]+/g;

const generateAudioDownloadURLS = async (playListName, list, q) => {
  // console.log(
  // "🚀 ~ file: generateAudioDownloadURLS.js ~ line 9 ~ generateAudioDownloadURLS ~ list",
  // list
  // );
  let i = 1;

  const audioOptions = {
    basePath: "/tmp/audio", // Optional. Path where cache files are stored (default).
    ns: `audio`, // Optional. A grouping namespace for items.
  };

  const audioCache = new FileSystemCache_1.FileSystemCache(audioOptions);

  const audioList = [];
  for (let lis of list) {
    let title = await getData(lis);
    title = title.replace(regExURL, " ");
    // console.log(
    // "🚀 ~ file: generateAudioDownloadURLS.js ~ line 26 ~ generateAudioDownloadURLS ~ title",
    // title
    // );

    let data = {};

    const elsePart = async () => {
      data = await GetAudio(lis, title, q);
      // console.log(
      // "🚀 ~ file: generateAudioDownloadURLS.js ~ line 32 ~ elsePart ~ data",
      // data
      // );
      data["expiry_time"] = getExpiryTimeInHours(100000000);

      const downURL = data.urlDown;
      console.log(i, ": ", downURL);

      const httpRegex = /^http\.*/;
      if (!httpRegex.test(downURL)) {
        console.log("deteced", title);
        // continue;
      } else {
        // audioCache.set(lis, data,ONE_DAY_IN_SECONDS*6);
      }

      await promiseSetTimeOut(1000);
      audioList.push({ downURL, title, type: "mp3", quality: q });
      // console.log(
      // "🚀 ~ file: generateAudioDownloadURLS.js ~ line 48 ~ elsePart ~ audioList",
      // audioList
      // );
    };
    // till above everything is working fine. analyzing below if part
    if (await audioCache.fileExists(lis)) {
      data = await audioCache.get(lis);
      if (data.expiry_time < Date.now()) {
        audioCache.remove(lis);
        await elsePart();
        continue;
      }

      const downURL = data.urlDown;
      console.log(i, ": ", downURL);
      audioList.push({ downURL, title, type: "mp3" });
      // console.log(
      // "🚀 ~ file: generateAudioDownloadURLS.js ~ line 62 ~ generateAudioDownloadURLS ~ audioList",
      // audioList
      // );
    } else {
      await elsePart();
    }
    i++;
    // .then(async (data) => {
    // let title = data.title;

    // await mainDownload(playListName, downURL, title, "video");
    // });
  }

  // console.log(
  // "🚀 ~ file: generateAudioDownloadURLS.js ~ line 76 ~ generateAudioDownloadURLS ~ audioList",
  // audioList
  // );
  return audioList;
};

const generateIndividualAudioDownloadURL = async (playListName, lis, q) => {
  let i = 1;

  const audioOptions = {
    basePath: "/tmp/audio", // Optional. Path where cache files are stored (default).
    ns: `audio`, // Optional. A grouping namespace for items.
  };

  const audioCache = new FileSystemCache_1.FileSystemCache(audioOptions);

  // const audioList = [];
  // for (let lis of list) {
  let title = await getData(lis);
  title = title.replace(regExURL, " ");

  let data = {};

  const elsePart = async () => {
    data = await GetAudio(lis, title, q);

    const downURL = data.urlDown;
    console.log(i, ": ", downURL);

    const httpRegex = /^http\.*/;
    if (!httpRegex.test(downURL)) {
      console.log("deteced", title);
      // continue;
    } else {
      // audioCache.set(lis, data);
      // audioCache.set(lis, data,ONE_DAY_IN_SECONDS*6);
    }

    await promiseSetTimeOut(1000);
    return { audioURL: downURL, title, quality: q };
  };

  if (await audioCache.fileExists(lis)) {
    data = await audioCache.get(lis);
    if (data.expiry_time < Date.now()) {
      audioCache.remove(lis);
      return await elsePart();
    }
    const downURL = data.urlDown;
    console.log(i, ": ", downURL);
    return { audioURL: downURL, title };
  } else {
    return await elsePart();
  }

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
