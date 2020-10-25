import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrowsAsync
} from "../../../testing/asserts.mjs";
import {writeFile} from "./_fs_writeFile.mjs";
const decoder = new TextDecoder("utf-8");
Deno.test("Invalid encoding results in error()", function testEncodingErrors() {
  assertThrowsAsync(async () => {
    await writeFile("some/path", "some data", "made-up-encoding");
  }, Error, `The value "made-up-encoding" is invalid for option "encoding"`);
  assertThrowsAsync(async () => {
    await writeFile("some/path", "some data", {
      encoding: "made-up-encoding"
    });
  }, Error, `The value "made-up-encoding" is invalid for option "encoding"`);
});
Deno.test("Unsupported encoding results in error()", function testUnsupportedEncoding() {
  assertThrowsAsync(async () => {
    await writeFile("some/path", "some data", "utf16le");
  }, Error, `Not implemented: "utf16le" encoding`);
});
Deno.test("Data is written to correct rid", async function testCorrectWriteUsingRid() {
  const tempFile = await Deno.makeTempFile();
  const file = await Deno.open(tempFile, {
    create: true,
    write: true,
    read: true
  });
  await writeFile(file.rid, "hello world");
  Deno.close(file.rid);
  const data = await Deno.readFile(tempFile);
  await Deno.remove(tempFile);
  assertEquals(decoder.decode(data), "hello world");
});
Deno.test("Data is written to correct file", async function testCorrectWriteUsingPath() {
  const openResourcesBeforeWrite = Deno.resources();
  await writeFile("_fs_writeFile_test_file.txt", "hello world");
  assertEquals(Deno.resources(), openResourcesBeforeWrite);
  const data = await Deno.readFile("_fs_writeFile_test_file.txt");
  await Deno.remove("_fs_writeFile_test_file.txt");
  assertEquals(decoder.decode(data), "hello world");
});
Deno.test("Data is written to correct file encodings", async function testCorrectWritePromiseUsingDifferentEncodings() {
  const encodings = [
    ["hex", "68656c6c6f20776f726c64"],
    ["HEX", "68656c6c6f20776f726c64"],
    ["base64", "aGVsbG8gd29ybGQ="],
    ["BASE64", "aGVsbG8gd29ybGQ="],
    ["utf8", "hello world"],
    ["utf-8", "hello world"]
  ];
  for (const [encoding, value] of encodings) {
    await writeFile("_fs_writeFile_test_file.txt", value, encoding);
    const data = await Deno.readFile("_fs_writeFile_test_file.txt");
    await Deno.remove("_fs_writeFile_test_file.txt");
    assertEquals(decoder.decode(data), "hello world");
  }
});
Deno.test("Mode is correctly set", async function testCorrectFileMode() {
  if (Deno.build.os === "windows")
    return;
  const filename = "_fs_writeFile_test_file.txt";
  await writeFile(filename, "hello world", {mode: 511});
  const fileInfo = await Deno.stat(filename);
  await Deno.remove(filename);
  assert(fileInfo && fileInfo.mode);
  assertEquals(fileInfo.mode & 511, 511);
});
Deno.test("Mode is not set when rid is passed", async function testCorrectFileModeRid() {
  if (Deno.build.os === "windows")
    return;
  const filename = await Deno.makeTempFile();
  const file = await Deno.open(filename, {
    create: true,
    write: true,
    read: true
  });
  await writeFile(file.rid, "hello world", {mode: 511});
  Deno.close(file.rid);
  const fileInfo = await Deno.stat(filename);
  await Deno.remove(filename);
  assert(fileInfo.mode);
  assertNotEquals(fileInfo.mode & 511, 511);
});
