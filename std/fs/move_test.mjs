import {
  assertEquals,
  assertThrows,
  assertThrowsAsync
} from "../testing/asserts.mjs";
import * as path from "../path/mod.mjs";
import {move as move2, moveSync} from "./move.mjs";
import {ensureFile, ensureFileSync} from "./ensure_file.mjs";
import {ensureDir, ensureDirSync} from "./ensure_dir.mjs";
import {exists as exists2, existsSync} from "./exists.mjs";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
Deno.test("moveDirectoryIfSrcNotExists", async function() {
  const srcDir = path.join(testdataDir, "move_test_src_1");
  const destDir = path.join(testdataDir, "move_test_dest_1");
  await assertThrowsAsync(async () => {
    await move2(srcDir, destDir);
  });
});
Deno.test("moveDirectoryIfDestNotExists", async function() {
  const srcDir = path.join(testdataDir, "move_test_src_2");
  const destDir = path.join(testdataDir, "move_test_dest_2");
  await Deno.mkdir(srcDir, {recursive: true});
  await assertThrowsAsync(async () => {
    await move2(srcDir, destDir);
    throw new Error("should not throw error");
  }, Error, "should not throw error");
  await Deno.remove(destDir);
});
Deno.test("moveDirectoryIfDestNotExistsAndOverwrite", async function() {
  const srcDir = path.join(testdataDir, "move_test_src_2");
  const destDir = path.join(testdataDir, "move_test_dest_2");
  await Deno.mkdir(srcDir, {recursive: true});
  await assertThrowsAsync(async () => {
    await move2(srcDir, destDir, {overwrite: true});
    throw new Error("should not throw error");
  }, Error, "should not throw error");
  await Deno.remove(destDir);
});
Deno.test("moveFileIfSrcNotExists", async function() {
  const srcFile = path.join(testdataDir, "move_test_src_3", "test.txt");
  const destFile = path.join(testdataDir, "move_test_dest_3", "test.txt");
  await assertThrowsAsync(async () => {
    await move2(srcFile, destFile);
  });
});
Deno.test("moveFileIfDestExists", async function() {
  const srcDir = path.join(testdataDir, "move_test_src_4");
  const destDir = path.join(testdataDir, "move_test_dest_4");
  const srcFile = path.join(srcDir, "test.txt");
  const destFile = path.join(destDir, "test.txt");
  const srcContent = new TextEncoder().encode("src");
  const destContent = new TextEncoder().encode("dest");
  await Promise.all([ensureFile(srcFile), ensureFile(destFile)]);
  await Promise.all([
    Deno.writeFile(srcFile, srcContent),
    Deno.writeFile(destFile, destContent)
  ]);
  assertEquals(new TextDecoder().decode(await Deno.readFile(srcFile)), "src");
  assertEquals(new TextDecoder().decode(await Deno.readFile(destFile)), "dest");
  await assertThrowsAsync(async () => {
    await move2(srcFile, destFile);
  }, Error, "dest already exists");
  await assertThrowsAsync(async () => {
    await move2(srcFile, destFile, {overwrite: true});
    throw new Error("should not throw error");
  }, Error, "should not throw error");
  assertEquals(await exists2(srcFile), false);
  assertEquals(new TextDecoder().decode(await Deno.readFile(destFile)), "src");
  await Promise.all([
    Deno.remove(srcDir, {recursive: true}),
    Deno.remove(destDir, {recursive: true})
  ]);
});
Deno.test("moveDirectory", async function() {
  const srcDir = path.join(testdataDir, "move_test_src_5");
  const destDir = path.join(testdataDir, "move_test_dest_5");
  const srcFile = path.join(srcDir, "test.txt");
  const destFile = path.join(destDir, "test.txt");
  const srcContent = new TextEncoder().encode("src");
  await Deno.mkdir(srcDir, {recursive: true});
  assertEquals(await exists2(srcDir), true);
  await Deno.writeFile(srcFile, srcContent);
  await move2(srcDir, destDir);
  assertEquals(await exists2(srcDir), false);
  assertEquals(await exists2(destDir), true);
  assertEquals(await exists2(destFile), true);
  const destFileContent = new TextDecoder().decode(await Deno.readFile(destFile));
  assertEquals(destFileContent, "src");
  await Deno.remove(destDir, {recursive: true});
});
Deno.test("moveIfSrcAndDestDirectoryExistsAndOverwrite", async function() {
  const srcDir = path.join(testdataDir, "move_test_src_6");
  const destDir = path.join(testdataDir, "move_test_dest_6");
  const srcFile = path.join(srcDir, "test.txt");
  const destFile = path.join(destDir, "test.txt");
  const srcContent = new TextEncoder().encode("src");
  const destContent = new TextEncoder().encode("dest");
  await Promise.all([
    Deno.mkdir(srcDir, {recursive: true}),
    Deno.mkdir(destDir, {recursive: true})
  ]);
  assertEquals(await exists2(srcDir), true);
  assertEquals(await exists2(destDir), true);
  await Promise.all([
    Deno.writeFile(srcFile, srcContent),
    Deno.writeFile(destFile, destContent)
  ]);
  await move2(srcDir, destDir, {overwrite: true});
  assertEquals(await exists2(srcDir), false);
  assertEquals(await exists2(destDir), true);
  assertEquals(await exists2(destFile), true);
  const destFileContent = new TextDecoder().decode(await Deno.readFile(destFile));
  assertEquals(destFileContent, "src");
  await Deno.remove(destDir, {recursive: true});
});
Deno.test("moveIntoSubDir", async function() {
  const srcDir = path.join(testdataDir, "move_test_src_7");
  const destDir = path.join(srcDir, "nest");
  await ensureDir(destDir);
  await assertThrowsAsync(async () => {
    await move2(srcDir, destDir);
  }, Error, `Cannot move '${srcDir}' to a subdirectory of itself, '${destDir}'.`);
  await Deno.remove(srcDir, {recursive: true});
});
Deno.test("moveSyncDirectoryIfSrcNotExists", function() {
  const srcDir = path.join(testdataDir, "move_sync_test_src_1");
  const destDir = path.join(testdataDir, "move_sync_test_dest_1");
  assertThrows(() => {
    moveSync(srcDir, destDir);
  });
});
Deno.test("moveSyncDirectoryIfDestNotExists", function() {
  const srcDir = path.join(testdataDir, "move_sync_test_src_2");
  const destDir = path.join(testdataDir, "move_sync_test_dest_2");
  Deno.mkdirSync(srcDir, {recursive: true});
  assertThrows(() => {
    moveSync(srcDir, destDir);
    throw new Error("should not throw error");
  }, Error, "should not throw error");
  Deno.removeSync(destDir);
});
Deno.test("moveSyncDirectoryIfDestNotExistsAndOverwrite", function() {
  const srcDir = path.join(testdataDir, "move_sync_test_src_2");
  const destDir = path.join(testdataDir, "move_sync_test_dest_2");
  Deno.mkdirSync(srcDir, {recursive: true});
  assertThrows(() => {
    moveSync(srcDir, destDir, {overwrite: true});
    throw new Error("should not throw error");
  }, Error, "should not throw error");
  Deno.removeSync(destDir);
});
Deno.test("moveSyncFileIfSrcNotExists", function() {
  const srcFile = path.join(testdataDir, "move_sync_test_src_3", "test.txt");
  const destFile = path.join(testdataDir, "move_sync_test_dest_3", "test.txt");
  assertThrows(() => {
    moveSync(srcFile, destFile);
  });
});
Deno.test("moveSyncFileIfDestExists", function() {
  const srcDir = path.join(testdataDir, "move_sync_test_src_4");
  const destDir = path.join(testdataDir, "move_sync_test_dest_4");
  const srcFile = path.join(srcDir, "test.txt");
  const destFile = path.join(destDir, "test.txt");
  const srcContent = new TextEncoder().encode("src");
  const destContent = new TextEncoder().encode("dest");
  ensureFileSync(srcFile);
  ensureFileSync(destFile);
  Deno.writeFileSync(srcFile, srcContent);
  Deno.writeFileSync(destFile, destContent);
  assertEquals(new TextDecoder().decode(Deno.readFileSync(srcFile)), "src");
  assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "dest");
  assertThrows(() => {
    moveSync(srcFile, destFile);
  }, Error, "dest already exists");
  assertThrows(() => {
    moveSync(srcFile, destFile, {overwrite: true});
    throw new Error("should not throw error");
  }, Error, "should not throw error");
  assertEquals(existsSync(srcFile), false);
  assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "src");
  Deno.removeSync(srcDir, {recursive: true});
  Deno.removeSync(destDir, {recursive: true});
});
Deno.test("moveSyncDirectory", function() {
  const srcDir = path.join(testdataDir, "move_sync_test_src_5");
  const destDir = path.join(testdataDir, "move_sync_test_dest_5");
  const srcFile = path.join(srcDir, "test.txt");
  const destFile = path.join(destDir, "test.txt");
  const srcContent = new TextEncoder().encode("src");
  Deno.mkdirSync(srcDir, {recursive: true});
  assertEquals(existsSync(srcDir), true);
  Deno.writeFileSync(srcFile, srcContent);
  moveSync(srcDir, destDir);
  assertEquals(existsSync(srcDir), false);
  assertEquals(existsSync(destDir), true);
  assertEquals(existsSync(destFile), true);
  const destFileContent = new TextDecoder().decode(Deno.readFileSync(destFile));
  assertEquals(destFileContent, "src");
  Deno.removeSync(destDir, {recursive: true});
});
Deno.test("moveSyncIfSrcAndDestDirectoryExistsAndOverwrite", function() {
  const srcDir = path.join(testdataDir, "move_sync_test_src_6");
  const destDir = path.join(testdataDir, "move_sync_test_dest_6");
  const srcFile = path.join(srcDir, "test.txt");
  const destFile = path.join(destDir, "test.txt");
  const srcContent = new TextEncoder().encode("src");
  const destContent = new TextEncoder().encode("dest");
  Deno.mkdirSync(srcDir, {recursive: true});
  Deno.mkdirSync(destDir, {recursive: true});
  assertEquals(existsSync(srcDir), true);
  assertEquals(existsSync(destDir), true);
  Deno.writeFileSync(srcFile, srcContent);
  Deno.writeFileSync(destFile, destContent);
  moveSync(srcDir, destDir, {overwrite: true});
  assertEquals(existsSync(srcDir), false);
  assertEquals(existsSync(destDir), true);
  assertEquals(existsSync(destFile), true);
  const destFileContent = new TextDecoder().decode(Deno.readFileSync(destFile));
  assertEquals(destFileContent, "src");
  Deno.removeSync(destDir, {recursive: true});
});
Deno.test("moveSyncIntoSubDir", function() {
  const srcDir = path.join(testdataDir, "move_sync_test_src_7");
  const destDir = path.join(srcDir, "nest");
  ensureDirSync(destDir);
  assertThrows(() => {
    moveSync(srcDir, destDir);
  }, Error, `Cannot move '${srcDir}' to a subdirectory of itself, '${destDir}'.`);
  Deno.removeSync(srcDir, {recursive: true});
});
