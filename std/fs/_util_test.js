import {assertEquals} from "../testing/asserts.js";
import * as path from "../path/mod.js";
import {getFileInfoType, isSubdir} from "./_util.js";
import {ensureFileSync} from "./ensure_file.js";
import {ensureDirSync} from "./ensure_dir.js";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
Deno.test("_isSubdir", function() {
  const pairs = [
    ["", "", false, path.posix.sep],
    ["/first/second", "/first", false, path.posix.sep],
    ["/first", "/first", false, path.posix.sep],
    ["/first", "/first/second", true, path.posix.sep],
    ["first", "first/second", true, path.posix.sep],
    ["../first", "../first/second", true, path.posix.sep],
    ["c:\\first", "c:\\first", false, path.win32.sep],
    ["c:\\first", "c:\\first\\second", true, path.win32.sep]
  ];
  pairs.forEach(function(p) {
    const src = p[0];
    const dest = p[1];
    const expected = p[2];
    const sep = p[3];
    assertEquals(isSubdir(src, dest, sep), expected, `'${src}' should ${expected ? "" : "not"} be parent dir of '${dest}'`);
  });
});
Deno.test("_getFileInfoType", function() {
  const pairs = [
    [path.join(testdataDir, "file_type_1"), "file"],
    [path.join(testdataDir, "file_type_dir_1"), "dir"]
  ];
  pairs.forEach(function(p) {
    const filePath = p[0];
    const type = p[1];
    switch (type) {
      case "file":
        ensureFileSync(filePath);
        break;
      case "dir":
        ensureDirSync(filePath);
        break;
      case "symlink":
        break;
    }
    const stat = Deno.statSync(filePath);
    Deno.removeSync(filePath, {recursive: true});
    assertEquals(getFileInfoType(stat), type);
  });
});
