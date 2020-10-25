import {assertEquals, fail} from "../../testing/asserts.mjs";
import {existsSync} from "../../fs/mod.mjs";
import {unlink, unlinkSync} from "./_fs_unlink.mjs";
Deno.test({
  name: "ASYNC: deleting a file",
  async fn() {
    const file = Deno.makeTempFileSync();
    await new Promise((resolve, reject) => {
      unlink(file, (err) => {
        if (err)
          reject(err);
        resolve();
      });
    }).then(() => assertEquals(existsSync(file), false)).catch(() => fail()).finally(() => {
      if (existsSync(file))
        Deno.removeSync(file);
    });
  }
});
Deno.test({
  name: "SYNC: Test deleting a file",
  fn() {
    const file = Deno.makeTempFileSync();
    unlinkSync(file);
    assertEquals(existsSync(file), false);
  }
});
