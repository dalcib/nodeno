import {assertEquals} from "../testing/asserts.js";
import * as path from "./mod.js";
const slashRE = /\//g;
const pairs = [
  ["", ""],
  ["/path/to/file", ""],
  ["/path/to/file.ext", ".ext"],
  ["/path.to/file.ext", ".ext"],
  ["/path.to/file", ""],
  ["/path.to/.file", ""],
  ["/path.to/.file.ext", ".ext"],
  ["/path/to/f.ext", ".ext"],
  ["/path/to/..ext", ".ext"],
  ["/path/to/..", ""],
  ["file", ""],
  ["file.ext", ".ext"],
  [".file", ""],
  [".file.ext", ".ext"],
  ["/file", ""],
  ["/file.ext", ".ext"],
  ["/.file", ""],
  ["/.file.ext", ".ext"],
  [".path/file.ext", ".ext"],
  ["file.ext.ext", ".ext"],
  ["file.", "."],
  [".", ""],
  ["./", ""],
  [".file.ext", ".ext"],
  [".file", ""],
  [".file.", "."],
  [".file..", "."],
  ["..", ""],
  ["../", ""],
  ["..file.ext", ".ext"],
  ["..file", ".file"],
  ["..file.", "."],
  ["..file..", "."],
  ["...", "."],
  ["...ext", ".ext"],
  ["....", "."],
  ["file.ext/", ".ext"],
  ["file.ext//", ".ext"],
  ["file/", ""],
  ["file//", ""],
  ["file./", "."],
  ["file.//", "."]
];
Deno.test("extname", function() {
  pairs.forEach(function(p) {
    const input = p[0];
    const expected = p[1];
    assertEquals(expected, path.posix.extname(input));
  });
  assertEquals(path.posix.extname(".\\"), "");
  assertEquals(path.posix.extname("..\\"), ".\\");
  assertEquals(path.posix.extname("file.ext\\"), ".ext\\");
  assertEquals(path.posix.extname("file.ext\\\\"), ".ext\\\\");
  assertEquals(path.posix.extname("file\\"), "");
  assertEquals(path.posix.extname("file\\\\"), "");
  assertEquals(path.posix.extname("file.\\"), ".\\");
  assertEquals(path.posix.extname("file.\\\\"), ".\\\\");
});
Deno.test("extnameWin32", function() {
  pairs.forEach(function(p) {
    const input = p[0].replace(slashRE, "\\");
    const expected = p[1];
    assertEquals(expected, path.win32.extname(input));
    assertEquals(expected, path.win32.extname("C:" + input));
  });
  assertEquals(path.win32.extname(".\\"), "");
  assertEquals(path.win32.extname("..\\"), "");
  assertEquals(path.win32.extname("file.ext\\"), ".ext");
  assertEquals(path.win32.extname("file.ext\\\\"), ".ext");
  assertEquals(path.win32.extname("file\\"), "");
  assertEquals(path.win32.extname("file\\\\"), "");
  assertEquals(path.win32.extname("file.\\"), ".");
  assertEquals(path.win32.extname("file.\\\\"), ".");
});
