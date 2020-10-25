import {diff as diff2} from "./_diff.mjs";
import {assertEquals} from "../testing/asserts.mjs";
Deno.test({
  name: "empty",
  fn() {
    assertEquals(diff2([], []), []);
  }
});
Deno.test({
  name: '"a" vs "b"',
  fn() {
    assertEquals(diff2(["a"], ["b"]), [
      {type: "removed", value: "a"},
      {type: "added", value: "b"}
    ]);
  }
});
Deno.test({
  name: '"a" vs "a"',
  fn() {
    assertEquals(diff2(["a"], ["a"]), [{type: "common", value: "a"}]);
  }
});
Deno.test({
  name: '"a" vs ""',
  fn() {
    assertEquals(diff2(["a"], []), [{type: "removed", value: "a"}]);
  }
});
Deno.test({
  name: '"" vs "a"',
  fn() {
    assertEquals(diff2([], ["a"]), [{type: "added", value: "a"}]);
  }
});
Deno.test({
  name: '"a" vs "a, b"',
  fn() {
    assertEquals(diff2(["a"], ["a", "b"]), [
      {type: "common", value: "a"},
      {type: "added", value: "b"}
    ]);
  }
});
Deno.test({
  name: '"strength" vs "string"',
  fn() {
    assertEquals(diff2(Array.from("strength"), Array.from("string")), [
      {type: "common", value: "s"},
      {type: "common", value: "t"},
      {type: "common", value: "r"},
      {type: "removed", value: "e"},
      {type: "added", value: "i"},
      {type: "common", value: "n"},
      {type: "common", value: "g"},
      {type: "removed", value: "t"},
      {type: "removed", value: "h"}
    ]);
  }
});
Deno.test({
  name: '"strength" vs ""',
  fn() {
    assertEquals(diff2(Array.from("strength"), Array.from("")), [
      {type: "removed", value: "s"},
      {type: "removed", value: "t"},
      {type: "removed", value: "r"},
      {type: "removed", value: "e"},
      {type: "removed", value: "n"},
      {type: "removed", value: "g"},
      {type: "removed", value: "t"},
      {type: "removed", value: "h"}
    ]);
  }
});
Deno.test({
  name: '"" vs "strength"',
  fn() {
    assertEquals(diff2(Array.from(""), Array.from("strength")), [
      {type: "added", value: "s"},
      {type: "added", value: "t"},
      {type: "added", value: "r"},
      {type: "added", value: "e"},
      {type: "added", value: "n"},
      {type: "added", value: "g"},
      {type: "added", value: "t"},
      {type: "added", value: "h"}
    ]);
  }
});
Deno.test({
  name: '"abc", "c" vs "abc", "bcd", "c"',
  fn() {
    assertEquals(diff2(["abc", "c"], ["abc", "bcd", "c"]), [
      {type: "common", value: "abc"},
      {type: "added", value: "bcd"},
      {type: "common", value: "c"}
    ]);
  }
});
