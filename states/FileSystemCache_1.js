const fs = require("fs");
const crypto = require("crypto");
const { unique } = require("../helpers/generateHash");
const { redisClient } = require("./redis");

// Class to deal with redis functions and managing keys and value is JSON
class FileSystemCache {
  constructor(options = {}) {
    this.basePath = options.basePath;
    this.ns = options.ns;
  }

  async fileExists(key) {
    // const hash = crypto.createHash("sha256", key).digest(key);
    // const hash = unique(key, { format: "string" });
    // if (fs.existsSync(`${this.basePath}/${hash}`)) {
    //   return true;
    // } else {
    //   return false;
    // }
    const newKey = this.basePath + "_" + key;
    if (await redisClient.exists(newKey)) {
      return true;
    } else {
      return false;
    }
  }

  async get(key, defaultValue = null) {
    // const hash = crypto.createHash("sha256", key).digest(key); //?
    // const hash = unique(key, { format: "string" });
    const newKey = this.basePath + "_" + key;
    if (!this.fileExists(newKey)) {
      return defaultValue;
    }
    // const str = fs.readFileSync(`${this.basePath}/${hash}`).toString();
    const str = await redisClient.get(newKey);
    let obj = {};
    if (str) {
      obj = JSON.parse(str);
      return obj.value;
    } else {
      return defaultValue;
    }
  }

  set(key, value, time = 3600 * 0.5) {
    // const hash = crypto.createHash("sha256", key).digest(key);
    // const hash = unique(key, { format: "string" });

    // const dir = this.basePath;
    const newKey = this.basePath + "_" + key;
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir, { recursive: true });
    // }

    const obj = { value };
    const str = JSON.stringify(obj);
    // fs.writeFileSync(`${this.basePath}/${hash}`, str);

    redisClient.set(newKey, str, "EX", time);
    // redisClient.set(newKey, str);
  }

  remove(key) {
    // const hash = crypto.createHash("sha256", key).digest(key);
    // const hash = unique(key, { format: "string" });
    // const dir = this.basePath;
    const newKey = this.basePath + "_" + key;
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir, { recursive: true });
    // }

    if (this.fileExists(key)) {
      // fs.unlinkSync(`${this.basePath}/${hash}`);
      redisClient.del(newKey);
    }
  }
  clear() {}
}

module.exports = {
  FileSystemCache,
};
