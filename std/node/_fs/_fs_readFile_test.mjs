import {readFile, readFileSync} from "./_fs_readFile.mjs";
import * as path from "../../path/mod.mjs";
import {assert, assertEquals} from "../../testing/asserts.mjs";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testData = path.resolve(moduleDir, "testdata", "hello.txt");
Deno.test("readFileSuccess", async function() {
  const data = await new Promise((res, rej) => {
    readFile(testData, (err, data2) => {
      if (err) {
        rej(err);
      }
      res(data2);
    });
  });
  assert(data instanceof Uint8Array);
  assertEquals(new TextDecoder().decode(data), "hello world");
});
Deno.test("readFileEncodeUtf8Success", async function() {
  const data = await new Promise((res, rej) => {
    readFile(testData, {encoding: "utf8"}, (err, data2) => {
      if (err) {
        rej(err);
      }
      res(data2);
    });
  });
  assertEquals(typeof data, "string");
  assertEquals(data, "hello world");
});
Deno.test("readFileEncodeHexSuccess", async function() {
  const data = await new Promise((res, rej) => {
    readFile(testData, {encoding: "hex"}, (err, data2) => {
      if (err) {
        rej(err);
      }
      res(data2);
    });
  });
  assertEquals(typeof data, "string");
  assertEquals(data, "68656c6c6f20776f726c64");
});
Deno.test("readFileEncodeBase64Success", async function() {
  const data = await new Promise((res, rej) => {
    readFile(testData, {encoding: "base64"}, (err, data2) => {
      if (err) {
        rej(err);
      }
      res(data2);
    });
  });
  assertEquals(typeof data, "string");
  assertEquals(data, "aGVsbG8gd29ybGQ=");
});
Deno.test("readFileEncodingAsString", async function() {
  const data = await new Promise((res, rej) => {
    readFile(testData, "utf8", (err, data2) => {
      if (err) {
        rej(err);
      }
      res(data2);
    });
  });
  assertEquals(typeof data, "string");
  assertEquals(data, "hello world");
});
Deno.test("readFileSyncSuccess", function() {
  const data = readFileSync(testData);
  assert(data instanceof Uint8Array);
  assertEquals(new TextDecoder().decode(data), "hello world");
});
Deno.test("readFileEncodeUtf8Success", function() {
  const data = readFileSync(testData, {encoding: "utf8"});
  assertEquals(typeof data, "string");
  assertEquals(data, "hello world");
});
Deno.test("readFileEncodeHexSuccess", function() {
  const data = readFileSync(testData, {encoding: "hex"});
  assertEquals(typeof data, "string");
  assertEquals(data, "68656c6c6f20776f726c64");
});
Deno.test("readFileEncodeBase64Success", function() {
  const data = readFileSync(testData, {encoding: "base64"});
  assertEquals(typeof data, "string");
  assertEquals(data, "aGVsbG8gd29ybGQ=");
});
Deno.test("readFileEncodeAsString", function() {
  const data = readFileSync(testData, "utf8");
  assertEquals(typeof data, "string");
  assertEquals(data, "hello world");
});
