import {
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {write: true, read: true}}, function readLinkSyncSuccess() {
  const testDir = Deno.makeTempDirSync();
  const target = testDir + (Deno.build.os == "windows" ? "\\target" : "/target");
  const symlink = testDir + (Deno.build.os == "windows" ? "\\symlink" : "/symlink");
  Deno.mkdirSync(target);
  Deno.symlinkSync(target, symlink);
  const targetPath = Deno.readLinkSync(symlink);
  assertEquals(targetPath, target);
});
unitTest({perms: {read: false}}, function readLinkSyncPerm() {
  assertThrows(() => {
    Deno.readLinkSync("/symlink");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, function readLinkSyncNotFound() {
  assertThrows(() => {
    Deno.readLinkSync("bad_filename");
  }, Deno.errors.NotFound);
});
unitTest({perms: {write: true, read: true}}, async function readLinkSuccess() {
  const testDir = Deno.makeTempDirSync();
  const target = testDir + (Deno.build.os == "windows" ? "\\target" : "/target");
  const symlink = testDir + (Deno.build.os == "windows" ? "\\symlink" : "/symlink");
  Deno.mkdirSync(target);
  Deno.symlinkSync(target, symlink);
  const targetPath = await Deno.readLink(symlink);
  assertEquals(targetPath, target);
});
unitTest({perms: {read: false}}, async function readLinkPerm() {
  await assertThrowsAsync(async () => {
    await Deno.readLink("/symlink");
  }, Deno.errors.PermissionDenied);
});
