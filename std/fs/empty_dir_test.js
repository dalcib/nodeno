import {
  assert,
  assertEquals,
  assertStringContains,
  assertThrows,
  assertThrowsAsync
} from "../testing/asserts.js";
import * as path from "../path/mod.js";
import {emptyDir, emptyDirSync} from "./empty_dir.js";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
Deno.test("emptyDirIfItNotExist", async function() {
  const testDir = path.join(testdataDir, "empty_dir_test_1");
  const testNestDir = path.join(testDir, "nest");
  await emptyDir(testNestDir);
  try {
    const stat = await Deno.stat(testNestDir);
    assertEquals(stat.isDirectory, true);
  } finally {
    await Deno.remove(testDir, {recursive: true});
  }
});
Deno.test("emptyDirSyncIfItNotExist", function() {
  const testDir = path.join(testdataDir, "empty_dir_test_2");
  const testNestDir = path.join(testDir, "nest");
  emptyDirSync(testNestDir);
  try {
    const stat = Deno.statSync(testNestDir);
    assertEquals(stat.isDirectory, true);
  } finally {
    Deno.removeSync(testDir, {recursive: true});
  }
});
Deno.test("emptyDirIfItExist", async function() {
  const testDir = path.join(testdataDir, "empty_dir_test_3");
  const testNestDir = path.join(testDir, "nest");
  await emptyDir(testNestDir);
  const testDirFile = path.join(testNestDir, "test.ts");
  await Deno.writeFile(testDirFile, new Uint8Array());
  const beforeFileStat = await Deno.stat(testDirFile);
  assertEquals(beforeFileStat.isFile, true);
  const beforeDirStat = await Deno.stat(testNestDir);
  assertEquals(beforeDirStat.isDirectory, true);
  await emptyDir(testDir);
  try {
    const stat = await Deno.stat(testDir);
    assertEquals(stat.isDirectory, true);
    await assertThrowsAsync(async () => {
      await Deno.stat(testNestDir);
    });
    await assertThrowsAsync(async () => {
      await Deno.stat(testDirFile);
    });
  } finally {
    await Deno.remove(testDir, {recursive: true});
  }
});
Deno.test("emptyDirSyncIfItExist", function() {
  const testDir = path.join(testdataDir, "empty_dir_test_4");
  const testNestDir = path.join(testDir, "nest");
  emptyDirSync(testNestDir);
  const testDirFile = path.join(testNestDir, "test.ts");
  Deno.writeFileSync(testDirFile, new Uint8Array());
  const beforeFileStat = Deno.statSync(testDirFile);
  assertEquals(beforeFileStat.isFile, true);
  const beforeDirStat = Deno.statSync(testNestDir);
  assertEquals(beforeDirStat.isDirectory, true);
  emptyDirSync(testDir);
  try {
    const stat = Deno.statSync(testDir);
    assertEquals(stat.isDirectory, true);
    assertThrows(() => {
      Deno.statSync(testNestDir);
    });
    assertThrows(() => {
      Deno.statSync(testDirFile);
    });
  } finally {
    Deno.removeSync(testDir, {recursive: true});
  }
});
const scenes = [
  {
    read: false,
    write: false,
    async: true,
    output: "run again with the --allow-read flag"
  },
  {
    read: false,
    write: false,
    async: false,
    output: "run again with the --allow-read flag"
  },
  {
    read: true,
    write: false,
    async: true,
    output: "run again with the --allow-write flag"
  },
  {
    read: true,
    write: false,
    async: false,
    output: "run again with the --allow-write flag"
  },
  {
    read: false,
    write: true,
    async: true,
    output: "run again with the --allow-read flag"
  },
  {
    read: false,
    write: true,
    async: false,
    output: "run again with the --allow-read flag"
  },
  {
    read: true,
    write: true,
    async: true,
    output: "success"
  },
  {
    read: true,
    write: true,
    async: false,
    output: "success"
  }
];
for (const s of scenes) {
  let title = `test ${s.async ? "emptyDir" : "emptyDirSync"}`;
  title += `("testdata/testfolder") ${s.read ? "with" : "without"}`;
  title += ` --allow-read & ${s.write ? "with" : "without"} --allow-write`;
  Deno.test(`[fs] emptyDirPermission ${title}`, async function() {
    const testfolder = path.join(testdataDir, "testfolder");
    try {
      await Deno.mkdir(testfolder);
      await Deno.writeFile(path.join(testfolder, "child.txt"), new TextEncoder().encode("hello world"));
      try {
        const args = [Deno.execPath(), "run"];
        if (s.read) {
          args.push("--allow-read");
        }
        if (s.write) {
          args.push("--allow-write");
        }
        args.push(path.join(testdataDir, s.async ? "empty_dir.ts" : "empty_dir_sync.ts"));
        args.push("testfolder");
        const p = Deno.run({
          stdout: "piped",
          cwd: testdataDir,
          cmd: args
        });
        assert(p.stdout);
        const output = await p.output();
        p.close();
        assertStringContains(new TextDecoder().decode(output), s.output);
      } catch (err) {
        await Deno.remove(testfolder, {recursive: true});
        throw err;
      }
    } finally {
      await Deno.remove(testfolder, {recursive: true});
    }
  });
}
