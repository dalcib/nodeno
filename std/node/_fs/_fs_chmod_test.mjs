import {assert, fail} from "../../testing/asserts.mjs";
import {chmod, chmodSync} from "./_fs_chmod.mjs";
Deno.test({
  name: "ASYNC: Permissions are changed (non-Windows)",
  ignore: Deno.build.os === "windows",
  async fn() {
    const tempFile = await Deno.makeTempFile();
    const originalFileMode = (await Deno.lstat(tempFile)).mode;
    await new Promise((resolve, reject) => {
      chmod(tempFile, 511, (err) => {
        if (err)
          reject(err);
        else
          resolve();
      });
    }).then(() => {
      const newFileMode = Deno.lstatSync(tempFile).mode;
      assert(newFileMode && originalFileMode);
      assert(newFileMode === 33279 && newFileMode > originalFileMode);
    }).catch(() => {
      fail();
    }).finally(() => {
      Deno.removeSync(tempFile);
    });
  }
});
Deno.test({
  name: "SYNC: Permissions are changed (non-Windows)",
  ignore: Deno.build.os === "windows",
  fn() {
    const tempFile = Deno.makeTempFileSync();
    const originalFileMode = Deno.lstatSync(tempFile).mode;
    chmodSync(tempFile, "777");
    const newFileMode = Deno.lstatSync(tempFile).mode;
    assert(newFileMode && originalFileMode);
    assert(newFileMode === 33279 && newFileMode > originalFileMode);
    Deno.removeSync(tempFile);
  }
});
