import {assertEquals} from "../testing/asserts.js";
import {parse, stringify} from "./querystring.js";
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
