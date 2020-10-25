import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
  unitTest
} from "./test_util.mjs";
function delay(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
}
function readableStreamToArray(readable, reader) {
  if (reader === void 0) {
    reader = readable.getReader();
  }
  const chunks = [];
  return pump();
  function pump() {
    return reader.read().then((result) => {
      if (result.done) {
        return chunks;
      }
      chunks.push(result.value);
      return pump();
    });
  }
}
unitTest(function transformStreamConstructedWithTransformFunction() {
  new TransformStream({transform() {
  }});
});
unitTest(function transformStreamConstructedNoTransform() {
  new TransformStream();
  new TransformStream({});
});
unitTest(function transformStreamIntstancesHaveProperProperties() {
  const ts = new TransformStream({transform() {
  }});
  const proto = Object.getPrototypeOf(ts);
  const writableStream = Object.getOwnPropertyDescriptor(proto, "writable");
  assert(writableStream !== void 0, "it has a writable property");
  assert(!writableStream.enumerable, "writable should be non-enumerable");
  assertEquals(typeof writableStream.get, "function", "writable should have a getter");
  assertEquals(writableStream.set, void 0, "writable should not have a setter");
  assert(writableStream.configurable, "writable should be configurable");
  assert(ts.writable instanceof WritableStream, "writable is an instance of WritableStream");
  assert(WritableStream.prototype.getWriter.call(ts.writable), "writable should pass WritableStream brand check");
  const readableStream = Object.getOwnPropertyDescriptor(proto, "readable");
  assert(readableStream !== void 0, "it has a readable property");
  assert(!readableStream.enumerable, "readable should be non-enumerable");
  assertEquals(typeof readableStream.get, "function", "readable should have a getter");
  assertEquals(readableStream.set, void 0, "readable should not have a setter");
  assert(readableStream.configurable, "readable should be configurable");
  assert(ts.readable instanceof ReadableStream, "readable is an instance of ReadableStream");
  assertNotEquals(ReadableStream.prototype.getReader.call(ts.readable), void 0, "readable should pass ReadableStream brand check");
});
unitTest(function transformStreamWritableStartsAsWritable() {
  const ts = new TransformStream({transform() {
  }});
  const writer = ts.writable.getWriter();
  assertEquals(writer.desiredSize, 1, "writer.desiredSize should be 1");
});
unitTest(async function transformStreamReadableCanReadOutOfWritable() {
  const ts = new TransformStream();
  const writer = ts.writable.getWriter();
  writer.write("a");
  assertEquals(writer.desiredSize, 0, "writer.desiredSize should be 0 after write()");
  const result = await ts.readable.getReader().read();
  assertEquals(result.value, "a", "result from reading the readable is the same as was written to writable");
  assert(!result.done, "stream should not be done");
  await delay(0);
  assert(writer.desiredSize === 1, "desiredSize should be 1 again");
});
unitTest(async function transformStreamCanReadWhatIsWritten() {
  let c;
  const ts = new TransformStream({
    start(controller) {
      c = controller;
    },
    transform(chunk) {
      c.enqueue(chunk.toUpperCase());
    }
  });
  const writer = ts.writable.getWriter();
  writer.write("a");
  const result = await ts.readable.getReader().read();
  assertEquals(result.value, "A", "result from reading the readable is the transformation of what was written to writable");
  assert(!result.done, "stream should not be done");
});
unitTest(async function transformStreamCanReadBothChunks() {
  let c;
  const ts = new TransformStream({
    start(controller) {
      c = controller;
    },
    transform(chunk) {
      c.enqueue(chunk.toUpperCase());
      c.enqueue(chunk.toUpperCase());
    }
  });
  const writer = ts.writable.getWriter();
  writer.write("a");
  const reader = ts.readable.getReader();
  const result1 = await reader.read();
  assertEquals(result1.value, "A", "the first chunk read is the transformation of the single chunk written");
  assert(!result1.done, "stream should not be done");
  const result2 = await reader.read();
  assertEquals(result2.value, "A", "the second chunk read is also the transformation of the single chunk written");
  assert(!result2.done, "stream should not be done");
});
unitTest(async function transformStreamCanReadWhatIsWritten2() {
  let c;
  const ts = new TransformStream({
    start(controller) {
      c = controller;
    },
    transform(chunk) {
      return delay(0).then(() => c.enqueue(chunk.toUpperCase()));
    }
  });
  const writer = ts.writable.getWriter();
  writer.write("a");
  const result = await ts.readable.getReader().read();
  assertEquals(result.value, "A", "result from reading the readable is the transformation of what was written to writable");
  assert(!result.done, "stream should not be done");
});
unitTest(async function transformStreamAsyncReadMultipleChunks() {
  let doSecondEnqueue;
  let returnFromTransform;
  const ts = new TransformStream({
    transform(chunk, controller) {
      delay(0).then(() => controller.enqueue(chunk.toUpperCase()));
      doSecondEnqueue = () => controller.enqueue(chunk.toUpperCase());
      return new Promise((resolve) => {
        returnFromTransform = resolve;
      });
    }
  });
  const reader = ts.readable.getReader();
  const writer = ts.writable.getWriter();
  writer.write("a");
  const result1 = await reader.read();
  assertEquals(result1.value, "A", "the first chunk read is the transformation of the single chunk written");
  assert(!result1.done, "stream should not be done");
  doSecondEnqueue();
  const result2 = await reader.read();
  assertEquals(result2.value, "A", "the second chunk read is also the transformation of the single chunk written");
  assert(!result2.done, "stream should not be done");
  returnFromTransform();
});
unitTest(function transformStreamClosingWriteClosesRead() {
  const ts = new TransformStream({transform() {
  }});
  const writer = ts.writable.getWriter();
  writer.close();
  return Promise.all([writer.closed, ts.readable.getReader().closed]).then(void 0);
});
unitTest(async function transformStreamCloseWaitAwaitsTransforms() {
  let transformResolve;
  const transformPromise = new Promise((resolve) => {
    transformResolve = resolve;
  });
  const ts = new TransformStream({
    transform() {
      return transformPromise;
    }
  }, void 0, {highWaterMark: 1});
  const writer = ts.writable.getWriter();
  writer.write("a");
  writer.close();
  let rsClosed = false;
  ts.readable.getReader().closed.then(() => {
    rsClosed = true;
  });
  await delay(0);
  assertEquals(rsClosed, false, "readable is not closed after a tick");
  transformResolve();
  await writer.closed;
  assertEquals(rsClosed, true, "readable is closed at that point");
});
unitTest(async function transformStreamCloseWriteAfterSyncEnqueues() {
  let c;
  const ts = new TransformStream({
    start(controller) {
      c = controller;
    },
    transform() {
      c.enqueue("x");
      c.enqueue("y");
      return delay(0);
    }
  });
  const writer = ts.writable.getWriter();
  writer.write("a");
  writer.close();
  const readableChunks = readableStreamToArray(ts.readable);
  await writer.closed;
  const chunks = await readableChunks;
  assertEquals(chunks, ["x", "y"], "both enqueued chunks can be read from the readable");
});
unitTest(async function transformStreamWritableCloseAsyncAfterAsyncEnqueues() {
  let c;
  const ts = new TransformStream({
    start(controller) {
      c = controller;
    },
    transform() {
      return delay(0).then(() => c.enqueue("x")).then(() => c.enqueue("y")).then(() => delay(0));
    }
  });
  const writer = ts.writable.getWriter();
  writer.write("a");
  writer.close();
  const readableChunks = readableStreamToArray(ts.readable);
  await writer.closed;
  const chunks = await readableChunks;
  assertEquals(chunks, ["x", "y"], "both enqueued chunks can be read from the readable");
});
unitTest(async function transformStreamTransformerMethodsCalledAsMethods() {
  let c;
  const transformer = {
    suffix: "-suffix",
    start(controller) {
      c = controller;
      c.enqueue("start" + this.suffix);
    },
    transform(chunk) {
      c.enqueue(chunk + this.suffix);
    },
    flush() {
      c.enqueue("flushed" + this.suffix);
    }
  };
  const ts = new TransformStream(transformer);
  const writer = ts.writable.getWriter();
  writer.write("a");
  writer.close();
  const readableChunks = readableStreamToArray(ts.readable);
  await writer.closed;
  const chunks = await readableChunks;
  assertEquals(chunks, ["start-suffix", "a-suffix", "flushed-suffix"], "all enqueued chunks have suffixes");
});
unitTest(async function transformStreamMethodsShouldNotBeAppliedOrCalled() {
  function functionWithOverloads() {
  }
  functionWithOverloads.apply = () => {
    throw new Error("apply() should not be called");
  };
  functionWithOverloads.call = () => {
    throw new Error("call() should not be called");
  };
  const ts = new TransformStream({
    start: functionWithOverloads,
    transform: functionWithOverloads,
    flush: functionWithOverloads
  });
  const writer = ts.writable.getWriter();
  writer.write("a");
  writer.close();
  await readableStreamToArray(ts.readable);
});
unitTest(async function transformStreamCallTransformSync() {
  let transformCalled = false;
  const ts = new TransformStream({
    transform() {
      transformCalled = true;
    }
  }, void 0, {highWaterMark: Infinity});
  await delay(0);
  const writePromise = ts.writable.getWriter().write(void 0);
  assert(transformCalled, "transform() should have been called");
  await writePromise;
});
unitTest(function transformStreamCloseWriteCloesesReadWithNoChunks() {
  const ts = new TransformStream({}, void 0, {highWaterMark: 0});
  const writer = ts.writable.getWriter();
  writer.close();
  return Promise.all([writer.closed, ts.readable.getReader().closed]).then(void 0);
});
unitTest(function transformStreamEnqueueThrowsAfterTerminate() {
  new TransformStream({
    start(controller) {
      controller.terminate();
      assertThrows(() => {
        controller.enqueue(void 0);
      }, TypeError);
    }
  });
});
unitTest(function transformStreamEnqueueThrowsAfterReadableCancel() {
  let controller;
  const ts = new TransformStream({
    start(c) {
      controller = c;
    }
  });
  const cancelPromise = ts.readable.cancel();
  assertThrows(() => controller.enqueue(void 0), TypeError, void 0, "enqueue should throw");
  return cancelPromise;
});
unitTest(function transformStreamSecondTerminateNoOp() {
  new TransformStream({
    start(controller) {
      controller.terminate();
      controller.terminate();
    }
  });
});
unitTest(async function transformStreamTerminateAfterReadableCancelIsNoop() {
  let controller;
  const ts = new TransformStream({
    start(c) {
      controller = c;
    }
  });
  const cancelReason = {name: "cancelReason"};
  const cancelPromise = ts.readable.cancel(cancelReason);
  controller.terminate();
  await cancelPromise;
  try {
    await ts.writable.getWriter().closed;
  } catch (e) {
    assert(e === cancelReason);
    return;
  }
  throw new Error("closed should have rejected");
});
unitTest(async function transformStreamStartCalledOnce() {
  let calls = 0;
  new TransformStream({
    start() {
      ++calls;
    }
  });
  await delay(0);
  assertEquals(calls, 1, "start() should have been called exactly once");
});
unitTest(function transformStreamReadableTypeThrows() {
  assertThrows(() => new TransformStream({readableType: "bytes"}), RangeError, void 0, "constructor should throw");
});
unitTest(function transformStreamWirtableTypeThrows() {
  assertThrows(() => new TransformStream({writableType: "bytes"}), RangeError, void 0, "constructor should throw");
});
unitTest(function transformStreamSubclassable() {
  class Subclass extends TransformStream {
    extraFunction() {
      return true;
    }
  }
  assert(Object.getPrototypeOf(Subclass.prototype) === TransformStream.prototype, "Subclass.prototype's prototype should be TransformStream.prototype");
  assert(Object.getPrototypeOf(Subclass) === TransformStream, "Subclass's prototype should be TransformStream");
  const sub = new Subclass();
  assert(sub instanceof TransformStream, "Subclass object should be an instance of TransformStream");
  assert(sub instanceof Subclass, "Subclass object should be an instance of Subclass");
  const readableGetter = Object.getOwnPropertyDescriptor(TransformStream.prototype, "readable").get;
  assert(readableGetter.call(sub) === sub.readable, "Subclass object should pass brand check");
  assert(sub.extraFunction(), "extraFunction() should be present on Subclass object");
});
