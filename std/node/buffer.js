import * as hex from "../encoding/hex.js";
import * as base64 from "../encoding/base64.js";
import {normalizeEncoding, notImplemented} from "./_utils.js";
const notImplementedEncodings = [
  "ascii",
  "binary",
  "latin1",
  "ucs2",
  "utf16le"
];
function checkEncoding(encoding = "utf8", strict = true) {
  if (typeof encoding !== "string" || strict && encoding === "") {
    if (!strict)
      return "utf8";
    throw new TypeError(`Unkown encoding: ${encoding}`);
  }
  const normalized = normalizeEncoding(encoding);
  if (normalized === void 0) {
    throw new TypeError(`Unkown encoding: ${encoding}`);
  }
  if (notImplementedEncodings.includes(encoding)) {
    notImplemented(`"${encoding}" encoding`);
  }
  return normalized;
}
const encodingOps = {
  utf8: {
    byteLength: (string) => new TextEncoder().encode(string).byteLength
  },
  ucs2: {
    byteLength: (string) => string.length * 2
  },
  utf16le: {
    byteLength: (string) => string.length * 2
  },
  latin1: {
    byteLength: (string) => string.length
  },
  ascii: {
    byteLength: (string) => string.length
  },
  base64: {
    byteLength: (string) => base64ByteLength(string, string.length)
  },
  hex: {
    byteLength: (string) => string.length >>> 1
  }
};
function base64ByteLength(str, bytes) {
  if (str.charCodeAt(bytes - 1) === 61)
    bytes--;
  if (bytes > 1 && str.charCodeAt(bytes - 1) === 61)
    bytes--;
  return bytes * 3 >>> 2;
}
export default class Buffer extends Uint8Array {
  static alloc(size, fill, encoding = "utf8") {
    if (typeof size !== "number") {
      throw new TypeError(`The "size" argument must be of type number. Received type ${typeof size}`);
    }
    const buf = new Buffer(size);
    if (size === 0)
      return buf;
    let bufFill;
    if (typeof fill === "string") {
      encoding = checkEncoding(encoding);
      if (typeof fill === "string" && fill.length === 1 && encoding === "utf8") {
        buf.fill(fill.charCodeAt(0));
      } else
        bufFill = Buffer.from(fill, encoding);
    } else if (typeof fill === "number") {
      buf.fill(fill);
    } else if (fill instanceof Uint8Array) {
      if (fill.length === 0) {
        throw new TypeError(`The argument "value" is invalid. Received ${fill.constructor.name} []`);
      }
      bufFill = fill;
    }
    if (bufFill) {
      if (bufFill.length > buf.length) {
        bufFill = bufFill.subarray(0, buf.length);
      }
      let offset = 0;
      while (offset < size) {
        buf.set(bufFill, offset);
        offset += bufFill.length;
        if (offset + bufFill.length >= size)
          break;
      }
      if (offset !== size) {
        buf.set(bufFill.subarray(0, size - offset), offset);
      }
    }
    return buf;
  }
  static allocUnsafe(size) {
    return new Buffer(size);
  }
  static byteLength(string, encoding = "utf8") {
    if (typeof string != "string")
      return string.byteLength;
    encoding = normalizeEncoding(encoding) || "utf8";
    return encodingOps[encoding].byteLength(string);
  }
  static concat(list, totalLength) {
    if (totalLength == void 0) {
      totalLength = 0;
      for (const buf of list) {
        totalLength += buf.length;
      }
    }
    const buffer = new Buffer(totalLength);
    let pos = 0;
    for (const buf of list) {
      buffer.set(buf, pos);
      pos += buf.length;
    }
    return buffer;
  }
  static from(value, offsetOrEncoding, length) {
    const offset = typeof offsetOrEncoding === "string" ? void 0 : offsetOrEncoding;
    let encoding = typeof offsetOrEncoding === "string" ? offsetOrEncoding : void 0;
    if (typeof value == "string") {
      encoding = checkEncoding(encoding, false);
      if (encoding === "hex")
        return new Buffer(hex.decodeString(value).buffer);
      if (encoding === "base64")
        return new Buffer(base64.decode(value));
      return new Buffer(new TextEncoder().encode(value).buffer);
    }
    return new Buffer(value, offset, length);
  }
  static isBuffer(obj) {
    return obj instanceof Buffer;
  }
  static isEncoding(encoding) {
    return typeof encoding === "string" && encoding.length !== 0 && normalizeEncoding(encoding) !== void 0;
  }
  copy(targetBuffer, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
    const sourceBuffer = this.subarray(sourceStart, sourceEnd);
    targetBuffer.set(sourceBuffer, targetStart);
    return sourceBuffer.length;
  }
  equals(otherBuffer) {
    if (!(otherBuffer instanceof Uint8Array)) {
      throw new TypeError(`The "otherBuffer" argument must be an instance of Buffer or Uint8Array. Received type ${typeof otherBuffer}`);
    }
    if (this === otherBuffer)
      return true;
    if (this.byteLength !== otherBuffer.byteLength)
      return false;
    for (let i = 0; i < this.length; i++) {
      if (this[i] !== otherBuffer[i])
        return false;
    }
    return true;
  }
  readBigInt64BE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset);
  }
  readBigInt64LE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset, true);
  }
  readBigUInt64BE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset);
  }
  readBigUInt64LE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset, true);
  }
  readDoubleBE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset);
  }
  readDoubleLE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset, true);
  }
  readFloatBE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset);
  }
  readFloatLE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset, true);
  }
  readInt8(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt8(offset);
  }
  readInt16BE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset);
  }
  readInt16LE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset, true);
  }
  readInt32BE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset);
  }
  readInt32LE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset, true);
  }
  readUInt8(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint8(offset);
  }
  readUInt16BE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset);
  }
  readUInt16LE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset, true);
  }
  readUInt32BE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset);
  }
  readUInt32LE(offset = 0) {
    return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset, true);
  }
  slice(begin = 0, end = this.length) {
    return this.subarray(begin, end);
  }
  toJSON() {
    return {type: "Buffer", data: Array.from(this)};
  }
  toString(encoding = "utf8", start = 0, end = this.length) {
    encoding = checkEncoding(encoding);
    const b = this.subarray(start, end);
    if (encoding === "hex")
      return hex.encodeToString(b);
    if (encoding === "base64")
      return base64.encode(b.buffer);
    return new TextDecoder(encoding).decode(b);
  }
  write(string, offset = 0, length = this.length) {
    return new TextEncoder().encodeInto(string, this.subarray(offset, offset + length)).written;
  }
  writeBigInt64BE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value);
    return offset + 4;
  }
  writeBigInt64LE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value, true);
    return offset + 4;
  }
  writeBigUInt64BE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value);
    return offset + 4;
  }
  writeBigUInt64LE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value, true);
    return offset + 4;
  }
  writeDoubleBE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value);
    return offset + 8;
  }
  writeDoubleLE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value, true);
    return offset + 8;
  }
  writeFloatBE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value);
    return offset + 4;
  }
  writeFloatLE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value, true);
    return offset + 4;
  }
  writeInt8(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setInt8(offset, value);
    return offset + 1;
  }
  writeInt16BE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value);
    return offset + 2;
  }
  writeInt16LE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value, true);
    return offset + 2;
  }
  writeInt32BE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
    return offset + 4;
  }
  writeInt32LE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setInt32(offset, value, true);
    return offset + 4;
  }
  writeUInt8(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setUint8(offset, value);
    return offset + 1;
  }
  writeUInt16BE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value);
    return offset + 2;
  }
  writeUInt16LE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value, true);
    return offset + 2;
  }
  writeUInt32BE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
    return offset + 4;
  }
  writeUInt32LE(value, offset = 0) {
    new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value, true);
    return offset + 4;
  }
}
export {Buffer};
Object.defineProperty(globalThis, "Buffer", {
  value: Buffer,
  enumerable: false,
  writable: true,
  configurable: true
});
