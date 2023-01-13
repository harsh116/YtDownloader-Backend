const { videoLinkHOST } = require("./constants");
const fetch = require("node-fetch");
const { promiseSetTimeOut } = require("./helper");

const fetching = async (url) => {
  const res = await fetch(`${videoLinkHOST}/getAudioLink`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      url,
    }),
  });
  const data = await res.json();

  return data;
};

async function GetAudio(url) {
  let data;
  try {
    data = await fetching(url);
    return data;
  } catch (err) {
    console.log(err);
    await promiseSetTimeOut(2000);
    return await GetAudio(url);
  }
}

module.exports = GetAudio;
