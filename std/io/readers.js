import {encode} from "../encoding/utf8.js";
export class StringReader extends Deno.Buffer {
  constructor(s) {
    super(encode(s).buffer);
  }
}
export class MultiReader {
  constructor(...readers) {
    this.currentIndex = 0;
    this.readers = readers;
  }
  async read(p) {
    const r = this.readers[this.currentIndex];
    if (!r)
      return null;
    const result = await r.read(p);
    if (result === null) {
      this.currentIndex++;
      return 0;
    }
    return result;
  }
}
export class LimitedReader {
  constructor(reader, limit) {
    this.reader = reader;
    this.limit = limit;
  }
  async read(p) {
    if (this.limit <= 0) {
      return null;
    }
    if (p.length > this.limit) {
      p = p.subarray(0, this.limit);
    }
    const n = await this.reader.read(p);
    if (n == null) {
      return null;
    }
    this.limit -= n;
    return n;
  }
}
