import {equal, findIndex, findLastIndex, hasPrefix} from "../bytes/mod.mjs";
import {copyN} from "../io/ioutil.mjs";
import {MultiReader} from "../io/readers.mjs";
import {extname} from "../path/mod.mjs";
import {tempFile} from "../io/util.mjs";
import {BufReader, BufWriter} from "../io/bufio.mjs";
import {encoder} from "../encoding/utf8.mjs";
import {assert as assert2} from "../_util/assert.mjs";
import {TextProtoReader} from "../textproto/mod.mjs";
import {hasOwnProperty} from "../_util/has_own_property.mjs";
export function isFormFile(x) {
  return hasOwnProperty(x, "filename") && hasOwnProperty(x, "type");
}
function randomBoundary() {
  let boundary = "--------------------------";
  for (let i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 16).toString(16);
  }
  return boundary;
}
export function matchAfterPrefix(buf, prefix, eof) {
  if (buf.length === prefix.length) {
    return eof ? 1 : 0;
  }
  const c = buf[prefix.length];
  if (c === " ".charCodeAt(0) || c === "	".charCodeAt(0) || c === "\r".charCodeAt(0) || c === "\n".charCodeAt(0) || c === "-".charCodeAt(0)) {
    return 1;
  }
  return -1;
}
export function scanUntilBoundary(buf, dashBoundary, newLineDashBoundary, total, eof) {
  if (total === 0) {
    if (hasPrefix(buf, dashBoundary)) {
      switch (matchAfterPrefix(buf, dashBoundary, eof)) {
        case -1:
          return dashBoundary.length;
        case 0:
          return 0;
        case 1:
          return null;
      }
    }
    if (hasPrefix(dashBoundary, buf)) {
      return 0;
    }
  }
  const i = findIndex(buf, newLineDashBoundary);
  if (i >= 0) {
    switch (matchAfterPrefix(buf.slice(i), newLineDashBoundary, eof)) {
      case -1:
        return i + newLineDashBoundary.length;
      case 0:
        return i;
      case 1:
        return i > 0 ? i : null;
    }
  }
  if (hasPrefix(newLineDashBoundary, buf)) {
    return 0;
  }
  const j = findLastIndex(buf, newLineDashBoundary.slice(0, 1));
  if (j >= 0 && hasPrefix(newLineDashBoundary, buf.slice(j))) {
    return j;
  }
  return buf.length;
}
class PartReader {
  constructor(mr, headers) {
    this.mr = mr;
    this.headers = headers;
    this.n = 0;
    this.total = 0;
  }
  async read(p) {
    const br = this.mr.bufReader;
    let peekLength = 1;
    while (this.n === 0) {
      peekLength = Math.max(peekLength, br.buffered());
      const peekBuf = await br.peek(peekLength);
      if (peekBuf === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      const eof = peekBuf.length < peekLength;
      this.n = scanUntilBoundary(peekBuf, this.mr.dashBoundary, this.mr.newLineDashBoundary, this.total, eof);
      if (this.n === 0) {
        assert2(eof === false);
        peekLength++;
      }
    }
    if (this.n === null) {
      return null;
    }
    const nread = Math.min(p.length, this.n);
    const buf = p.subarray(0, nread);
    const r = await br.readFull(buf);
    assert2(r === buf);
    this.n -= nread;
    this.total += nread;
    return nread;
  }
  close() {
  }
  getContentDispositionParams() {
    if (this.contentDispositionParams)
      return this.contentDispositionParams;
    const cd = this.headers.get("content-disposition");
    const params = {};
    assert2(cd != null, "content-disposition must be set");
    const comps = decodeURI(cd).split(";");
    this.contentDisposition = comps[0];
    comps.slice(1).map((v) => v.trim()).map((kv) => {
      const [k, v] = kv.split("=");
      if (v) {
        const s = v.charAt(0);
        const e = v.charAt(v.length - 1);
        if (s === e && s === '"' || s === "'") {
          params[k] = v.substr(1, v.length - 2);
        } else {
          params[k] = v;
        }
      }
    });
    return this.contentDispositionParams = params;
  }
  get fileName() {
    return this.getContentDispositionParams()["filename"];
  }
  get formName() {
    const p = this.getContentDispositionParams();
    if (this.contentDisposition === "form-data") {
      return p["name"];
    }
    return "";
  }
}
function skipLWSPChar(u) {
  const ret = new Uint8Array(u.length);
  const sp = " ".charCodeAt(0);
  const ht = "	".charCodeAt(0);
  let j = 0;
  for (let i = 0; i < u.length; i++) {
    if (u[i] === sp || u[i] === ht)
      continue;
    ret[j++] = u[i];
  }
  return ret.slice(0, j);
}
export class MultipartReader {
  constructor(reader, boundary) {
    this.boundary = boundary;
    this.newLine = encoder.encode("\r\n");
    this.newLineDashBoundary = encoder.encode(`\r
--${this.boundary}`);
    this.dashBoundaryDash = encoder.encode(`--${this.boundary}--`);
    this.dashBoundary = encoder.encode(`--${this.boundary}`);
    this.partsRead = 0;
    this.bufReader = new BufReader(reader);
  }
  async readForm(maxMemory = 10 << 20) {
    const fileMap = new Map();
    const valueMap = new Map();
    let maxValueBytes = maxMemory + (10 << 20);
    const buf = new Deno.Buffer(new Uint8Array(maxValueBytes));
    for (; ; ) {
      const p = await this.nextPart();
      if (p === null) {
        break;
      }
      if (p.formName === "") {
        continue;
      }
      buf.reset();
      if (!p.fileName) {
        const n2 = await copyN(p, buf, maxValueBytes);
        maxValueBytes -= n2;
        if (maxValueBytes < 0) {
          throw new RangeError("message too large");
        }
        const value = new TextDecoder().decode(buf.bytes());
        valueMap.set(p.formName, value);
        continue;
      }
      let formFile;
      const n = await copyN(p, buf, maxValueBytes);
      const contentType = p.headers.get("content-type");
      assert2(contentType != null, "content-type must be set");
      if (n > maxMemory) {
        const ext = extname(p.fileName);
        const {file, filepath} = await tempFile(".", {
          prefix: "multipart-",
          postfix: ext
        });
        try {
          const size = await Deno.copy(new MultiReader(buf, p), file);
          file.close();
          formFile = {
            filename: p.fileName,
            type: contentType,
            tempfile: filepath,
            size
          };
        } catch (e) {
          await Deno.remove(filepath);
          throw e;
        }
      } else {
        formFile = {
          filename: p.fileName,
          type: contentType,
          content: buf.bytes(),
          size: buf.length
        };
        maxMemory -= n;
        maxValueBytes -= n;
      }
      if (formFile) {
        const mapVal = fileMap.get(p.formName);
        if (mapVal !== void 0) {
          if (Array.isArray(mapVal)) {
            mapVal.push(formFile);
          } else {
            fileMap.set(p.formName, [mapVal, formFile]);
          }
        } else {
          fileMap.set(p.formName, formFile);
        }
      }
    }
    return multipatFormData(fileMap, valueMap);
  }
  async nextPart() {
    if (this.currentPart) {
      this.currentPart.close();
    }
    if (equal(this.dashBoundary, encoder.encode("--"))) {
      throw new Error("boundary is empty");
    }
    let expectNewPart = false;
    for (; ; ) {
      const line = await this.bufReader.readSlice("\n".charCodeAt(0));
      if (line === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      if (this.isBoundaryDelimiterLine(line)) {
        this.partsRead++;
        const r = new TextProtoReader(this.bufReader);
        const headers = await r.readMIMEHeader();
        if (headers === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        const np = new PartReader(this, headers);
        this.currentPart = np;
        return np;
      }
      if (this.isFinalBoundary(line)) {
        return null;
      }
      if (expectNewPart) {
        throw new Error(`expecting a new Part; got line ${line}`);
      }
      if (this.partsRead === 0) {
        continue;
      }
      if (equal(line, this.newLine)) {
        expectNewPart = true;
        continue;
      }
      throw new Error(`unexpected line in nextPart(): ${line}`);
    }
  }
  isFinalBoundary(line) {
    if (!hasPrefix(line, this.dashBoundaryDash)) {
      return false;
    }
    const rest = line.slice(this.dashBoundaryDash.length, line.length);
    return rest.length === 0 || equal(skipLWSPChar(rest), this.newLine);
  }
  isBoundaryDelimiterLine(line) {
    if (!hasPrefix(line, this.dashBoundary)) {
      return false;
    }
    const rest = line.slice(this.dashBoundary.length);
    return equal(skipLWSPChar(rest), this.newLine);
  }
}
function multipatFormData(fileMap, valueMap) {
  function file(key) {
    return fileMap.get(key);
  }
  function value(key) {
    return valueMap.get(key);
  }
  function* entries() {
    yield* fileMap;
    yield* valueMap;
  }
  async function removeAll() {
    const promises = [];
    for (const val of fileMap.values()) {
      if (Array.isArray(val)) {
        for (const subVal of val) {
          if (!subVal.tempfile)
            continue;
          promises.push(Deno.remove(subVal.tempfile));
        }
      } else {
        if (!val.tempfile)
          continue;
        promises.push(Deno.remove(val.tempfile));
      }
    }
    await Promise.all(promises);
  }
  return {
    file,
    value,
    entries,
    removeAll,
    [Symbol.iterator]() {
      return entries();
    }
  };
}
class PartWriter {
  constructor(writer, boundary, headers, isFirstBoundary) {
    this.writer = writer;
    this.boundary = boundary;
    this.headers = headers;
    this.closed = false;
    this.headersWritten = false;
    let buf = "";
    if (isFirstBoundary) {
      buf += `--${boundary}\r
`;
    } else {
      buf += `\r
--${boundary}\r
`;
    }
    for (const [key, value] of headers.entries()) {
      buf += `${key}: ${value}\r
`;
    }
    buf += `\r
`;
    this.partHeader = buf;
  }
  close() {
    this.closed = true;
  }
  async write(p) {
    if (this.closed) {
      throw new Error("part is closed");
    }
    if (!this.headersWritten) {
      await this.writer.write(encoder.encode(this.partHeader));
      this.headersWritten = true;
    }
    return this.writer.write(p);
  }
}
function checkBoundary(b) {
  if (b.length < 1 || b.length > 70) {
    throw new Error(`invalid boundary length: ${b.length}`);
  }
  const end = b.length - 1;
  for (let i = 0; i < end; i++) {
    const c = b.charAt(i);
    if (!c.match(/[a-zA-Z0-9'()+_,\-./:=?]/) || c === " " && i !== end) {
      throw new Error("invalid boundary character: " + c);
    }
  }
  return b;
}
export class MultipartWriter {
  constructor(writer, boundary) {
    this.writer = writer;
    this.isClosed = false;
    if (boundary !== void 0) {
      this._boundary = checkBoundary(boundary);
    } else {
      this._boundary = randomBoundary();
    }
    this.bufWriter = new BufWriter(writer);
  }
  get boundary() {
    return this._boundary;
  }
  formDataContentType() {
    return `multipart/form-data; boundary=${this.boundary}`;
  }
  createPart(headers) {
    if (this.isClosed) {
      throw new Error("multipart: writer is closed");
    }
    if (this.lastPart) {
      this.lastPart.close();
    }
    const part = new PartWriter(this.writer, this.boundary, headers, !this.lastPart);
    this.lastPart = part;
    return part;
  }
  createFormFile(field, filename) {
    const h = new Headers();
    h.set("Content-Disposition", `form-data; name="${field}"; filename="${filename}"`);
    h.set("Content-Type", "application/octet-stream");
    return this.createPart(h);
  }
  createFormField(field) {
    const h = new Headers();
    h.set("Content-Disposition", `form-data; name="${field}"`);
    h.set("Content-Type", "application/octet-stream");
    return this.createPart(h);
  }
  async writeField(field, value) {
    const f = await this.createFormField(field);
    await f.write(encoder.encode(value));
  }
  async writeFile(field, filename, file) {
    const f = await this.createFormFile(field, filename);
    await Deno.copy(file, f);
  }
  flush() {
    return this.bufWriter.flush();
  }
  async close() {
    if (this.isClosed) {
      throw new Error("multipart: writer is closed");
    }
    if (this.lastPart) {
      this.lastPart.close();
      this.lastPart = void 0;
    }
    await this.writer.write(encoder.encode(`\r
--${this.boundary}--\r
`));
    await this.flush();
    this.isClosed = true;
  }
}
