import {assert, assertEquals, assertThrows, unitTest} from "./test_util.mjs";
unitTest({perms: {read: true, write: true}}, function linkSyncSuccess() {
  const testDir = Deno.makeTempDirSync();
  const oldData = "Hardlink";
  const oldName = testDir + "/oldname";
  const newName = testDir + "/newname";
  Deno.writeFileSync(oldName, new TextEncoder().encode(oldData));
  Deno.linkSync(oldName, newName);
  const newData = new TextDecoder().decode(Deno.readFileSync(newName));
  assertEquals(oldData, newData);
  const newData2 = "Modified";
  Deno.writeFileSync(newName, new TextEncoder().encode(newData2));
  assertEquals(newData2, new TextDecoder().decode(Deno.readFileSync(oldName)));
  const newData3 = "ModifiedAgain";
  Deno.writeFileSync(oldName, new TextEncoder().encode(newData3));
  assertEquals(newData3, new TextDecoder().decode(Deno.readFileSync(newName)));
  Deno.removeSync(oldName);
  const newNameStat = Deno.statSync(newName);
  assert(newNameStat.isFile);
  assert(!newNameStat.isSymlink);
  assertEquals(newData3, new TextDecoder().decode(Deno.readFileSync(newName)));
});
unitTest({perms: {read: true, write: true}}, function linkSyncExists() {
  const testDir = Deno.makeTempDirSync();
  const oldName = testDir + "/oldname";
  const newName = testDir + "/newname";
  Deno.writeFileSync(oldName, new TextEncoder().encode("oldName"));
  Deno.writeFileSync(newName, new TextEncoder().encode("newName"));
  assertThrows(() => {
    Deno.linkSync(oldName, newName);
  }, Deno.errors.AlreadyExists);
});
unitTest({perms: {read: true, write: true}}, function linkSyncNotFound() {
  const testDir = Deno.makeTempDirSync();
  const oldName = testDir + "/oldname";
  const newName = testDir + "/newname";
  assertThrows(() => {
    Deno.linkSync(oldName, newName);
  }, Deno.errors.NotFound);
});
unitTest({perms: {read: false, write: true}}, function linkSyncReadPerm() {
  assertThrows(() => {
    Deno.linkSync("oldbaddir", "newbaddir");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: false}}, function linkSyncWritePerm() {
  assertThrows(() => {
    Deno.linkSync("oldbaddir", "newbaddir");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: true}}, async function linkSuccess() {
  const testDir = Deno.makeTempDirSync();
  const oldData = "Hardlink";
  const oldName = testDir + "/oldname";
  const newName = testDir + "/newname";
  Deno.writeFileSync(oldName, new TextEncoder().encode(oldData));
  await Deno.link(oldName, newName);
  const newData = new TextDecoder().decode(Deno.readFileSync(newName));
  assertEquals(oldData, newData);
  const newData2 = "Modified";
  Deno.writeFileSync(newName, new TextEncoder().encode(newData2));
  assertEquals(newData2, new TextDecoder().decode(Deno.readFileSync(oldName)));
  const newData3 = "ModifiedAgain";
  Deno.writeFileSync(oldName, new TextEncoder().encode(newData3));
  assertEquals(newData3, new TextDecoder().decode(Deno.readFileSync(newName)));
  Deno.removeSync(oldName);
  const newNameStat = Deno.statSync(newName);
  assert(newNameStat.isFile);
  assert(!newNameStat.isSymlink);
  assertEquals(newData3, new TextDecoder().decode(Deno.readFileSync(newName)));
});
