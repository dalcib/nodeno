import {
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrowsAsync
} from "../../testing/asserts.js";
import {promisify} from "./_util_promisify.js";
import * as fs from "../fs.js";
const readFile = promisify(fs.readFile);
const customPromisifyArgs = Symbol.for("nodejs.util.promisify.customArgs");
Deno.test("Errors should reject the promise", async function testPromiseRejection() {
  await assertThrowsAsync(() => readFile("/dontexist"), Deno.errors.NotFound);
});
Deno.test("Promisify.custom", async function testPromisifyCustom() {
  function fn() {
  }
  function promisifedFn() {
  }
  fn[promisify.custom] = promisifedFn;
  const promisifiedFnA = promisify(fn);
  const promisifiedFnB = promisify(promisifiedFnA);
  assertStrictEquals(promisifiedFnA, promisifedFn);
  assertStrictEquals(promisifiedFnB, promisifedFn);
  await promisifiedFnA;
  await promisifiedFnB;
});
Deno.test("promiisfy.custom symbol", function testPromisifyCustomSymbol() {
  function fn() {
  }
  function promisifiedFn() {
  }
  const kCustomPromisifiedSymbol = Symbol.for("nodejs.util.promisify.custom");
  fn[kCustomPromisifiedSymbol] = promisifiedFn;
  assertStrictEquals(kCustomPromisifiedSymbol, promisify.custom);
  assertStrictEquals(promisify(fn), promisifiedFn);
  assertStrictEquals(promisify(promisify(fn)), promisifiedFn);
});
Deno.test("Invalid argument should throw", function testThrowInvalidArgument() {
  function fn() {
  }
  fn[promisify.custom] = 42;
  try {
    promisify(fn);
  } catch (e) {
    assertStrictEquals(e.code, "ERR_INVALID_ARG_TYPE");
    assert(e instanceof TypeError);
  }
});
Deno.test("Custom promisify args", async function testPromisifyCustomArgs() {
  const firstValue = 5;
  const secondValue = 17;
  function fn(callback) {
    callback(null, firstValue, secondValue);
  }
  fn[customPromisifyArgs] = ["first", "second"];
  const obj = await promisify(fn)();
  assertEquals(obj, {first: firstValue, second: secondValue});
});
Deno.test("Multiple callback args without custom promisify args", async function testPromisifyWithoutCustomArgs() {
  function fn(callback) {
    callback(null, "foo", "bar");
  }
  const value = await promisify(fn)();
  assertStrictEquals(value, "foo");
});
Deno.test("Undefined resolved value", async function testPromisifyWithUndefinedResolvedValue() {
  function fn(callback) {
    callback(null);
  }
  const value = await promisify(fn)();
  assertStrictEquals(value, void 0);
});
Deno.test("Undefined resolved value II", async function testPromisifyWithUndefinedResolvedValueII() {
  function fn(callback) {
    callback();
  }
  const value = await promisify(fn)();
  assertStrictEquals(value, void 0);
});
Deno.test("Resolved value: number", async function testPromisifyWithNumberResolvedValue() {
  function fn(err, val, callback) {
    callback(err, val);
  }
  const value = await promisify(fn)(null, 42);
  assertStrictEquals(value, 42);
});
Deno.test("Rejected value", async function testPromisifyWithNumberRejectedValue() {
  function fn(err, val, callback) {
    callback(err, val);
  }
  await assertThrowsAsync(() => promisify(fn)(new Error("oops"), null), Error, "oops");
});
Deno.test("Rejected value", async function testPromisifyWithAsObjectMethod() {
  const o = {};
  const fn = promisify(function(cb) {
    cb(null, this === o);
  });
  o.fn = fn;
  const val = await o.fn();
  assert(val);
});
Deno.test("Multiple callback", async function testPromisifyWithMultipleCallback() {
  const err = new Error("Should not have called the callback with the error.");
  const stack = err.stack;
  const fn = promisify(function(cb) {
    cb(null);
    cb(err);
  });
  await fn();
  await Promise.resolve();
  return assertStrictEquals(stack, err.stack);
});
Deno.test("Promisify a promise", function testPromisifyPromise() {
  function c() {
  }
  const a = promisify(function() {
  });
  const b = promisify(a);
  assert(c !== a);
  assertStrictEquals(a, b);
});
Deno.test("Test error", async function testInvalidArguments() {
  let errToThrow;
  const thrower = promisify(function(a, b, c, cb) {
    errToThrow = new Error(`${a}-${b}-${c}-${cb}`);
    throw errToThrow;
  });
  try {
    await thrower(1, 2, 3);
    throw new Error(`should've failed`);
  } catch (e) {
    assertStrictEquals(e, errToThrow);
  }
});
Deno.test("Test invalid arguments", function testInvalidArguments2() {
  [void 0, null, true, 0, "str", {}, [], Symbol()].forEach((input) => {
    try {
      promisify(input);
    } catch (e) {
      assertStrictEquals(e.code, "ERR_INVALID_ARG_TYPE");
      assert(e instanceof TypeError);
      assertEquals(e.message, `The "original" argument must be of type Function. Received ${typeof input}`);
    }
  });
});
