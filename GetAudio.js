const { videoLinkHOST } = require("./constants");
const fetch = require("node-fetch");

async function GetAudio(url) {
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
}

module.exports = GetAudio;
