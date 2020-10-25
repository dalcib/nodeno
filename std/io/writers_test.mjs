import {assertEquals} from "../testing/asserts.mjs";
import {StringWriter} from "./writers.mjs";
import {StringReader} from "./readers.mjs";
import {copyN} from "./ioutil.mjs";
Deno.test("ioStringWriter", async function() {
  const w = new StringWriter("base");
  const r = new StringReader("0123456789");
  await copyN(r, w, 4);
  assertEquals(w.toString(), "base0123");
  await Deno.copy(r, w);
  assertEquals(w.toString(), "base0123456789");
});
Deno.test("ioStringWriterSync", function() {
  const encoder = new TextEncoder();
  const w = new StringWriter("");
  w.writeSync(encoder.encode("deno"));
  assertEquals(w.toString(), "deno");
  w.writeSync(encoder.encode("\nland"));
  assertEquals(w.toString(), "deno\nland");
});
