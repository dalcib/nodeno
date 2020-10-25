import {assertEquals} from "../testing/asserts.mjs";
import {parse} from "./mod.mjs";
Deno.test("hyphen", function() {
  assertEquals(parse(["-n", "-"]), {n: "-", _: []});
  assertEquals(parse(["-"]), {_: ["-"]});
  assertEquals(parse(["-f-"]), {f: "-", _: []});
  assertEquals(parse(["-b", "-"], {boolean: "b"}), {b: true, _: ["-"]});
  assertEquals(parse(["-s", "-"], {string: "s"}), {s: "-", _: []});
});
Deno.test("doubleDash", function() {
  assertEquals(parse(["-a", "--", "b"]), {a: true, _: ["b"]});
  assertEquals(parse(["--a", "--", "b"]), {a: true, _: ["b"]});
  assertEquals(parse(["--a", "--", "b"]), {a: true, _: ["b"]});
});
Deno.test("moveArgsAfterDoubleDashIntoOwnArray", function() {
  assertEquals(parse(["--name", "John", "before", "--", "after"], {"--": true}), {
    name: "John",
    _: ["before"],
    "--": ["after"]
  });
});
