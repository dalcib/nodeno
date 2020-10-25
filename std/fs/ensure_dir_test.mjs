import {assertThrows, assertThrowsAsync} from "../testing/asserts.mjs";
import * as path from "../path/mod.mjs";
import {ensureDir, ensureDirSync} from "./ensure_dir.mjs";
import {ensureFile, ensureFileSync} from "./ensure_file.mjs";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
Deno.test("ensureDirIfItNotExist", async function() {
  const baseDir = path.join(testdataDir, "ensure_dir_not_exist");
  const testDir = path.join(baseDir, "test");
  await ensureDir(testDir);
  await assertThrowsAsync(async () => {
    await Deno.stat(testDir).then(() => {
      throw new Error("test dir should exists.");
    });
  });
  await Deno.remove(baseDir, {recursive: true});
});
Deno.test("ensureDirSyncIfItNotExist", function() {
  const baseDir = path.join(testdataDir, "ensure_dir_sync_not_exist");
  const testDir = path.join(baseDir, "test");
  ensureDirSync(testDir);
  Deno.statSync(testDir);
  Deno.removeSync(baseDir, {recursive: true});
});
Deno.test("ensureDirIfItExist", async function() {
  const baseDir = path.join(testdataDir, "ensure_dir_exist");
  const testDir = path.join(baseDir, "test");
  await Deno.mkdir(testDir, {recursive: true});
  await ensureDir(testDir);
  await assertThrowsAsync(async () => {
    await Deno.stat(testDir).then(() => {
      throw new Error("test dir should still exists.");
    });
  });
  await Deno.remove(baseDir, {recursive: true});
});
Deno.test("ensureDirSyncIfItExist", function() {
  const baseDir = path.join(testdataDir, "ensure_dir_sync_exist");
  const testDir = path.join(baseDir, "test");
  Deno.mkdirSync(testDir, {recursive: true});
  ensureDirSync(testDir);
  assertThrows(() => {
    Deno.statSync(testDir);
    throw new Error("test dir should still exists.");
  });
  Deno.removeSync(baseDir, {recursive: true});
});
Deno.test("ensureDirIfItAsFile", async function() {
  const baseDir = path.join(testdataDir, "ensure_dir_exist_file");
  const testFile = path.join(baseDir, "test");
  await ensureFile(testFile);
  await assertThrowsAsync(async () => {
    await ensureDir(testFile);
  }, Error, `Ensure path exists, expected 'dir', got 'file'`);
  await Deno.remove(baseDir, {recursive: true});
});
Deno.test("ensureDirSyncIfItAsFile", function() {
  const baseDir = path.join(testdataDir, "ensure_dir_exist_file_async");
  const testFile = path.join(baseDir, "test");
  ensureFileSync(testFile);
  assertThrows(() => {
    ensureDirSync(testFile);
  }, Error, `Ensure path exists, expected 'dir', got 'file'`);
  Deno.removeSync(baseDir, {recursive: true});
});
