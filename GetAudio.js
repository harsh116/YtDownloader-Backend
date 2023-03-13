const { videoLinkHOST } = require("./constants");
const fetch = require("node-fetch");
const { promiseSetTimeOut } = require("./helper");
const { createFileBin } = require("./createFilebin");
const { upload } = require("./upload");

const fetching = async (url, q) => {
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

async function GetAudio(url, title, q = "128") {
  let data;
  try {
    let initialTime = Date.now();
    data = await fetching(url, q);
    // console.log("got blob");
    // console.log("Took " + (Date.now() - initialTime) / 1000 + "s");
    //   const title = "video";

    //   const file = await res.blob();
    // const arrayBuffer = await blob.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    // initialTime = Date.now();
    // const binname = await createFileBin();

    // const urlDown = await upload(binname, buffer, title);
    // console.log("Took " + (Date.now() - initialTime) / 1000 + "s");

    // return { urlDown, title };
    return data;

    //   const arrayByte = new Uint8Array(arrayBuffer);

    // return buffer;
  } catch (err) {
    console.log(err);
    await promiseSetTimeOut(2000);
    return await GetAudio(url);
  }
}

module.exports = GetAudio;
