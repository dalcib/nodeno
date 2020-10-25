import {
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertNotStrictEquals,
  assertStrictEquals,
  assertThrows
} from "../testing/asserts.mjs";
export {AssertionError} from "./assertion_error.mjs";
export {
  assert,
  assert as default,
  assert as ok,
  fail
} from "../testing/asserts.mjs";
export const deepStrictEqual = assertEquals;
export const notDeepStrictEqual = assertNotEquals;
export const strictEqual = assertStrictEquals;
export const notStrictEqual = assertNotStrictEquals;
export const match = assertMatch;
export const throws = assertThrows;
