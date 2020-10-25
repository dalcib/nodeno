import {assertThrows, unitTest} from "./test_util.mjs";
unitTest(function testFnOverloading() {
  Deno.test("test fn overloading", () => {
  });
});
unitTest(function nameOfTestCaseCantBeEmpty() {
  assertThrows(() => {
    Deno.test("", () => {
    });
  }, TypeError, "The test name can't be empty");
  assertThrows(() => {
    Deno.test({
      name: "",
      fn: () => {
      }
    });
  }, TypeError, "The test name can't be empty");
});
