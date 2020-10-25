import {assertEquals, unitTest} from "./test_util.mjs";
unitTest(function customEventInitializedWithDetail() {
  const type = "touchstart";
  const detail = {message: "hello"};
  const customEventInit = {
    bubbles: true,
    cancelable: true,
    detail
  };
  const event = new CustomEvent(type, customEventInit);
  assertEquals(event.bubbles, true);
  assertEquals(event.cancelable, true);
  assertEquals(event.currentTarget, null);
  assertEquals(event.detail, detail);
  assertEquals(event.isTrusted, false);
  assertEquals(event.target, null);
  assertEquals(event.type, type);
});
unitTest(function toStringShouldBeWebCompatibility() {
  const type = "touchstart";
  const event = new CustomEvent(type, {});
  assertEquals(event.toString(), "[object CustomEvent]");
});
