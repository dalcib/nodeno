import {assert, assertEquals} from "../testing/asserts.js";
import {generate, validate} from "./v4.js";
Deno.test({
  name: "[UUID] test_uuid_v4",
  fn() {
    const u = generate();
    assertEquals(typeof u, "string", "returns a string");
    assert(u !== "", "return string is not empty");
  }
});
Deno.test({
  name: "[UUID] test_uuid_v4_format",
  fn() {
    for (let i = 0; i < 1e4; i++) {
      const u = generate();
      assert(validate(u), `${u} is not a valid uuid v4`);
    }
  }
});
Deno.test({
  name: "[UUID] is_valid_uuid_v4",
  fn() {
    const u = generate();
    const t = "84fb7824-b951-490e-8afd-0c13228a8282";
    const n = "84fb7824-b951-490g-8afd-0c13228a8282";
    assert(validate(u), `generated ${u} should be valid`);
    assert(validate(t), `${t} should be valid`);
    assert(!validate(n), `${n} should not be valid`);
  }
});
