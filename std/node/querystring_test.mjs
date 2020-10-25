import {assertEquals} from "../testing/asserts.mjs";
import {parse, stringify} from "./querystring.mjs";
Deno.test({
  name: "stringify",
  fn() {
    assertEquals(stringify({
      a: "hello",
      b: 5,
      c: true,
      d: ["foo", "bar"]
    }), "a=hello&b=5&c=true&d=foo&d=bar");
  }
});
Deno.test({
  name: "parse",
  fn() {
    assertEquals(parse("a=hello&b=5&c=true&d=foo&d=bar"), {
      a: "hello",
      b: "5",
      c: "true",
      d: ["foo", "bar"]
    });
  }
});
