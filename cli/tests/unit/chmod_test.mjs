import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, function chmodSyncSuccess() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const tempDir = Deno.makeTempDirSync();
  const filename = tempDir + "/test.txt";
  Deno.writeFileSync(filename, data, {mode: 438});
  Deno.chmodSync(filename, 511);
  const fileInfo = Deno.statSync(filename);
  assert(fileInfo.mode);
  assertEquals(fileInfo.mode & 511, 511);
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, function chmodSyncUrl() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const tempDir = Deno.makeTempDirSync();
  const fileUrl = new URL(`file://${tempDir}/test.txt`);
  Deno.writeFileSync(fileUrl, data, {mode: 438});
  Deno.chmodSync(fileUrl, 511);
  const fileInfo = Deno.statSync(fileUrl);
  assert(fileInfo.mode);
  assertEquals(fileInfo.mode & 511, 511);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({
  ignore: Deno.build.os === "windows",
  perms: {read: true, write: true}
}, function chmodSyncSymlinkSuccess() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const tempDir = Deno.makeTempDirSync();
  const filename = tempDir + "/test.txt";
  Deno.writeFileSync(filename, data, {mode: 438});
  const symlinkName = tempDir + "/test_symlink.txt";
  Deno.symlinkSync(filename, symlinkName);
  let symlinkInfo = Deno.lstatSync(symlinkName);
  assert(symlinkInfo.mode);
  const symlinkMode = symlinkInfo.mode & 511;
  Deno.chmodSync(symlinkName, 511);
  const fileInfo = Deno.statSync(filename);
  assert(fileInfo.mode);
  assertEquals(fileInfo.mode & 511, 511);
  symlinkInfo = Deno.lstatSync(symlinkName);
  assert(symlinkInfo.mode);
  assertEquals(symlinkInfo.mode & 511, symlinkMode);
});
unitTest({perms: {write: true}}, function chmodSyncFailure() {
  assertThrows(() => {
    const filename = "/badfile.txt";
    Deno.chmodSync(filename, 511);
  }, Deno.errors.NotFound);
});
unitTest({perms: {write: false}}, function chmodSyncPerm() {
  assertThrows(() => {
    Deno.chmodSync("/somefile.txt", 511);
  }, Deno.errors.PermissionDenied);
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, async function chmodSuccess() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const tempDir = Deno.makeTempDirSync();
  const filename = tempDir + "/test.txt";
  Deno.writeFileSync(filename, data, {mode: 438});
  await Deno.chmod(filename, 511);
  const fileInfo = Deno.statSync(filename);
  assert(fileInfo.mode);
  assertEquals(fileInfo.mode & 511, 511);
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, async function chmodUrl() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const tempDir = Deno.makeTempDirSync();
  const fileUrl = new URL(`file://${tempDir}/test.txt`);
  Deno.writeFileSync(fileUrl, data, {mode: 438});
  await Deno.chmod(fileUrl, 511);
  const fileInfo = Deno.statSync(fileUrl);
  assert(fileInfo.mode);
  assertEquals(fileInfo.mode & 511, 511);
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({
  ignore: Deno.build.os === "windows",
  perms: {read: true, write: true}
}, async function chmodSymlinkSuccess() {
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const tempDir = Deno.makeTempDirSync();
  const filename = tempDir + "/test.txt";
  Deno.writeFileSync(filename, data, {mode: 438});
  const symlinkName = tempDir + "/test_symlink.txt";
  Deno.symlinkSync(filename, symlinkName);
  let symlinkInfo = Deno.lstatSync(symlinkName);
  assert(symlinkInfo.mode);
  const symlinkMode = symlinkInfo.mode & 511;
  await Deno.chmod(symlinkName, 511);
  const fileInfo = Deno.statSync(filename);
  assert(fileInfo.mode);
  assertEquals(fileInfo.mode & 511, 511);
  symlinkInfo = Deno.lstatSync(symlinkName);
  assert(symlinkInfo.mode);
  assertEquals(symlinkInfo.mode & 511, symlinkMode);
});
unitTest({perms: {write: true}}, async function chmodFailure() {
  await assertThrowsAsync(async () => {
    const filename = "/badfile.txt";
    await Deno.chmod(filename, 511);
  }, Deno.errors.NotFound);
});
unitTest({perms: {write: false}}, async function chmodPerm() {
  await assertThrowsAsync(async () => {
    await Deno.chmod("/somefile.txt", 511);
  }, Deno.errors.PermissionDenied);
});
