import {assertEquals} from "../../testing/asserts.mjs";
import {exists, existsSync} from "./_fs_exists.mjs";
Deno.test("existsFile", async function() {
  const availableFile = await new Promise((resolve) => {
    const tmpFilePath = Deno.makeTempFileSync();
    exists(tmpFilePath, (exists2) => {
      Deno.removeSync(tmpFilePath);
      resolve(exists2);
    });
  });
  const notAvailableFile = await new Promise((resolve) => {
    exists("./notAvailable.txt", (exists2) => resolve(exists2));
  });
  assertEquals(availableFile, true);
  assertEquals(notAvailableFile, false);
});
Deno.test("existsSyncFile", function() {
  const tmpFilePath = Deno.makeTempFileSync();
  assertEquals(existsSync(tmpFilePath), true);
  Deno.removeSync(tmpFilePath);
  assertEquals(existsSync("./notAvailable.txt"), false);
});
