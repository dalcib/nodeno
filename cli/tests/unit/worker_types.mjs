import {assert, unitTest} from "./test_util.mjs";
unitTest({perms: {read: true}}, function utimeSyncFileSuccess() {
  const w = new Worker(new URL("../subdir/worker_types.ts", import.meta.url).href, {type: "module"});
  assert(w);
  w.terminate();
});
