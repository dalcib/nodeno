import {assertEquals, fail} from "../../testing/asserts.js";
import {link, linkSync} from "./_fs_link.js";
import {assert} from "../../testing/asserts.js";
Deno.test({
  name: "ASYNC: hard linking files works as expected",
  async fn() {
    const tempFile = await Deno.makeTempFile();
    const linkedFile = tempFile + ".link";
    await new Promise((res, rej) => {
      link(tempFile, linkedFile, (err) => {
        if (err)
          rej(err);
        else
          res();
      });
    }).then(() => {
      assertEquals(Deno.statSync(tempFile), Deno.statSync(linkedFile));
    }).catch(() => {
      fail("Expected to succeed");
    }).finally(() => {
      Deno.removeSync(tempFile);
      Deno.removeSync(linkedFile);
    });
  }
});
Deno.test({
  name: "ASYNC: hard linking files passes error to callback",
  async fn() {
    let failed = false;
    await new Promise((res, rej) => {
      link("no-such-file", "no-such-file", (err) => {
        if (err)
          rej(err);
        else
          res();
      });
    }).then(() => {
      fail("Expected to succeed");
    }).catch((err) => {
      assert(err);
      failed = true;
    });
    assert(failed);
  }
});
Deno.test({
  name: "SYNC: hard linking files works as expected",
  fn() {
    const tempFile = Deno.makeTempFileSync();
    const linkedFile = tempFile + ".link";
    linkSync(tempFile, linkedFile);
    assertEquals(Deno.statSync(tempFile), Deno.statSync(linkedFile));
    Deno.removeSync(tempFile);
    Deno.removeSync(linkedFile);
  }
});
