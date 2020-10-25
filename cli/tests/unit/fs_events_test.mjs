import {assert, assertEquals, assertThrows, unitTest} from "./test_util.mjs";
unitTest({perms: {read: false}}, function watchFsPermissions() {
  assertThrows(() => {
    Deno.watchFs(".");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true}}, function watchFsInvalidPath() {
  if (Deno.build.os === "windows") {
    assertThrows(() => {
      Deno.watchFs("non-existant.file");
    }, Error, "Input watch path is neither a file nor a directory");
  } else {
    assertThrows(() => {
      Deno.watchFs("non-existant.file");
    }, Deno.errors.NotFound);
  }
});
async function getTwoEvents(iter) {
  const events = [];
  for await (const event of iter) {
    events.push(event);
    if (events.length > 2)
      break;
  }
  return events;
}
unitTest({perms: {read: true, write: true}}, async function watchFsBasic() {
  const testDir = await Deno.makeTempDir();
  const iter = Deno.watchFs(testDir);
  const eventsPromise = getTwoEvents(iter);
  const file1 = testDir + "/file1.txt";
  const file2 = testDir + "/file2.txt";
  Deno.writeFileSync(file1, new Uint8Array([0, 1, 2]));
  Deno.writeFileSync(file2, new Uint8Array([0, 1, 2]));
  const events = await eventsPromise;
  assert(events.length >= 2);
  assert(events[0].kind == "create");
  assert(events[0].paths[0].includes(testDir));
  assert(events[1].kind == "create" || events[1].kind == "modify");
  assert(events[1].paths[0].includes(testDir));
});
unitTest({perms: {read: true, write: true}}, async function watchFsReturn() {
  const testDir = await Deno.makeTempDir();
  const iter = Deno.watchFs(testDir);
  const eventsPromise = getTwoEvents(iter);
  await iter.return();
  const events = await eventsPromise;
  assertEquals(events, []);
});
