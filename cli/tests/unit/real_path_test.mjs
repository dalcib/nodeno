import {
  assert,
  assertMatch,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {read: true}}, function realPathSyncSuccess() {
  const relative = "cli/tests/fixture.json";
  const realPath = Deno.realPathSync(relative);
  if (Deno.build.os !== "windows") {
    assert(realPath.startsWith("/"));
    assert(realPath.endsWith(relative));
  } else {
    assertMatch(realPath, /^[A-Z]:\\/);
    assert(realPath.endsWith(relative.replace(/\//g, "\\")));
  }
});
unitTest({
  perms: {read: true, write: true}
}, function realPathSyncSymlink() {
  const testDir = Deno.makeTempDirSync();
  const target = testDir + "/target";
  const symlink = testDir + "/symln";
  Deno.mkdirSync(target);
  Deno.symlinkSync(target, symlink);
  const realPath = Deno.realPathSync(symlink);
  if (Deno.build.os !== "windows") {
    assert(realPath.startsWith("/"));
    assert(realPath.endsWith("/target"));
  } else {
    assertMatch(realPath, /^[A-Z]:\\/);
    assert(realPath.endsWith("\\target"));
  }
});
unitTest({perms: {read: false}}, function realPathSyncPerm() {
  assertThrows(() => {
    Deno.realPathSync("some_file");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, function realPathSyncNotFound() {
  assertThrows(() => {
    Deno.realPathSync("bad_filename");
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true}}, async function realPathSuccess() {
  const relativePath = "cli/tests/fixture.json";
  const realPath = await Deno.realPath(relativePath);
  if (Deno.build.os !== "windows") {
    assert(realPath.startsWith("/"));
    assert(realPath.endsWith(relativePath));
  } else {
    assertMatch(realPath, /^[A-Z]:\\/);
    assert(realPath.endsWith(relativePath.replace(/\//g, "\\")));
  }
});
unitTest({
  perms: {read: true, write: true}
}, async function realPathSymlink() {
  const testDir = Deno.makeTempDirSync();
  const target = testDir + "/target";
  const symlink = testDir + "/symln";
  Deno.mkdirSync(target);
  Deno.symlinkSync(target, symlink);
  const realPath = await Deno.realPath(symlink);
  if (Deno.build.os !== "windows") {
    assert(realPath.startsWith("/"));
    assert(realPath.endsWith("/target"));
  } else {
    assertMatch(realPath, /^[A-Z]:\\/);
    assert(realPath.endsWith("\\target"));
  }
});
unitTest({perms: {read: false}}, async function realPathPerm() {
  await assertThrowsAsync(async () => {
    await Deno.realPath("some_file");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, async function realPathNotFound() {
  await assertThrowsAsync(async () => {
    await Deno.realPath("bad_filename");
  }, Deno.errors.NotFound);
});
