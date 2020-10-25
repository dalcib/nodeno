import {decode, encode} from "../encoding/utf8.js";
export class StringWriter {
  constructor(base = "") {
    this.base = base;
    this.chunks = [];
    this.byteLength = 0;
    const c = encode(base);
    this.chunks.push(c);
    this.byteLength += c.byteLength;
  }
  write(p) {
    return Promise.resolve(this.writeSync(p));
  }
  writeSync(p) {
    this.chunks.push(p);
    this.byteLength += p.byteLength;
    this.cache = void 0;
    return p.byteLength;
  }
  toString() {
    if (this.cache) {
      return this.cache;
    }
    const buf = new Uint8Array(this.byteLength);
    let offs = 0;
    for (const chunk of this.chunks) {
      buf.set(chunk, offs);
      offs += chunk.byteLength;
    }
    this.cache = decode(buf);
    return this.cache;
  }
}
