import {assertEquals, unitTest} from "./test_util.mjs";
unitTest({
  ignore: Deno.build.os === "windows"
}, function umaskSuccess() {
  const prevMask = Deno.umask(16);
  const newMask = Deno.umask(prevMask);
  const finalMask = Deno.umask();
  assertEquals(newMask, 16);
  assertEquals(finalMask, prevMask);
});
