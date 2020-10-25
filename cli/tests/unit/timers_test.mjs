import {
  assert,
  assertEquals,
  assertNotEquals,
  createResolvable,
  unitTest
} from "./test_util.mjs";
function waitForMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
unitTest(async function timeoutSuccess() {
  const promise = createResolvable();
  let count = 0;
  setTimeout(() => {
    count++;
    promise.resolve();
  }, 500);
  await promise;
  assertEquals(count, 1);
});
unitTest(async function timeoutArgs() {
  const promise = createResolvable();
  const arg = 1;
  setTimeout((a, b, c) => {
    assertEquals(a, arg);
    assertEquals(b, arg.toString());
    assertEquals(c, [arg]);
    promise.resolve();
  }, 10, arg, arg.toString(), [arg]);
  await promise;
});
unitTest(async function timeoutCancelSuccess() {
  let count = 0;
  const id = setTimeout(() => {
    count++;
  }, 1);
  clearTimeout(id);
  await waitForMs(600);
  assertEquals(count, 0);
});
unitTest(async function timeoutCancelMultiple() {
  function uncalled() {
    throw new Error("This function should not be called.");
  }
  const t1 = setTimeout(uncalled, 10);
  const t2 = setTimeout(uncalled, 10);
  const t3 = setTimeout(uncalled, 10);
  clearTimeout(t1);
  clearTimeout(t2);
  clearTimeout(t3);
  const t4 = setTimeout(uncalled, 20);
  const t5 = setTimeout(uncalled, 20);
  const t6 = setTimeout(uncalled, 20);
  clearTimeout(t6);
  clearTimeout(t5);
  clearTimeout(t4);
  await waitForMs(50);
});
unitTest(async function timeoutCancelInvalidSilentFail() {
  const promise = createResolvable();
  let count = 0;
  const id = setTimeout(() => {
    count++;
    clearTimeout(id);
    promise.resolve();
  }, 500);
  await promise;
  assertEquals(count, 1);
  clearTimeout(2147483647);
});
unitTest(async function intervalSuccess() {
  const promise = createResolvable();
  let count = 0;
  const id = setInterval(() => {
    count++;
    clearInterval(id);
    promise.resolve();
  }, 100);
  await promise;
  clearInterval(id);
  assertEquals(count, 1);
  await waitForMs(0);
});
unitTest(async function intervalCancelSuccess() {
  let count = 0;
  const id = setInterval(() => {
    count++;
  }, 1);
  clearInterval(id);
  await waitForMs(500);
  assertEquals(count, 0);
});
unitTest(async function intervalOrdering() {
  const timers = [];
  let timeouts = 0;
  function onTimeout() {
    ++timeouts;
    for (let i = 1; i < timers.length; i++) {
      clearTimeout(timers[i]);
    }
  }
  for (let i = 0; i < 10; i++) {
    timers[i] = setTimeout(onTimeout, 1);
  }
  await waitForMs(500);
  assertEquals(timeouts, 1);
});
unitTest(function intervalCancelInvalidSilentFail() {
  clearInterval(2147483647);
});
unitTest(async function fireCallbackImmediatelyWhenDelayOverMaxValue() {
  let count = 0;
  setTimeout(() => {
    count++;
  }, 2 ** 31);
  await waitForMs(1);
  assertEquals(count, 1);
});
unitTest(async function timeoutCallbackThis() {
  const promise = createResolvable();
  const obj = {
    foo() {
      assertEquals(this, window);
      promise.resolve();
    }
  };
  setTimeout(obj.foo, 1);
  await promise;
});
unitTest(async function timeoutBindThis() {
  const thisCheckPassed = [null, void 0, window, globalThis];
  const thisCheckFailed = [
    0,
    "",
    true,
    false,
    {},
    [],
    "foo",
    () => {
    },
    Object.prototype
  ];
  for (const thisArg of thisCheckPassed) {
    const resolvable = createResolvable();
    let hasThrown = 0;
    try {
      setTimeout.call(thisArg, () => resolvable.resolve(), 1);
      hasThrown = 1;
    } catch (err) {
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    await resolvable;
    assertEquals(hasThrown, 1);
  }
  for (const thisArg of thisCheckFailed) {
    let hasThrown = 0;
    try {
      setTimeout.call(thisArg, () => {
      }, 1);
      hasThrown = 1;
    } catch (err) {
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    assertEquals(hasThrown, 2);
  }
});
unitTest(function clearTimeoutShouldConvertToNumber() {
  let called = false;
  const obj = {
    valueOf() {
      called = true;
      return 1;
    }
  };
  clearTimeout(obj);
  assert(called);
});
unitTest(function setTimeoutShouldThrowWithBigint() {
  let hasThrown = 0;
  try {
    setTimeout(() => {
    }, 1n);
    hasThrown = 1;
  } catch (err) {
    if (err instanceof TypeError) {
      hasThrown = 2;
    } else {
      hasThrown = 3;
    }
  }
  assertEquals(hasThrown, 2);
});
unitTest(function clearTimeoutShouldThrowWithBigint() {
  let hasThrown = 0;
  try {
    clearTimeout(1n);
    hasThrown = 1;
  } catch (err) {
    if (err instanceof TypeError) {
      hasThrown = 2;
    } else {
      hasThrown = 3;
    }
  }
  assertEquals(hasThrown, 2);
});
unitTest(function testFunctionName() {
  assertEquals(clearTimeout.name, "clearTimeout");
  assertEquals(clearInterval.name, "clearInterval");
});
unitTest(function testFunctionParamsLength() {
  assertEquals(setTimeout.length, 1);
  assertEquals(setInterval.length, 1);
  assertEquals(clearTimeout.length, 0);
  assertEquals(clearInterval.length, 0);
});
unitTest(function clearTimeoutAndClearIntervalNotBeEquals() {
  assertNotEquals(clearTimeout, clearInterval);
});
unitTest(async function timerMaxCpuBug() {
  clearTimeout(setTimeout(() => {
  }, 1e3));
  const {opsDispatched} = Deno.metrics();
  await waitForMs(100);
  const opsDispatched_ = Deno.metrics().opsDispatched;
  assert(opsDispatched_ - opsDispatched < 10);
});
unitTest(async function timerBasicMicrotaskOrdering() {
  let s = "";
  let count = 0;
  const promise = createResolvable();
  setTimeout(() => {
    Promise.resolve().then(() => {
      count++;
      s += "de";
      if (count === 2) {
        promise.resolve();
      }
    });
  });
  setTimeout(() => {
    count++;
    s += "no";
    if (count === 2) {
      promise.resolve();
    }
  });
  await promise;
  assertEquals(s, "deno");
});
unitTest(async function timerNestedMicrotaskOrdering() {
  let s = "";
  const promise = createResolvable();
  s += "0";
  setTimeout(() => {
    s += "4";
    setTimeout(() => s += "A");
    Promise.resolve().then(() => {
      setTimeout(() => {
        s += "B";
        promise.resolve();
      });
    }).then(() => {
      s += "5";
    });
  });
  setTimeout(() => s += "6");
  Promise.resolve().then(() => s += "2");
  Promise.resolve().then(() => setTimeout(() => {
    s += "7";
    Promise.resolve().then(() => s += "8").then(() => {
      s += "9";
    });
  }));
  Promise.resolve().then(() => Promise.resolve().then(() => s += "3"));
  s += "1";
  await promise;
  assertEquals(s, "0123456789AB");
});
unitTest(function testQueueMicrotask() {
  assertEquals(typeof queueMicrotask, "function");
});
unitTest(async function timerIgnoresDateOverride() {
  const OriginalDate = Date;
  const promise = createResolvable();
  let hasThrown = 0;
  try {
    const overrideCalled = () => {
      promise.reject("global Date override used over original Date object");
      return 0;
    };
    const DateOverride = () => {
      overrideCalled();
    };
    globalThis.Date = DateOverride;
    globalThis.Date.now = overrideCalled;
    globalThis.Date.UTC = overrideCalled;
    globalThis.Date.parse = overrideCalled;
    queueMicrotask(promise.resolve);
    await promise;
    hasThrown = 1;
  } catch (err) {
    if (typeof err === "string") {
      assertEquals(err, "global Date override used over original Date object");
      hasThrown = 2;
    } else if (err instanceof TypeError) {
      hasThrown = 3;
    } else {
      hasThrown = 4;
    }
  } finally {
    globalThis.Date = OriginalDate;
  }
  assertEquals(hasThrown, 1);
});
