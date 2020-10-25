import {xeval as xeval2} from "./xeval.js";
import {StringReader} from "../io/readers.js";
import {decode, encode} from "../encoding/utf8.js";
import {
  assert,
  assertEquals,
  assertStringContains
} from "../testing/asserts.js";
import {dirname, fromFileUrl} from "../path/mod.js";
const moduleDir = dirname(fromFileUrl(import.meta.url));
Deno.test("xevalSuccess", async function() {
  const chunks = [];
  await xeval2(new StringReader("a\nb\nc"), ($) => chunks.push($));
  assertEquals(chunks, ["a", "b", "c"]);
});
Deno.test("xevalDelimiter", async function() {
  const chunks = [];
  await xeval2(new StringReader("!MADMADAMADAM!"), ($) => chunks.push($), {
    delimiter: "MADAM"
  });
  assertEquals(chunks, ["!MAD", "ADAM!"]);
});
const xevalPath = "xeval.js";
Deno.test({
  name: "xevalCliReplvar",
  fn: async function() {
    const p = Deno.run({
      cmd: [
        Deno.execPath(),
        "run",
        xevalPath,
        "--replvar=abc",
        "console.log(abc)"
      ],
      cwd: moduleDir,
      stdin: "piped",
      stdout: "piped",
      stderr: "null"
    });
    assert(p.stdin != null);
    await p.stdin.write(encode("hello"));
    p.stdin.close();
    assertEquals(await p.status(), {code: 0, success: true});
    assertEquals(decode(await p.output()).trimEnd(), "hello");
    p.close();
  }
});
Deno.test("xevalCliSyntaxError", async function() {
  const p = Deno.run({
    cmd: [Deno.execPath(), "run", xevalPath, "("],
    cwd: moduleDir,
    stdin: "null",
    stdout: "piped",
    stderr: "piped"
  });
  assertEquals(await p.status(), {code: 1, success: false});
  assertEquals(decode(await p.output()), "");
  assertStringContains(decode(await p.stderrOutput()), "Uncaught SyntaxError");
  p.close();
});
