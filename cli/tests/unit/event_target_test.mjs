import {assertEquals, unitTest} from "./test_util.mjs";
unitTest(function addEventListenerTest() {
  const document = new EventTarget();
  assertEquals(document.addEventListener("x", null, false), void 0);
  assertEquals(document.addEventListener("x", null, true), void 0);
  assertEquals(document.addEventListener("x", null), void 0);
});
unitTest(function constructedEventTargetCanBeUsedAsExpected() {
  const target = new EventTarget();
  const event = new Event("foo", {bubbles: true, cancelable: false});
  let callCount = 0;
  const listener = (e) => {
    assertEquals(e, event);
    ++callCount;
  };
  target.addEventListener("foo", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 1);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
  target.removeEventListener("foo", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
});
unitTest(function anEventTargetCanBeSubclassed() {
  class NicerEventTarget extends EventTarget {
    on(type, callback, options) {
      this.addEventListener(type, callback, options);
    }
    off(type, callback, options) {
      this.removeEventListener(type, callback, options);
    }
  }
  const target = new NicerEventTarget();
  new Event("foo", {bubbles: true, cancelable: false});
  let callCount = 0;
  const listener = () => {
    ++callCount;
  };
  target.on("foo", listener);
  assertEquals(callCount, 0);
  target.off("foo", listener);
  assertEquals(callCount, 0);
});
unitTest(function removingNullEventListenerShouldSucceed() {
  const document = new EventTarget();
  assertEquals(document.removeEventListener("x", null, false), void 0);
  assertEquals(document.removeEventListener("x", null, true), void 0);
  assertEquals(document.removeEventListener("x", null), void 0);
});
unitTest(function constructedEventTargetUseObjectPrototype() {
  const target = new EventTarget();
  const event = new Event("toString", {bubbles: true, cancelable: false});
  let callCount = 0;
  const listener = (e) => {
    assertEquals(e, event);
    ++callCount;
  };
  target.addEventListener("toString", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 1);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
  target.removeEventListener("toString", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
});
unitTest(function toStringShouldBeWebCompatible() {
  const target = new EventTarget();
  assertEquals(target.toString(), "[object EventTarget]");
});
unitTest(function dispatchEventShouldNotThrowError() {
  let hasThrown = false;
  try {
    const target = new EventTarget();
    const event = new Event("hasOwnProperty", {
      bubbles: true,
      cancelable: false
    });
    const listener = () => {
    };
    target.addEventListener("hasOwnProperty", listener);
    target.dispatchEvent(event);
  } catch {
    hasThrown = true;
  }
  assertEquals(hasThrown, false);
});
unitTest(function eventTargetThisShouldDefaultToWindow() {
  const {
    addEventListener,
    dispatchEvent,
    removeEventListener
  } = EventTarget.prototype;
  let n = 1;
  const event = new Event("hello");
  const listener = () => {
    n = 2;
  };
  addEventListener("hello", listener);
  window.dispatchEvent(event);
  assertEquals(n, 2);
  n = 1;
  removeEventListener("hello", listener);
  window.dispatchEvent(event);
  assertEquals(n, 1);
  window.addEventListener("hello", listener);
  dispatchEvent(event);
  assertEquals(n, 2);
  n = 1;
  window.removeEventListener("hello", listener);
  dispatchEvent(event);
  assertEquals(n, 1);
});
unitTest(function eventTargetShouldAcceptEventListenerObject() {
  const target = new EventTarget();
  const event = new Event("foo", {bubbles: true, cancelable: false});
  let callCount = 0;
  const listener = {
    handleEvent(e) {
      assertEquals(e, event);
      ++callCount;
    }
  };
  target.addEventListener("foo", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 1);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
  target.removeEventListener("foo", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
});
unitTest(function eventTargetShouldAcceptAsyncFunction() {
  const target = new EventTarget();
  const event = new Event("foo", {bubbles: true, cancelable: false});
  let callCount = 0;
  const listener = (e) => {
    assertEquals(e, event);
    ++callCount;
  };
  target.addEventListener("foo", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 1);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
  target.removeEventListener("foo", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
});
unitTest(function eventTargetShouldAcceptAsyncFunctionForEventListenerObject() {
  const target = new EventTarget();
  const event = new Event("foo", {bubbles: true, cancelable: false});
  let callCount = 0;
  const listener = {
    handleEvent(e) {
      assertEquals(e, event);
      ++callCount;
    }
  };
  target.addEventListener("foo", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 1);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
  target.removeEventListener("foo", listener);
  target.dispatchEvent(event);
  assertEquals(callCount, 2);
});
