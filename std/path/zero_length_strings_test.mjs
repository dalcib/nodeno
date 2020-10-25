import {assertEquals} from "../testing/asserts.mjs";
import * as path from "./mod.mjs";
const pwd = Deno.cwd();
Deno.test("joinZeroLength", function() {
  assertEquals(path.posix.join(""), ".");
  assertEquals(path.posix.join("", ""), ".");
  if (path.win32)
    assertEquals(path.win32.join(""), ".");
  if (path.win32)
    assertEquals(path.win32.join("", ""), ".");
  assertEquals(path.join(pwd), pwd);
  assertEquals(path.join(pwd, ""), pwd);
});
Deno.test("normalizeZeroLength", function() {
  assertEquals(path.posix.normalize(""), ".");
  if (path.win32)
    assertEquals(path.win32.normalize(""), ".");
  assertEquals(path.normalize(pwd), pwd);
});
Deno.test("isAbsoluteZeroLength", function() {
  assertEquals(path.posix.isAbsolute(""), false);
  if (path.win32)
    assertEquals(path.win32.isAbsolute(""), false);
});
Deno.test("resolveZeroLength", function() {
  assertEquals(path.resolve(""), pwd);
  assertEquals(path.resolve("", ""), pwd);
});
Deno.test("relativeZeroLength", function() {
  assertEquals(path.relative("", pwd), "");
  assertEquals(path.relative(pwd, ""), "");
  assertEquals(path.relative(pwd, pwd), "");
});
