const fetch = require("node-fetch");
const fs = require("fs");

const sendMedia = (req, res) => {
  const { url } = req.body;

  let initialTime = Date.now();
  fetch(url)
    .then((res) => res.blob())
    .then(async (blob) => {
      console.log("got blob");
      console.log("Took " + (Date.now() - initialTime) / 1000 + "s");
      //   const title = "video";

      //   const file = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // console.log("bytelength: ", buffer.byteLength());
      //   const arrayByte = new Uint8Array(arrayBuffer);

      res.writeHead(200, {
        "content-type": "application/octet-stream",
      });

      console.log("converted to buffer");
      res.write(buffer);
      //   const writeStream = fs.createWriteStream(arrayByte);

      //   res.sendFile(buffer);
      res.end();
      //   const buffer = Buffer.from(file, "binary");
      //   file.pipe(fs.createWriteStream(`${title}.mp4`));
      //   fs.writeFileSync(`${title}12.mp4`, buffer);
    })
    .catch((err) => console.log(err));
};

module.exports = { sendMedia };
