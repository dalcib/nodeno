import {
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
function readFileString(filename) {
  const dataRead = Deno.readFileSync(filename);
  const dec = new TextDecoder("utf-8");
  return dec.decode(dataRead);
}
function writeFileString(filename, s) {
  const enc = new TextEncoder();
  const data = enc.encode(s);
  Deno.writeFileSync(filename, data, {mode: 438});
}
function assertSameContent(filename1, filename2) {
  const data1 = Deno.readFileSync(filename1);
  const data2 = Deno.readFileSync(filename2);
  assertEquals(data1, data2);
}
unitTest({perms: {read: true, write: true}}, function copyFileSyncSuccess() {
  const tempDir = Deno.makeTempDirSync();
  const fromFilename = tempDir + "/from.txt";
  const toFilename = tempDir + "/to.txt";
  writeFileString(fromFilename, "Hello world!");
  Deno.copyFileSync(fromFilename, toFilename);
  assertEquals(readFileString(fromFilename), "Hello world!");
  assertSameContent(fromFilename, toFilename);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, function copyFileSyncByUrl() {
  const tempDir = Deno.makeTempDirSync();
  const fromUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/from.txt`);
  const toUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/to.txt`);
  writeFileString(fromUrl, "Hello world!");
  Deno.copyFileSync(fromUrl, toUrl);
  assertEquals(readFileString(fromUrl), "Hello world!");
  assertSameContent(fromUrl, toUrl);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {write: true, read: true}}, function copyFileSyncFailure() {
  const tempDir = Deno.makeTempDirSync();
  const fromFilename = tempDir + "/from.txt";
  const toFilename = tempDir + "/to.txt";
  assertThrows(() => {
    Deno.copyFileSync(fromFilename, toFilename);
  }, Deno.errors.NotFound);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {write: true, read: false}}, function copyFileSyncPerm1() {
  assertThrows(() => {
    Deno.copyFileSync("/from.txt", "/to.txt");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {write: false, read: true}}, function copyFileSyncPerm2() {
  assertThrows(() => {
    Deno.copyFileSync("/from.txt", "/to.txt");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: true}}, function copyFileSyncOverwrite() {
  const tempDir = Deno.makeTempDirSync();
  const fromFilename = tempDir + "/from.txt";
  const toFilename = tempDir + "/to.txt";
  writeFileString(fromFilename, "Hello world!");
  writeFileString(toFilename, "Goodbye!");
  Deno.copyFileSync(fromFilename, toFilename);
  assertEquals(readFileString(fromFilename), "Hello world!");
  assertSameContent(fromFilename, toFilename);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function copyFileSuccess() {
  const tempDir = Deno.makeTempDirSync();
  const fromFilename = tempDir + "/from.txt";
  const toFilename = tempDir + "/to.txt";
  writeFileString(fromFilename, "Hello world!");
  await Deno.copyFile(fromFilename, toFilename);
  assertEquals(readFileString(fromFilename), "Hello world!");
  assertSameContent(fromFilename, toFilename);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function copyFileByUrl() {
  const tempDir = Deno.makeTempDirSync();
  const fromUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/from.txt`);
  const toUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/to.txt`);
  writeFileString(fromUrl, "Hello world!");
  await Deno.copyFile(fromUrl, toUrl);
  assertEquals(readFileString(fromUrl), "Hello world!");
  assertSameContent(fromUrl, toUrl);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function copyFileFailure() {
  const tempDir = Deno.makeTempDirSync();
  const fromFilename = tempDir + "/from.txt";
  const toFilename = tempDir + "/to.txt";
  await assertThrowsAsync(async () => {
    await Deno.copyFile(fromFilename, toFilename);
  }, Deno.errors.NotFound);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function copyFileOverwrite() {
  const tempDir = Deno.makeTempDirSync();
  const fromFilename = tempDir + "/from.txt";
  const toFilename = tempDir + "/to.txt";
  writeFileString(fromFilename, "Hello world!");
  writeFileString(toFilename, "Goodbye!");
  await Deno.copyFile(fromFilename, toFilename);
  assertEquals(readFileString(fromFilename), "Hello world!");
  assertSameContent(fromFilename, toFilename);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {read: false, write: true}}, async function copyFilePerm1() {
  await assertThrowsAsync(async () => {
    await Deno.copyFile("/from.txt", "/to.txt");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: false}}, async function copyFilePerm2() {
  await assertThrowsAsync(async () => {
    await Deno.copyFile("/from.txt", "/to.txt");
  }, Deno.errors.PermissionDenied);
});
