import * as hex from "../encoding/hex.mjs";
const TYPE_ERROR_MSG = "md5: `data` is invalid type";
const BLOCK_SIZE = 64;
export class Md5 {
  #a;
  #b;
  #c;
  #d;
  #block;
  #pos;
  #n0;
  #n1;
  constructor() {
    this.#a = 1732584193;
    this.#b = 4023233417;
    this.#c = 2562383102;
    this.#d = 271733878;
    this.#block = new Uint8Array(BLOCK_SIZE);
    this.#pos = 0;
    this.#n0 = 0;
    this.#n1 = 0;
  }
  addLength(len) {
    let n0 = this.#n0;
    n0 += len;
    if (n0 > 4294967295)
      this.#n1 += 1;
    this.#n0 = n0 >>> 0;
  }
  hash(block) {
    let a = this.#a;
    let b = this.#b;
    let c = this.#c;
    let d = this.#d;
    const blk = (i) => block[i] | block[i + 1] << 8 | block[i + 2] << 16 | block[i + 3] << 24;
    const rol32 = (x, n) => x << n | x >>> 32 - n;
    const x0 = blk(0);
    const x1 = blk(4);
    const x2 = blk(8);
    const x3 = blk(12);
    const x4 = blk(16);
    const x5 = blk(20);
    const x6 = blk(24);
    const x7 = blk(28);
    const x8 = blk(32);
    const x9 = blk(36);
    const xa = blk(40);
    const xb = blk(44);
    const xc = blk(48);
    const xd = blk(52);
    const xe = blk(56);
    const xf = blk(60);
    a = b + rol32(((c ^ d) & b ^ d) + a + x0 + 3614090360, 7);
    d = a + rol32(((b ^ c) & a ^ c) + d + x1 + 3905402710, 12);
    c = d + rol32(((a ^ b) & d ^ b) + c + x2 + 606105819, 17);
    b = c + rol32(((d ^ a) & c ^ a) + b + x3 + 3250441966, 22);
    a = b + rol32(((c ^ d) & b ^ d) + a + x4 + 4118548399, 7);
    d = a + rol32(((b ^ c) & a ^ c) + d + x5 + 1200080426, 12);
    c = d + rol32(((a ^ b) & d ^ b) + c + x6 + 2821735955, 17);
    b = c + rol32(((d ^ a) & c ^ a) + b + x7 + 4249261313, 22);
    a = b + rol32(((c ^ d) & b ^ d) + a + x8 + 1770035416, 7);
    d = a + rol32(((b ^ c) & a ^ c) + d + x9 + 2336552879, 12);
    c = d + rol32(((a ^ b) & d ^ b) + c + xa + 4294925233, 17);
    b = c + rol32(((d ^ a) & c ^ a) + b + xb + 2304563134, 22);
    a = b + rol32(((c ^ d) & b ^ d) + a + xc + 1804603682, 7);
    d = a + rol32(((b ^ c) & a ^ c) + d + xd + 4254626195, 12);
    c = d + rol32(((a ^ b) & d ^ b) + c + xe + 2792965006, 17);
    b = c + rol32(((d ^ a) & c ^ a) + b + xf + 1236535329, 22);
    a = b + rol32(((b ^ c) & d ^ c) + a + x1 + 4129170786, 5);
    d = a + rol32(((a ^ b) & c ^ b) + d + x6 + 3225465664, 9);
    c = d + rol32(((d ^ a) & b ^ a) + c + xb + 643717713, 14);
    b = c + rol32(((c ^ d) & a ^ d) + b + x0 + 3921069994, 20);
    a = b + rol32(((b ^ c) & d ^ c) + a + x5 + 3593408605, 5);
    d = a + rol32(((a ^ b) & c ^ b) + d + xa + 38016083, 9);
    c = d + rol32(((d ^ a) & b ^ a) + c + xf + 3634488961, 14);
    b = c + rol32(((c ^ d) & a ^ d) + b + x4 + 3889429448, 20);
    a = b + rol32(((b ^ c) & d ^ c) + a + x9 + 568446438, 5);
    d = a + rol32(((a ^ b) & c ^ b) + d + xe + 3275163606, 9);
    c = d + rol32(((d ^ a) & b ^ a) + c + x3 + 4107603335, 14);
    b = c + rol32(((c ^ d) & a ^ d) + b + x8 + 1163531501, 20);
    a = b + rol32(((b ^ c) & d ^ c) + a + xd + 2850285829, 5);
    d = a + rol32(((a ^ b) & c ^ b) + d + x2 + 4243563512, 9);
    c = d + rol32(((d ^ a) & b ^ a) + c + x7 + 1735328473, 14);
    b = c + rol32(((c ^ d) & a ^ d) + b + xc + 2368359562, 20);
    a = b + rol32((b ^ c ^ d) + a + x5 + 4294588738, 4);
    d = a + rol32((a ^ b ^ c) + d + x8 + 2272392833, 11);
    c = d + rol32((d ^ a ^ b) + c + xb + 1839030562, 16);
    b = c + rol32((c ^ d ^ a) + b + xe + 4259657740, 23);
    a = b + rol32((b ^ c ^ d) + a + x1 + 2763975236, 4);
    d = a + rol32((a ^ b ^ c) + d + x4 + 1272893353, 11);
    c = d + rol32((d ^ a ^ b) + c + x7 + 4139469664, 16);
    b = c + rol32((c ^ d ^ a) + b + xa + 3200236656, 23);
    a = b + rol32((b ^ c ^ d) + a + xd + 681279174, 4);
    d = a + rol32((a ^ b ^ c) + d + x0 + 3936430074, 11);
    c = d + rol32((d ^ a ^ b) + c + x3 + 3572445317, 16);
    b = c + rol32((c ^ d ^ a) + b + x6 + 76029189, 23);
    a = b + rol32((b ^ c ^ d) + a + x9 + 3654602809, 4);
    d = a + rol32((a ^ b ^ c) + d + xc + 3873151461, 11);
    c = d + rol32((d ^ a ^ b) + c + xf + 530742520, 16);
    b = c + rol32((c ^ d ^ a) + b + x2 + 3299628645, 23);
    a = b + rol32((c ^ (b | ~d)) + a + x0 + 4096336452, 6);
    d = a + rol32((b ^ (a | ~c)) + d + x7 + 1126891415, 10);
    c = d + rol32((a ^ (d | ~b)) + c + xe + 2878612391, 15);
    b = c + rol32((d ^ (c | ~a)) + b + x5 + 4237533241, 21);
    a = b + rol32((c ^ (b | ~d)) + a + xc + 1700485571, 6);
    d = a + rol32((b ^ (a | ~c)) + d + x3 + 2399980690, 10);
    c = d + rol32((a ^ (d | ~b)) + c + xa + 4293915773, 15);
    b = c + rol32((d ^ (c | ~a)) + b + x1 + 2240044497, 21);
    a = b + rol32((c ^ (b | ~d)) + a + x8 + 1873313359, 6);
    d = a + rol32((b ^ (a | ~c)) + d + xf + 4264355552, 10);
    c = d + rol32((a ^ (d | ~b)) + c + x6 + 2734768916, 15);
    b = c + rol32((d ^ (c | ~a)) + b + xd + 1309151649, 21);
    a = b + rol32((c ^ (b | ~d)) + a + x4 + 4149444226, 6);
    d = a + rol32((b ^ (a | ~c)) + d + xb + 3174756917, 10);
    c = d + rol32((a ^ (d | ~b)) + c + x2 + 718787259, 15);
    b = c + rol32((d ^ (c | ~a)) + b + x9 + 3951481745, 21);
    this.#a = this.#a + a >>> 0;
    this.#b = this.#b + b >>> 0;
    this.#c = this.#c + c >>> 0;
    this.#d = this.#d + d >>> 0;
  }
  update(data) {
    let msg;
    if (typeof data === "string") {
      msg = new TextEncoder().encode(data);
    } else if (typeof data === "object") {
      if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
        msg = new Uint8Array(data);
      } else {
        throw new Error(TYPE_ERROR_MSG);
      }
    } else {
      throw new Error(TYPE_ERROR_MSG);
    }
    let pos = this.#pos;
    const free = BLOCK_SIZE - pos;
    if (msg.length < free) {
      this.#block.set(msg, pos);
      pos += msg.length;
    } else {
      this.#block.set(msg.slice(0, free), pos);
      this.hash(this.#block);
      let i = free;
      while (i + BLOCK_SIZE <= msg.length) {
        this.hash(msg.slice(i, i + BLOCK_SIZE));
        i += BLOCK_SIZE;
      }
      this.#block.fill(0).set(msg.slice(i), 0);
      pos = msg.length - i;
    }
    this.#pos = pos;
    this.addLength(msg.length);
    return this;
  }
  digest() {
    let padLen = BLOCK_SIZE - this.#pos;
    if (padLen < 9)
      padLen += BLOCK_SIZE;
    const pad = new Uint8Array(padLen);
    pad[0] = 128;
    const n0 = this.#n0 << 3;
    const n1 = this.#n1 << 3 | this.#n0 >>> 29;
    pad[pad.length - 8] = n0 & 255;
    pad[pad.length - 7] = n0 >>> 8 & 255;
    pad[pad.length - 6] = n0 >>> 16 & 255;
    pad[pad.length - 5] = n0 >>> 24 & 255;
    pad[pad.length - 4] = n1 & 255;
    pad[pad.length - 3] = n1 >>> 8 & 255;
    pad[pad.length - 2] = n1 >>> 16 & 255;
    pad[pad.length - 1] = n1 >>> 24 & 255;
    this.update(pad.buffer);
    const hash = new ArrayBuffer(16);
    const hashView = new DataView(hash);
    hashView.setUint32(0, this.#a, true);
    hashView.setUint32(4, this.#b, true);
    hashView.setUint32(8, this.#c, true);
    hashView.setUint32(12, this.#d, true);
    return hash;
  }
  toString(format = "hex") {
    const hash = this.digest();
    switch (format) {
      case "hex":
        return hex.encodeToString(new Uint8Array(hash));
      case "base64": {
        const data = new Uint8Array(hash);
        let dataString = "";
        for (let i = 0; i < data.length; ++i) {
          dataString += String.fromCharCode(data[i]);
        }
        return btoa(dataString);
      }
      default:
        throw new Error("md5: invalid format");
    }
  }
}
