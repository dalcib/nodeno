import {assert} from "../../testing/asserts.js";
import {copyFile, copyFileSync} from "./_fs_copy.js";
import {existsSync} from "./_fs_exists.js";
const destFile = "./destination.txt";
Deno.test({
  name: "[std/node/fs] copy file",
  fn: async () => {
    const sourceFile = Deno.makeTempFileSync();
    const err = await new Promise((resolve) => {
      copyFile(sourceFile, destFile, (err2) => resolve(err2));
    });
    assert(!err);
    assert(existsSync(destFile));
    Deno.removeSync(sourceFile);
    Deno.removeSync(destFile);
  }
});
Deno.test({
  name: "[std/node/fs] copy file sync",
  fn: () => {
    const sourceFile = Deno.makeTempFileSync();
    copyFileSync(sourceFile, destFile);
    assert(existsSync(destFile));
    Deno.removeSync(sourceFile);
    Deno.removeSync(destFile);
  }
});
