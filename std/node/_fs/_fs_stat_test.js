import {stat, statSync} from "./_fs_stat.js";
import {assertEquals, fail} from "../../testing/asserts.js";
export function assertStats(actual, expected) {
  assertEquals(actual.dev, expected.dev);
  assertEquals(actual.gid, expected.gid);
  assertEquals(actual.size, expected.size);
  assertEquals(actual.blksize, expected.blksize);
  assertEquals(actual.blocks, expected.blocks);
  assertEquals(actual.ino, expected.ino);
  assertEquals(actual.gid, expected.gid);
  assertEquals(actual.mode, expected.mode);
  assertEquals(actual.nlink, expected.nlink);
  assertEquals(actual.rdev, expected.rdev);
  assertEquals(actual.uid, expected.uid);
  assertEquals(actual.atime?.getTime(), expected.atime?.getTime());
  assertEquals(actual.mtime?.getTime(), expected.mtime?.getTime());
  assertEquals(actual.birthtime?.getTime(), expected.birthtime?.getTime());
  assertEquals(actual.atimeMs, expected.atime?.getTime());
  assertEquals(actual.mtimeMs, expected.mtime?.getTime());
  assertEquals(actual.birthtimeMs, expected.birthtime?.getTime());
  assertEquals(actual.isFile(), expected.isFile);
  assertEquals(actual.isDirectory(), expected.isDirectory);
  assertEquals(actual.isSymbolicLink(), expected.isSymlink);
}
export function assertStatsBigInt(actual, expected) {
  assertEquals(actual.dev, BigInt(expected.dev));
  assertEquals(actual.gid, BigInt(expected.gid));
  assertEquals(actual.size, BigInt(expected.size));
  assertEquals(actual.blksize, BigInt(expected.blksize));
  assertEquals(actual.blocks, BigInt(expected.blocks));
  assertEquals(actual.ino, BigInt(expected.ino));
  assertEquals(actual.gid, BigInt(expected.gid));
  assertEquals(actual.mode, BigInt(expected.mode));
  assertEquals(actual.nlink, BigInt(expected.nlink));
  assertEquals(actual.rdev, BigInt(expected.rdev));
  assertEquals(actual.uid, BigInt(expected.uid));
  assertEquals(actual.atime?.getTime(), expected.atime?.getTime());
  assertEquals(actual.mtime?.getTime(), expected.mtime?.getTime());
  assertEquals(actual.birthtime?.getTime(), expected.birthtime?.getTime());
  assertEquals(Number(actual.atimeMs), expected.atime?.getTime());
  assertEquals(Number(actual.mtimeMs), expected.mtime?.getTime());
  assertEquals(Number(actual.birthtimeMs), expected.birthtime?.getTime());
  assertEquals(Number(actual.atimeNs) / 1e6, expected.atime?.getTime());
  assertEquals(Number(actual.mtimeNs) / 1e6, expected.atime?.getTime());
  assertEquals(Number(actual.birthtimeNs) / 1e6, expected.atime?.getTime());
  assertEquals(actual.isFile(), expected.isFile);
  assertEquals(actual.isDirectory(), expected.isDirectory);
  assertEquals(actual.isSymbolicLink(), expected.isSymlink);
}
Deno.test({
  name: "ASYNC: get a file Stats",
  async fn() {
    const file = Deno.makeTempFileSync();
    await new Promise((resolve, reject) => {
      stat(file, (err, stat2) => {
        if (err)
          reject(err);
        resolve(stat2);
      });
    }).then((stat2) => assertStats(stat2, Deno.statSync(file))).catch(() => fail()).finally(() => Deno.removeSync(file));
  }
});
Deno.test({
  name: "SYNC: get a file Stats",
  fn() {
    const file = Deno.makeTempFileSync();
    assertStats(statSync(file), Deno.statSync(file));
  }
});
Deno.test({
  name: "ASYNC: get a file BigInt Stats",
  async fn() {
    const file = Deno.makeTempFileSync();
    await new Promise((resolve, reject) => {
      stat(file, {bigint: true}, (err, stat2) => {
        if (err)
          reject(err);
        resolve(stat2);
      });
    }).then((stat2) => assertStatsBigInt(stat2, Deno.statSync(file))).catch(() => fail()).finally(() => Deno.removeSync(file));
  }
});
Deno.test({
  name: "SYNC: get a file BigInt Stats",
  fn() {
    const file = Deno.makeTempFileSync();
    assertStatsBigInt(statSync(file, {bigint: true}), Deno.statSync(file));
  }
});
