import {concat} from "../bytes/mod.mjs";
import {decode} from "../encoding/utf8.mjs";
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
function str(buf) {
  if (buf == null) {
    return "";
  } else {
    return decode(buf);
  }
}
function charCode(s) {
  return s.charCodeAt(0);
}
export class TextProtoReader {
  constructor(r) {
    this.r = r;
  }
  async readLine() {
    const s = await this.readLineSlice();
    if (s === null)
      return null;
    return str(s);
  }
  async readMIMEHeader() {
    const m = new Headers();
    let line;
    let buf = await this.r.peek(1);
    if (buf === null) {
      return null;
    } else if (buf[0] == charCode(" ") || buf[0] == charCode("	")) {
      line = await this.readLineSlice();
    }
    buf = await this.r.peek(1);
    if (buf === null) {
      throw new Deno.errors.UnexpectedEof();
    } else if (buf[0] == charCode(" ") || buf[0] == charCode("	")) {
      throw new Deno.errors.InvalidData(`malformed MIME header initial line: ${str(line)}`);
    }
    while (true) {
      const kv = await this.readLineSlice();
      if (kv === null)
        throw new Deno.errors.UnexpectedEof();
      if (kv.byteLength === 0)
        return m;
      let i = kv.indexOf(charCode(":"));
      if (i < 0) {
        throw new Deno.errors.InvalidData(`malformed MIME header line: ${str(kv)}`);
      }
      const key = str(kv.subarray(0, i));
      if (key == "") {
        continue;
      }
      i++;
      while (i < kv.byteLength && (kv[i] == charCode(" ") || kv[i] == charCode("	"))) {
        i++;
      }
      const value = str(kv.subarray(i)).replace(invalidHeaderCharRegex, encodeURI);
      try {
        m.append(key, value);
      } catch {
      }
    }
  }
  async readLineSlice() {
    let line;
    while (true) {
      const r = await this.r.readLine();
      if (r === null)
        return null;
      const {line: l, more} = r;
      if (!line && !more) {
        if (this.skipSpace(l) === 0) {
          return new Uint8Array(0);
        }
        return l;
      }
      line = line ? concat(line, l) : l;
      if (!more) {
        break;
      }
    }
    return line;
  }
  skipSpace(l) {
    let n = 0;
    for (let i = 0; i < l.length; i++) {
      if (l[i] === charCode(" ") || l[i] === charCode("	")) {
        continue;
      }
      n++;
    }
    return n;
  }
}
