import {assertEquals} from "../testing/asserts.mjs";
import {parse} from "./mod.mjs";
Deno.test("flagBooleanTrue", function() {
  const argv = parse(["moo", "--honk", "cow"], {
    boolean: true
  });
  assertEquals(argv, {
    honk: true,
    _: ["moo", "cow"]
  });
  assertEquals(typeof argv.honk, "boolean");
});
Deno.test("flagBooleanTrueOnlyAffectsDoubleDash", function() {
  const argv = parse(["moo", "--honk", "cow", "-p", "55", "--tacos=good"], {
    boolean: true
  });
  assertEquals(argv, {
    honk: true,
    tacos: "good",
    p: 55,
    _: ["moo", "cow"]
  });
  assertEquals(typeof argv.honk, "boolean");
});
