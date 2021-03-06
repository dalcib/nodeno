import {walk as walk2, walkSync} from "./walk.mjs";
import {assert, assertEquals, assertThrowsAsync} from "../testing/asserts.mjs";
export function testWalk(setup, t, ignore = false) {
  const name = t.name;
  async function fn() {
    const origCwd = Deno.cwd();
    const d = await Deno.makeTempDir();
    Deno.chdir(d);
    try {
      await setup(d);
      await t();
    } finally {
      Deno.chdir(origCwd);
      await Deno.remove(d, {recursive: true});
    }
  }
  Deno.test({ignore, name: `[walk] ${name}`, fn});
}
function normalize({path}) {
  return path.replace(/\\/g, "/");
}
export async function walkArray(root, options = {}) {
  const arr = [];
  for await (const w of walk2(root, {...options})) {
    arr.push(normalize(w));
  }
  arr.sort();
  const arrSync = Array.from(walkSync(root, options), normalize);
  arrSync.sort();
  assertEquals(arr, arrSync);
  return arr;
}
export async function touch(path) {
  const f = await Deno.create(path);
  f.close();
}
function assertReady(expectedLength) {
  const arr = Array.from(walkSync("."), normalize);
  assertEquals(arr.length, expectedLength);
}
testWalk(async (d) => {
  await Deno.mkdir(d + "/empty");
}, async function emptyDir() {
  const arr = await walkArray(".");
  assertEquals(arr, [".", "empty"]);
});
testWalk(async (d) => {
  await touch(d + "/x");
}, async function singleFile() {
  const arr = await walkArray(".");
  assertEquals(arr, [".", "x"]);
});
testWalk(async (d) => {
  await touch(d + "/x");
}, async function iteratable() {
  let count = 0;
  for (const _ of walkSync(".")) {
    count += 1;
  }
  assertEquals(count, 2);
  for await (const _ of walk2(".")) {
    count += 1;
  }
  assertEquals(count, 4);
});
testWalk(async (d) => {
  await Deno.mkdir(d + "/a");
  await touch(d + "/a/x");
}, async function nestedSingleFile() {
  const arr = await walkArray(".");
  assertEquals(arr, [".", "a", "a/x"]);
});
testWalk(async (d) => {
  await Deno.mkdir(d + "/a/b/c/d", {recursive: true});
  await touch(d + "/a/b/c/d/x");
}, async function depth() {
  assertReady(6);
  const arr3 = await walkArray(".", {maxDepth: 3});
  assertEquals(arr3, [".", "a", "a/b", "a/b/c"]);
  const arr5 = await walkArray(".", {maxDepth: 5});
  assertEquals(arr5, [".", "a", "a/b", "a/b/c", "a/b/c/d", "a/b/c/d/x"]);
});
testWalk(async (d) => {
  await touch(d + "/a");
  await Deno.mkdir(d + "/b");
  await touch(d + "/b/c");
}, async function includeDirs() {
  assertReady(4);
  const arr = await walkArray(".", {includeDirs: false});
  assertEquals(arr, ["a", "b/c"]);
});
testWalk(async (d) => {
  await touch(d + "/a");
  await Deno.mkdir(d + "/b");
  await touch(d + "/b/c");
}, async function includeFiles() {
  assertReady(4);
  const arr = await walkArray(".", {includeFiles: false});
  assertEquals(arr, [".", "b"]);
});
testWalk(async (d) => {
  await touch(d + "/x.ts");
  await touch(d + "/y.rs");
}, async function ext() {
  assertReady(3);
  const arr = await walkArray(".", {exts: [".ts"]});
  assertEquals(arr, ["x.ts"]);
});
testWalk(async (d) => {
  await touch(d + "/x.ts");
  await touch(d + "/y.rs");
  await touch(d + "/z.py");
}, async function extAny() {
  assertReady(4);
  const arr = await walkArray(".", {exts: [".rs", ".ts"]});
  assertEquals(arr, ["x.ts", "y.rs"]);
});
testWalk(async (d) => {
  await touch(d + "/x");
  await touch(d + "/y");
}, async function match() {
  assertReady(3);
  const arr = await walkArray(".", {match: [/x/]});
  assertEquals(arr, ["x"]);
});
testWalk(async (d) => {
  await touch(d + "/x");
  await touch(d + "/y");
  await touch(d + "/z");
}, async function matchAny() {
  assertReady(4);
  const arr = await walkArray(".", {match: [/x/, /y/]});
  assertEquals(arr, ["x", "y"]);
});
testWalk(async (d) => {
  await touch(d + "/x");
  await touch(d + "/y");
}, async function skip() {
  assertReady(3);
  const arr = await walkArray(".", {skip: [/x/]});
  assertEquals(arr, [".", "y"]);
});
testWalk(async (d) => {
  await touch(d + "/x");
  await touch(d + "/y");
  await touch(d + "/z");
}, async function skipAny() {
  assertReady(4);
  const arr = await walkArray(".", {skip: [/x/, /y/]});
  assertEquals(arr, [".", "z"]);
});
testWalk(async (d) => {
  await Deno.mkdir(d + "/a");
  await Deno.mkdir(d + "/b");
  await touch(d + "/a/x");
  await touch(d + "/a/y");
  await touch(d + "/b/z");
}, async function subDir() {
  assertReady(6);
  const arr = await walkArray("b");
  assertEquals(arr, ["b", "b/z"]);
});
testWalk(async (_d) => {
}, async function nonexistentRoot() {
  await assertThrowsAsync(async () => {
    await walkArray("nonexistent");
  }, Deno.errors.NotFound);
});
testWalk(async (d) => {
  await Deno.mkdir(d + "/a");
  await Deno.mkdir(d + "/b");
  await touch(d + "/a/x");
  await touch(d + "/a/y");
  await touch(d + "/b/z");
  await Deno.symlink(d + "/b", d + "/a/bb");
}, async function symlink() {
  assertReady(6);
  const files = await walkArray("a");
  assertEquals(files.length, 2);
  assert(!files.includes("a/bb/z"));
  const arr = await walkArray("a", {followSymlinks: true});
  assertEquals(arr.length, 3);
  assert(arr.some((f) => f.endsWith("/b/z")));
}, true);
