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
  return title;
};

module.exports = {
  getData,
};
