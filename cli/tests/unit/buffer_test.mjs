import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
const MAX_SIZE = 2 ** 32 - 2;
const N = 100;
let testBytes;
let testString;
const ignoreMaxSizeTests = true;
function init() {
  if (testBytes == null) {
    testBytes = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      testBytes[i] = "a".charCodeAt(0) + i % 26;
    }
    const decoder = new TextDecoder();
    testString = decoder.decode(testBytes);
  }
}
function check(buf, s) {
  const bytes = buf.bytes();
  assertEquals(buf.length, bytes.byteLength);
  const decoder = new TextDecoder();
  const bytesStr = decoder.decode(bytes);
  assertEquals(bytesStr, s);
  assertEquals(buf.length, s.length);
}
async function fillBytes(buf, s, n, fub) {
  check(buf, s);
  for (; n > 0; n--) {
    const m = await buf.write(fub);
    assertEquals(m, fub.byteLength);
    const decoder = new TextDecoder();
    s += decoder.decode(fub);
    check(buf, s);
  }
  return s;
}
async function empty(buf, s, fub) {
  check(buf, s);
  while (true) {
    const r = await buf.read(fub);
    if (r === null) {
      break;
    }
    s = s.slice(r);
    check(buf, s);
  }
  check(buf, "");
}
function repeat(c, bytes) {
  assertEquals(c.length, 1);
  const ui8 = new Uint8Array(bytes);
  ui8.fill(c.charCodeAt(0));
  return ui8;
}
unitTest(function bufferNewBuffer() {
  init();
  assert(testBytes);
  assert(testString);
  const buf = new Deno.Buffer(testBytes.buffer);
  check(buf, testString);
});
unitTest(async function bufferBasicOperations() {
  init();
  assert(testBytes);
  assert(testString);
  const buf = new Deno.Buffer();
  for (let i = 0; i < 5; i++) {
    check(buf, "");
    buf.reset();
    check(buf, "");
    buf.truncate(0);
    check(buf, "");
    let n = await buf.write(testBytes.subarray(0, 1));
    assertEquals(n, 1);
    check(buf, "a");
    n = await buf.write(testBytes.subarray(1, 2));
    assertEquals(n, 1);
    check(buf, "ab");
    n = await buf.write(testBytes.subarray(2, 26));
    assertEquals(n, 24);
    check(buf, testString.slice(0, 26));
    buf.truncate(26);
    check(buf, testString.slice(0, 26));
    buf.truncate(20);
    check(buf, testString.slice(0, 20));
    await empty(buf, testString.slice(0, 20), new Uint8Array(5));
    await empty(buf, "", new Uint8Array(100));
  }
});
unitTest(async function bufferReadEmptyAtEOF() {
  const buf = new Deno.Buffer();
  const zeroLengthTmp = new Uint8Array(0);
  const result = await buf.read(zeroLengthTmp);
  assertEquals(result, 0);
});
unitTest(async function bufferLargeByteWrites() {
  init();
  const buf = new Deno.Buffer();
  const limit = 9;
  for (let i = 3; i < limit; i += 3) {
    const s = await fillBytes(buf, "", 5, testBytes);
    await empty(buf, s, new Uint8Array(Math.floor(testString.length / i)));
  }
  check(buf, "");
});
unitTest(async function bufferTooLargeByteWrites() {
  init();
  const tmp = new Uint8Array(72);
  const growLen = Number.MAX_VALUE;
  const xBytes = repeat("x", 0);
  const buf = new Deno.Buffer(xBytes.buffer);
  await buf.read(tmp);
  assertThrows(() => {
    buf.grow(growLen);
  }, Error, "grown beyond the maximum size");
});
unitTest({ignore: ignoreMaxSizeTests}, function bufferGrowWriteMaxBuffer() {
  const bufSize = 16 * 1024;
  const capacities = [MAX_SIZE, MAX_SIZE - 1];
  for (const capacity of capacities) {
    let written = 0;
    const buf = new Deno.Buffer();
    const writes = Math.floor(capacity / bufSize);
    for (let i = 0; i < writes; i++) {
      written += buf.writeSync(repeat("x", bufSize));
    }
    if (written < capacity) {
      written += buf.writeSync(repeat("x", capacity - written));
    }
    assertEquals(written, capacity);
  }
});
unitTest({ignore: ignoreMaxSizeTests}, async function bufferGrowReadCloseMaxBufferPlus1() {
  const reader = new Deno.Buffer(new ArrayBuffer(MAX_SIZE + 1));
  const buf = new Deno.Buffer();
  await assertThrowsAsync(async () => {
    await buf.readFrom(reader);
  }, Error, "grown beyond the maximum size");
});
unitTest({ignore: ignoreMaxSizeTests}, function bufferGrowReadSyncCloseMaxBufferPlus1() {
  const reader = new Deno.Buffer(new ArrayBuffer(MAX_SIZE + 1));
  const buf = new Deno.Buffer();
  assertThrows(() => {
    buf.readFromSync(reader);
  }, Error, "grown beyond the maximum size");
});
unitTest({ignore: ignoreMaxSizeTests}, function bufferGrowReadSyncCloseToMaxBuffer() {
  const capacities = [MAX_SIZE, MAX_SIZE - 1];
  for (const capacity of capacities) {
    const reader = new Deno.Buffer(new ArrayBuffer(capacity));
    const buf = new Deno.Buffer();
    buf.readFromSync(reader);
    assertEquals(buf.length, capacity);
  }
});
unitTest({ignore: ignoreMaxSizeTests}, async function bufferGrowReadCloseToMaxBuffer() {
  const capacities = [MAX_SIZE, MAX_SIZE - 1];
  for (const capacity of capacities) {
    const reader = new Deno.Buffer(new ArrayBuffer(capacity));
    const buf = new Deno.Buffer();
    await buf.readFrom(reader);
    assertEquals(buf.length, capacity);
  }
});
unitTest({ignore: ignoreMaxSizeTests}, async function bufferReadCloseToMaxBufferWithInitialGrow() {
  const capacities = [MAX_SIZE, MAX_SIZE - 1, MAX_SIZE - 512];
  for (const capacity of capacities) {
    const reader = new Deno.Buffer(new ArrayBuffer(capacity));
    const buf = new Deno.Buffer();
    buf.grow(MAX_SIZE);
    await buf.readFrom(reader);
    assertEquals(buf.length, capacity);
  }
});
unitTest(async function bufferLargeByteReads() {
  init();
  assert(testBytes);
  assert(testString);
  const buf = new Deno.Buffer();
  for (let i = 3; i < 30; i += 3) {
    const n = Math.floor(testBytes.byteLength / i);
    const s = await fillBytes(buf, "", 5, testBytes.subarray(0, n));
    await empty(buf, s, new Uint8Array(testString.length));
  }
  check(buf, "");
});
unitTest(function bufferCapWithPreallocatedSlice() {
  const buf = new Deno.Buffer(new ArrayBuffer(10));
  assertEquals(buf.capacity, 10);
});
unitTest(async function bufferReadFrom() {
  init();
  assert(testBytes);
  assert(testString);
  const buf = new Deno.Buffer();
  for (let i = 3; i < 30; i += 3) {
    const s = await fillBytes(buf, "", 5, testBytes.subarray(0, Math.floor(testBytes.byteLength / i)));
    const b = new Deno.Buffer();
    await b.readFrom(buf);
    const fub = new Uint8Array(testString.length);
    await empty(b, s, fub);
  }
  assertThrowsAsync(async function() {
    await new Deno.Buffer().readFrom(null);
  });
});
unitTest(async function bufferReadFromSync() {
  init();
  assert(testBytes);
  assert(testString);
  const buf = new Deno.Buffer();
  for (let i = 3; i < 30; i += 3) {
    const s = await fillBytes(buf, "", 5, testBytes.subarray(0, Math.floor(testBytes.byteLength / i)));
    const b = new Deno.Buffer();
    b.readFromSync(buf);
    const fub = new Uint8Array(testString.length);
    await empty(b, s, fub);
  }
  assertThrows(function() {
    new Deno.Buffer().readFromSync(null);
  });
});
unitTest(async function bufferTestGrow() {
  const tmp = new Uint8Array(72);
  for (const startLen of [0, 100, 1e3, 1e4]) {
    const xBytes = repeat("x", startLen);
    for (const growLen of [0, 100, 1e3, 1e4]) {
      const buf = new Deno.Buffer(xBytes.buffer);
      const nread = await buf.read(tmp) ?? 0;
      buf.grow(growLen);
      const yBytes = repeat("y", growLen);
      await buf.write(yBytes);
      assertEquals(buf.bytes().subarray(0, startLen - nread), xBytes.subarray(nread));
      assertEquals(buf.bytes().subarray(startLen - nread, startLen - nread + growLen), yBytes);
    }
  }
});
unitTest(async function testReadAll() {
  init();
  assert(testBytes);
  const reader = new Deno.Buffer(testBytes.buffer);
  const actualBytes = await Deno.readAll(reader);
  assertEquals(testBytes.byteLength, actualBytes.byteLength);
  for (let i = 0; i < testBytes.length; ++i) {
    assertEquals(testBytes[i], actualBytes[i]);
  }
});
unitTest(function testReadAllSync() {
  init();
  assert(testBytes);
  const reader = new Deno.Buffer(testBytes.buffer);
  const actualBytes = Deno.readAllSync(reader);
  assertEquals(testBytes.byteLength, actualBytes.byteLength);
  for (let i = 0; i < testBytes.length; ++i) {
    assertEquals(testBytes[i], actualBytes[i]);
  }
});
unitTest(async function testWriteAll() {
  init();
  assert(testBytes);
  const writer = new Deno.Buffer();
  await Deno.writeAll(writer, testBytes);
  const actualBytes = writer.bytes();
  assertEquals(testBytes.byteLength, actualBytes.byteLength);
  for (let i = 0; i < testBytes.length; ++i) {
    assertEquals(testBytes[i], actualBytes[i]);
  }
});
unitTest(function testWriteAllSync() {
  init();
  assert(testBytes);
  const writer = new Deno.Buffer();
  Deno.writeAllSync(writer, testBytes);
  const actualBytes = writer.bytes();
  assertEquals(testBytes.byteLength, actualBytes.byteLength);
  for (let i = 0; i < testBytes.length; ++i) {
    assertEquals(testBytes[i], actualBytes[i]);
  }
});
unitTest(function testBufferBytesArrayBufferLength() {
  const args = [{}, {copy: void 0}, void 0, {copy: true}];
  for (const arg of args) {
    const bufSize = 64 * 1024;
    const bytes = new TextEncoder().encode("a".repeat(bufSize));
    const reader = new Deno.Buffer();
    Deno.writeAllSync(reader, bytes);
    const writer = new Deno.Buffer();
    writer.readFromSync(reader);
    const actualBytes = writer.bytes(arg);
    assertEquals(actualBytes.byteLength, bufSize);
    assert(actualBytes.buffer !== writer.bytes(arg).buffer);
    assertEquals(actualBytes.byteLength, actualBytes.buffer.byteLength);
  }
});
unitTest(function testBufferBytesCopyFalse() {
  const bufSize = 64 * 1024;
  const bytes = new TextEncoder().encode("a".repeat(bufSize));
  const reader = new Deno.Buffer();
  Deno.writeAllSync(reader, bytes);
  const writer = new Deno.Buffer();
  writer.readFromSync(reader);
  const actualBytes = writer.bytes({copy: false});
  assertEquals(actualBytes.byteLength, bufSize);
  assertEquals(actualBytes.buffer, writer.bytes({copy: false}).buffer);
  assert(actualBytes.buffer.byteLength > actualBytes.byteLength);
});
unitTest(function testBufferBytesCopyFalseGrowExactBytes() {
  const bufSize = 64 * 1024;
  const bytes = new TextEncoder().encode("a".repeat(bufSize));
  const reader = new Deno.Buffer();
  Deno.writeAllSync(reader, bytes);
  const writer = new Deno.Buffer();
  writer.grow(bufSize);
  writer.readFromSync(reader);
  const actualBytes = writer.bytes({copy: false});
  assertEquals(actualBytes.byteLength, bufSize);
  assertEquals(actualBytes.buffer.byteLength, actualBytes.byteLength);
});
