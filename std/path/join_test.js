import {assertEquals} from "../testing/asserts.js";
import * as path from "./mod.js";
const backslashRE = /\\/g;
const joinTests = [
  [[".", "x/b", "..", "/b/c.js"], "x/b/c.js"],
  [[], "."],
  [["/.", "x/b", "..", "/b/c.js"], "/x/b/c.js"],
  [["/foo", "../../../bar"], "/bar"],
  [["foo", "../../../bar"], "../../bar"],
  [["foo/", "../../../bar"], "../../bar"],
  [["foo/x", "../../../bar"], "../bar"],
  [["foo/x", "./bar"], "foo/x/bar"],
  [["foo/x/", "./bar"], "foo/x/bar"],
  [["foo/x/", ".", "bar"], "foo/x/bar"],
  [["./"], "./"],
  [[".", "./"], "./"],
  [[".", ".", "."], "."],
  [[".", "./", "."], "."],
  [[".", "/./", "."], "."],
  [[".", "/////./", "."], "."],
  [["."], "."],
  [["", "."], "."],
  [["", "foo"], "foo"],
  [["foo", "/bar"], "foo/bar"],
  [["", "/foo"], "/foo"],
  [["", "", "/foo"], "/foo"],
  [["", "", "foo"], "foo"],
  [["foo", ""], "foo"],
  [["foo/", ""], "foo/"],
  [["foo", "", "/bar"], "foo/bar"],
  [["./", "..", "/foo"], "../foo"],
  [["./", "..", "..", "/foo"], "../../foo"],
  [[".", "..", "..", "/foo"], "../../foo"],
  [["", "..", "..", "/foo"], "../../foo"],
  [["/"], "/"],
  [["/", "."], "/"],
  [["/", ".."], "/"],
  [["/", "..", ".."], "/"],
  [[""], "."],
  [["", ""], "."],
  [[" /foo"], " /foo"],
  [[" ", "foo"], " /foo"],
  [[" ", "."], " "],
  [[" ", "/"], " /"],
  [[" ", ""], " "],
  [["/", "foo"], "/foo"],
  [["/", "/foo"], "/foo"],
  [["/", "//foo"], "/foo"],
  [["/", "", "/foo"], "/foo"],
  [["", "/", "foo"], "/foo"],
  [["", "/", "/foo"], "/foo"]
];
const windowsJoinTests = [
  [["//foo/bar"], "\\\\foo\\bar\\"],
  [["\\/foo/bar"], "\\\\foo\\bar\\"],
  [["\\\\foo/bar"], "\\\\foo\\bar\\"],
  [["//foo", "bar"], "\\\\foo\\bar\\"],
  [["//foo/", "bar"], "\\\\foo\\bar\\"],
  [["//foo", "/bar"], "\\\\foo\\bar\\"],
  [["//foo", "", "bar"], "\\\\foo\\bar\\"],
  [["//foo/", "", "bar"], "\\\\foo\\bar\\"],
  [["//foo/", "", "/bar"], "\\\\foo\\bar\\"],
  [["", "//foo", "bar"], "\\\\foo\\bar\\"],
  [["", "//foo/", "bar"], "\\\\foo\\bar\\"],
  [["", "//foo/", "/bar"], "\\\\foo\\bar\\"],
  [["\\", "foo/bar"], "\\foo\\bar"],
  [["\\", "/foo/bar"], "\\foo\\bar"],
  [["", "/", "/foo/bar"], "\\foo\\bar"],
  [["//", "foo/bar"], "\\foo\\bar"],
  [["//", "/foo/bar"], "\\foo\\bar"],
  [["\\\\", "/", "/foo/bar"], "\\foo\\bar"],
  [["//"], "\\"],
  [["//foo"], "\\foo"],
  [["//foo/"], "\\foo\\"],
  [["//foo", "/"], "\\foo\\"],
  [["//foo", "", "/"], "\\foo\\"],
  [["///foo/bar"], "\\foo\\bar"],
  [["////foo", "bar"], "\\foo\\bar"],
  [["\\\\\\/foo/bar"], "\\foo\\bar"],
  [["c:"], "c:."],
  [["c:."], "c:."],
  [["c:", ""], "c:."],
  [["", "c:"], "c:."],
  [["c:.", "/"], "c:.\\"],
  [["c:.", "file"], "c:file"],
  [["c:", "/"], "c:\\"],
  [["c:", "file"], "c:\\file"]
];
Deno.test("join", function() {
  joinTests.forEach(function(p) {
    const _p = p[0];
    const actual = path.posix.join.apply(null, _p);
    assertEquals(actual, p[1]);
  });
});
Deno.test("joinWin32", function() {
  joinTests.forEach(function(p) {
    const _p = p[0];
    const actual = path.win32.join.apply(null, _p).replace(backslashRE, "/");
    assertEquals(actual, p[1]);
  });
  windowsJoinTests.forEach(function(p) {
    const _p = p[0];
    const actual = path.win32.join.apply(null, _p);
    assertEquals(actual, p[1]);
  });
});
