import {assertEquals} from "../testing/asserts.mjs";
import {parse} from "./mod.mjs";
Deno.test("booleanDefaultTrue", function() {
  const argv = parse([], {
    boolean: "sometrue",
    default: {sometrue: true}
  });
  assertEquals(argv.sometrue, true);
});
Deno.test("booleanDefaultFalse", function() {
  const argv = parse([], {
    boolean: "somefalse",
    default: {somefalse: false}
  });
  assertEquals(argv.somefalse, false);
});
Deno.test("booleanDefaultNull", function() {
  const argv = parse([], {
    boolean: "maybe",
    default: {maybe: null}
  });
  assertEquals(argv.maybe, null);
  const argv2 = parse(["--maybe"], {
    boolean: "maybe",
    default: {maybe: null}
  });
  assertEquals(argv2.maybe, true);
});
