const { videoLinkHOST } = require("./constants");
const fetch = require("node-fetch");
const { promiseSetTimeOut } = require("./helper");

const fetching = async (url, q = "480") => {
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
};

async function GetVideo(url, q) {
  let data;
  try {
    data = await fetching(url, q);
    return data;
  } catch (err) {
    console.log(err);
    await promiseSetTimeOut(2000);
    return await GetVideo(url, q);
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
