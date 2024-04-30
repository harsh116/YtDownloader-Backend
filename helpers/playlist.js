const ytpl = require("ytpl");

const getPlayListURLS = async (pURL) => {
  const pregex = /https:\/\/www.youtube.com\/playlist\?list=(.+)&*/;
  const pID = pregex.exec(pURL)?.[1];

  const pInfo = await ytpl(pID, { limit: Infinity });

  console.log("pinfo: ", pInfo);

  const urlList = pInfo.items.map((item) => item.shortUrl);

  return urlList;
};

module.exports = {
  getPlayListURLS,
};
