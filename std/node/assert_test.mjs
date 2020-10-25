import {
  assert as denoAssert,
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertNotStrictEquals,
  assertStrictEquals,
  assertThrows,
  fail as denoFail
} from "../testing/asserts.mjs";
import AssertionError from "./assertion_error.mjs";
import assert2, {
  assert as assert_,
  AssertionError as AssertionError_,
  deepStrictEqual,
  fail,
  match,
  notDeepStrictEqual,
  notStrictEqual,
  ok,
  strictEqual,
  throws
} from "./assert.mjs";
Deno.test("API should be exposed", () => {
  assertStrictEquals(assert_, assert2, "`assert()` should be the default export");
  assertStrictEquals(assert_, denoAssert, "`assert()` should be exposed");
  assertStrictEquals(assert_, ok, "`assert()` should be an alias of `ok()`");
  assertStrictEquals(assertEquals, deepStrictEqual, "`assertEquals()` should be exposed as `deepStrictEqual()`");
  assertStrictEquals(assertNotEquals, notDeepStrictEqual, "`assertNotEquals()` should be exposed as `notDeepStrictEqual()`");
  assertStrictEquals(assertStrictEquals, strictEqual, "`assertStrictEquals()` should be exposed as `strictEqual()`");
  assertStrictEquals(assertNotStrictEquals, notStrictEqual, "`assertNotStrictEquals()` should be exposed as `notStrictEqual()`");
  assertStrictEquals(assertMatch, match, "`assertMatch()` should be exposed as `match()`");
  assertStrictEquals(assertThrows, throws, "`assertThrows()` should be exposed as `throws()`");
  assertStrictEquals(fail, denoFail, "`fail()` should be exposed");
  assertStrictEquals(AssertionError, AssertionError_, "`AssertionError()` constructor should be exposed");
});
