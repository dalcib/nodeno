import {assert, assertStrictEquals} from "../../testing/asserts.mjs";
import {callbackify} from "./_util_callbackify.mjs";
const values = [
  "hello world",
  null,
  void 0,
  false,
  0,
  {},
  {key: "value"},
  Symbol("I am a symbol"),
  function ok() {
  },
  ["array", "with", 4, "values"],
  new Error("boo")
];
class TestQueue {
  constructor() {
    this.#queueSize = 0;
    this.#waitingPromise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }
  #waitingPromise;
  #resolve;
  #reject;
  #queueSize;
  enqueue(fn) {
    this.#queueSize++;
    try {
      fn(() => {
        this.#queueSize--;
        if (this.#queueSize === 0) {
          assert(this.#resolve, "Test setup error; async queue is missing #resolve");
          this.#resolve();
        }
      });
    } catch (err) {
      assert(this.#reject, "Test setup error; async queue is missing #reject");
      this.#reject(err);
    }
  }
  waitForCompletion() {
    return this.#waitingPromise;
  }
}
Deno.test("callbackify passes the resolution value as the second argument to the callback", async () => {
  const testQueue = new TestQueue();
  for (const value of values) {
    const asyncFn = async () => {
      return value;
    };
    const cbAsyncFn = callbackify(asyncFn);
    testQueue.enqueue((done) => {
      cbAsyncFn((err, ret) => {
        assertStrictEquals(err, null);
        assertStrictEquals(ret, value);
        done();
      });
    });
    const promiseFn = () => {
      return Promise.resolve(value);
    };
    const cbPromiseFn = callbackify(promiseFn);
    testQueue.enqueue((done) => {
      cbPromiseFn((err, ret) => {
        assertStrictEquals(err, null);
        assertStrictEquals(ret, value);
        done();
      });
    });
    const thenableFn = () => {
      return {
        then(onfulfilled) {
          assert(onfulfilled);
          onfulfilled(value);
          return this;
        }
      };
    };
    const cbThenableFn = callbackify(thenableFn);
    testQueue.enqueue((done) => {
      cbThenableFn((err, ret) => {
        assertStrictEquals(err, null);
        assertStrictEquals(ret, value);
        done();
      });
    });
  }
  await testQueue.waitForCompletion();
});
Deno.test("callbackify passes the rejection value as the first argument to the callback", async () => {
  const testQueue = new TestQueue();
  for (const value of values) {
    const asyncFn = async () => {
      return Promise.reject(value);
    };
    const cbAsyncFn = callbackify(asyncFn);
    assertStrictEquals(cbAsyncFn.length, 1);
    assertStrictEquals(cbAsyncFn.name, "asyncFnCallbackified");
    testQueue.enqueue((done) => {
      cbAsyncFn((err, ret) => {
        assertStrictEquals(ret, void 0);
        if (err instanceof Error) {
          if ("reason" in err) {
            assert(!value);
            assertStrictEquals(err.code, "ERR_FALSY_VALUE_REJECTION");
            assertStrictEquals(err.reason, value);
          } else {
            assertStrictEquals(String(value).endsWith(err.message), true);
          }
        } else {
          assertStrictEquals(err, value);
        }
        done();
      });
    });
    const promiseFn = () => {
      return Promise.reject(value);
    };
    const obj = {};
    Object.defineProperty(promiseFn, "name", {
      value: obj,
      writable: false,
      enumerable: false,
      configurable: true
    });
    const cbPromiseFn = callbackify(promiseFn);
    assertStrictEquals(promiseFn.name, obj);
    testQueue.enqueue((done) => {
      cbPromiseFn((err, ret) => {
        assertStrictEquals(ret, void 0);
        if (err instanceof Error) {
          if ("reason" in err) {
            assert(!value);
            assertStrictEquals(err.code, "ERR_FALSY_VALUE_REJECTION");
            assertStrictEquals(err.reason, value);
          } else {
            assertStrictEquals(String(value).endsWith(err.message), true);
          }
        } else {
          assertStrictEquals(err, value);
        }
        done();
      });
    });
    const thenableFn = () => {
      return {
        then(onfulfilled, onrejected) {
          assert(onrejected);
          onrejected(value);
          return this;
        }
      };
    };
    const cbThenableFn = callbackify(thenableFn);
    testQueue.enqueue((done) => {
      cbThenableFn((err, ret) => {
        assertStrictEquals(ret, void 0);
        if (err instanceof Error) {
          if ("reason" in err) {
            assert(!value);
            assertStrictEquals(err.code, "ERR_FALSY_VALUE_REJECTION");
            assertStrictEquals(err.reason, value);
          } else {
            assertStrictEquals(String(value).endsWith(err.message), true);
          }
        } else {
          assertStrictEquals(err, value);
        }
        done();
      });
    });
  }
  await testQueue.waitForCompletion();
});
Deno.test("callbackify passes arguments to the original", async () => {
  const testQueue = new TestQueue();
  for (const value of values) {
    const asyncFn = async (arg) => {
      assertStrictEquals(arg, value);
      return arg;
    };
    const cbAsyncFn = callbackify(asyncFn);
    assertStrictEquals(cbAsyncFn.length, 2);
    assert(Object.getPrototypeOf(cbAsyncFn) !== Object.getPrototypeOf(asyncFn));
    assertStrictEquals(Object.getPrototypeOf(cbAsyncFn), Function.prototype);
    testQueue.enqueue((done) => {
      cbAsyncFn(value, (err, ret) => {
        assertStrictEquals(err, null);
        assertStrictEquals(ret, value);
        done();
      });
    });
    const promiseFn = (arg) => {
      assertStrictEquals(arg, value);
      return Promise.resolve(arg);
    };
    const obj = {};
    Object.defineProperty(promiseFn, "length", {
      value: obj,
      writable: false,
      enumerable: false,
      configurable: true
    });
    const cbPromiseFn = callbackify(promiseFn);
    assertStrictEquals(promiseFn.length, obj);
    testQueue.enqueue((done) => {
      cbPromiseFn(value, (err, ret) => {
        assertStrictEquals(err, null);
        assertStrictEquals(ret, value);
        done();
      });
    });
  }
  await testQueue.waitForCompletion();
});
Deno.test("callbackify preserves the `this` binding", async () => {
  const testQueue = new TestQueue();
  for (const value of values) {
    const objectWithSyncFunction = {
      fn(arg) {
        assertStrictEquals(this, objectWithSyncFunction);
        return Promise.resolve(arg);
      }
    };
    const cbSyncFunction = callbackify(objectWithSyncFunction.fn);
    testQueue.enqueue((done) => {
      cbSyncFunction.call(objectWithSyncFunction, value, function(err, ret) {
        assertStrictEquals(err, null);
        assertStrictEquals(ret, value);
        assertStrictEquals(this, objectWithSyncFunction);
        done();
      });
    });
    const objectWithAsyncFunction = {
      async fn(arg) {
        assertStrictEquals(this, objectWithAsyncFunction);
        return arg;
      }
    };
    const cbAsyncFunction = callbackify(objectWithAsyncFunction.fn);
    testQueue.enqueue((done) => {
      cbAsyncFunction.call(objectWithAsyncFunction, value, function(err, ret) {
        assertStrictEquals(err, null);
        assertStrictEquals(ret, value);
        assertStrictEquals(this, objectWithAsyncFunction);
        done();
      });
    });
  }
  await testQueue.waitForCompletion();
});
Deno.test("callbackify throws with non-function inputs", () => {
  ["foo", null, void 0, false, 0, {}, Symbol(), []].forEach((value) => {
    try {
      callbackify(value);
      throw Error("We should never reach this error");
    } catch (err) {
      assert(err instanceof TypeError);
      assertStrictEquals(err.code, "ERR_INVALID_ARG_TYPE");
      assertStrictEquals(err.name, "TypeError");
      assertStrictEquals(err.message, 'The "original" argument must be of type function.');
    }
  });
});
Deno.test("callbackify returns a function that throws if the last argument is not a function", () => {
  async function asyncFn() {
    return 42;
  }
  const cb = callbackify(asyncFn);
  const args = [];
  ["foo", null, void 0, false, 0, {}, Symbol(), []].forEach((value) => {
    args.push(value);
    try {
      cb(...args);
      throw Error("We should never reach this error");
    } catch (err) {
      assert(err instanceof TypeError);
      assertStrictEquals(err.code, "ERR_INVALID_ARG_TYPE");
      assertStrictEquals(err.name, "TypeError");
      assertStrictEquals(err.message, "The last argument must be of type function.");
    }
  });
});
