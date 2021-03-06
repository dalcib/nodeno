import {assert, assertEquals} from "../testing/asserts.js";
import {generate, validate} from "./v5.js";
const NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";
Deno.test({
  name: "[UUID] test_uuid_v5",
  fn() {
    const u = generate({value: "", namespace: NAMESPACE});
    assertEquals(typeof u, "string", "returns a string");
    assert(u !== "", "return string is not empty");
  }
});
Deno.test({
  name: "[UUID] test_uuid_v5_format",
  fn() {
    for (let i = 0; i < 1e4; i++) {
      const u = generate({value: String(i), namespace: NAMESPACE});
      assert(validate(u), `${u} is not a valid uuid v5`);
    }
  }
});
Deno.test({
  name: "[UUID] test_uuid_v5_option",
  fn() {
    const v5Options = {
      value: "Hello, World",
      namespace: NAMESPACE
    };
    const u = generate(v5Options);
    assertEquals(u, "4b4f2adc-5b27-57b5-8e3a-c4c4bcf94f05");
  }
});
Deno.test({
  name: "[UUID] test_uuid_v5_buf_offset",
  fn() {
    const buf = [
      75,
      79,
      42,
      220,
      91,
      39,
      87,
      181,
      142,
      58,
      196,
      196,
      188,
      249,
      79,
      5
    ];
    const origin = JSON.parse(JSON.stringify(buf));
    generate({value: "Hello, World", namespace: NAMESPACE}, buf);
    assertEquals(origin, buf);
    generate({value: "Hello, World", namespace: NAMESPACE}, buf, 3);
    assertEquals(origin.slice(0, 3), buf.slice(0, 3));
    assertEquals(origin, buf.slice(3));
  }
});
Deno.test({
  name: "[UUID] is_valid_uuid_v5",
  fn() {
    const u = generate({
      value: "Hello, World",
      namespace: "1b671a64-40d5-491e-99b0-da01ff1f3341"
    });
    const t = "4b4f2adc-5b27-57b5-8e3a-c4c4bcf94f05";
    const n = "4b4f2adc-5b27-17b5-8e3a-c4c4bcf94f05";
    assert(validate(u), `generated ${u} should be valid`);
    assert(validate(t), `${t} should be valid`);
    assert(!validate(n), `${n} should not be valid`);
  }
});
