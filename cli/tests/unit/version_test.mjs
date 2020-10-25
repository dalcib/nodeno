import { assert, unitTest } from "./test_util.mjs";
unitTest(function version() {
  const pattern = /^\d+\.\d+\.\d+/;
  assert(pattern.test(Deno.version.deno));
  assert(pattern.test(Deno.version.v8));
  assert(pattern.test(Deno.version.typescript));
});
