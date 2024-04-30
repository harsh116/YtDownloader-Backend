// https://store9.gofile.io/download/a0410e2c-0da8-4e04-a938-98b83ee870e5/song.mp3

// const anonfile = require("anonfile-lib");
// const node = require("node-annonfiles");
// const { uploadAnonFile, getAnonInfo } = require("@sekiju/anonfiles-api");
// const { getDownloadLinkGoFile } = require("./extractDownload");

const fs = require("fs");

const fetch = require("node-fetch");
const FormData = require("form-data");

// const { goFileToken, parentFolderID } = require("./constants");

const upload = async (binName, file, title) => {
  // const file = fs.readFileSync(filePath);
  // let filename0 = /\/(.+\.mp3)$/.exec(filePath)[1];
  let filename0 = title + ".mp3c";

  filename0 = encodeURIComponent(filename0);

  const HOST = "https://filebin.net";

  //   const formData = new FormData();
  //   formData.append("bin", binName);
  //   //   formData.append("filename", fs.readFileSync(filePath));
  //   formData.append("filename", file, filename0);

  try {
    const url = `${HOST}/${binName}/${filename0}`;
    const res = await fetch(url, {
      method: "post",
      body: file,
      headers: {
        "content-type": "application/octet-stream",
      },
    });
    const data = await res.json();
    console.log(data);
    return url;
  } catch (err) {
    console.log(err);
    return null;
  }

  //   let serverData;
  //   try {
  //     const res = await fetch("https://api.gofile.io/getServer");
  //     serverData = await res.json();
  //     console.log(serverData);
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   let folderid;

  //   try {
  //     const formData = new FormData();
  //     formData.append("parentFolderId", "4523432");
  //     formData.append("token", goFileToken);
  //     formData.append("folderName", "songs");
  //     const res = await fetch("https://api.gofile.io/createFolder", {
  //       method: "put",
  //       body: formData,
  //     });
  //     const data = await res.json();
  //     console.log("createFolder: ", data);
  //   } catch (err) {
  //     console.log("createFolder: ", err);
  //   }

  //   const { status, data } = serverData;

  //   const uploadUrl = `https://${data.server}.gofile.io/uploadFile`;

  //   const formData = new FormData();

  //   formData.append("file", file, filename0);
  //   formData.append("token", goFileToken);
  //   //   formData.append("folderId", "17be1c0f-370c-4e48-b9c1-a1a3090fgfe8");

  //   let fileId, fileName, pageLink;
  //   try {
  //     const res2 = await fetch(uploadUrl, {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const uploadedFileData = await res2.json();

  //     fileId = uploadedFileData.data.fileId;
  //     fileName = uploadedFileData.data.fileName;
  //     pageLink = uploadedFileData.data.downloadPage;

  //     console.log("uploadedFile Data: ", uploadedFileData);
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   const goFileDownloadLink = getDownloadLinkGoFile(pageLink);

  //   return goFileDownloadLink;

  //   try {
  //     // If you have not keyAcess let it empty
  //     const uploadFile = await uploadAnonFile(filePath);
  //     console.log("upload: ", JSON.stringify(uploadFile)); // you will get same result on the top
  //     // functions download,getInfo = (id: string) => result json
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   return { goFileDownloadLink, fileId, fileName, pageLink };
};

module.exports = { upload };
