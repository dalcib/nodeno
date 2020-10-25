const lookup = [];
const revLookup = [];
const code = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
for (let i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
const placeHolderPadLookup = [0, 1, , 2, 3, , 4];
function _getPadLen(placeHoldersLen) {
  const maybeLen = placeHolderPadLookup[placeHoldersLen];
  if (typeof maybeLen !== "number") {
    throw new Error("Invalid pad length");
  }
  return maybeLen;
}
function getLens(b32) {
  const len = b32.length;
  if (len % 8 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 8");
  }
  let validLen = b32.indexOf("=");
  if (validLen === -1)
    validLen = len;
  const placeHoldersLen = validLen === len ? 0 : 8 - validLen % 8;
  return [validLen, placeHoldersLen];
}
export function byteLength(b32) {
  const [validLen, placeHoldersLen] = getLens(b32);
  return _byteLength(validLen, placeHoldersLen);
}
function _byteLength(validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 5 / 8 - _getPadLen(placeHoldersLen);
}
export function decode(b32) {
  let tmp;
  const [validLen, placeHoldersLen] = getLens(b32);
  const arr = new Uint8Array(_byteLength(validLen, placeHoldersLen));
  let curByte = 0;
  const len = placeHoldersLen > 0 ? validLen - 8 : validLen;
  let i;
  for (i = 0; i < len; i += 8) {
    tmp = revLookup[b32.charCodeAt(i)] << 20 | revLookup[b32.charCodeAt(i + 1)] << 15 | revLookup[b32.charCodeAt(i + 2)] << 10 | revLookup[b32.charCodeAt(i + 3)] << 5 | revLookup[b32.charCodeAt(i + 4)];
    arr[curByte++] = tmp >> 17 & 255;
    arr[curByte++] = tmp >> 9 & 255;
    arr[curByte++] = tmp >> 1 & 255;
    tmp = (tmp & 1) << 15 | revLookup[b32.charCodeAt(i + 5)] << 10 | revLookup[b32.charCodeAt(i + 6)] << 5 | revLookup[b32.charCodeAt(i + 7)];
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b32.charCodeAt(i)] << 20 | revLookup[b32.charCodeAt(i + 1)] << 15 | revLookup[b32.charCodeAt(i + 2)] << 10 | revLookup[b32.charCodeAt(i + 3)] << 5 | revLookup[b32.charCodeAt(i + 4)];
    arr[curByte++] = tmp >> 17 & 255;
    arr[curByte++] = tmp >> 9 & 255;
    arr[curByte++] = tmp >> 1 & 255;
    tmp = (tmp & 1) << 7 | revLookup[b32.charCodeAt(i + 5)] << 2 | revLookup[b32.charCodeAt(i + 6)] >> 3;
    arr[curByte++] = tmp & 255;
  } else if (placeHoldersLen === 3) {
    tmp = revLookup[b32.charCodeAt(i)] << 19 | revLookup[b32.charCodeAt(i + 1)] << 14 | revLookup[b32.charCodeAt(i + 2)] << 9 | revLookup[b32.charCodeAt(i + 3)] << 4 | revLookup[b32.charCodeAt(i + 4)] >> 1;
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  } else if (placeHoldersLen === 4) {
    tmp = revLookup[b32.charCodeAt(i)] << 11 | revLookup[b32.charCodeAt(i + 1)] << 6 | revLookup[b32.charCodeAt(i + 2)] << 1 | revLookup[b32.charCodeAt(i + 3)] >> 4;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  } else if (placeHoldersLen === 6) {
    tmp = revLookup[b32.charCodeAt(i)] << 3 | revLookup[b32.charCodeAt(i + 1)] >> 2;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function encodeChunk(uint8, start, end) {
  let tmp;
  const output = [];
  for (let i = start; i < end; i += 5) {
    tmp = uint8[i] << 16 & 16711680 | uint8[i + 1] << 8 & 65280 | uint8[i + 2] & 255;
    output.push(lookup[tmp >> 19 & 31]);
    output.push(lookup[tmp >> 14 & 31]);
    output.push(lookup[tmp >> 9 & 31]);
    output.push(lookup[tmp >> 4 & 31]);
    tmp = (tmp & 15) << 16 | uint8[i + 3] << 8 & 65280 | uint8[i + 4] & 255;
    output.push(lookup[tmp >> 15 & 31]);
    output.push(lookup[tmp >> 10 & 31]);
    output.push(lookup[tmp >> 5 & 31]);
    output.push(lookup[tmp & 31]);
  }
  return output.join("");
}
export function encode(uint8) {
  let tmp;
  const len = uint8.length;
  const extraBytes = len % 5;
  const parts = [];
  const maxChunkLength = 16385;
  const len2 = len - extraBytes;
  for (let i = 0; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 4) {
    tmp = (uint8[len2] & 255) << 16 | (uint8[len2 + 1] & 255) << 8 | uint8[len2 + 2] & 255;
    parts.push(lookup[tmp >> 19 & 31]);
    parts.push(lookup[tmp >> 14 & 31]);
    parts.push(lookup[tmp >> 9 & 31]);
    parts.push(lookup[tmp >> 4 & 31]);
    tmp = (tmp & 15) << 11 | uint8[len2 + 3] << 3;
    parts.push(lookup[tmp >> 10 & 31]);
    parts.push(lookup[tmp >> 5 & 31]);
    parts.push(lookup[tmp & 31]);
    parts.push("=");
  } else if (extraBytes === 3) {
    tmp = (uint8[len2] & 255) << 17 | (uint8[len2 + 1] & 255) << 9 | (uint8[len2 + 2] & 255) << 1;
    parts.push(lookup[tmp >> 20 & 31]);
    parts.push(lookup[tmp >> 15 & 31]);
    parts.push(lookup[tmp >> 10 & 31]);
    parts.push(lookup[tmp >> 5 & 31]);
    parts.push(lookup[tmp & 31]);
    parts.push("===");
  } else if (extraBytes === 2) {
    tmp = (uint8[len2] & 255) << 12 | (uint8[len2 + 1] & 255) << 4;
    parts.push(lookup[tmp >> 15 & 31]);
    parts.push(lookup[tmp >> 10 & 31]);
    parts.push(lookup[tmp >> 5 & 31]);
    parts.push(lookup[tmp & 31]);
    parts.push("====");
  } else if (extraBytes === 1) {
    tmp = (uint8[len2] & 255) << 2;
    parts.push(lookup[tmp >> 5 & 31]);
    parts.push(lookup[tmp & 31]);
    parts.push("======");
  }
  return parts.join("");
}
