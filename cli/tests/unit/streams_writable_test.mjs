import {assert, assertEquals, assertThrows, unitTest} from "./test_util.mjs";
unitTest(function writableStreamDesiredSizeOnReleasedWriter() {
  const ws = new WritableStream();
  const writer = ws.getWriter();
  writer.releaseLock();
  assertThrows(() => {
    writer.desiredSize;
  }, TypeError);
});
unitTest(function writableStreamDesiredSizeInitialValue() {
  const ws = new WritableStream();
  const writer = ws.getWriter();
  assertEquals(writer.desiredSize, 1);
});
unitTest(async function writableStreamDesiredSizeClosed() {
  const ws = new WritableStream();
  const writer = ws.getWriter();
  await writer.close();
  assertEquals(writer.desiredSize, 0);
});
unitTest(function writableStreamStartThrowsDesiredSizeNull() {
  const ws = new WritableStream({
    start(c) {
      c.error();
    }
  });
  const writer = ws.getWriter();
  assertEquals(writer.desiredSize, null, "desiredSize should be null");
});
unitTest(function getWriterOnClosingStream() {
  const ws = new WritableStream({});
  const writer = ws.getWriter();
  writer.close();
  writer.releaseLock();
  ws.getWriter();
});
unitTest(async function getWriterOnClosedStream() {
  const ws = new WritableStream({});
  const writer = ws.getWriter();
  await writer.close();
  writer.releaseLock();
  ws.getWriter();
});
unitTest(function getWriterOnAbortedStream() {
  const ws = new WritableStream({});
  const writer = ws.getWriter();
  writer.abort();
  writer.releaseLock();
  ws.getWriter();
});
unitTest(function getWriterOnErroredStream() {
  const ws = new WritableStream({
    start(c) {
      c.error();
    }
  });
  const writer = ws.getWriter();
  return writer.closed.then((v) => {
    throw new Error(`writer.closed fulfilled unexpectedly with: ${v}`);
  }, () => {
    writer.releaseLock();
    ws.getWriter();
  });
});
unitTest(function closedAndReadyOnReleasedWriter() {
  const ws = new WritableStream({});
  const writer = ws.getWriter();
  writer.releaseLock();
  return writer.closed.then((v) => {
    throw new Error("writer.closed fulfilled unexpectedly with: " + v);
  }, (closedRejection) => {
    assertEquals(closedRejection.name, "TypeError", "closed promise should reject with a TypeError");
    return writer.ready.then((v) => {
      throw new Error("writer.ready fulfilled unexpectedly with: " + v);
    }, (readyRejection) => assertEquals(readyRejection, closedRejection, "ready promise should reject with the same error"));
  });
});
unitTest(function sinkMethodsCalledAsMethods() {
  let thisObject = null;
  class Sink {
    start() {
      assertEquals(this, thisObject, "start should be called as a method");
    }
    write() {
      assertEquals(this, thisObject, "write should be called as a method");
    }
    close() {
      assertEquals(this, thisObject, "close should be called as a method");
    }
    abort() {
      assertEquals(this, thisObject, "abort should be called as a method");
    }
  }
  const theSink = new Sink();
  thisObject = theSink;
  const ws = new WritableStream(theSink);
  const writer = ws.getWriter();
  writer.write("a");
  const closePromise = writer.close();
  const ws2 = new WritableStream(theSink);
  const writer2 = ws2.getWriter();
  const abortPromise = writer2.abort();
  return Promise.all([closePromise, abortPromise]).then(void 0);
});
unitTest(function sizeShouldNotBeCalledAsMethod() {
  const strategy = {
    size() {
      if (this !== void 0) {
        throw new Error("size called as a method");
      }
      return 1;
    }
  };
  const ws = new WritableStream({}, strategy);
  const writer = ws.getWriter();
  return writer.write("a");
});
unitTest(function redundantReleaseLockIsNoOp() {
  const ws = new WritableStream();
  const writer1 = ws.getWriter();
  assertEquals(void 0, writer1.releaseLock(), "releaseLock() should return undefined");
  const writer2 = ws.getWriter();
  assertEquals(void 0, writer1.releaseLock(), "no-op releaseLock() should return undefined");
  return writer2.ready;
});
unitTest(function readyPromiseShouldFireBeforeReleaseLock() {
  const events = [];
  const ws = new WritableStream();
  const writer = ws.getWriter();
  return writer.ready.then(() => {
    const writerPromise = writer.write("dummy");
    const readyPromise = writer.ready.catch(() => events.push("ready"));
    const closedPromise = writer.closed.catch(() => events.push("closed"));
    writer.releaseLock();
    return Promise.all([readyPromise, closedPromise]).then(() => {
      assertEquals(events, ["ready", "closed"], "ready promise should fire before closed promise");
      return Promise.all([writerPromise, ws.abort()]).then(void 0);
    });
  });
});
unitTest(function subclassingWritableStream() {
  class Subclass extends WritableStream {
    extraFunction() {
      return true;
    }
  }
  assert(Object.getPrototypeOf(Subclass.prototype) === WritableStream.prototype, "Subclass.prototype's prototype should be WritableStream.prototype");
  assert(Object.getPrototypeOf(Subclass) === WritableStream, "Subclass's prototype should be WritableStream");
  const sub = new Subclass();
  assert(sub instanceof WritableStream, "Subclass object should be an instance of WritableStream");
  assert(sub instanceof Subclass, "Subclass object should be an instance of Subclass");
  const lockedGetter = Object.getOwnPropertyDescriptor(WritableStream.prototype, "locked").get;
  assert(lockedGetter.call(sub) === sub.locked, "Subclass object should pass brand check");
  assert(sub.extraFunction(), "extraFunction() should be present on Subclass object");
});
unitTest(function lockedGetterShouldReturnTrue() {
  const ws = new WritableStream();
  assert(!ws.locked, "stream should not be locked");
  ws.getWriter();
  assert(ws.locked, "stream should be locked");
});
