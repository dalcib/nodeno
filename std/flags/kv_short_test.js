import {assertEquals} from "../testing/asserts.js";
import {parse} from "./mod.js";
Deno.test("short", function() {
  const argv = parse(["-b=123"]);
  assertEquals(argv, {b: 123, _: []});
});
Deno.test("multiShort", function() {
  const argv = parse(["-a=whatever", "-b=robots"]);
  assertEquals(argv, {a: "whatever", b: "robots", _: []});
});
