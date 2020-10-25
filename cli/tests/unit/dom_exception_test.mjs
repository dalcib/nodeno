import {assert, assertEquals, unitTest} from "./test_util.mjs";
unitTest(function testDomError() {
  const de = new DOMException("foo", "bar");
  assert(de);
  assertEquals(de.message, "foo");
  assertEquals(de.name, "bar");
});
