const GetVideo = require("./GetVideo");
const { getData } = require("./getData");
const FileSystemCache_1 = require("file-system-cache");
const { promiseSetTimeOut } = require("./helper");

const regExURL = /[?:&"\/|]+/g;

const VALID_Q = ["144", "240", "360", "480", "720", "1080"];



const generateVideoDownloadURLS = async (playListName, list, q) => {
  let i = 1;

  if (!q || !VALID_Q.includes(q)) {
    q = "480";
  }

  const videoList = [];
  let videoOptions = {
    basePath: "./.cache/videos", // Optional. Path where cache files are stored (default).
    ns: `videos`, // Optional. A grouping namespace for items.
  };

  let videoCache = new FileSystemCache_1.FileSystemCache(videoOptions);

  const videoLisRecur=async(lis,q)=>{
  let title = await getData(lis);
    title = title.replace(regExURL, " ");

    let obj = {};

    const videoLisRecurElse=async()=>{
      let data = await GetVideo(lis, q);
      let quality = data.quality;
      obj[quality]=data

      const downURL = data.urlDown;
      console.log(i, ": ", downURL);

      if (downURL === "Error") {
        console.log("deteced", title);
        // continue;
      } else {
        videoCache.set(lis, obj);
      }

      await promiseSetTimeOut(1000);
      const titleQuality = `${title} ${quality}`;
      console.log(titleQuality);
      videoList.push({ downURL, titleQuality });
    }

    if (await videoCache.fileExists(lis)) {
      obj = await videoCache.get(lis);
      if(obj[q])
      {
        const data=obj[q]
        const downURL = data.urlDown;
      const quality = data.quality;
      console.log(i, ": ", downURL);
      const titleQuality = `${title} ${quality}`;
      console.log(titleQuality);

      videoList.push({ downURL, titleQuality });
      }
      else{
        const keys=Object.keys(obj)
        const {highestQ}=obj[keys[0]]
        const quality= Number(highestQ) > Number(q) ? q : highestQ;

        if(keys.includes(quality))
        {
          await videoLisRecur(lis,quality)  
        }
        else{
            await videoLisRecurElse()
        }
        
      }

      
    } else {
      await videoLisRecurElse()
    }
}



  
  for (let lis of list) {
    await videoLisRecur(lis,q)
    i++;
    // .then(async (data) => {
    // let title = data.title;

    // await mainDownload(playListName, downURL, title, "video");
    // });
  }
  console.log(" ");
  return videoList;
};

const generateIndividualVideoDownloadURL = async (playListName, lis, q) => {
  let i = 1;

  if (!q || !VALID_Q.includes(q)) {
    q = "480";
  }

  let videoOptions = {
    basePath: "./.cache/videos", // Optional. Path where cache files are stored (default).
    ns: `videos_${q}`, // Optional. A grouping namespace for items.
  };

  let videoCache = new FileSystemCache_1.FileSystemCache(videoOptions);



  // const videoList = [];
  // for (let lis of list) {
  let title = await getData(lis);
  title = title.replace(regExURL, " ");

  let data = {};

  if (await videoCache.fileExists(lis)) {
    data = await videoCache.get(lis);
    const downURL = data.urlDown;
    const quality = data.quality;
    console.log(i, ": ", downURL);
    const titleQuality = `${title} ${quality}`;
    console.log(titleQuality);

    return { videoURL: downURL, title: titleQuality };
  } else {
    data = await GetVideo(lis, q);
    let quality = data.quality;

    videoOptions = {
      basePath: "./.cache/videos", // Optional. Path where cache files are stored (default).
      ns: `videos_${quality}`, // Optional. A grouping namespace for items.
    };

    videoCache = new FileSystemCache_1.FileSystemCache(videoOptions);

    const downURL = data.urlDown;
    console.log(i, ": ", downURL);

    if (downURL === "Error") {
      console.log("deteced", title);
      // continue;
    } else {
      videoCache.set(lis, data);
    }

    await promiseSetTimeOut(1000);
    const titleQuality = `${title} ${quality}`;
    console.log(titleQuality);
    return { videoURL: downURL, title: titleQuality };
  }

  // .then(async (data) => {
  // let title = data.title;

  // await mainDownload(playListName, downURL, title, "video");
  // });
  // }
  console.log(" ");
  return videoList;
};

module.exports = {
  generateVideoDownloadURLS,
  generateIndividualVideoDownloadURL,
};
