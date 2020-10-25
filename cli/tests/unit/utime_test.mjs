import {
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {read: true, write: true}}, async function futimeSyncSuccess() {
  const testDir = await Deno.makeTempDir();
  const filename = testDir + "/file.txt";
  const file = await Deno.open(filename, {
    create: true,
    write: true
  });
  const atime = 1e3;
  const mtime = 5e4;
  await Deno.futime(file.rid, atime, mtime);
  await Deno.fdatasync(file.rid);
  const fileInfo = Deno.statSync(filename);
  assertEquals(fileInfo.atime, new Date(atime * 1e3));
  assertEquals(fileInfo.mtime, new Date(mtime * 1e3));
  file.close();
});
unitTest({perms: {read: true, write: true}}, function futimeSyncSuccess2() {
  const testDir = Deno.makeTempDirSync();
  const filename = testDir + "/file.txt";
  const file = Deno.openSync(filename, {
    create: true,
    write: true
  });
  const atime = 1e3;
  const mtime = 5e4;
  Deno.futimeSync(file.rid, atime, mtime);
  Deno.fdatasyncSync(file.rid);
  const fileInfo = Deno.statSync(filename);
  assertEquals(fileInfo.atime, new Date(atime * 1e3));
  assertEquals(fileInfo.mtime, new Date(mtime * 1e3));
  file.close();
});
unitTest({perms: {read: true, write: true}}, function utimeSyncFileSuccess() {
  const testDir = Deno.makeTempDirSync();
  const filename = testDir + "/file.txt";
  Deno.writeFileSync(filename, new TextEncoder().encode("hello"), {
    mode: 438
  });
  const atime = 1e3;
  const mtime = 5e4;
  Deno.utimeSync(filename, atime, mtime);
  const fileInfo = Deno.statSync(filename);
  assertEquals(fileInfo.atime, new Date(atime * 1e3));
  assertEquals(fileInfo.mtime, new Date(mtime * 1e3));
});
unitTest({perms: {read: true, write: true}}, function utimeSyncDirectorySuccess() {
  const testDir = Deno.makeTempDirSync();
  const atime = 1e3;
  const mtime = 5e4;
  Deno.utimeSync(testDir, atime, mtime);
  const dirInfo = Deno.statSync(testDir);
  assertEquals(dirInfo.atime, new Date(atime * 1e3));
  assertEquals(dirInfo.mtime, new Date(mtime * 1e3));
});
unitTest({perms: {read: true, write: true}}, function utimeSyncDateSuccess() {
  const testDir = Deno.makeTempDirSync();
  const atime = new Date(1e6);
  const mtime = new Date(5e7);
  Deno.utimeSync(testDir, atime, mtime);
  const dirInfo = Deno.statSync(testDir);
  assertEquals(dirInfo.atime, atime);
  assertEquals(dirInfo.mtime, mtime);
});
unitTest({perms: {read: true, write: true}}, function utimeSyncFileDateSuccess() {
  const testDir = Deno.makeTempDirSync();
  const filename = testDir + "/file.txt";
  Deno.writeFileSync(filename, new TextEncoder().encode("hello"), {
    mode: 438
  });
  const atime = new Date();
  const mtime = new Date();
  Deno.utimeSync(filename, atime, mtime);
  const fileInfo = Deno.statSync(filename);
  assertEquals(fileInfo.atime, atime);
  assertEquals(fileInfo.mtime, mtime);
});
unitTest({perms: {read: true, write: true}}, function utimeSyncLargeNumberSuccess() {
  const testDir = Deno.makeTempDirSync();
  const atime = 4294967297;
  const mtime = 4294967298;
  Deno.utimeSync(testDir, atime, mtime);
  const dirInfo = Deno.statSync(testDir);
  assertEquals(dirInfo.atime, new Date(atime * 1e3));
  assertEquals(dirInfo.mtime, new Date(mtime * 1e3));
});
unitTest({perms: {read: true, write: true}}, function utimeSyncNotFound() {
  const atime = 1e3;
  const mtime = 5e4;
  assertThrows(() => {
    Deno.utimeSync("/baddir", atime, mtime);
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true, write: false}}, function utimeSyncPerm() {
  const atime = 1e3;
  const mtime = 5e4;
  assertThrows(() => {
    Deno.utimeSync("/some_dir", atime, mtime);
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: true}}, async function utimeFileSuccess() {
  const testDir = Deno.makeTempDirSync();
  const filename = testDir + "/file.txt";
  Deno.writeFileSync(filename, new TextEncoder().encode("hello"), {
    mode: 438
  });
  const atime = 1e3;
  const mtime = 5e4;
  await Deno.utime(filename, atime, mtime);
  const fileInfo = Deno.statSync(filename);
  assertEquals(fileInfo.atime, new Date(atime * 1e3));
  assertEquals(fileInfo.mtime, new Date(mtime * 1e3));
});
unitTest({perms: {read: true, write: true}}, async function utimeDirectorySuccess() {
  const testDir = Deno.makeTempDirSync();
  const atime = 1e3;
  const mtime = 5e4;
  await Deno.utime(testDir, atime, mtime);
  const dirInfo = Deno.statSync(testDir);
  assertEquals(dirInfo.atime, new Date(atime * 1e3));
  assertEquals(dirInfo.mtime, new Date(mtime * 1e3));
});
unitTest({perms: {read: true, write: true}}, async function utimeDateSuccess() {
  const testDir = Deno.makeTempDirSync();
  const atime = new Date(1e5);
  const mtime = new Date(5e6);
  await Deno.utime(testDir, atime, mtime);
  const dirInfo = Deno.statSync(testDir);
  assertEquals(dirInfo.atime, atime);
  assertEquals(dirInfo.mtime, mtime);
});
unitTest({perms: {read: true, write: true}}, async function utimeFileDateSuccess() {
  const testDir = Deno.makeTempDirSync();
  const filename = testDir + "/file.txt";
  Deno.writeFileSync(filename, new TextEncoder().encode("hello"), {
    mode: 438
  });
  const atime = new Date();
  const mtime = new Date();
  await Deno.utime(filename, atime, mtime);
  const fileInfo = Deno.statSync(filename);
  assertEquals(fileInfo.atime, atime);
  assertEquals(fileInfo.mtime, mtime);
});
unitTest({perms: {read: true, write: true}}, async function utimeNotFound() {
  const atime = 1e3;
  const mtime = 5e4;
  await assertThrowsAsync(async () => {
    await Deno.utime("/baddir", atime, mtime);
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true, write: false}}, async function utimeSyncPerm2() {
  const atime = 1e3;
  const mtime = 5e4;
  await assertThrowsAsync(async () => {
    await Deno.utime("/some_dir", atime, mtime);
  }, Deno.errors.PermissionDenied);
});
