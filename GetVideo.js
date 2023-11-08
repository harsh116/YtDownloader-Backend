const { videoLinkHOST } = require("./constants");
const fetch = require("node-fetch");
const { promiseSetTimeOut } = require("./helper");
const ytdl = require("ytdl-core");
const tiny = require("tinyurl");

const getDownloadLinkByItag = (formats, itag) => {
  const formatObj = formats.find((format) => format.itag === Number(itag));
  if (formatObj.itag === 140) {
    return { url: formatObj.url, cL: formatObj.contentLength };
  }
  return formatObj.url;
};

const getVideoLink = async (url) => {
  const info = await ytdl.getInfo(url);

  const { formats } = info;

  // console.log("formats: ", formats);

  const title = info.videoDetails.title;

  let quality = "360";
  const iTag = "18";

  let dURL = getDownloadLinkByItag(formats, iTag);

  dURL = dURL + `&title=${encodeURIComponent(title)}`;

  // const urlDown = await tiny.shorten(dURL);
  console.log("video durl: ", dURL);

  return { urlDown: dURL, title, highestQ: "720", quality: "360" };
};

const fetching = async (url, q = "480") => {
  if (q === "360") {
    return await getVideoLink(url);
  }

  const res = await fetch(`${videoLinkHOST}/getLink`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      url,
      q,
    }),
  });
  const data = await res.json();

  return data;
};

async function GetVideo(url, q) {
  let data;
  // q = Number(q);
  try {
    data = await fetching(url, q);
    return data;
  } catch (err) {
    console.log(err);
    await promiseSetTimeOut(10000);
    try {
      data = await fetching(url, q);
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

// async function GetVideo(url, q = "480") {
//   const res = await fetch(`${videoLinkHOST}/getVideoLink`, {
//     method: "POST",
//     mode: "cors",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify({
//       url,
//       q,
//     }),
//   });
//   const data = await res.json();

//   return data;
// }

module.exports = GetVideo;
