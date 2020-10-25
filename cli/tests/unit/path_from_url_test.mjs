import {assertEquals, assertThrows, unitTest} from "./test_util.mjs";
const {pathFromURL} = Deno[Deno.internal];
unitTest({ignore: Deno.build.os === "windows"}, function pathFromURLPosix() {
  assertEquals(pathFromURL(new URL("file:///test/directory")), "/test/directory");
  assertEquals(pathFromURL(new URL("file:///space_ .txt")), "/space_ .txt");
  assertThrows(() => pathFromURL(new URL("https://deno.land/welcome.ts")));
});
unitTest({ignore: Deno.build.os !== "windows"}, function pathFromURLWin32() {
  assertEquals(pathFromURL(new URL("file:///c:/windows/test")), "c:\\windows\\test");
  assertEquals(pathFromURL(new URL("file:///c:/space_ .txt")), "c:\\space_ .txt");
  assertThrows(() => pathFromURL(new URL("https://deno.land/welcome.ts")));
});
