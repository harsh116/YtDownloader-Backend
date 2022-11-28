const fs = require("fs");
const crypto = require("crypto");
const { unique } = require("./generateHash");

class FileSystemCache {
  constructor(options = {}) {
    this.basePath = options.basePath;
    this.ns = options.ns;
  }

  async fileExists(key) {
    // const hash = crypto.createHash("sha256", key).digest(key);
    const hash = unique(key, { format: "string" });
    if (fs.existsSync(`${this.basePath}/${hash}`)) {
      return true;
    } else {
      return false;
    }
  }

  async get(key, defaultValue = null) {
    // const hash = crypto.createHash("sha256", key).digest(key); //?
    const hash = unique(key, { format: "string" });
    if (!this.fileExists(key)) {
      return defaultValue;
    }
    const str = fs.readFileSync(`${this.basePath}/${hash}`).toString();
    let obj = {};
    if (str) {
      obj = JSON.parse(str);
      return obj.value;
    } else {
      return defaultValue;
    }
  }

  set(key, value) {
    // const hash = crypto.createHash("sha256", key).digest(key);
    const hash = unique(key, { format: "string" });

    const dir = this.basePath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const obj = { value };
    const str = JSON.stringify(obj);
    fs.writeFileSync(`${this.basePath}/${hash}`, str);
  }

  remove(key) {
    // const hash = crypto.createHash("sha256", key).digest(key);
    const hash = unique(key, { format: "string" });
    const dir = this.basePath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (this.fileExists(key)) {
      fs.unlinkSync(`${this.basePath}/${hash}`);
    }
  }
  clear() {}
}

module.exports = {
  FileSystemCache,
};
