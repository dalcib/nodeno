import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  pathToAbsoluteFileUrl,
  unitTest
} from "./test_util.mjs";
function assertSameContent(files) {
  let counter = 0;
  for (const entry of files) {
    if (entry.name === "subdir") {
      assert(entry.isDirectory);
      counter++;
    }
  }
  assertEquals(counter, 1);
}
unitTest({perms: {read: true}}, function readDirSyncSuccess() {
  const files = [...Deno.readDirSync("cli/tests/")];
  assertSameContent(files);
});
unitTest({perms: {read: true}}, function readDirSyncWithUrl() {
  const files = [...Deno.readDirSync(pathToAbsoluteFileUrl("cli/tests"))];
  assertSameContent(files);
});
unitTest({perms: {read: false}}, function readDirSyncPerm() {
  assertThrows(() => {
    Deno.readDirSync("tests/");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, function readDirSyncNotDir() {
  assertThrows(() => {
    Deno.readDirSync("cli/tests/fixture.json");
  }, Error);
});
unitTest({perms: {read: true}}, function readDirSyncNotFound() {
  assertThrows(() => {
    Deno.readDirSync("bad_dir_name");
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true}}, async function readDirSuccess() {
  const files = [];
  for await (const dirEntry of Deno.readDir("cli/tests/")) {
    files.push(dirEntry);
  }
  assertSameContent(files);
});
unitTest({perms: {read: true}}, async function readDirWithUrl() {
  const files = [];
  for await (const dirEntry of Deno.readDir(pathToAbsoluteFileUrl("cli/tests"))) {
    files.push(dirEntry);
  }
  assertSameContent(files);
});
unitTest({perms: {read: false}}, async function readDirPerm() {
  await assertThrowsAsync(async () => {
    await Deno.readDir("tests/")[Symbol.asyncIterator]().next();
  }, Deno.errors.PermissionDenied);
});
