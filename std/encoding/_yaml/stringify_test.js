import {assertEquals} from "../../testing/asserts.js";
import {stringify as stringify2} from "./stringify.js";
Deno.test({
  name: "stringified correctly",
  fn() {
    const FIXTURE = {
      foo: {
        bar: true,
        test: [
          "a",
          "b",
          {
            a: false
          },
          {
            a: false
          }
        ]
      },
      test: "foobar"
    };
    const ASSERTS = `foo:
  bar: true
  test:
    - a
    - b
    - a: false
    - a: false
test: foobar
`;
    assertEquals(stringify2(FIXTURE), ASSERTS);
  }
});
