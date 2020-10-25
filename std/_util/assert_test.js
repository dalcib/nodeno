import {assert as assert2, DenoStdInternalError} from "./assert.js";
import {assertThrows} from "../testing/asserts.js";
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
