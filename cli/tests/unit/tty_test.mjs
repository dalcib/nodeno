import {assert, assertThrows, unitTest} from "./test_util.mjs";
unitTest({perms: {read: true}}, function consoleSizeFile() {
  const file = Deno.openSync("cli/tests/hello.txt");
  assertThrows(() => {
    Deno.consoleSize(file.rid);
  }, Error);
  file.close();
});
unitTest(function consoleSizeError() {
  assertThrows(() => {
    Deno.consoleSize(2147483647);
  }, Deno.errors.BadResource);
});
unitTest({perms: {read: true}}, function isatty() {
  const f = Deno.openSync("cli/tests/hello.txt");
  assert(!Deno.isatty(f.rid));
  f.close();
});
unitTest(function isattyError() {
  let caught = false;
  try {
    Deno.isatty(2147483647);
  } catch (e) {
    caught = true;
    assert(e instanceof Deno.errors.BadResource);
  }
  assert(caught);
});
