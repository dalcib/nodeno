import {assert, assertEquals, assertThrows, unitTest} from "./test_util.mjs";
unitTest(function btoaSuccess() {
  const text = "hello world";
  const encoded = btoa(text);
  assertEquals(encoded, "aGVsbG8gd29ybGQ=");
});
unitTest(function atobSuccess() {
  const encoded = "aGVsbG8gd29ybGQ=";
  const decoded = atob(encoded);
  assertEquals(decoded, "hello world");
});
unitTest(function atobWithAsciiWhitespace() {
  const encodedList = [
    " aGVsbG8gd29ybGQ=",
    "  aGVsbG8gd29ybGQ=",
    "aGVsbG8gd29ybGQ= ",
    "aGVsbG8gd29ybGQ=\n",
    "aGVsbG	8gd29ybGQ=",
    `aGVsbG	8g
                d29ybGQ=`
  ];
  for (const encoded of encodedList) {
    const decoded = atob(encoded);
    assertEquals(decoded, "hello world");
  }
});
unitTest(function atobThrows() {
  let threw = false;
  try {
    atob("aGVsbG8gd29ybGQ==");
  } catch (e) {
    threw = true;
  }
  assert(threw);
});
unitTest(function atobThrows2() {
  let threw = false;
  try {
    atob("aGVsbG8gd29ybGQ===");
  } catch (e) {
    threw = true;
  }
  assert(threw);
});
unitTest(function btoaFailed() {
  const text = "你好";
  assertThrows(() => {
    btoa(text);
  }, TypeError);
});
unitTest(function textDecoder2() {
  const fixture = new Uint8Array([
    240,
    157,
    147,
    189,
    240,
    157,
    147,
    174,
    240,
    157,
    148,
    129,
    240,
    157,
    147,
    189
  ]);
  const decoder = new TextDecoder();
  assertEquals(decoder.decode(fixture), "𝓽𝓮𝔁𝓽");
});
unitTest(function textDecoderIgnoreBOM() {
  const fixture = new Uint8Array([
    239,
    187,
    191,
    240,
    157,
    147,
    189,
    240,
    157,
    147,
    174,
    240,
    157,
    148,
    129,
    240,
    157,
    147,
    189
  ]);
  const decoder = new TextDecoder("utf-8", {ignoreBOM: true});
  assertEquals(decoder.decode(fixture), "𝓽𝓮𝔁𝓽");
});
unitTest(function textDecoderNotBOM() {
  const fixture = new Uint8Array([
    239,
    187,
    137,
    240,
    157,
    147,
    189,
    240,
    157,
    147,
    174,
    240,
    157,
    148,
    129,
    240,
    157,
    147,
    189
  ]);
  const decoder = new TextDecoder("utf-8", {ignoreBOM: true});
  assertEquals(decoder.decode(fixture), "ﻉ𝓽𝓮𝔁𝓽");
});
unitTest(function textDecoderASCII() {
  const fixture = new Uint8Array([137, 149, 159, 191]);
  const decoder = new TextDecoder("ascii");
  assertEquals(decoder.decode(fixture), "‰•Ÿ¿");
});
unitTest(function textDecoderErrorEncoding() {
  let didThrow = false;
  try {
    new TextDecoder("foo");
  } catch (e) {
    didThrow = true;
    assertEquals(e.message, "The encoding label provided ('foo') is invalid.");
  }
  assert(didThrow);
});
unitTest(function textEncoder() {
  const fixture = "𝓽𝓮𝔁𝓽";
  const encoder = new TextEncoder();
  assertEquals(Array.from(encoder.encode(fixture)), [
    240,
    157,
    147,
    189,
    240,
    157,
    147,
    174,
    240,
    157,
    148,
    129,
    240,
    157,
    147,
    189
  ]);
});
unitTest(function textEncodeInto() {
  const fixture = "text";
  const encoder = new TextEncoder();
  const bytes = new Uint8Array(5);
  const result = encoder.encodeInto(fixture, bytes);
  assertEquals(result.read, 4);
  assertEquals(result.written, 4);
  assertEquals(Array.from(bytes), [
    116,
    101,
    120,
    116,
    0
  ]);
});
unitTest(function textEncodeInto2() {
  const fixture = "𝓽𝓮𝔁𝓽";
  const encoder = new TextEncoder();
  const bytes = new Uint8Array(17);
  const result = encoder.encodeInto(fixture, bytes);
  assertEquals(result.read, 8);
  assertEquals(result.written, 16);
  assertEquals(Array.from(bytes), [
    240,
    157,
    147,
    189,
    240,
    157,
    147,
    174,
    240,
    157,
    148,
    129,
    240,
    157,
    147,
    189,
    0
  ]);
});
unitTest(function textEncodeInto3() {
  const fixture = "𝓽𝓮𝔁𝓽";
  const encoder = new TextEncoder();
  const bytes = new Uint8Array(5);
  const result = encoder.encodeInto(fixture, bytes);
  assertEquals(result.read, 2);
  assertEquals(result.written, 4);
  assertEquals(Array.from(bytes), [
    240,
    157,
    147,
    189,
    0
  ]);
});
unitTest(function textDecoderSharedUint8Array() {
  const ab = new SharedArrayBuffer(6);
  const dataView = new DataView(ab);
  const charCodeA = "A".charCodeAt(0);
  for (let i = 0; i < ab.byteLength; i++) {
    dataView.setUint8(i, charCodeA + i);
  }
  const ui8 = new Uint8Array(ab);
  const decoder = new TextDecoder();
  const actual = decoder.decode(ui8);
  assertEquals(actual, "ABCDEF");
});
unitTest(function textDecoderSharedInt32Array() {
  const ab = new SharedArrayBuffer(8);
  const dataView = new DataView(ab);
  const charCodeA = "A".charCodeAt(0);
  for (let i = 0; i < ab.byteLength; i++) {
    dataView.setUint8(i, charCodeA + i);
  }
  const i32 = new Int32Array(ab);
  const decoder = new TextDecoder();
  const actual = decoder.decode(i32);
  assertEquals(actual, "ABCDEFGH");
});
unitTest(function toStringShouldBeWebCompatibility() {
  const encoder = new TextEncoder();
  assertEquals(encoder.toString(), "[object TextEncoder]");
  const decoder = new TextDecoder();
  assertEquals(decoder.toString(), "[object TextDecoder]");
});
