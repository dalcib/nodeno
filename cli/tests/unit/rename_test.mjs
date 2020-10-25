import {assert, assertEquals, assertThrows, unitTest} from "./test_util.mjs";
function assertMissing(path) {
  let caughtErr = false;
  let info;
  try {
    info = Deno.lstatSync(path);
  } catch (e) {
    caughtErr = true;
    assert(e instanceof Deno.errors.NotFound);
  }
  assert(caughtErr);
  assertEquals(info, void 0);
}
function assertFile(path) {
  const info = Deno.lstatSync(path);
  assert(info.isFile);
}
function assertDirectory(path, mode) {
  const info = Deno.lstatSync(path);
  assert(info.isDirectory);
  if (Deno.build.os !== "windows" && mode !== void 0) {
    assertEquals(info.mode & 511, mode & ~Deno.umask());
  }
}
unitTest({perms: {read: true, write: true}}, function renameSyncSuccess() {
  const testDir = Deno.makeTempDirSync();
  const oldpath = testDir + "/oldpath";
  const newpath = testDir + "/newpath";
  Deno.mkdirSync(oldpath);
  Deno.renameSync(oldpath, newpath);
  assertDirectory(newpath);
  assertMissing(oldpath);
});
unitTest({perms: {read: false, write: true}}, function renameSyncReadPerm() {
  assertThrows(() => {
    const oldpath = "/oldbaddir";
    const newpath = "/newbaddir";
    Deno.renameSync(oldpath, newpath);
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: false}}, function renameSyncWritePerm() {
  assertThrows(() => {
    const oldpath = "/oldbaddir";
    const newpath = "/newbaddir";
    Deno.renameSync(oldpath, newpath);
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: true}}, async function renameSuccess() {
  const testDir = Deno.makeTempDirSync();
  const oldpath = testDir + "/oldpath";
  const newpath = testDir + "/newpath";
  Deno.mkdirSync(oldpath);
  await Deno.rename(oldpath, newpath);
  assertDirectory(newpath);
  assertMissing(oldpath);
});
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
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, function renameSyncErrorsUnix() {
  const testDir = Deno.makeTempDirSync();
  const oldfile = testDir + "/oldfile";
  const olddir = testDir + "/olddir";
  const emptydir = testDir + "/empty";
  const fulldir = testDir + "/dir";
  const file = fulldir + "/file";
  writeFileString(oldfile, "Hello");
  Deno.mkdirSync(olddir);
  Deno.mkdirSync(emptydir);
  Deno.mkdirSync(fulldir);
  writeFileString(file, "world");
  assertThrows(() => {
    Deno.renameSync(oldfile, emptydir);
  }, Error, "Is a directory");
  assertThrows(() => {
    Deno.renameSync(olddir, fulldir);
  }, Error, "Directory not empty");
  assertThrows(() => {
    Deno.renameSync(olddir, file);
  }, Error, "Not a directory");
  const fileLink = testDir + "/fileLink";
  const dirLink = testDir + "/dirLink";
  const danglingLink = testDir + "/danglingLink";
  Deno.symlinkSync(file, fileLink);
  Deno.symlinkSync(emptydir, dirLink);
  Deno.symlinkSync(testDir + "/nonexistent", danglingLink);
  assertThrows(() => {
    Deno.renameSync(olddir, fileLink);
  }, Error, "Not a directory");
  assertThrows(() => {
    Deno.renameSync(olddir, dirLink);
  }, Error, "Not a directory");
  assertThrows(() => {
    Deno.renameSync(olddir, danglingLink);
  }, Error, "Not a directory");
  Deno.renameSync(olddir, emptydir);
  Deno.renameSync(oldfile, dirLink);
  Deno.renameSync(dirLink, danglingLink);
  assertFile(danglingLink);
  assertEquals("Hello", readFileString(danglingLink));
});
unitTest({ignore: Deno.build.os !== "windows", perms: {read: true, write: true}}, function renameSyncErrorsWin() {
  const testDir = Deno.makeTempDirSync();
  const oldfile = testDir + "/oldfile";
  const olddir = testDir + "/olddir";
  const emptydir = testDir + "/empty";
  const fulldir = testDir + "/dir";
  const file = fulldir + "/file";
  writeFileString(oldfile, "Hello");
  Deno.mkdirSync(olddir);
  Deno.mkdirSync(emptydir);
  Deno.mkdirSync(fulldir);
  writeFileString(file, "world");
  assertThrows(() => {
    Deno.renameSync(oldfile, emptydir);
  }, Deno.errors.PermissionDenied, "Access is denied");
  assertThrows(() => {
    Deno.renameSync(olddir, fulldir);
  }, Deno.errors.PermissionDenied, "Access is denied");
  assertThrows(() => {
    Deno.renameSync(olddir, emptydir);
  }, Deno.errors.PermissionDenied, "Access is denied");
  Deno.renameSync(olddir, file);
  assertDirectory(file);
});
