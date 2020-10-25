import {assertEquals, assertThrows} from "../testing/asserts.js";
import {
  decode,
  decodedLen,
  decodeString,
  encode,
  encodedLen,
  encodeToString,
  errInvalidByte,
  errLength
} from "./hex.js";
function toByte(s) {
  return new TextEncoder().encode(s)[0];
}
const testCases = [
  ["", []],
  ["0001020304050607", [0, 1, 2, 3, 4, 5, 6, 7]],
  ["08090a0b0c0d0e0f", [8, 9, 10, 11, 12, 13, 14, 15]],
  ["f0f1f2f3f4f5f6f7", [240, 241, 242, 243, 244, 245, 246, 247]],
  ["f8f9fafbfcfdfeff", [248, 249, 250, 251, 252, 253, 254, 255]],
  ["67", Array.from(new TextEncoder().encode("g"))],
  ["e3a1", [227, 161]]
];
const errCases = [
  ["0", errLength()],
  ["zd4aa", errInvalidByte(toByte("z"))],
  ["d4aaz", errInvalidByte(toByte("z"))],
  ["30313", errLength()],
  ["0g", errInvalidByte(new TextEncoder().encode("g")[0])],
  ["00gg", errInvalidByte(new TextEncoder().encode("g")[0])],
  ["0", errInvalidByte(new TextEncoder().encode("")[0])],
  ["ffeed", errLength()]
];
Deno.test({
  name: "[encoding.hex] encodedLen",
  fn() {
    assertEquals(encodedLen(0), 0);
    assertEquals(encodedLen(1), 2);
    assertEquals(encodedLen(2), 4);
    assertEquals(encodedLen(3), 6);
    assertEquals(encodedLen(4), 8);
  }
});
Deno.test({
  name: "[encoding.hex] encode",
  fn() {
    {
      const srcStr = "abc";
      const src = new TextEncoder().encode(srcStr);
      const dest = encode(src);
      assertEquals(src, new Uint8Array([97, 98, 99]));
      assertEquals(dest.length, 6);
    }
    for (const [enc, dec] of testCases) {
      const src = new Uint8Array(dec);
      const dest = encode(src);
      assertEquals(dest.length, src.length * 2);
      assertEquals(new TextDecoder().decode(dest), enc);
    }
  }
});
Deno.test({
  name: "[encoding.hex] encodeToString",
  fn() {
    for (const [enc, dec] of testCases) {
      assertEquals(encodeToString(new Uint8Array(dec)), enc);
    }
  }
});
Deno.test({
  name: "[encoding.hex] decodedLen",
  fn() {
    assertEquals(decodedLen(0), 0);
    assertEquals(decodedLen(2), 1);
    assertEquals(decodedLen(4), 2);
    assertEquals(decodedLen(6), 3);
    assertEquals(decodedLen(8), 4);
  }
});
Deno.test({
  name: "[encoding.hex] decode",
  fn() {
    const extraTestcase = [
      ["F8F9FAFBFCFDFEFF", [248, 249, 250, 251, 252, 253, 254, 255]]
    ];
    const cases = testCases.concat(extraTestcase);
    for (const [enc, dec] of cases) {
      const src = new TextEncoder().encode(enc);
      const dest = decode(src);
      assertEquals(Array.from(dest), Array.from(dec));
    }
  }
});
Deno.test({
  name: "[encoding.hex] decodeString",
  fn() {
    for (const [enc, dec] of testCases) {
      const dst = decodeString(enc);
      assertEquals(dec, Array.from(dst));
    }
  }
});
Deno.test({
  name: "[encoding.hex] decode error",
  fn() {
    for (const [input, expectedErr] of errCases) {
      assertThrows(() => decode(new TextEncoder().encode(input)), Error, expectedErr.message);
    }
  }
});
Deno.test({
  name: "[encoding.hex] decodeString error",
  fn() {
    for (const [input, expectedErr] of errCases) {
      assertThrows(() => {
        decodeString(input);
      }, Error, expectedErr.message);
    }
  }
});
