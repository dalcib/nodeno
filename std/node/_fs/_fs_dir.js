import Dirent from "./_fs_dirent.js";
import {assert as assert2} from "../../_util/assert.js";
export default class Dir {
  constructor(path) {
    this.dirPath = path;
  }
  get path() {
    if (this.dirPath instanceof Uint8Array) {
      return new TextDecoder().decode(this.dirPath);
    }
    return this.dirPath;
  }
  read(callback) {
    return new Promise((resolve, reject) => {
      if (!this.asyncIterator) {
        this.asyncIterator = Deno.readDir(this.path)[Symbol.asyncIterator]();
      }
      assert2(this.asyncIterator);
      this.asyncIterator.next().then(({value}) => {
        resolve(value ? value : null);
        if (callback) {
          callback(null, value ? value : null);
        }
      }).catch((err) => {
        if (callback) {
          callback(err, null);
        }
        reject(err);
      });
    });
  }
  readSync() {
    if (!this.syncIterator) {
      this.syncIterator = Deno.readDirSync(this.path)[Symbol.iterator]();
    }
    const file = this.syncIterator.next().value;
    return file ? new Dirent(file) : null;
  }
  close(callback) {
    return new Promise((resolve, reject) => {
      try {
        if (callback) {
          callback(null);
        }
        resolve();
      } catch (err) {
        if (callback) {
          callback(err);
        }
        reject(err);
      }
    });
  }
  closeSync() {
  }
  async *[Symbol.asyncIterator]() {
    try {
      while (true) {
        const dirent = await this.read();
        if (dirent === null) {
          break;
        }
        yield dirent;
      }
    } finally {
      await this.close();
    }
  }
}
