import {assert as assert2, DenoStdInternalError} from "./assert.mjs";
import {assertThrows} from "../testing/asserts.mjs";
Deno.test({
  name: "assert valid scenario",
  fn() {
    assert2(true);
  }
});
Deno.test({
  name: "assert invalid scenario, no message",
  fn() {
    assertThrows(() => {
      assert2(false);
    }, DenoStdInternalError);
  }
});
Deno.test({
  name: "assert invalid scenario, with message",
  fn() {
    assertThrows(() => {
      assert2(false, "Oops! Should be true");
    }, DenoStdInternalError, "Oops! Should be true");
  }
});
