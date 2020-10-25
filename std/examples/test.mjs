import {assertEquals} from "../testing/asserts.mjs";
import {dirname, fromFileUrl, relative, resolve} from "../path/mod.mjs";
const moduleDir = dirname(fromFileUrl(import.meta.url));
Deno.test("t1", function() {
  assertEquals("hello", "hello");
});
Deno.test("t2", function() {
  assertEquals("world", "world");
});
Deno.test("catSmoke", async function() {
  const p = Deno.run({
    cmd: [
      Deno.execPath(),
      "run",
      "--allow-read",
      relative(Deno.cwd(), resolve(moduleDir, "cat.ts")),
      relative(Deno.cwd(), resolve(moduleDir, "..", "README.md"))
    ],
    stdout: "null",
    stderr: "null"
  });
  const s = await p.status();
  assertEquals(s.code, 0);
  p.close();
});
