import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  pathToAbsoluteFileUrl,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {read: true}}, function readFileSyncSuccess() {
  const data = Deno.readFileSync("cli/tests/fixture.json");
  assert(data.byteLength > 0);
  const decoder = new TextDecoder("utf-8");
  const json = decoder.decode(data);
  const pkg = JSON.parse(json);
  assertEquals(pkg.name, "deno");
});
unitTest({perms: {read: true}}, function readFileSyncUrl() {
  const data = Deno.readFileSync(pathToAbsoluteFileUrl("cli/tests/fixture.json"));
  assert(data.byteLength > 0);
  const decoder = new TextDecoder("utf-8");
  const json = decoder.decode(data);
  const pkg = JSON.parse(json);
  assertEquals(pkg.name, "deno");
});
unitTest({perms: {read: false}}, function readFileSyncPerm() {
  assertThrows(() => {
    Deno.readFileSync("cli/tests/fixture.json");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, function readFileSyncNotFound() {
  assertThrows(() => {
    Deno.readFileSync("bad_filename");
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: true}}, async function readFileUrl() {
  const data = await Deno.readFile(pathToAbsoluteFileUrl("cli/tests/fixture.json"));
  assert(data.byteLength > 0);
  const decoder = new TextDecoder("utf-8");
  const json = decoder.decode(data);
  const pkg = JSON.parse(json);
  assertEquals(pkg.name, "deno");
});
unitTest({perms: {read: true}}, async function readFileSuccess() {
  const data = await Deno.readFile("cli/tests/fixture.json");
  assert(data.byteLength > 0);
  const decoder = new TextDecoder("utf-8");
  const json = decoder.decode(data);
  const pkg = JSON.parse(json);
  assertEquals(pkg.name, "deno");
});
unitTest({perms: {read: false}}, async function readFilePerm() {
  await assertThrowsAsync(async () => {
    await Deno.readFile("cli/tests/fixture.json");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, function readFileSyncLoop() {
  for (let i = 0; i < 256; i++) {
    Deno.readFileSync("cli/tests/fixture.json");
  }
});
