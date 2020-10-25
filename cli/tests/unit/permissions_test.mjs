import {assertThrows, assertThrowsAsync, unitTest} from "./test_util.mjs";
unitTest(async function permissionInvalidName() {
  await assertThrowsAsync(async () => {
    await Deno.permissions.query({name: "foo"});
  }, Error);
});
unitTest(async function permissionNetInvalidUrl() {
  await assertThrowsAsync(async () => {
    await Deno.permissions.query({name: "net", url: ":"});
  }, URIError);
});
unitTest(function permissionsIllegalConstructor() {
  assertThrows(() => new Deno.Permissions(), TypeError, "Illegal constructor.");
});
unitTest(function permissionStatusIllegalConstructor() {
  assertThrows(() => new Deno.PermissionStatus(), TypeError, "Illegal constructor.");
});
