import {
  assert,
  assertEquals,
  assertThrowsAsync,
  unitTest
} from "./test_util.mjs";
unitTest(function filesStdioFileDescriptors() {
  assertEquals(Deno.stdin.rid, 0);
  assertEquals(Deno.stdout.rid, 1);
  assertEquals(Deno.stderr.rid, 2);
});
unitTest({perms: {read: true}}, async function filesCopyToStdout() {
  const filename = "cli/tests/fixture.json";
  const file = await Deno.open(filename);
  assert(file.rid > 2);
  const bytesWritten = await Deno.copy(file, Deno.stdout);
  const fileSize = Deno.statSync(filename).size;
  assertEquals(bytesWritten, fileSize);
  file.close();
});
unitTest({perms: {read: true}}, async function filesIter() {
  const filename = "cli/tests/hello.txt";
  const file = await Deno.open(filename);
  let totalSize = 0;
  for await (const buf of Deno.iter(file)) {
    totalSize += buf.byteLength;
  }
  assertEquals(totalSize, 12);
  file.close();
});
unitTest({perms: {read: true}}, async function filesIterCustomBufSize() {
  const filename = "cli/tests/hello.txt";
  const file = await Deno.open(filename);
  let totalSize = 0;
  let iterations = 0;
  for await (const buf of Deno.iter(file, {bufSize: 6})) {
    totalSize += buf.byteLength;
    iterations += 1;
  }
  assertEquals(totalSize, 12);
  assertEquals(iterations, 2);
  file.close();
});
unitTest({perms: {read: true}}, function filesIterSync() {
  const filename = "cli/tests/hello.txt";
  const file = Deno.openSync(filename);
  let totalSize = 0;
  for (const buf of Deno.iterSync(file)) {
    totalSize += buf.byteLength;
  }
  assertEquals(totalSize, 12);
  file.close();
});
unitTest({perms: {read: true}}, function filesIterSyncCustomBufSize() {
  const filename = "cli/tests/hello.txt";
  const file = Deno.openSync(filename);
  let totalSize = 0;
  let iterations = 0;
  for (const buf of Deno.iterSync(file, {bufSize: 6})) {
    totalSize += buf.byteLength;
    iterations += 1;
  }
  assertEquals(totalSize, 12);
  assertEquals(iterations, 2);
  file.close();
});
unitTest(async function readerIter() {
  const encoder = new TextEncoder();
  class TestReader {
    constructor(s) {
      this.#offset = 0;
      this.#buf = new Uint8Array(encoder.encode(s));
    }
    #offset;
    #buf;
    read(p) {
      const n = Math.min(p.byteLength, this.#buf.byteLength - this.#offset);
      p.set(this.#buf.slice(this.#offset, this.#offset + n));
      this.#offset += n;
      if (n === 0) {
        return Promise.resolve(null);
      }
      return Promise.resolve(n);
    }
  }
  const reader = new TestReader("hello world!");
  let totalSize = 0;
  for await (const buf of Deno.iter(reader)) {
    totalSize += buf.byteLength;
  }
  assertEquals(totalSize, 12);
});
unitTest(async function readerIterSync() {
  const encoder = new TextEncoder();
  class TestReader {
    constructor(s) {
      this.#offset = 0;
      this.#buf = new Uint8Array(encoder.encode(s));
    }
    #offset;
    #buf;
    readSync(p) {
      const n = Math.min(p.byteLength, this.#buf.byteLength - this.#offset);
      p.set(this.#buf.slice(this.#offset, this.#offset + n));
      this.#offset += n;
      if (n === 0) {
        return null;
      }
      return n;
    }
  }
  const reader = new TestReader("hello world!");
  let totalSize = 0;
  for await (const buf of Deno.iterSync(reader)) {
    totalSize += buf.byteLength;
  }
  assertEquals(totalSize, 12);
});
unitTest({
  perms: {read: true, write: true}
}, function openSyncMode() {
  const path = Deno.makeTempDirSync() + "/test_openSync.txt";
  const file = Deno.openSync(path, {
    write: true,
    createNew: true,
    mode: 406
  });
  file.close();
  const pathInfo = Deno.statSync(path);
  if (Deno.build.os !== "windows") {
    assertEquals(pathInfo.mode & 511, 406 & ~Deno.umask());
  }
});
unitTest({
  perms: {read: true, write: true}
}, async function openMode() {
  const path = await Deno.makeTempDir() + "/test_open.txt";
  const file = await Deno.open(path, {
    write: true,
    createNew: true,
    mode: 406
  });
  file.close();
  const pathInfo = Deno.statSync(path);
  if (Deno.build.os !== "windows") {
    assertEquals(pathInfo.mode & 511, 406 & ~Deno.umask());
  }
});
unitTest({
  perms: {read: true, write: true}
}, function openSyncUrl() {
  const tempDir = Deno.makeTempDirSync();
  const fileUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/test_open.txt`);
  const file = Deno.openSync(fileUrl, {
    write: true,
    createNew: true,
    mode: 406
  });
  file.close();
  const pathInfo = Deno.statSync(fileUrl);
  if (Deno.build.os !== "windows") {
    assertEquals(pathInfo.mode & 511, 406 & ~Deno.umask());
  }
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({
  perms: {read: true, write: true}
}, async function openUrl() {
  const tempDir = await Deno.makeTempDir();
  const fileUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/test_open.txt`);
  const file = await Deno.open(fileUrl, {
    write: true,
    createNew: true,
    mode: 406
  });
  file.close();
  const pathInfo = Deno.statSync(fileUrl);
  if (Deno.build.os !== "windows") {
    assertEquals(pathInfo.mode & 511, 406 & ~Deno.umask());
  }
  Deno.removeSync(tempDir, {recursive: true});
});
unitTest({perms: {write: false}}, async function writePermFailure() {
  const filename = "tests/hello.txt";
  const openOptions2 = [{write: true}, {append: true}];
  for (const options of openOptions2) {
    await assertThrowsAsync(async () => {
      await Deno.open(filename, options);
    }, Deno.errors.PermissionDenied);
  }
});
unitTest(async function openOptions() {
  const filename = "cli/tests/fixture.json";
  await assertThrowsAsync(async () => {
    await Deno.open(filename, {write: false});
  }, Error, "OpenOptions requires at least one option to be true");
  await assertThrowsAsync(async () => {
    await Deno.open(filename, {truncate: true, write: false});
  }, Error, "'truncate' option requires 'write' option");
  await assertThrowsAsync(async () => {
    await Deno.open(filename, {create: true, write: false});
  }, Error, "'create' or 'createNew' options require 'write' or 'append' option");
  await assertThrowsAsync(async () => {
    await Deno.open(filename, {createNew: true, append: false});
  }, Error, "'create' or 'createNew' options require 'write' or 'append' option");
});
unitTest({perms: {read: false}}, async function readPermFailure() {
  await assertThrowsAsync(async () => {
    await Deno.open("package.json", {read: true});
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {write: true}}, async function writeNullBufferFailure() {
  const tempDir = Deno.makeTempDirSync();
  const filename = tempDir + "hello.txt";
  const w = {
    write: true,
    truncate: true,
    create: true
  };
  const file = await Deno.open(filename, w);
  await assertThrowsAsync(async () => {
    await file.write(null);
  });
  file.close();
  await Deno.remove(tempDir, {recursive: true});
});
unitTest({perms: {write: true, read: true}}, async function readNullBufferFailure() {
  const tempDir = Deno.makeTempDirSync();
  const filename = tempDir + "hello.txt";
  const file = await Deno.open(filename, {
    read: true,
    write: true,
    truncate: true,
    create: true
  });
  const bytesRead = await file.read(new Uint8Array(0));
  assert(bytesRead === 0);
  await assertThrowsAsync(async () => {
    await file.read(null);
  }, TypeError);
  file.close();
  await Deno.remove(tempDir, {recursive: true});
});
unitTest({perms: {write: false, read: false}}, async function readWritePermFailure() {
  const filename = "tests/hello.txt";
  await assertThrowsAsync(async () => {
    await Deno.open(filename, {read: true});
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, write: true}}, async function createFile() {
  const tempDir = await Deno.makeTempDir();
  const filename = tempDir + "/test.txt";
  const f = await Deno.create(filename);
  let fileInfo = Deno.statSync(filename);
  assert(fileInfo.isFile);
  assert(fileInfo.size === 0);
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  await f.write(data);
  fileInfo = Deno.statSync(filename);
  assert(fileInfo.size === 5);
  f.close();
  await Deno.remove(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function createFileWithUrl() {
  const tempDir = await Deno.makeTempDir();
  const fileUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/test.txt`);
  const f = await Deno.create(fileUrl);
  let fileInfo = Deno.statSync(fileUrl);
  assert(fileInfo.isFile);
  assert(fileInfo.size === 0);
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  await f.write(data);
  fileInfo = Deno.statSync(fileUrl);
  assert(fileInfo.size === 5);
  f.close();
  await Deno.remove(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function createSyncFile() {
  const tempDir = await Deno.makeTempDir();
  const filename = tempDir + "/test.txt";
  const f = Deno.createSync(filename);
  let fileInfo = Deno.statSync(filename);
  assert(fileInfo.isFile);
  assert(fileInfo.size === 0);
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  await f.write(data);
  fileInfo = Deno.statSync(filename);
  assert(fileInfo.size === 5);
  f.close();
  await Deno.remove(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function createSyncFileWithUrl() {
  const tempDir = await Deno.makeTempDir();
  const fileUrl = new URL(`file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/test.txt`);
  const f = Deno.createSync(fileUrl);
  let fileInfo = Deno.statSync(fileUrl);
  assert(fileInfo.isFile);
  assert(fileInfo.size === 0);
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  await f.write(data);
  fileInfo = Deno.statSync(fileUrl);
  assert(fileInfo.size === 5);
  f.close();
  await Deno.remove(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function openModeWrite() {
  const tempDir = Deno.makeTempDirSync();
  const encoder = new TextEncoder();
  const filename = tempDir + "hello.txt";
  const data = encoder.encode("Hello world!\n");
  let file = await Deno.open(filename, {
    create: true,
    write: true,
    truncate: true
  });
  let fileInfo = Deno.statSync(filename);
  assert(fileInfo.isFile);
  assertEquals(fileInfo.size, 0);
  await file.write(data);
  fileInfo = Deno.statSync(filename);
  assertEquals(fileInfo.size, 13);
  let thrown = false;
  try {
    const buf = new Uint8Array(20);
    await file.read(buf);
  } catch (e) {
    thrown = true;
  } finally {
    assert(thrown, "'w' mode shouldn't allow to read file");
  }
  file.close();
  file = await Deno.open(filename, {
    write: true,
    truncate: true
  });
  file.close();
  const fileSize = Deno.statSync(filename).size;
  assertEquals(fileSize, 0);
  await Deno.remove(tempDir, {recursive: true});
});
unitTest({perms: {read: true, write: true}}, async function openModeWriteRead() {
  const tempDir = Deno.makeTempDirSync();
  const encoder = new TextEncoder();
  const filename = tempDir + "hello.txt";
  const data = encoder.encode("Hello world!\n");
  const file = await Deno.open(filename, {
    write: true,
    truncate: true,
    create: true,
    read: true
  });
  const seekPosition = 0;
  let fileInfo = Deno.statSync(filename);
  assert(fileInfo.isFile);
  assertEquals(fileInfo.size, 0);
  await file.write(data);
  fileInfo = Deno.statSync(filename);
  assertEquals(fileInfo.size, 13);
  const buf = new Uint8Array(20);
  const cursorPosition = await file.seek(seekPosition, Deno.SeekMode.Start);
  assertEquals(seekPosition, cursorPosition);
  const result = await file.read(buf);
  assertEquals(result, 13);
  file.close();
  await Deno.remove(tempDir, {recursive: true});
});
unitTest({perms: {read: true}}, async function seekStart() {
  const filename = "cli/tests/hello.txt";
  const file = await Deno.open(filename);
  const seekPosition = 6;
  await file.read(new Uint8Array(1));
  const cursorPosition = await file.seek(seekPosition, Deno.SeekMode.Start);
  assertEquals(seekPosition, cursorPosition);
  const buf = new Uint8Array(6);
  await file.read(buf);
  const decoded = new TextDecoder().decode(buf);
  assertEquals(decoded, "world!");
  file.close();
});
unitTest({perms: {read: true}}, function seekSyncStart() {
  const filename = "cli/tests/hello.txt";
  const file = Deno.openSync(filename);
  const seekPosition = 6;
  file.readSync(new Uint8Array(1));
  const cursorPosition = file.seekSync(seekPosition, Deno.SeekMode.Start);
  assertEquals(seekPosition, cursorPosition);
  const buf = new Uint8Array(6);
  file.readSync(buf);
  const decoded = new TextDecoder().decode(buf);
  assertEquals(decoded, "world!");
  file.close();
});
unitTest({perms: {read: true}}, async function seekCurrent() {
  const filename = "cli/tests/hello.txt";
  const file = await Deno.open(filename);
  await file.read(new Uint8Array(1));
  const seekPosition = 5;
  const cursorPosition = await file.seek(seekPosition, Deno.SeekMode.Current);
  assertEquals(seekPosition + 1, cursorPosition);
  const buf = new Uint8Array(6);
  await file.read(buf);
  const decoded = new TextDecoder().decode(buf);
  assertEquals(decoded, "world!");
  file.close();
});
unitTest({perms: {read: true}}, function seekSyncCurrent() {
  const filename = "cli/tests/hello.txt";
  const file = Deno.openSync(filename);
  file.readSync(new Uint8Array(1));
  const seekPosition = 5;
  const cursorPosition = file.seekSync(seekPosition, Deno.SeekMode.Current);
  assertEquals(seekPosition + 1, cursorPosition);
  const buf = new Uint8Array(6);
  file.readSync(buf);
  const decoded = new TextDecoder().decode(buf);
  assertEquals(decoded, "world!");
  file.close();
});
unitTest({perms: {read: true}}, async function seekEnd() {
  const filename = "cli/tests/hello.txt";
  const file = await Deno.open(filename);
  const seekPosition = -6;
  const cursorPosition = await file.seek(seekPosition, Deno.SeekMode.End);
  assertEquals(6, cursorPosition);
  const buf = new Uint8Array(6);
  await file.read(buf);
  const decoded = new TextDecoder().decode(buf);
  assertEquals(decoded, "world!");
  file.close();
});
unitTest({perms: {read: true}}, function seekSyncEnd() {
  const filename = "cli/tests/hello.txt";
  const file = Deno.openSync(filename);
  const seekPosition = -6;
  const cursorPosition = file.seekSync(seekPosition, Deno.SeekMode.End);
  assertEquals(6, cursorPosition);
  const buf = new Uint8Array(6);
  file.readSync(buf);
  const decoded = new TextDecoder().decode(buf);
  assertEquals(decoded, "world!");
  file.close();
});
unitTest({perms: {read: true}}, async function seekMode() {
  const filename = "cli/tests/hello.txt";
  const file = await Deno.open(filename);
  await assertThrowsAsync(async () => {
    await file.seek(1, -1);
  }, TypeError, "Invalid seek mode");
  const buf = new Uint8Array(1);
  await file.read(buf);
  assertEquals(new TextDecoder().decode(buf), "H");
  file.close();
});
