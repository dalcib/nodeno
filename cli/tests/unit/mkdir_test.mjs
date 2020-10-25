import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
function assertDirectory(path, mode) {
  const info = Deno.lstatSync(path);
  assert(info.isDirectory);
  if (Deno.build.os !== "windows" && mode !== void 0) {
    assertEquals(info.mode & 511, mode & ~Deno.umask());
  }
}
unitTest({perms: {read: true, write: true}}, function mkdirSyncSuccess() {
  const path = Deno.makeTempDirSync() + "/dir";
  Deno.mkdirSync(path);
  assertDirectory(path);
});
unitTest({perms: {read: true, write: true}}, function mkdirSyncMode() {
  const path = Deno.makeTempDirSync() + "/dir";
  Deno.mkdirSync(path, {mode: 479});
  assertDirectory(path, 479);
});
unitTest({perms: {write: false}}, function mkdirSyncPerm() {
  assertThrows(() => {
    Deno.mkdirSync("/baddir");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: true}}, async function mkdirSuccess() {
  const path = Deno.makeTempDirSync() + "/dir";
  await Deno.mkdir(path);
  assertDirectory(path);
});
unitTest({perms: {read: true, write: true}}, async function mkdirMode() {
  const path = Deno.makeTempDirSync() + "/dir";
  await Deno.mkdir(path, {mode: 479});
  assertDirectory(path, 479);
});
unitTest({perms: {write: true}}, function mkdirErrSyncIfExists() {
  assertThrows(() => {
    Deno.mkdirSync(".");
  }, Deno.errors.AlreadyExists);
});
unitTest({perms: {write: true}}, async function mkdirErrIfExists() {
  await assertThrowsAsync(async () => {
    await Deno.mkdir(".");
  }, Deno.errors.AlreadyExists);
});
unitTest({perms: {read: true, write: true}}, function mkdirSyncRecursive() {
  const path = Deno.makeTempDirSync() + "/nested/directory";
  Deno.mkdirSync(path, {recursive: true});
  assertDirectory(path);
});
unitTest({perms: {read: true, write: true}}, async function mkdirRecursive() {
  const path = Deno.makeTempDirSync() + "/nested/directory";
  await Deno.mkdir(path, {recursive: true});
  assertDirectory(path);
});
unitTest({perms: {read: true, write: true}}, function mkdirSyncRecursiveMode() {
  const nested = Deno.makeTempDirSync() + "/nested";
  const path = nested + "/dir";
  Deno.mkdirSync(path, {mode: 479, recursive: true});
  assertDirectory(path, 479);
  assertDirectory(nested, 479);
});
unitTest({perms: {read: true, write: true}}, async function mkdirRecursiveMode() {
  const nested = Deno.makeTempDirSync() + "/nested";
  const path = nested + "/dir";
  await Deno.mkdir(path, {mode: 479, recursive: true});
  assertDirectory(path, 479);
  assertDirectory(nested, 479);
});
unitTest({perms: {read: true, write: true}}, function mkdirSyncRecursiveIfExists() {
  const path = Deno.makeTempDirSync() + "/dir";
  Deno.mkdirSync(path, {mode: 479});
  Deno.mkdirSync(path, {recursive: true});
  Deno.mkdirSync(path, {recursive: true, mode: 473});
  assertDirectory(path, 479);
  if (Deno.build.os !== "windows") {
    const pathLink = path + "Link";
    Deno.symlinkSync(path, pathLink);
    Deno.mkdirSync(pathLink, {recursive: true});
    Deno.mkdirSync(pathLink, {recursive: true, mode: 473});
    assertDirectory(path, 479);
  }
});
unitTest({perms: {read: true, write: true}}, async function mkdirRecursiveIfExists() {
  const path = Deno.makeTempDirSync() + "/dir";
  await Deno.mkdir(path, {mode: 479});
  await Deno.mkdir(path, {recursive: true});
  await Deno.mkdir(path, {recursive: true, mode: 473});
  assertDirectory(path, 479);
  if (Deno.build.os !== "windows") {
    const pathLink = path + "Link";
    Deno.symlinkSync(path, pathLink);
    await Deno.mkdir(pathLink, {recursive: true});
    await Deno.mkdir(pathLink, {recursive: true, mode: 473});
    assertDirectory(path, 479);
  }
});
unitTest({perms: {read: true, write: true}}, function mkdirSyncErrors() {
  const testDir = Deno.makeTempDirSync();
  const emptydir = testDir + "/empty";
  const fulldir = testDir + "/dir";
  const file = fulldir + "/file";
  Deno.mkdirSync(emptydir);
  Deno.mkdirSync(fulldir);
  Deno.createSync(file).close();
  assertThrows(() => {
    Deno.mkdirSync(emptydir, {recursive: false});
  }, Deno.errors.AlreadyExists);
  assertThrows(() => {
    Deno.mkdirSync(fulldir, {recursive: false});
  }, Deno.errors.AlreadyExists);
  assertThrows(() => {
    Deno.mkdirSync(file, {recursive: false});
  }, Deno.errors.AlreadyExists);
  assertThrows(() => {
    Deno.mkdirSync(file, {recursive: true});
  }, Deno.errors.AlreadyExists);
  if (Deno.build.os !== "windows") {
    const fileLink = testDir + "/fileLink";
    const dirLink = testDir + "/dirLink";
    const danglingLink = testDir + "/danglingLink";
    Deno.symlinkSync(file, fileLink);
    Deno.symlinkSync(emptydir, dirLink);
    Deno.symlinkSync(testDir + "/nonexistent", danglingLink);
    assertThrows(() => {
      Deno.mkdirSync(dirLink, {recursive: false});
    }, Deno.errors.AlreadyExists);
    assertThrows(() => {
      Deno.mkdirSync(fileLink, {recursive: false});
    }, Deno.errors.AlreadyExists);
    assertThrows(() => {
      Deno.mkdirSync(fileLink, {recursive: true});
    }, Deno.errors.AlreadyExists);
    assertThrows(() => {
      Deno.mkdirSync(danglingLink, {recursive: false});
    }, Deno.errors.AlreadyExists);
    assertThrows(() => {
      Deno.mkdirSync(danglingLink, {recursive: true});
    }, Deno.errors.AlreadyExists);
  }
});
