import {assert, assertEquals, unitTest} from "./test_util.mjs";
unitTest(function eventInitializedWithType() {
  const type = "click";
  const event = new Event(type);
  assertEquals(event.isTrusted, false);
  assertEquals(event.target, null);
  assertEquals(event.currentTarget, null);
  assertEquals(event.type, "click");
  assertEquals(event.bubbles, false);
  assertEquals(event.cancelable, false);
});
unitTest(function eventInitializedWithTypeAndDict() {
  const init = "submit";
  const eventInit = {bubbles: true, cancelable: true};
  const event = new Event(init, eventInit);
  assertEquals(event.isTrusted, false);
  assertEquals(event.target, null);
  assertEquals(event.currentTarget, null);
  assertEquals(event.type, "submit");
  assertEquals(event.bubbles, true);
  assertEquals(event.cancelable, true);
});
unitTest(function eventComposedPathSuccess() {
  const type = "click";
  const event = new Event(type);
  const composedPath = event.composedPath();
  assertEquals(composedPath, []);
});
unitTest(function eventStopPropagationSuccess() {
  const type = "click";
  const event = new Event(type);
  assertEquals(event.cancelBubble, false);
  event.stopPropagation();
  assertEquals(event.cancelBubble, true);
});
unitTest(function eventStopImmediatePropagationSuccess() {
  const type = "click";
  const event = new Event(type);
  assertEquals(event.cancelBubble, false);
  event.stopImmediatePropagation();
  assertEquals(event.cancelBubble, true);
});
unitTest(function eventPreventDefaultSuccess() {
  const type = "click";
  const event = new Event(type);
  assertEquals(event.defaultPrevented, false);
  event.preventDefault();
  assertEquals(event.defaultPrevented, false);
  const eventInit = {bubbles: true, cancelable: true};
  const cancelableEvent = new Event(type, eventInit);
  assertEquals(cancelableEvent.defaultPrevented, false);
  cancelableEvent.preventDefault();
  assertEquals(cancelableEvent.defaultPrevented, true);
});
unitTest(function eventInitializedWithNonStringType() {
  const type = void 0;
  const event = new Event(type);
  assertEquals(event.isTrusted, false);
  assertEquals(event.target, null);
  assertEquals(event.currentTarget, null);
  assertEquals(event.type, "undefined");
  assertEquals(event.bubbles, false);
  assertEquals(event.cancelable, false);
});
unitTest(function eventIsTrusted() {
  const desc1 = Object.getOwnPropertyDescriptor(new Event("x"), "isTrusted");
  assert(desc1);
  assertEquals(typeof desc1.get, "function");
  const desc2 = Object.getOwnPropertyDescriptor(new Event("x"), "isTrusted");
  assert(desc2);
  assertEquals(typeof desc2.get, "function");
  assertEquals(desc1.get, desc2.get);
});
