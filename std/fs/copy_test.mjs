import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync
} from "../testing/asserts.mjs";
import * as path from "../path/mod.mjs";
import {copy as copy2, copySync} from "./copy.mjs";
import {exists as exists2, existsSync} from "./exists.mjs";
import {ensureDir, ensureDirSync} from "./ensure_dir.mjs";
import {ensureFile, ensureFileSync} from "./ensure_file.mjs";
import {ensureSymlink, ensureSymlinkSync} from "./ensure_symlink.mjs";
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
const testdataDir = path.resolve(moduleDir, "testdata");
function testCopy(name, cb, ignore = false) {
  Deno.test({
    name,
    async fn() {
      const tempDir = await Deno.makeTempDir({
        prefix: "deno_std_copy_async_test_"
      });
      await cb(tempDir);
      await Deno.remove(tempDir, {recursive: true});
    },
    ignore
  });
}
function testCopySync(name, cb) {
  Deno.test({
    name,
    fn: () => {
      const tempDir = Deno.makeTempDirSync({
        prefix: "deno_std_copy_sync_test_"
      });
      cb(tempDir);
      Deno.removeSync(tempDir, {recursive: true});
    }
  });
}
testCopy("[fs] copy file if it does no exist", async (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file_not_exists.txt");
  const destFile = path.join(tempDir, "copy_file_not_exists_1.txt");
  await assertThrowsAsync(async () => {
    await copy2(srcFile, destFile);
  });
});
testCopy("[fs] copy if src and dest are the same paths", async (tempDir) => {
  const srcFile = path.join(tempDir, "copy_file_same.txt");
  const destFile = path.join(tempDir, "copy_file_same.txt");
  await assertThrowsAsync(async () => {
    await copy2(srcFile, destFile);
  }, Error, "Source and destination cannot be the same.");
});
testCopy("[fs] copy file", async (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file.txt");
  const destFile = path.join(tempDir, "copy_file_copy.txt");
  const srcContent = new TextDecoder().decode(await Deno.readFile(srcFile));
  assertEquals(await exists2(srcFile), true, `source should exist before copy`);
  assertEquals(await exists2(destFile), false, "destination should not exist before copy");
  await copy2(srcFile, destFile);
  assertEquals(await exists2(srcFile), true, "source should exist after copy");
  assertEquals(await exists2(destFile), true, "destination should exist before copy");
  const destContent = new TextDecoder().decode(await Deno.readFile(destFile));
  assertEquals(srcContent, destContent, "source and destination should have the same content");
  await assertThrowsAsync(async () => {
    await copy2(srcFile, destFile);
  }, Error, `'${destFile}' already exists.`);
  await Deno.writeFile(destFile, new TextEncoder().encode("txt copy"));
  assertEquals(new TextDecoder().decode(await Deno.readFile(destFile)), "txt copy");
  await copy2(srcFile, destFile, {overwrite: true});
  assertEquals(new TextDecoder().decode(await Deno.readFile(destFile)), "txt");
});
testCopy("[fs] copy with preserve timestamps", async (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file.txt");
  const destFile = path.join(tempDir, "copy_file_copy.txt");
  const srcStatInfo = await Deno.stat(srcFile);
  assert(srcStatInfo.atime instanceof Date);
  assert(srcStatInfo.mtime instanceof Date);
  await copy2(srcFile, destFile, {
    overwrite: true,
    preserveTimestamps: true
  });
  const destStatInfo = await Deno.stat(destFile);
  assert(destStatInfo.atime instanceof Date);
  assert(destStatInfo.mtime instanceof Date);
  assertEquals(destStatInfo.atime, srcStatInfo.atime);
  assertEquals(destStatInfo.mtime, srcStatInfo.mtime);
});
testCopy("[fs] copy directory to its subdirectory", async (tempDir) => {
  const srcDir = path.join(tempDir, "parent");
  const destDir = path.join(srcDir, "child");
  await ensureDir(srcDir);
  await assertThrowsAsync(async () => {
    await copy2(srcDir, destDir);
  }, Error, `Cannot copy '${srcDir}' to a subdirectory of itself, '${destDir}'.`);
});
testCopy("[fs] copy directory and destination exist and not a directory", async (tempDir) => {
  const srcDir = path.join(tempDir, "parent");
  const destDir = path.join(tempDir, "child.txt");
  await ensureDir(srcDir);
  await ensureFile(destDir);
  await assertThrowsAsync(async () => {
    await copy2(srcDir, destDir);
  }, Error, `Cannot overwrite non-directory '${destDir}' with directory '${srcDir}'.`);
});
testCopy("[fs] copy directory", async (tempDir) => {
  const srcDir = path.join(testdataDir, "copy_dir");
  const destDir = path.join(tempDir, "copy_dir");
  const srcFile = path.join(srcDir, "0.txt");
  const destFile = path.join(destDir, "0.txt");
  const srcNestFile = path.join(srcDir, "nest", "0.txt");
  const destNestFile = path.join(destDir, "nest", "0.txt");
  await copy2(srcDir, destDir);
  assertEquals(await exists2(destFile), true);
  assertEquals(await exists2(destNestFile), true);
  assertEquals(new TextDecoder().decode(await Deno.readFile(srcFile)), new TextDecoder().decode(await Deno.readFile(destFile)));
  assertEquals(new TextDecoder().decode(await Deno.readFile(srcNestFile)), new TextDecoder().decode(await Deno.readFile(destNestFile)));
  await assertThrowsAsync(async () => {
    await copy2(srcDir, destDir);
  }, Error, `'${destDir}' already exists.`);
  await Deno.writeFile(destNestFile, new TextEncoder().encode("nest copy"));
  assertEquals(new TextDecoder().decode(await Deno.readFile(destNestFile)), "nest copy");
  await copy2(srcDir, destDir, {overwrite: true});
  assertEquals(new TextDecoder().decode(await Deno.readFile(destNestFile)), "nest");
});
testCopy("[fs] copy symlink file", async (tempDir) => {
  const dir = path.join(testdataDir, "copy_dir_link_file");
  const srcLink = path.join(dir, "0.txt");
  const destLink = path.join(tempDir, "0_copy.txt");
  assert((await Deno.lstat(srcLink)).isSymlink, `'${srcLink}' should be symlink type`);
  await copy2(srcLink, destLink);
  const statInfo = await Deno.lstat(destLink);
  assert(statInfo.isSymlink, `'${destLink}' should be symlink type`);
});
testCopy("[fs] copy symlink directory", async (tempDir) => {
  const srcDir = path.join(testdataDir, "copy_dir");
  const srcLink = path.join(tempDir, "copy_dir_link");
  const destLink = path.join(tempDir, "copy_dir_link_copy");
  await ensureSymlink(srcDir, srcLink);
  assert((await Deno.lstat(srcLink)).isSymlink, `'${srcLink}' should be symlink type`);
  await copy2(srcLink, destLink);
  const statInfo = await Deno.lstat(destLink);
  assert(statInfo.isSymlink);
});
testCopySync("[fs] copy file synchronously if it does not exist", (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file_not_exists_sync.txt");
  const destFile = path.join(tempDir, "copy_file_not_exists_1_sync.txt");
  assertThrows(() => {
    copySync(srcFile, destFile);
  });
});
testCopySync("[fs] copy synchronously with preserve timestamps", (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file.txt");
  const destFile = path.join(tempDir, "copy_file_copy.txt");
  const srcStatInfo = Deno.statSync(srcFile);
  assert(srcStatInfo.atime instanceof Date);
  assert(srcStatInfo.mtime instanceof Date);
  copySync(srcFile, destFile, {
    overwrite: true,
    preserveTimestamps: true
  });
  const destStatInfo = Deno.statSync(destFile);
  assert(destStatInfo.atime instanceof Date);
  assert(destStatInfo.mtime instanceof Date);
});
testCopySync("[fs] copy synchronously if src and dest are the same paths", () => {
  const srcFile = path.join(testdataDir, "copy_file_same_sync.txt");
  assertThrows(() => {
    copySync(srcFile, srcFile);
  }, Error, "Source and destination cannot be the same.");
});
testCopySync("[fs] copy file synchronously", (tempDir) => {
  const srcFile = path.join(testdataDir, "copy_file.txt");
  const destFile = path.join(tempDir, "copy_file_copy_sync.txt");
  const srcContent = new TextDecoder().decode(Deno.readFileSync(srcFile));
  assertEquals(existsSync(srcFile), true);
  assertEquals(existsSync(destFile), false);
  copySync(srcFile, destFile);
  assertEquals(existsSync(srcFile), true);
  assertEquals(existsSync(destFile), true);
  const destContent = new TextDecoder().decode(Deno.readFileSync(destFile));
  assertEquals(srcContent, destContent);
  assertThrows(() => {
    copySync(srcFile, destFile);
  }, Error, `'${destFile}' already exists.`);
  Deno.writeFileSync(destFile, new TextEncoder().encode("txt copy"));
  assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "txt copy");
  copySync(srcFile, destFile, {overwrite: true});
  assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "txt");
});
testCopySync("[fs] copy directory synchronously to its subdirectory", (tempDir) => {
  const srcDir = path.join(tempDir, "parent");
  const destDir = path.join(srcDir, "child");
  ensureDirSync(srcDir);
  assertThrows(() => {
    copySync(srcDir, destDir);
  }, Error, `Cannot copy '${srcDir}' to a subdirectory of itself, '${destDir}'.`);
});
testCopySync("[fs] copy directory synchronously, and destination exist and not a directory", (tempDir) => {
  const srcDir = path.join(tempDir, "parent_sync");
  const destDir = path.join(tempDir, "child.txt");
  ensureDirSync(srcDir);
  ensureFileSync(destDir);
  assertThrows(() => {
    copySync(srcDir, destDir);
  }, Error, `Cannot overwrite non-directory '${destDir}' with directory '${srcDir}'.`);
});
testCopySync("[fs] copy directory synchronously", (tempDir) => {
  const srcDir = path.join(testdataDir, "copy_dir");
  const destDir = path.join(tempDir, "copy_dir_copy_sync");
  const srcFile = path.join(srcDir, "0.txt");
  const destFile = path.join(destDir, "0.txt");
  const srcNestFile = path.join(srcDir, "nest", "0.txt");
  const destNestFile = path.join(destDir, "nest", "0.txt");
  copySync(srcDir, destDir);
  assertEquals(existsSync(destFile), true);
  assertEquals(existsSync(destNestFile), true);
  assertEquals(new TextDecoder().decode(Deno.readFileSync(srcFile)), new TextDecoder().decode(Deno.readFileSync(destFile)));
  assertEquals(new TextDecoder().decode(Deno.readFileSync(srcNestFile)), new TextDecoder().decode(Deno.readFileSync(destNestFile)));
  assertThrows(() => {
    copySync(srcDir, destDir);
  }, Error, `'${destDir}' already exists.`);
  Deno.writeFileSync(destNestFile, new TextEncoder().encode("nest copy"));
  assertEquals(new TextDecoder().decode(Deno.readFileSync(destNestFile)), "nest copy");
  copySync(srcDir, destDir, {overwrite: true});
  assertEquals(new TextDecoder().decode(Deno.readFileSync(destNestFile)), "nest");
});
testCopySync("[fs] copy symlink file synchronously", (tempDir) => {
  const dir = path.join(testdataDir, "copy_dir_link_file");
  const srcLink = path.join(dir, "0.txt");
  const destLink = path.join(tempDir, "0_copy.txt");
  assert(Deno.lstatSync(srcLink).isSymlink, `'${srcLink}' should be symlink type`);
  copySync(srcLink, destLink);
  const statInfo = Deno.lstatSync(destLink);
  assert(statInfo.isSymlink, `'${destLink}' should be symlink type`);
});
testCopySync("[fs] copy symlink directory synchronously", (tempDir) => {
  const originDir = path.join(testdataDir, "copy_dir");
  const srcLink = path.join(tempDir, "copy_dir_link");
  const destLink = path.join(tempDir, "copy_dir_link_copy");
  ensureSymlinkSync(originDir, srcLink);
  assert(Deno.lstatSync(srcLink).isSymlink, `'${srcLink}' should be symlink type`);
  copySync(srcLink, destLink);
  const statInfo = Deno.lstatSync(destLink);
  assert(statInfo.isSymlink);
});
