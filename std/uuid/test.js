import {assert} from "../testing/asserts.js";
import {isNil, NIL_UUID} from "./mod.js";
Deno.test({
  name: "[UUID] isNil",
  fn() {
    const nil = NIL_UUID;
    const u = "582cbcff-dad6-4f28-888a-e062ae36bafc";
    assert(isNil(nil));
    assert(!isNil(u));
  }
});
