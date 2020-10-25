import {assert, assertThrows, fail} from "../../testing/asserts.js";
import {close, closeSync} from "./_fs_close.js";
Deno.test({
  name: "ASYNC: File is closed",
  async fn() {
    const tempFile = await Deno.makeTempFile();
    const file = await Deno.open(tempFile);
    assert(Deno.resources()[file.rid]);
    await new Promise((resolve, reject) => {
      close(file.rid, (err) => {
        if (err !== null)
          reject();
        else
          resolve();
      });
    }).then(() => {
      assert(!Deno.resources()[file.rid]);
    }).catch(() => {
      fail("No error expected");
    }).finally(async () => {
      await Deno.remove(tempFile);
    });
  }
});
Deno.test({
  name: "ASYNC: Invalid fd",
  async fn() {
    await new Promise((resolve, reject) => {
      close(-1, (err) => {
        if (err !== null)
          return resolve();
        reject();
      });
    });
  }
});
Deno.test({
  name: "close callback should be asynchronous",
  async fn() {
    const tempFile = Deno.makeTempFileSync();
    const file = Deno.openSync(tempFile);
    let foo;
    const promise = new Promise((resolve) => {
      close(file.rid, () => {
        assert(foo === "bar");
        resolve();
      });
      foo = "bar";
    });
    await promise;
    Deno.removeSync(tempFile);
  }
});
Deno.test({
  name: "SYNC: File is closed",
  fn() {
    const tempFile = Deno.makeTempFileSync();
    const file = Deno.openSync(tempFile);
    assert(Deno.resources()[file.rid]);
    closeSync(file.rid);
    assert(!Deno.resources()[file.rid]);
    Deno.removeSync(tempFile);
  }
});
Deno.test({
  name: "SYNC: Invalid fd",
  fn() {
    assertThrows(() => closeSync(-1));
  }
});
