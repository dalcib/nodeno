import {assertEquals} from "../testing/asserts.js";
import {parse} from "./mod.js";
Deno.test("stopParsing", function() {
  const argv = parse(["--aaa", "bbb", "ccc", "--ddd"], {
    stopEarly: true
  });
  assertEquals(argv, {
    aaa: "bbb",
    _: ["ccc", "--ddd"]
  });
});
