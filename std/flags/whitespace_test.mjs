import {assertEquals} from "../testing/asserts.mjs";
import {parse} from "./mod.mjs";
Deno.test("whitespaceShouldBeWhitespace", function() {
  assertEquals(parse(["-x", "	"]).x, "	");
});
