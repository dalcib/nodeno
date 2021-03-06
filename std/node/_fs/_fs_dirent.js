import {notImplemented} from "../_utils.js";
export default class Dirent {
  constructor(entry) {
    this.entry = entry;
  }
  isBlockDevice() {
    notImplemented("Deno does not yet support identification of block devices");
    return false;
  }
  isCharacterDevice() {
    notImplemented("Deno does not yet support identification of character devices");
    return false;
  }
  isDirectory() {
    return this.entry.isDirectory;
  }
  isFIFO() {
    notImplemented("Deno does not yet support identification of FIFO named pipes");
    return false;
  }
  isFile() {
    return this.entry.isFile;
  }
  isSocket() {
    notImplemented("Deno does not yet support identification of sockets");
    return false;
  }
  isSymbolicLink() {
    return this.entry.isSymlink;
  }
  get name() {
    return this.entry.name;
  }
}
