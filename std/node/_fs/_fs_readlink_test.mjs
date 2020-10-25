import {readlink, readlinkSync} from "./_fs_readlink.mjs";
import {assert, assertEquals} from "../../testing/asserts.mjs";
import * as path from "../path.mjs";
const testDir = Deno.makeTempDirSync();
const oldname = path.join(testDir, "oldname");
const newname = path.join(testDir, "newname");
if (Deno.build.os === "windows") {
  Deno.symlinkSync(oldname, newname, {type: "file"});
} else {
  Deno.symlinkSync(oldname, newname);
}
Deno.test({
  name: "readlinkSuccess",
  async fn() {
    const data = await new Promise((res, rej) => {
      readlink(newname, (err, data2) => {
        if (err) {
          rej(err);
        }
        res(data2);
      });
    });
    assertEquals(typeof data, "string");
    assertEquals(data, oldname);
  }
});
Deno.test({
  name: "readlinkEncodeBufferSuccess",
  async fn() {
    const data = await new Promise((res, rej) => {
      readlink(newname, {encoding: "buffer"}, (err, data2) => {
        if (err) {
          rej(err);
        }
        res(data2);
      });
    });
    assert(data instanceof Uint8Array);
    assertEquals(new TextDecoder().decode(data), oldname);
  }
});
Deno.test({
  name: "readlinkSyncSuccess",
  fn() {
    const data = readlinkSync(newname);
    assertEquals(typeof data, "string");
    assertEquals(data, oldname);
  }
});
Deno.test({
  name: "readlinkEncodeBufferSuccess",
  fn() {
    const data = readlinkSync(newname, {encoding: "buffer"});
    assert(data instanceof Uint8Array);
    assertEquals(new TextDecoder().decode(data), oldname);
  }
});
