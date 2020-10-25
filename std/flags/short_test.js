import {assertEquals} from "../testing/asserts.js";
import {parse} from "./mod.js";
Deno.test("numbericShortArgs", function() {
  assertEquals(parse(["-n123"]), {n: 123, _: []});
  assertEquals(parse(["-123", "456"]), {1: true, 2: true, 3: 456, _: []});
});
Deno.test("short", function() {
  assertEquals(parse(["-b"]), {b: true, _: []});
  assertEquals(parse(["foo", "bar", "baz"]), {_: ["foo", "bar", "baz"]});
  assertEquals(parse(["-cats"]), {c: true, a: true, t: true, s: true, _: []});
  assertEquals(parse(["-cats", "meow"]), {
    c: true,
    a: true,
    t: true,
    s: "meow",
    _: []
  });
  assertEquals(parse(["-h", "localhost"]), {h: "localhost", _: []});
  assertEquals(parse(["-h", "localhost", "-p", "555"]), {
    h: "localhost",
    p: 555,
    _: []
  });
});
Deno.test("mixedShortBoolAndCapture", function() {
  assertEquals(parse(["-h", "localhost", "-fp", "555", "script.js"]), {
    f: true,
    p: 555,
    h: "localhost",
    _: ["script.js"]
  });
});
Deno.test("shortAndLong", function() {
  assertEquals(parse(["-h", "localhost", "-fp", "555", "script.js"]), {
    f: true,
    p: 555,
    h: "localhost",
    _: ["script.js"]
  });
});
