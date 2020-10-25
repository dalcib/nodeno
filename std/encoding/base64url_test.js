import {assertEquals} from "../testing/asserts.js";
import {decode, encode} from "./base64url.js";
const testsetString = [
  ["", ""],
  ["f", "Zg"],
  ["fo", "Zm8"],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg"],
  ["fooba", "Zm9vYmE"],
  ["foobar", "Zm9vYmFy"],
  [">?>d?ß", "Pj8-ZD_f"]
];
const testsetBinary = [
  [new TextEncoder().encode("\0"), "AA"],
  [new TextEncoder().encode("\0\0"), "AAA"],
  [new TextEncoder().encode("\0\0\0"), "AAAA"],
  [new TextEncoder().encode("\0\0\0\0"), "AAAAAA"]
];
Deno.test("[encoding/base64url] testBase64urlEncodeString", () => {
  for (const [input, output] of testsetString) {
    assertEquals(encode(input), output);
  }
});
Deno.test("[encoding/base64url] testBase64urlEncodeBinary", () => {
  for (const [input, output] of testsetBinary) {
    assertEquals(encode(input), output);
  }
});
Deno.test("[encoding/base64ur] testBase64urDecodeBinary", () => {
  for (const [input, output] of testsetBinary) {
    const outputBinary = new Uint8Array(decode(output));
    assertEquals(outputBinary, input);
  }
});
