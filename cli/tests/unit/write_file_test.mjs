import {
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {read: true, write: true}}, function writeFileSyncSuccess() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  Deno.writeFileSync(filename, data);
  const dataRead = Deno.readFileSync(filename);
  const dec = new TextDecoder("utf-8");
  const actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
});
unitTest({perms: {read: true, write: true}}, function writeFileSyncUrl() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const tempDir = Deno.makeTempDirSync();
  const fileUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/test.txt`);
  Deno.writeFileSync(fileUrl, data);
  const dataRead = Deno.readFileSync(fileUrl);
  const dec = new TextDecoder("utf-8");
  const actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {write: true}}, function writeFileSyncFail() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = "/baddir/test.txt";
  assertThrows(() => {
    Deno.writeFileSync(filename, data);
  }, Deno.errors.NotFound);
});
unitTest({perms: {write: false}}, function writeFileSyncPerm() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = "/baddir/test.txt";
  assertThrows(() => {
    Deno.writeFileSync(filename, data);
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: true}}, function writeFileSyncUpdateMode() {
  if (Deno.build.os !== "windows") {
    const enc = new TextEncoder();
    const data = enc.encode("Hello");
    const filename = Deno.makeTempDirSync() + "/test.txt";
    Deno.writeFileSync(filename, data, {mode: 493});
    assertEquals(Deno.statSync(filename).mode & 511, 493);
    Deno.writeFileSync(filename, data, {mode: 438});
    assertEquals(Deno.statSync(filename).mode & 511, 438);
  }
});
unitTest({perms: {read: true, write: true}}, function writeFileSyncCreate() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  assertThrows(() => {
    Deno.writeFileSync(filename, data, {create: false});
  }, Deno.errors.NotFound);
  Deno.writeFileSync(filename, data, {create: true});
  Deno.writeFileSync(filename, data, {create: false});
  const dataRead = Deno.readFileSync(filename);
  const dec = new TextDecoder("utf-8");
  const actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
});
unitTest({perms: {read: true, write: true}}, function writeFileSyncAppend() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  Deno.writeFileSync(filename, data);
  Deno.writeFileSync(filename, data, {append: true});
  let dataRead = Deno.readFileSync(filename);
  const dec = new TextDecoder("utf-8");
  let actual = dec.decode(dataRead);
  assertEquals("HelloHello", actual);
  Deno.writeFileSync(filename, data, {append: false});
  dataRead = Deno.readFileSync(filename);
  actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
  Deno.writeFileSync(filename, data);
  dataRead = Deno.readFileSync(filename);
  actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
});
unitTest({perms: {read: true, write: true}}, async function writeFileSuccess() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  await Deno.writeFile(filename, data);
  const dataRead = Deno.readFileSync(filename);
  const dec = new TextDecoder("utf-8");
  const actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
});
unitTest({perms: {read: true, write: true}}, async function writeFileUrl() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const tempDir = await Deno.makeTempDir();
  const fileUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/test.txt`);
  await Deno.writeFile(fileUrl, data);
  const dataRead = Deno.readFileSync(fileUrl);
  const dec = new TextDecoder("utf-8");
  const actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function writeFileNotFound() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = "/baddir/test.txt";
  await assertThrowsAsync(async () => {
    await Deno.writeFile(filename, data);
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true, write: false}}, async function writeFilePerm() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = "/baddir/test.txt";
  await assertThrowsAsync(async () => {
    await Deno.writeFile(filename, data);
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: true}}, async function writeFileUpdateMode() {
  if (Deno.build.os !== "windows") {
    const enc = new TextEncoder();
    const data = enc.encode("Hello");
    const filename = Deno.makeTempDirSync() + "/test.txt";
    await Deno.writeFile(filename, data, {mode: 493});
    assertEquals(Deno.statSync(filename).mode & 511, 493);
    await Deno.writeFile(filename, data, {mode: 438});
    assertEquals(Deno.statSync(filename).mode & 511, 438);
  }
});
unitTest({perms: {read: true, write: true}}, async function writeFileCreate() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  await assertThrowsAsync(async () => {
    await Deno.writeFile(filename, data, {create: false});
  }, Deno.errors.NotFound);
  await Deno.writeFile(filename, data, {create: true});
  await Deno.writeFile(filename, data, {create: false});
  const dataRead = Deno.readFileSync(filename);
  const dec = new TextDecoder("utf-8");
  const actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
});
unitTest({perms: {read: true, write: true}}, async function writeFileAppend() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  await Deno.writeFile(filename, data);
  await Deno.writeFile(filename, data, {append: true});
  let dataRead = Deno.readFileSync(filename);
  const dec = new TextDecoder("utf-8");
  let actual = dec.decode(dataRead);
  assertEquals("HelloHello", actual);
  await Deno.writeFile(filename, data, {append: false});
  dataRead = Deno.readFileSync(filename);
  actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
  await Deno.writeFile(filename, data);
  dataRead = Deno.readFileSync(filename);
  actual = dec.decode(dataRead);
  assertEquals("Hello", actual);
});
