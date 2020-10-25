import {assertEquals} from "../testing/asserts.mjs";
import {parse} from "./mod.mjs";
Deno.test("dottedAlias", function() {
  const argv = parse(["--a.b", "22"], {
    default: {"a.b": 11},
    alias: {"a.b": "aa.bb"}
  });
  assertEquals(argv.a.b, 22);
  assertEquals(argv.aa.bb, 22);
});
Deno.test("dottedDefault", function() {
  const argv = parse([], {default: {"a.b": 11}, alias: {"a.b": "aa.bb"}});
  assertEquals(argv.a.b, 11);
  assertEquals(argv.aa.bb, 11);
});
Deno.test("dottedDefaultWithNoAlias", function() {
  const argv = parse([], {default: {"a.b": 11}});
  assertEquals(argv.a.b, 11);
});
