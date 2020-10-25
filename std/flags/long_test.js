import {assertEquals} from "../testing/asserts.js";
import {parse} from "./mod.js";
Deno.test("longOpts", function() {
  assertEquals(parse(["--bool"]), {bool: true, _: []});
  assertEquals(parse(["--pow", "xixxle"]), {pow: "xixxle", _: []});
  assertEquals(parse(["--pow=xixxle"]), {pow: "xixxle", _: []});
  assertEquals(parse(["--host", "localhost", "--port", "555"]), {
    host: "localhost",
    port: 555,
    _: []
  });
  assertEquals(parse(["--host=localhost", "--port=555"]), {
    host: "localhost",
    port: 555,
    _: []
  });
});
