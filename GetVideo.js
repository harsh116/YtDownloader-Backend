const { videoLinkHOST } = require("./constants");
const fetch = require("node-fetch");

async function GetVideo(url, q = "480") {
  const res = await fetch(`${videoLinkHOST}/getVideoLink`, {
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
}

module.exports = GetVideo;
