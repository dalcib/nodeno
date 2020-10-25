import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {env: true}}, function envSuccess() {
  Deno.env.set("TEST_VAR", "A");
  const env = Deno.env.toObject();
  Deno.env.set("TEST_VAR", "B");
  assertEquals(env["TEST_VAR"], "A");
  assertNotEquals(Deno.env.get("TEST_VAR"), env["TEST_VAR"]);
});
unitTest({perms: {env: true}}, function envNotFound() {
  const r = Deno.env.get("env_var_does_not_exist!");
  assertEquals(r, void 0);
});
unitTest({perms: {env: true}}, function deleteEnv() {
  Deno.env.set("TEST_VAR", "A");
  assertEquals(Deno.env.get("TEST_VAR"), "A");
  assertEquals(Deno.env.delete("TEST_VAR"), void 0);
  assertEquals(Deno.env.get("TEST_VAR"), void 0);
});
unitTest(function envPermissionDenied1() {
  assertThrows(() => {
    Deno.env.toObject();
  }, Deno.errors.PermissionDenied);
});
unitTest(function envPermissionDenied2() {
  assertThrows(() => {
    Deno.env.get("PATH");
  }, Deno.errors.PermissionDenied);
});
unitTest({
  ignore: Deno.build.os !== "windows",
  perms: {read: true, env: true, run: true}
}, async function envCaseInsensitive() {
  const checkChildEnv = async (inputEnv, expectedEnv) => {
    const src = `
      console.log(
        ${JSON.stringify(Object.keys(expectedEnv))}.map(k => Deno.env.get(k))
      )`;
    const proc = Deno.run({
      cmd: [Deno.execPath(), "eval", src],
      env: {...inputEnv, NO_COLOR: "1"},
      stdout: "piped"
    });
    const status = await proc.status();
    assertEquals(status.success, true);
    const expectedValues = Object.values(expectedEnv);
    const actualValues = JSON.parse(new TextDecoder().decode(await proc.output()));
    assertEquals(actualValues, expectedValues);
    proc.close();
  };
  assertEquals(Deno.env.get("path"), Deno.env.get("PATH"));
  assertEquals(Deno.env.get("Path"), Deno.env.get("PATH"));
  await checkChildEnv({foo: "X"}, {foo: "X", Foo: "X", FOO: "X"});
  const lc1 = "µ";
  const uc1 = lc1.toUpperCase();
  assertNotEquals(lc1, uc1);
  await checkChildEnv({[lc1]: "mu", [uc1]: "MU"}, {[lc1]: "mu", [uc1]: "MU"});
  const c2 = "ǅ";
  const lc2 = c2.toLowerCase();
  const uc2 = c2.toUpperCase();
  assertNotEquals(c2, lc2);
  assertNotEquals(c2, uc2);
  await checkChildEnv({[c2]: "Dz", [lc2]: "dz"}, {[c2]: "Dz", [lc2]: "dz", [uc2]: "dz"});
  await checkChildEnv({[c2]: "Dz", [uc2]: "DZ"}, {[c2]: "Dz", [uc2]: "DZ", [lc2]: "DZ"});
});
unitTest(function osPid() {
  assert(Deno.pid > 0);
});
unitTest(function osPpid() {
  assert(Deno.ppid > 0);
});
unitTest({perms: {run: true, read: true}}, async function osPpidIsEqualToPidOfParentProcess() {
  const decoder = new TextDecoder();
  const process = Deno.run({
    cmd: [Deno.execPath(), "eval", "-p", "--unstable", "Deno.ppid"],
    stdout: "piped",
    env: {NO_COLOR: "true"}
  });
  const output = await process.output();
  process.close();
  const expected = Deno.pid;
  const actual = parseInt(decoder.decode(output));
  assertEquals(actual, expected);
});
unitTest({perms: {read: true}}, function execPath() {
  assertNotEquals(Deno.execPath(), "");
});
unitTest({perms: {read: false}}, function execPathPerm() {
  assertThrows(() => {
    Deno.execPath();
  }, Deno.errors.PermissionDenied, "read access to <exec_path>, run again with the --allow-read flag");
});
unitTest({perms: {env: true}}, function loadavgSuccess() {
  const load = Deno.loadavg();
  assertEquals(load.length, 3);
});
unitTest({perms: {env: false}}, function loadavgPerm() {
  assertThrows(() => {
    Deno.loadavg();
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {env: true}}, function hostnameDir() {
  assertNotEquals(Deno.hostname(), "");
});
unitTest({perms: {env: false}}, function hostnamePerm() {
  assertThrows(() => {
    Deno.hostname();
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {env: true}}, function releaseDir() {
  assertNotEquals(Deno.osRelease(), "");
});
unitTest({perms: {env: false}}, function releasePerm() {
  assertThrows(() => {
    Deno.osRelease();
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {env: true}}, function systemMemoryInfo() {
  const info = Deno.systemMemoryInfo();
  assert(info.total >= 0);
  assert(info.free >= 0);
  assert(info.available >= 0);
  assert(info.buffers >= 0);
  assert(info.cached >= 0);
  assert(info.swapTotal >= 0);
  assert(info.swapFree >= 0);
});
