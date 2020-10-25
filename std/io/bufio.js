import {copyBytes} from "../bytes/mod.js";
import {assert as assert2} from "../_util/assert.js";
const DEFAULT_BUF_SIZE = 4096;
const MIN_BUF_SIZE = 16;
const MAX_CONSECUTIVE_EMPTY_READS = 100;
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
export class BufferFullError extends Error {
  constructor(partial) {
    super("Buffer full");
    this.partial = partial;
    this.name = "BufferFullError";
  }
}
export class PartialReadError extends Deno.errors.UnexpectedEof {
  constructor() {
    super("Encountered UnexpectedEof, data only partially read");
    this.name = "PartialReadError";
  }
}
export class BufReader {
  constructor(rd, size = DEFAULT_BUF_SIZE) {
    this.r = 0;
    this.w = 0;
    this.eof = false;
    if (size < MIN_BUF_SIZE) {
      size = MIN_BUF_SIZE;
    }
    this._reset(new Uint8Array(size), rd);
  }
  static create(r, size = DEFAULT_BUF_SIZE) {
    return r instanceof BufReader ? r : new BufReader(r, size);
  }
  size() {
    return this.buf.byteLength;
  }
  buffered() {
    return this.w - this.r;
  }
  async _fill() {
    if (this.r > 0) {
      this.buf.copyWithin(0, this.r, this.w);
      this.w -= this.r;
      this.r = 0;
    }
    if (this.w >= this.buf.byteLength) {
      throw Error("bufio: tried to fill full buffer");
    }
    for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
      const rr = await this.rd.read(this.buf.subarray(this.w));
      if (rr === null) {
        this.eof = true;
        return;
      }
      assert2(rr >= 0, "negative read");
      this.w += rr;
      if (rr > 0) {
        return;
      }
    }
    throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
  }
  reset(r) {
    this._reset(this.buf, r);
  }
  _reset(buf, rd) {
    this.buf = buf;
    this.rd = rd;
    this.eof = false;
  }
  async read(p) {
    let rr = p.byteLength;
    if (p.byteLength === 0)
      return rr;
    if (this.r === this.w) {
      if (p.byteLength >= this.buf.byteLength) {
        const rr2 = await this.rd.read(p);
        const nread = rr2 ?? 0;
        assert2(nread >= 0, "negative read");
        return rr2;
      }
      this.r = 0;
      this.w = 0;
      rr = await this.rd.read(this.buf);
      if (rr === 0 || rr === null)
        return rr;
      assert2(rr >= 0, "negative read");
      this.w += rr;
    }
    const copied = copyBytes(this.buf.subarray(this.r, this.w), p, 0);
    this.r += copied;
    return copied;
  }
  async readFull(p) {
    let bytesRead = 0;
    while (bytesRead < p.length) {
      try {
        const rr = await this.read(p.subarray(bytesRead));
        if (rr === null) {
          if (bytesRead === 0) {
            return null;
          } else {
            throw new PartialReadError();
          }
        }
        bytesRead += rr;
      } catch (err) {
        err.partial = p.subarray(0, bytesRead);
        throw err;
      }
    }
    return p;
  }
  async readByte() {
    while (this.r === this.w) {
      if (this.eof)
        return null;
      await this._fill();
    }
    const c = this.buf[this.r];
    this.r++;
    return c;
  }
  async readString(delim) {
    if (delim.length !== 1) {
      throw new Error("Delimiter should be a single character");
    }
    const buffer = await this.readSlice(delim.charCodeAt(0));
    if (buffer === null)
      return null;
    return new TextDecoder().decode(buffer);
  }
  async readLine() {
    let line;
    try {
      line = await this.readSlice(LF);
    } catch (err) {
      let {partial} = err;
      assert2(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
      if (!(err instanceof BufferFullError)) {
        throw err;
      }
      if (!this.eof && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
        assert2(this.r > 0, "bufio: tried to rewind past start of buffer");
        this.r--;
        partial = partial.subarray(0, partial.byteLength - 1);
      }
      return {line: partial, more: !this.eof};
    }
    if (line === null) {
      return null;
    }
    if (line.byteLength === 0) {
      return {line, more: false};
    }
    if (line[line.byteLength - 1] == LF) {
      let drop = 1;
      if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
        drop = 2;
      }
      line = line.subarray(0, line.byteLength - drop);
    }
    return {line, more: false};
  }
  async readSlice(delim) {
    let s = 0;
    let slice;
    while (true) {
      let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
      if (i >= 0) {
        i += s;
        slice = this.buf.subarray(this.r, this.r + i + 1);
        this.r += i + 1;
        break;
      }
      if (this.eof) {
        if (this.r === this.w) {
          return null;
        }
        slice = this.buf.subarray(this.r, this.w);
        this.r = this.w;
        break;
      }
      if (this.buffered() >= this.buf.byteLength) {
        this.r = this.w;
        const oldbuf = this.buf;
        const newbuf = this.buf.slice(0);
        this.buf = newbuf;
        throw new BufferFullError(oldbuf);
      }
      s = this.w - this.r;
      try {
        await this._fill();
      } catch (err) {
        err.partial = slice;
        throw err;
      }
    }
    return slice;
  }
  async peek(n) {
    if (n < 0) {
      throw Error("negative count");
    }
    let avail = this.w - this.r;
    while (avail < n && avail < this.buf.byteLength && !this.eof) {
      try {
        await this._fill();
      } catch (err) {
        err.partial = this.buf.subarray(this.r, this.w);
        throw err;
      }
      avail = this.w - this.r;
    }
    if (avail === 0 && this.eof) {
      return null;
    } else if (avail < n && this.eof) {
      return this.buf.subarray(this.r, this.r + avail);
    } else if (avail < n) {
      throw new BufferFullError(this.buf.subarray(this.r, this.w));
    }
    return this.buf.subarray(this.r, this.r + n);
  }
}
class AbstractBufBase {
  constructor() {
    this.usedBufferBytes = 0;
    this.err = null;
  }
  size() {
    return this.buf.byteLength;
  }
  available() {
    return this.buf.byteLength - this.usedBufferBytes;
  }
  buffered() {
    return this.usedBufferBytes;
  }
}
export class BufWriter extends AbstractBufBase {
  constructor(writer, size = DEFAULT_BUF_SIZE) {
    super();
    this.writer = writer;
    if (size <= 0) {
      size = DEFAULT_BUF_SIZE;
    }
    this.buf = new Uint8Array(size);
  }
  static create(writer, size = DEFAULT_BUF_SIZE) {
    return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
  }
  reset(w) {
    this.err = null;
    this.usedBufferBytes = 0;
    this.writer = w;
  }
  async flush() {
    if (this.err !== null)
      throw this.err;
    if (this.usedBufferBytes === 0)
      return;
    try {
      await Deno.writeAll(this.writer, this.buf.subarray(0, this.usedBufferBytes));
    } catch (e) {
      this.err = e;
      throw e;
    }
    this.buf = new Uint8Array(this.buf.length);
    this.usedBufferBytes = 0;
  }
  async write(data) {
    if (this.err !== null)
      throw this.err;
    if (data.length === 0)
      return 0;
    let totalBytesWritten = 0;
    let numBytesWritten = 0;
    while (data.byteLength > this.available()) {
      if (this.buffered() === 0) {
        try {
          numBytesWritten = await this.writer.write(data);
        } catch (e) {
          this.err = e;
          throw e;
        }
      } else {
        numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        await this.flush();
      }
      totalBytesWritten += numBytesWritten;
      data = data.subarray(numBytesWritten);
    }
    numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
    this.usedBufferBytes += numBytesWritten;
    totalBytesWritten += numBytesWritten;
    return totalBytesWritten;
  }
}
export class BufWriterSync extends AbstractBufBase {
  constructor(writer, size = DEFAULT_BUF_SIZE) {
    super();
    this.writer = writer;
    if (size <= 0) {
      size = DEFAULT_BUF_SIZE;
    }
    this.buf = new Uint8Array(size);
  }
  static create(writer, size = DEFAULT_BUF_SIZE) {
    return writer instanceof BufWriterSync ? writer : new BufWriterSync(writer, size);
  }
  reset(w) {
    this.err = null;
    this.usedBufferBytes = 0;
    this.writer = w;
  }
  flush() {
    if (this.err !== null)
      throw this.err;
    if (this.usedBufferBytes === 0)
      return;
    try {
      Deno.writeAllSync(this.writer, this.buf.subarray(0, this.usedBufferBytes));
    } catch (e) {
      this.err = e;
      throw e;
    }
    this.buf = new Uint8Array(this.buf.length);
    this.usedBufferBytes = 0;
  }
  writeSync(data) {
    if (this.err !== null)
      throw this.err;
    if (data.length === 0)
      return 0;
    let totalBytesWritten = 0;
    let numBytesWritten = 0;
    while (data.byteLength > this.available()) {
      if (this.buffered() === 0) {
        try {
          numBytesWritten = this.writer.writeSync(data);
        } catch (e) {
          this.err = e;
          throw e;
        }
      } else {
        numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        this.flush();
      }
      totalBytesWritten += numBytesWritten;
      data = data.subarray(numBytesWritten);
    }
    numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
    this.usedBufferBytes += numBytesWritten;
    totalBytesWritten += numBytesWritten;
    return totalBytesWritten;
  }
}
function createLPS(pat) {
  const lps = new Uint8Array(pat.length);
  lps[0] = 0;
  let prefixEnd = 0;
  let i = 1;
  while (i < lps.length) {
    if (pat[i] == pat[prefixEnd]) {
      prefixEnd++;
      lps[i] = prefixEnd;
      i++;
    } else if (prefixEnd === 0) {
      lps[i] = 0;
      i++;
    } else {
      prefixEnd = pat[prefixEnd - 1];
    }
  }
  return lps;
}
export async function* readDelim(reader, delim) {
  const delimLen = delim.length;
  const delimLPS = createLPS(delim);
  let inputBuffer = new Deno.Buffer();
  const inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
  let inspectIndex = 0;
  let matchIndex = 0;
  while (true) {
    const result = await reader.read(inspectArr);
    if (result === null) {
      yield inputBuffer.bytes();
      return;
    }
    if (result < 0) {
      return;
    }
    const sliceRead = inspectArr.subarray(0, result);
    await Deno.writeAll(inputBuffer, sliceRead);
    let sliceToProcess = inputBuffer.bytes();
    while (inspectIndex < sliceToProcess.length) {
      if (sliceToProcess[inspectIndex] === delim[matchIndex]) {
        inspectIndex++;
        matchIndex++;
        if (matchIndex === delimLen) {
          const matchEnd = inspectIndex - delimLen;
          const readyBytes = sliceToProcess.subarray(0, matchEnd);
          const pendingBytes = sliceToProcess.slice(inspectIndex);
          yield readyBytes;
          sliceToProcess = pendingBytes;
          inspectIndex = 0;
          matchIndex = 0;
        }
      } else {
        if (matchIndex === 0) {
          inspectIndex++;
        } else {
          matchIndex = delimLPS[matchIndex - 1];
        }
      }
    }
    inputBuffer = new Deno.Buffer(sliceToProcess);
  }
}
export async function* readStringDelim(reader, delim) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  for await (const chunk of readDelim(reader, encoder.encode(delim))) {
    yield decoder.decode(chunk);
  }
}
export async function* readLines(reader) {
  yield* readStringDelim(reader, "\n");
}
