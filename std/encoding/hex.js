const hextable = new TextEncoder().encode("0123456789abcdef");
export function errInvalidByte(byte) {
  return new Error("encoding/hex: invalid byte: " + new TextDecoder().decode(new Uint8Array([byte])));
}
export function errLength() {
  return new Error("encoding/hex: odd length hex string");
}
function fromHexChar(byte) {
  if (48 <= byte && byte <= 57)
    return byte - 48;
  if (97 <= byte && byte <= 102)
    return byte - 97 + 10;
  if (65 <= byte && byte <= 70)
    return byte - 65 + 10;
  throw errInvalidByte(byte);
}
export function encodedLen(n) {
  return n * 2;
}
export function encode(src) {
  const dst = new Uint8Array(encodedLen(src.length));
  for (let i = 0; i < dst.length; i++) {
    const v = src[i];
    dst[i * 2] = hextable[v >> 4];
    dst[i * 2 + 1] = hextable[v & 15];
  }
  return dst;
}
export function encodeToString(src) {
  return new TextDecoder().decode(encode(src));
}
export function decode(src) {
  const dst = new Uint8Array(decodedLen(src.length));
  for (let i = 0; i < dst.length; i++) {
    const a = fromHexChar(src[i * 2]);
    const b = fromHexChar(src[i * 2 + 1]);
    dst[i] = a << 4 | b;
  }
  if (src.length % 2 == 1) {
    fromHexChar(src[dst.length * 2]);
    throw errLength();
  }
  return dst;
}
export function decodedLen(x) {
  return x >>> 1;
}
export function decodeString(s) {
  return decode(new TextEncoder().encode(s));
}
