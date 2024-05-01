const { videoLinkHOST, videoLinkHOSTYTDL } = require("../constants");
const fetch = require("node-fetch");

async function GetAudio(url, title, q = "128") {
  let data;
  // q = Number(q);
  try {
    // data = await fetching(url, q);
    let querystr = "";
    querystr += "url=";
    querystr += encodeURIComponent(url);
    querystr += "&";
    querystr += "title=";
    querystr += encodeURIComponent(title);
    querystr += "&";
    querystr += "q=";
    querystr += encodeURIComponent(q);
    const res = await fetch(`${videoLinkHOSTYTDL}/getaudio?${querystr}`);
    const data = res.json();

    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

// const { promiseSetTimeOut } = require("../helpers/helper");
// // const { createFileBin } = require("./createFilebin");
// // const { upload } = require("./upload");

// const ytdl = require("ytdl-core");
// const tiny = require("tinyurl");

// const getDownloadLinkByItag = (formats, itag) => {
//   const formatObj = formats.find((format) => format.itag === Number(itag));
//   if (formatObj.itag === 140) {
//     return { url: formatObj.url, cL: formatObj.contentLength };
//   }
//   return formatObj.url;
// };

// const getAudioLink = async (url) => {
//   const info = await ytdl.getInfo(url);

//   const { formats } = info;

//   // console.log("formats: ", formats);

//   const title = info.videoDetails.title;

//   let quality = "128";
//   const iTag = "140";

//   let dobj = getDownloadLinkByItag(formats, iTag);
//   let dURL = dobj.url;
//   const end = dobj.cL;
//   dURL = dURL + `&title=${encodeURIComponent(title)}&range=0-${end}`;

//   console.log("audio durl: ", dURL);
//   // const urlDown = await tiny.shorten(dURL);
//   return { urlDown: dURL, title };
// };

// const fetching = async (url, q) => {
//   if (q === "128") {
//     return await getAudioLink(url);
//   }
//   const res = await fetch(`${videoLinkHOST}/getLink`, {
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
// };

// async function GetAudio(url, title, q = "128") {
//   let data;
//   try {
//     let initialTime = Date.now();
//     data = await fetching(url, q);
//     // console.log("got blob");
//     // console.log("Took " + (Date.now() - initialTime) / 1000 + "s");
//     //   const title = "video";

//     //   const file = await res.blob();
//     // const arrayBuffer = await blob.arrayBuffer();
//     // const buffer = Buffer.from(arrayBuffer);

//     // initialTime = Date.now();
//     // const binname = await createFileBin();

//     // const urlDown = await upload(binname, buffer, title);
//     // console.log("Took " + (Date.now() - initialTime) / 1000 + "s");

//     // return { urlDown, title };
//     return data;

//     //   const arrayByte = new Uint8Array(arrayBuffer);

//     // return buffer;
//   } catch (err) {
//     console.log(err);
//     await promiseSetTimeOut(2000);
//     try {
//       data = await fetching(url, q);
//       return data;
//     } catch (err) {
//       console.log(err);
//       return err;
//     }
//   }
// }

module.exports = GetAudio;
