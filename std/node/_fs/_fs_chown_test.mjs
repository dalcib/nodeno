import {assertEquals, fail} from "../../testing/asserts.mjs";
import {chown, chownSync} from "./_fs_chown.mjs";
const ignore = Deno.build.os == "windows";
Deno.test({
  ignore,
  name: "ASYNC: setting existing uid/gid works as expected (non-Windows)",
  async fn() {
    const tempFile = await Deno.makeTempFile();
    const originalUserId = (await Deno.lstat(tempFile)).uid;
    const originalGroupId = (await Deno.lstat(tempFile)).gid;
    await new Promise((resolve, reject) => {
      chown(tempFile, originalUserId, originalGroupId, (err) => {
        if (err)
          reject(err);
        else
          resolve();
      });
    }).then(() => {
      const newUserId = Deno.lstatSync(tempFile).uid;
      const newGroupId = Deno.lstatSync(tempFile).gid;
      assertEquals(newUserId, originalUserId);
      assertEquals(newGroupId, originalGroupId);
    }).catch(() => {
      fail();
    }).finally(() => {
      Deno.removeSync(tempFile);
    });
  }
});
Deno.test({
  ignore,
  name: "SYNC: setting existing uid/gid works as expected (non-Windows)",
  fn() {
    const tempFile = Deno.makeTempFileSync();
    const originalUserId = Deno.lstatSync(tempFile).uid;
    const originalGroupId = Deno.lstatSync(tempFile).gid;
    chownSync(tempFile, originalUserId, originalGroupId);
    const newUserId = Deno.lstatSync(tempFile).uid;
    const newGroupId = Deno.lstatSync(tempFile).gid;
    assertEquals(newUserId, originalUserId);
    assertEquals(newGroupId, originalGroupId);
    Deno.removeSync(tempFile);
  }
});
