import {
  assertEquals,
  assertThrows,
  assertThrowsAsync
} from "../testing/asserts.js";
import * as path from "../path/mod.js";
import {ensureLink, ensureLinkSync} from "./ensure_link.js";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
Deno.test("ensureLinkIfItNotExist", async function() {
  const srcDir = path.join(testdataDir, "ensure_link_1");
  const destDir = path.join(testdataDir, "ensure_link_1_2");
  const testFile = path.join(srcDir, "test.txt");
  const linkFile = path.join(destDir, "link.txt");
  await assertThrowsAsync(async () => {
    await ensureLink(testFile, linkFile);
  });
  await Deno.remove(destDir, {recursive: true});
});
Deno.test("ensureLinkSyncIfItNotExist", function() {
  const testDir = path.join(testdataDir, "ensure_link_2");
  const testFile = path.join(testDir, "test.txt");
  const linkFile = path.join(testDir, "link.txt");
  assertThrows(() => {
    ensureLinkSync(testFile, linkFile);
  });
  Deno.removeSync(testDir, {recursive: true});
});
Deno.test("ensureLinkIfItExist", async function() {
  const testDir = path.join(testdataDir, "ensure_link_3");
  const testFile = path.join(testDir, "test.txt");
  const linkFile = path.join(testDir, "link.txt");
  await Deno.mkdir(testDir, {recursive: true});
  await Deno.writeFile(testFile, new Uint8Array());
  await ensureLink(testFile, linkFile);
  const srcStat = await Deno.lstat(testFile);
  const linkStat = await Deno.lstat(linkFile);
  assertEquals(srcStat.isFile, true);
  assertEquals(linkStat.isFile, true);
  await Deno.writeFile(testFile, new TextEncoder().encode("123"));
  const testFileContent1 = new TextDecoder().decode(await Deno.readFile(testFile));
  const linkFileContent1 = new TextDecoder().decode(await Deno.readFile(testFile));
  assertEquals(testFileContent1, "123");
  assertEquals(testFileContent1, linkFileContent1);
  await Deno.writeFile(testFile, new TextEncoder().encode("abc"));
  const testFileContent2 = new TextDecoder().decode(await Deno.readFile(testFile));
  const linkFileContent2 = new TextDecoder().decode(await Deno.readFile(testFile));
  assertEquals(testFileContent2, "abc");
  assertEquals(testFileContent2, linkFileContent2);
  await Deno.remove(testDir, {recursive: true});
});
Deno.test("ensureLinkSyncIfItExist", function() {
  const testDir = path.join(testdataDir, "ensure_link_4");
  const testFile = path.join(testDir, "test.txt");
  const linkFile = path.join(testDir, "link.txt");
  Deno.mkdirSync(testDir, {recursive: true});
  Deno.writeFileSync(testFile, new Uint8Array());
  ensureLinkSync(testFile, linkFile);
  const srcStat = Deno.lstatSync(testFile);
  const linkStat = Deno.lstatSync(linkFile);
  assertEquals(srcStat.isFile, true);
  assertEquals(linkStat.isFile, true);
  Deno.writeFileSync(testFile, new TextEncoder().encode("123"));
  const testFileContent1 = new TextDecoder().decode(Deno.readFileSync(testFile));
  const linkFileContent1 = new TextDecoder().decode(Deno.readFileSync(testFile));
  assertEquals(testFileContent1, "123");
  assertEquals(testFileContent1, linkFileContent1);
  Deno.writeFileSync(testFile, new TextEncoder().encode("abc"));
  const testFileContent2 = new TextDecoder().decode(Deno.readFileSync(testFile));
  const linkFileContent2 = new TextDecoder().decode(Deno.readFileSync(testFile));
  assertEquals(testFileContent2, "abc");
  assertEquals(testFileContent2, linkFileContent2);
  Deno.removeSync(testDir, {recursive: true});
});
Deno.test("ensureLinkDirectoryIfItExist", async function() {
  const testDir = path.join(testdataDir, "ensure_link_origin_3");
  const linkDir = path.join(testdataDir, "ensure_link_link_3");
  const testFile = path.join(testDir, "test.txt");
  await Deno.mkdir(testDir, {recursive: true});
  await Deno.writeFile(testFile, new Uint8Array());
  await assertThrowsAsync(async () => {
    await ensureLink(testDir, linkDir);
  });
  Deno.removeSync(testDir, {recursive: true});
});
Deno.test("ensureLinkSyncDirectoryIfItExist", function() {
  const testDir = path.join(testdataDir, "ensure_link_origin_3");
  const linkDir = path.join(testdataDir, "ensure_link_link_3");
  const testFile = path.join(testDir, "test.txt");
  Deno.mkdirSync(testDir, {recursive: true});
  Deno.writeFileSync(testFile, new Uint8Array());
  assertThrows(() => {
    ensureLinkSync(testDir, linkDir);
  });
  Deno.removeSync(testDir, {recursive: true});
});
