import {assertEquals} from "../testing/asserts.mjs";
import {parse} from "./mod.mjs";
Deno.test("stopParsing", function() {
  const argv = parse(["--aaa", "bbb", "ccc", "--ddd"], {
    stopEarly: true
  });
  assertEquals(argv, {
    aaa: "bbb",
    _: ["ccc", "--ddd"]
  });
});
