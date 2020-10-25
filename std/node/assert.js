import {
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertNotStrictEquals,
  assertStrictEquals,
  assertThrows
} from "../testing/asserts.js";
export {AssertionError} from "./assertion_error.js";
export {
  assert,
  assert as default,
  assert as ok,
  fail
} from "../testing/asserts.js";
export const deepStrictEqual = assertEquals;
export const notDeepStrictEqual = assertNotEquals;
export const strictEqual = assertStrictEquals;
export const notStrictEqual = assertNotStrictEquals;
export const match = assertMatch;
export const throws = assertThrows;
