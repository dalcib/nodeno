import {
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
async function getUidAndGid() {
  const uidProc = Deno.run({
    stdout: "piped",
    cmd: ["python", "-c", "import os; print(os.getuid())"]
  });
  const gidProc = Deno.run({
    stdout: "piped",
    cmd: ["python", "-c", "import os; print(os.getgid())"]
  });
  assertEquals((await uidProc.status()).code, 0);
  assertEquals((await gidProc.status()).code, 0);
  const uid = parseInt(new TextDecoder("utf-8").decode(await uidProc.output()));
  uidProc.close();
  const gid = parseInt(new TextDecoder("utf-8").decode(await gidProc.output()));
  gidProc.close();
  return {uid, gid};
}
unitTest({ignore: Deno.build.os == "windows"}, async function chownNoWritePermission() {
  const filePath = "chown_test_file.txt";
  await assertThrowsAsync(async () => {
    await Deno.chown(filePath, 1e3, 1e3);
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {run: true, write: true}, ignore: Deno.build.os == "windows"}, async function chownSyncFileNotExist() {
  const {uid, gid} = await getUidAndGid();
  const filePath = Deno.makeTempDirSync() + "/chown_test_file.txt";
  assertThrows(() => {
    Deno.chownSync(filePath, uid, gid);
  }, Deno.errors.NotFound);
});
unitTest({perms: {run: true, write: true}, ignore: Deno.build.os == "windows"}, async function chownFileNotExist() {
  const {uid, gid} = await getUidAndGid();
  const filePath = await Deno.makeTempDir() + "/chown_test_file.txt";
  await assertThrowsAsync(async () => {
    await Deno.chown(filePath, uid, gid);
  }, Deno.errors.NotFound);
});
unitTest({perms: {write: true}, ignore: Deno.build.os == "windows"}, function chownSyncPermissionDenied() {
  const dirPath = Deno.makeTempDirSync();
  const filePath = dirPath + "/chown_test_file.txt";
  Deno.writeTextFileSync(filePath, "Hello");
  assertThrows(() => {
    Deno.chownSync(filePath, 0, 0);
  }, Deno.errors.PermissionDenied);
  Deno.removeSync(dirPath, {recursive: true});
});
unitTest({perms: {write: true}, ignore: Deno.build.os == "windows"}, async function chownPermissionDenied() {
  const dirPath = await Deno.makeTempDir();
  const filePath = dirPath + "/chown_test_file.txt";
  await Deno.writeTextFile(filePath, "Hello");
  await assertThrowsAsync(async () => {
    await Deno.chown(filePath, 0, 0);
  }, Deno.errors.PermissionDenied);
  await Deno.remove(dirPath, {recursive: true});
});
unitTest({perms: {run: true, write: true}, ignore: Deno.build.os == "windows"}, async function chownSyncSucceed() {
  const {uid, gid} = await getUidAndGid();
  const dirPath = Deno.makeTempDirSync();
  const filePath = dirPath + "/chown_test_file.txt";
  Deno.writeTextFileSync(filePath, "Hello");
  Deno.chownSync(filePath, uid, gid);
  Deno.removeSync(dirPath, {recursive: true});
});
unitTest({perms: {run: true, write: true}, ignore: Deno.build.os == "windows"}, async function chownSyncWithUrl() {
  const {uid, gid} = await getUidAndGid();
  const dirPath = Deno.makeTempDirSync();
  const fileUrl = new URL(`file://${dirPath}/chown_test_file.txt`);
  Deno.writeTextFileSync(fileUrl, "Hello");
  Deno.chownSync(fileUrl, uid, gid);
  Deno.removeSync(dirPath, {recursive: true});
});
unitTest({perms: {run: true, write: true}, ignore: Deno.build.os == "windows"}, async function chownSucceed() {
  const {uid, gid} = await getUidAndGid();
  const dirPath = await Deno.makeTempDir();
  const filePath = dirPath + "/chown_test_file.txt";
  await Deno.writeTextFile(filePath, "Hello");
  await Deno.chown(filePath, uid, gid);
  Deno.removeSync(dirPath, {recursive: true});
});
unitTest({perms: {run: true, write: true}, ignore: Deno.build.os == "windows"}, async function chownUidOnly() {
  const {uid} = await getUidAndGid();
  const dirPath = await Deno.makeTempDir();
  const filePath = dirPath + "/chown_test_file.txt";
  await Deno.writeTextFile(filePath, "Foo");
  await Deno.chown(filePath, uid, null);
  Deno.removeSync(dirPath, {recursive: true});
});
unitTest({perms: {run: true, write: true}, ignore: Deno.build.os == "windows"}, async function chownWithUrl() {
  const {uid, gid} = await getUidAndGid();
  const enc = new TextEncoder();
  const dirPath = await Deno.makeTempDir();
  const fileUrl = new URL(`file://${dirPath}/chown_test_file.txt`);
  const fileData = enc.encode("Hello");
  await Deno.writeFile(fileUrl, fileData);
  await Deno.chown(fileUrl, uid, gid);
  Deno.removeSync(dirPath, {recursive: true});
});
