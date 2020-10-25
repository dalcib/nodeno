import {assert, unitTest} from "./test_util.mjs";
unitTest(function internalsExists() {
  const {
    inspectArgs
  } = Deno[Deno.internal];
  assert(!!inspectArgs);
});
