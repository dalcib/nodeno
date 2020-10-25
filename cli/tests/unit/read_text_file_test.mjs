import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  pathToAbsoluteFileUrl,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {read: true}}, function readTextFileSyncSuccess() {
  const data = Deno.readTextFileSync("cli/tests/fixture.json");
  assert(data.length > 0);
  const pkg = JSON.parse(data);
  assertEquals(pkg.name, "deno");
});
unitTest({perms: {read: true}}, function readTextFileSyncByUrl() {
  const data = Deno.readTextFileSync(pathToAbsoluteFileUrl("cli/tests/fixture.json"));
  assert(data.length > 0);
  const pkg = JSON.parse(data);
  assertEquals(pkg.name, "deno");
});
unitTest({perms: {read: false}}, function readTextFileSyncPerm() {
  assertThrows(() => {
    Deno.readTextFileSync("cli/tests/fixture.json");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, function readTextFileSyncNotFound() {
  assertThrows(() => {
    Deno.readTextFileSync("bad_filename");
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true}}, async function readTextFileSuccess() {
  const data = await Deno.readTextFile("cli/tests/fixture.json");
  assert(data.length > 0);
  const pkg = JSON.parse(data);
  assertEquals(pkg.name, "deno");
});
unitTest({perms: {read: true}}, async function readTextFileByUrl() {
  const data = await Deno.readTextFile(pathToAbsoluteFileUrl("cli/tests/fixture.json"));
  assert(data.length > 0);
  const pkg = JSON.parse(data);
  assertEquals(pkg.name, "deno");
});
unitTest({perms: {read: false}}, async function readTextFilePerm() {
  await assertThrowsAsync(async () => {
    await Deno.readTextFile("cli/tests/fixture.json");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, function readTextFileSyncLoop() {
  for (let i = 0; i < 256; i++) {
    Deno.readTextFileSync("cli/tests/fixture.json");
  }
});
