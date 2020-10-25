import {assert, unitTest} from "./test_util.mjs";
unitTest(function buildInfo() {
  const {arch, os} = Deno.build;
  assert(arch.length > 0);
  assert(os === "darwin" || os === "windows" || os === "linux");
});
