import { assert, assertEquals } from "../../../std/testing/asserts.mjs";
import * as colors from "../../../std/fmt/colors.mjs";
export { colors };
import { resolve } from "../../../std/path/mod.mjs";
export {
  assert,
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertStrictEquals,
  assertStringContains,
  assertThrows,
  assertThrowsAsync,
  fail,
  unreachable,
} from "../../../std/testing/asserts.mjs";
export { readLines } from "../../../std/io/bufio.mjs";
export { parse as parseArgs } from "../../../std/flags/mod.mjs";
export function fmtPerms(perms) {
  const p = Object.keys(perms)
    .filter((e) => perms[e] === true)
    .map((key) => `--allow-${key}`);
  if (p.length) {
    return p.join(" ");
  }
  return "<no permissions>";
}
const isGranted = async (name) => (await Deno.permissions.query({ name })).state === "granted";
export async function getProcessPermissions() {
  return {
    run: await isGranted("run"),
    read: await isGranted("read"),
    write: await isGranted("write"),
    net: await isGranted("net"),
    env: await isGranted("env"),
    plugin: await isGranted("plugin"),
    hrtime: await isGranted("hrtime"),
  };
}
export function permissionsMatch(processPerms, requiredPerms) {
  for (const permName in processPerms) {
    if (processPerms[permName] !== requiredPerms[permName]) {
      return false;
    }
  }
  return true;
}
export const permissionCombinations = new Map();
function permToString(perms) {
  const r = perms.read ? 1 : 0;
  const w = perms.write ? 1 : 0;
  const n = perms.net ? 1 : 0;
  const e = perms.env ? 1 : 0;
  const u = perms.run ? 1 : 0;
  const p = perms.plugin ? 1 : 0;
  const h = perms.hrtime ? 1 : 0;
  return `permR${r}W${w}N${n}E${e}U${u}P${p}H${h}`;
}
function registerPermCombination(perms) {
  const key = permToString(perms);
  if (!permissionCombinations.has(key)) {
    permissionCombinations.set(key, perms);
  }
}
export async function registerUnitTests() {
  //const processPerms = await getProcessPermissions();
  const onlyTests = REGISTERED_UNIT_TESTS.filter(({ only }) => only);
  const unitTests = onlyTests.length > 0 ? onlyTests : REGISTERED_UNIT_TESTS;
  for (const unitTestDefinition of unitTests) {
    /* if (!permissionsMatch(processPerms, unitTestDefinition.perms)) {
      continue;
    } */
    Deno.test(unitTestDefinition);
  }
}
function normalizeTestPermissions(perms) {
  return {
    read: !!perms.read,
    write: !!perms.write,
    net: !!perms.net,
    run: !!perms.run,
    env: !!perms.env,
    plugin: !!perms.plugin,
    hrtime: !!perms.hrtime,
  };
}
export const REGISTERED_UNIT_TESTS = [];
export function unitTest(optionsOrFn, maybeFn) {
  assert(optionsOrFn, "At least one argument is required");
  let options;
  let name;
  let fn;
  if (typeof optionsOrFn === "function") {
    options = {};
    fn = optionsOrFn;
    name = fn.name;
    assert(name, "Missing test function name");
  } else {
    options = optionsOrFn;
    assert(maybeFn, "Missing test function definition");
    assert(typeof maybeFn === "function", "Second argument should be test function definition");
    fn = maybeFn;
    name = fn.name;
    assert(name, "Missing test function name");
  }
  const normalizedPerms = normalizeTestPermissions(options.perms || {});
  registerPermCombination(normalizedPerms);
  const unitTestDefinition = {
    name,
    fn,
    ignore: !!options.ignore,
    only: !!options.only,
    perms: normalizedPerms,
  };
  REGISTERED_UNIT_TESTS.push(unitTestDefinition);
}
export function createResolvable() {
  let methods;
  const promise = new Promise((resolve2, reject) => {
    methods = { resolve: resolve2, reject };
  });
  return Object.assign(promise, methods);
}
const encoder = new TextEncoder();
function serializeTestMessage(message) {
  return JSON.stringify({
    start: message.start && {
      ...message.start,
      tests: message.start.tests.map((test) => ({
        ...test,
        fn: null,
      })),
    },
    testStart: message.testStart && { ...message.testStart, fn: null },
    testEnd: message.testEnd && {
      ...message.testEnd,
      error: String(message.testEnd.error?.stack),
    },
    end: message.end && {
      ...message.end,
      results: message.end.results.map((result) => ({
        ...result,
        error: result.error?.stack,
      })),
    },
  });
}
export async function reportToConn(conn, message) {
  const line = serializeTestMessage(message);
  const encodedMsg = encoder.encode(line + (message.end == null ? "\n" : ""));
  await Deno.writeAll(conn, encodedMsg);
  if (message.end != null) {
    conn.closeWrite();
  }
}
/* unitTest(function permissionsMatches() {
  assert(permissionsMatch({
    read: true,
    write: false,
    net: false,
    env: false,
    run: false,
    plugin: false,
    hrtime: false
  }, normalizeTestPermissions({read: true})));
  assert(permissionsMatch({
    read: false,
    write: false,
    net: false,
    env: false,
    run: false,
    plugin: false,
    hrtime: false
  }, normalizeTestPermissions({})));
  assertEquals(permissionsMatch({
    read: false,
    write: true,
    net: true,
    env: true,
    run: true,
    plugin: true,
    hrtime: true
  }, normalizeTestPermissions({read: true})), false);
  assertEquals(permissionsMatch({
    read: true,
    write: false,
    net: true,
    env: false,
    run: false,
    plugin: false,
    hrtime: false
  }, normalizeTestPermissions({read: true})), false);
  assert(permissionsMatch({
    read: true,
    write: true,
    net: true,
    env: true,
    run: true,
    plugin: true,
    hrtime: true
  }, {
    read: true,
    write: true,
    net: true,
    env: true,
    run: true,
    plugin: true,
    hrtime: true
  }));
}); */
unitTest({ perms: { read: true } }, function assertAllUnitTestFilesImported() {
  const directoryTestFiles = [...Deno.readDirSync("./cli/tests/unit/")]
    .map((k) => k.name)
    .filter(
      (file) =>
        file.endsWith(".ts") &&
        !file.endsWith("unit_tests.ts") &&
        !file.endsWith("test_util.ts") &&
        !file.endsWith("unit_test_runner.ts")
    );
  const unitTestsFile = Deno.readFileSync("./cli/tests/unit/unit_tests.ts");
  const importLines = new TextDecoder("utf-8")
    .decode(unitTestsFile)
    .split("\n")
    .filter((line) => line.startsWith("import"));
  const importedTestFiles = importLines.map((relativeFilePath) => relativeFilePath.match(/\/([^\/]+)";/)[1]);
  directoryTestFiles.forEach((dirFile) => {
    if (!importedTestFiles.includes(dirFile)) {
      throw new Error("cil/tests/unit/unit_tests.ts is missing import of test file: cli/js/" + dirFile);
    }
  });
});
export function pathToAbsoluteFileUrl(path) {
  path = resolve(path);
  return new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${path}`);
}
