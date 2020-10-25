import {assertStrictEquals} from "../testing/asserts.js";
import {dirname, fromFileUrl} from "../path/mod.js";
const moduleDir = dirname(fromFileUrl(import.meta.url));
Deno.test("[examples/welcome] print a welcome message", async () => {
  const decoder = new TextDecoder();
  const process = Deno.run({
    cmd: [Deno.execPath(), "run", "welcome.ts"],
    cwd: moduleDir,
    stdout: "piped"
  });
  try {
    const output = await process.output();
    const actual = decoder.decode(output).trim();
    const expected = "Welcome to Deno 🦕";
    assertStrictEquals(actual, expected);
  } finally {
    process.close();
  }
});
