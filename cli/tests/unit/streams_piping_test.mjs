import {assert, assertEquals, unitTest} from "./test_util.mjs";
import {assertThrowsAsync} from "../../../std/testing/asserts.mjs";
unitTest(function streamPipeLocks() {
  const rs = new ReadableStream();
  const ws = new WritableStream();
  assertEquals(rs.locked, false);
  assertEquals(ws.locked, false);
  rs.pipeTo(ws);
  assert(rs.locked);
  assert(ws.locked);
});
unitTest(async function streamPipeFinishUnlocks() {
  const rs = new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
  const ws = new WritableStream();
  await rs.pipeTo(ws);
  assertEquals(rs.locked, false);
  assertEquals(ws.locked, false);
});
unitTest(async function streamPipeReadableStreamLocked() {
  const rs = new ReadableStream();
  const ws = new WritableStream();
  rs.getReader();
  await assertThrowsAsync(async () => {
    await rs.pipeTo(ws);
  }, TypeError);
});
unitTest(async function streamPipeReadableStreamLocked2() {
  const rs = new ReadableStream();
  const ws = new WritableStream();
  ws.getWriter();
  await assertThrowsAsync(async () => {
    await rs.pipeTo(ws);
  }, TypeError);
});
unitTest(async function streamPipeLotsOfChunks() {
  const CHUNKS = 10;
  const rs = new ReadableStream({
    start(c) {
      for (let i = 0; i < CHUNKS; ++i) {
        c.enqueue(i);
      }
      c.close();
    }
  });
  const written = [];
  const ws = new WritableStream({
    write(chunk) {
      written.push(chunk);
    },
    close() {
      written.push("closed");
    }
  }, new CountQueuingStrategy({highWaterMark: CHUNKS}));
  await rs.pipeTo(ws);
  const targetValues = [];
  for (let i = 0; i < CHUNKS; ++i) {
    targetValues.push(i);
  }
  targetValues.push("closed");
  assertEquals(written, targetValues, "the correct values must be written");
  await Promise.all([rs.getReader().closed, ws.getWriter().closed]);
});
for (const preventAbort of [true, false]) {
  unitTest(function undefinedRejectionFromPull() {
    const rs = new ReadableStream({
      pull() {
        return Promise.reject(void 0);
      }
    });
    return rs.pipeTo(new WritableStream(), {preventAbort}).then(() => {
      throw new Error("pipeTo promise should be rejected");
    }, (value) => assertEquals(value, void 0, "rejection value should be undefined"));
  });
}
for (const preventCancel of [true, false]) {
  unitTest(function undefinedRejectionWithPreventCancel() {
    const rs = new ReadableStream({
      pull(controller) {
        controller.enqueue(0);
      }
    });
    const ws = new WritableStream({
      write() {
        return Promise.reject(void 0);
      }
    });
    return rs.pipeTo(ws, {preventCancel}).then(() => {
      throw new Error("pipeTo promise should be rejected");
    }, (value) => assertEquals(value, void 0, "rejection value should be undefined"));
  });
}
