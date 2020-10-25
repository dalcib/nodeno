import {assert, assertEquals} from "../testing/asserts.js";
import {generate, validate} from "./v1.js";
Deno.test({
  name: "[UUID] is_valid_uuid_v1",
  fn() {
    const u = generate();
    const t = "63655efa-7ee6-11ea-bc55-0242ac130003";
    const n = "63655efa-7ee6-11eg-bc55-0242ac130003";
    assert(validate(u), `generated ${u} should be valid`);
    assert(validate(t), `${t} should be valid`);
    assert(!validate(n), `${n} should not be valid`);
  }
});
Deno.test({
  name: "[UUID] test_uuid_v1",
  fn() {
    const u = generate();
    assertEquals(typeof u, "string", "returns a string");
    assert(u !== "", "return string is not empty");
  }
});
Deno.test({
  name: "[UUID] test_uuid_v1_format",
  fn() {
    for (let i = 0; i < 1e4; i++) {
      const u = generate();
      assert(validate(u), `${u} is not a valid uuid v1`);
    }
  }
});
Deno.test({
  name: "[UUID] test_uuid_v1_static",
  fn() {
    const v1options = {
      node: [1, 35, 69, 103, 137, 171],
      clockseq: 4660,
      msecs: new Date("2011-11-01").getTime(),
      nsecs: 5678
    };
    const u = generate(v1options);
    assertEquals(u, "710b962e-041c-11e1-9234-0123456789ab");
  }
});
