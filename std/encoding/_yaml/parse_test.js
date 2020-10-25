import {parse as parse2, parseAll} from "./parse.js";
import {assertEquals} from "../../testing/asserts.js";
Deno.test({
  name: "`parse` parses single document yaml string",
  fn() {
    const yaml = `
      test: toto
      foo:
        bar: True
        baz: 1
        qux: ~
    `;
    const expected = {test: "toto", foo: {bar: true, baz: 1, qux: null}};
    assertEquals(parse2(yaml), expected);
  }
});
Deno.test({
  name: "`parseAll` parses the yaml string with multiple documents",
  fn() {
    const yaml = `
---
id: 1
name: Alice
---
id: 2
name: Bob
---
id: 3
name: Eve
    `;
    const expected = [
      {
        id: 1,
        name: "Alice"
      },
      {
        id: 2,
        name: "Bob"
      },
      {
        id: 3,
        name: "Eve"
      }
    ];
    assertEquals(parseAll(yaml), expected);
  }
});
