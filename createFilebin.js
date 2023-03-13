const cheerio = require("cheerio");
const fetch = require("node-fetch");

const getData = async (url) => {
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text() ||
    $('meta[name="title"]').attr("content");

  const link = $('a[rel="nofollow"]').attr("href");
  const binname = /net\/(.+)/.exec(link)[1];
  console.log(
    "🚀 ~ file: createFilebin.js ~ line 17 ~ getData ~ binname",
    binname
  );

  return binname;
};

const createFileBin = async () => {
  const url = "https://filebin.net";
  const binname = await getData(url);
  return binname;
};

module.exports = { createFileBin };
