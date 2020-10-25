import {assertEquals, assertStringContains} from "../testing/asserts.js";
import * as path from "../path/mod.js";
import {exists as exists2, existsSync} from "./exists.js";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
Deno.test("[fs] existsFile", async function() {
  assertEquals(await exists2(path.join(testdataDir, "not_exist_file.ts")), false);
  assertEquals(await existsSync(path.join(testdataDir, "0.ts")), true);
});
Deno.test("[fs] existsFileSync", function() {
  assertEquals(existsSync(path.join(testdataDir, "not_exist_file.ts")), false);
  assertEquals(existsSync(path.join(testdataDir, "0.ts")), true);
});
Deno.test("[fs] existsDirectory", async function() {
  assertEquals(await exists2(path.join(testdataDir, "not_exist_directory")), false);
  assertEquals(existsSync(testdataDir), true);
});
Deno.test("[fs] existsDirectorySync", function() {
  assertEquals(existsSync(path.join(testdataDir, "not_exist_directory")), false);
  assertEquals(existsSync(testdataDir), true);
});
Deno.test("[fs] existsLinkSync", function() {
  assertEquals(existsSync(path.join(testdataDir, "0-link")), true);
});
Deno.test("[fs] existsLink", async function() {
  assertEquals(await exists2(path.join(testdataDir, "0-link")), true);
});
const scenes = [
  {
    read: false,
    async: true,
    output: "run again with the --allow-read flag",
    file: "0.ts"
  },
  {
    read: false,
    async: false,
    output: "run again with the --allow-read flag",
    file: "0.ts"
  },
  {
    read: true,
    async: true,
    output: "exist",
    file: "0.ts"
  },
  {
    read: true,
    async: false,
    output: "exist",
    file: "0.ts"
  },
  {
    read: false,
    async: true,
    output: "run again with the --allow-read flag",
    file: "no_exist_file_for_test.ts"
  },
  {
    read: false,
    async: false,
    output: "run again with the --allow-read flag",
    file: "no_exist_file_for_test.ts"
  },
  {
    read: true,
    async: true,
    output: "not exist",
    file: "no_exist_file_for_test.ts"
  },
  {
    read: true,
    async: false,
    output: "not exist",
    file: "no_exist_file_for_test.ts"
  }
];
for (const s of scenes) {
  let title = `test ${s.async ? "exists" : "existsSync"}("testdata/${s.file}")`;
  title += ` ${s.read ? "with" : "without"} --allow-read`;
  Deno.test(`[fs] existsPermission ${title}`, async function() {
    const args = [Deno.execPath(), "run"];
    if (s.read) {
      args.push("--allow-read");
    }
    args.push(path.join(testdataDir, s.async ? "exists.ts" : "exists_sync.ts"));
    args.push(s.file);
    const p = Deno.run({
      stdout: "piped",
      cwd: testdataDir,
      cmd: args
    });
    const output = await p.output();
    p.close();
    assertStringContains(new TextDecoder().decode(output), s.output);
  });
}
