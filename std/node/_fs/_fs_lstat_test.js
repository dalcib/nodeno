import {lstat, lstatSync} from "./_fs_lstat.js";
import {fail} from "../../testing/asserts.js";
import {assertStats, assertStatsBigInt} from "./_fs_stat_test.js";
Deno.test({
  name: "ASYNC: get a file Stats (lstat)",
  async fn() {
    const file = Deno.makeTempFileSync();
    await new Promise((resolve, reject) => {
      lstat(file, (err, stat) => {
        if (err)
          reject(err);
        resolve(stat);
      });
    }).then((stat) => {
      assertStats(stat, Deno.lstatSync(file));
    }).catch(() => fail()).finally(() => {
      Deno.removeSync(file);
    });
  }
});
Deno.test({
  name: "SYNC: get a file Stats (lstat)",
  fn() {
    const file = Deno.makeTempFileSync();
    assertStats(lstatSync(file), Deno.lstatSync(file));
  }
});
Deno.test({
  name: "ASYNC: get a file BigInt Stats (lstat)",
  async fn() {
    const file = Deno.makeTempFileSync();
    await new Promise((resolve, reject) => {
      lstat(file, {bigint: true}, (err, stat) => {
        if (err)
          reject(err);
        resolve(stat);
      });
    }).then((stat) => assertStatsBigInt(stat, Deno.lstatSync(file))).catch(() => fail()).finally(() => Deno.removeSync(file));
  }
});
Deno.test({
  name: "SYNC: BigInt Stats (lstat)",
  fn() {
    const file = Deno.makeTempFileSync();
    assertStatsBigInt(lstatSync(file, {bigint: true}), Deno.lstatSync(file));
  }
});
