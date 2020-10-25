import {assertEquals} from "../testing/asserts.mjs";
import {decode, decodeString, encode} from "./base64.mjs";
const testsetString = [
  ["", ""],
  ["f", "Zg=="],
  ["fo", "Zm8="],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg=="],
  ["fooba", "Zm9vYmE="],
  ["foobar", "Zm9vYmFy"]
];
const testsetBinary = [
  [new TextEncoder().encode("\0"), "AA=="],
  [new TextEncoder().encode("\0\0"), "AAA="],
  [new TextEncoder().encode("\0\0\0"), "AAAA"],
  [new TextEncoder().encode("\0\0\0\0"), "AAAAAA=="]
];
Deno.test("[encoding/base64] testBase64EncodeString", () => {
  for (const [input, output] of testsetString) {
    assertEquals(encode(input), output);
  }
});
Deno.test("[encoding/base64] testBase64DecodeString", () => {
  for (const [input, output] of testsetString) {
    assertEquals(decodeString(output), input);
  }
});
Deno.test("[encoding/base64] testBase64EncodeBinary", () => {
  for (const [input, output] of testsetBinary) {
    assertEquals(encode(input), output);
  }
});
Deno.test("[encoding/base64] testBase64DecodeBinary", () => {
  for (const [input, output] of testsetBinary) {
    const outputBinary = new Uint8Array(decode(output));
    assertEquals(outputBinary, input);
  }
});
