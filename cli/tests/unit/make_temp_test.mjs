import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {write: true}}, function makeTempDirSyncSuccess() {
  const dir1 = Deno.makeTempDirSync({prefix: "hello", suffix: "world"});
  const dir2 = Deno.makeTempDirSync({prefix: "hello", suffix: "world"});
  assert(dir1 !== dir2);
  for (const dir of [dir1, dir2]) {
    const lastPart = dir.replace(/^.*[\\\/]/, "");
    assert(lastPart.startsWith("hello"));
    assert(lastPart.endsWith("world"));
  }
  const dir3 = Deno.makeTempDirSync({dir: dir1});
  assert(dir3.startsWith(dir1));
  assert(/^[\\\/]/.test(dir3.slice(dir1.length)));
  assertThrows(() => {
    Deno.makeTempDirSync({dir: "/baddir"});
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true, write: true}}, function makeTempDirSyncMode() {
  const path = Deno.makeTempDirSync();
  const pathInfo = Deno.statSync(path);
  if (Deno.build.os !== "windows") {
    assertEquals(pathInfo.mode & 511, 448 & ~Deno.umask());
  }
});
unitTest(function makeTempDirSyncPerm() {
  assertThrows(() => {
    Deno.makeTempDirSync({dir: "/baddir"});
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {write: true}}, async function makeTempDirSuccess() {
  const dir1 = await Deno.makeTempDir({prefix: "hello", suffix: "world"});
  const dir2 = await Deno.makeTempDir({prefix: "hello", suffix: "world"});
  assert(dir1 !== dir2);
  for (const dir of [dir1, dir2]) {
    const lastPart = dir.replace(/^.*[\\\/]/, "");
    assert(lastPart.startsWith("hello"));
    assert(lastPart.endsWith("world"));
  }
  const dir3 = await Deno.makeTempDir({dir: dir1});
  assert(dir3.startsWith(dir1));
  assert(/^[\\\/]/.test(dir3.slice(dir1.length)));
  await assertThrowsAsync(async () => {
    await Deno.makeTempDir({dir: "/baddir"});
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true, write: true}}, async function makeTempDirMode() {
  const path = await Deno.makeTempDir();
  const pathInfo = Deno.statSync(path);
  if (Deno.build.os !== "windows") {
    assertEquals(pathInfo.mode & 511, 448 & ~Deno.umask());
  }
});
unitTest({perms: {write: true}}, function makeTempFileSyncSuccess() {
  const file1 = Deno.makeTempFileSync({prefix: "hello", suffix: "world"});
  const file2 = Deno.makeTempFileSync({prefix: "hello", suffix: "world"});
  assert(file1 !== file2);
  for (const dir2 of [file1, file2]) {
    const lastPart = dir2.replace(/^.*[\\\/]/, "");
    assert(lastPart.startsWith("hello"));
    assert(lastPart.endsWith("world"));
  }
  const dir = Deno.makeTempDirSync({prefix: "tempdir"});
  const file3 = Deno.makeTempFileSync({dir});
  assert(file3.startsWith(dir));
  assert(/^[\\\/]/.test(file3.slice(dir.length)));
  assertThrows(() => {
    Deno.makeTempFileSync({dir: "/baddir"});
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true, write: true}}, function makeTempFileSyncMode() {
  const path = Deno.makeTempFileSync();
  const pathInfo = Deno.statSync(path);
  if (Deno.build.os !== "windows") {
    assertEquals(pathInfo.mode & 511, 384 & ~Deno.umask());
  }
});
unitTest(function makeTempFileSyncPerm() {
  assertThrows(() => {
    Deno.makeTempFileSync({dir: "/baddir"});
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {write: true}}, async function makeTempFileSuccess() {
  const file1 = await Deno.makeTempFile({prefix: "hello", suffix: "world"});
  const file2 = await Deno.makeTempFile({prefix: "hello", suffix: "world"});
  assert(file1 !== file2);
  for (const dir2 of [file1, file2]) {
    const lastPart = dir2.replace(/^.*[\\\/]/, "");
    assert(lastPart.startsWith("hello"));
    assert(lastPart.endsWith("world"));
  }
  const dir = Deno.makeTempDirSync({prefix: "tempdir"});
  const file3 = await Deno.makeTempFile({dir});
  assert(file3.startsWith(dir));
  assert(/^[\\\/]/.test(file3.slice(dir.length)));
  await assertThrowsAsync(async () => {
    await Deno.makeTempFile({dir: "/baddir"});
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true, write: true}}, async function makeTempFileMode() {
  const path = await Deno.makeTempFile();
  const pathInfo = Deno.statSync(path);
  if (Deno.build.os !== "windows") {
    assertEquals(pathInfo.mode & 511, 384 & ~Deno.umask());
  }
});
