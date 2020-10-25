import {assert, assertEquals} from "../testing/asserts.js";
import {deepAssign} from "./deep_assign.js";
Deno.test("deepAssignTest", function() {
  const date = new Date("1979-05-27T07:32:00Z");
  const reg = RegExp(/DENOWOWO/);
  const obj1 = {deno: {bar: {deno: ["is", "not", "node"]}}};
  const obj2 = {foo: {deno: date}};
  const obj3 = {foo: {bar: "deno"}, reg};
  const actual = deepAssign(obj1, obj2, obj3);
  const expected = {
    foo: {
      deno: new Date("1979-05-27T07:32:00Z"),
      bar: "deno"
    },
    deno: {bar: {deno: ["is", "not", "node"]}},
    reg: RegExp(/DENOWOWO/)
  };
  assert(date !== expected.foo.deno);
  assert(reg !== expected.reg);
  assertEquals(actual, expected);
});
