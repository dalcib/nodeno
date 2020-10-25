import {assertEquals} from "../testing/asserts.js";
import {parse} from "./mod.js";
Deno.test("whitespaceShouldBeWhitespace", function() {
  assertEquals(parse(["-x", "	"]).x, "	");
});
