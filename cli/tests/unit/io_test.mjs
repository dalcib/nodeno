import {assertEquals, unitTest} from "./test_util.mjs";
const DEFAULT_BUF_SIZE = 32 * 1024;
function repeat(c, bytes) {
  assertEquals(c.length, 1);
  const ui8 = new Uint8Array(bytes);
  ui8.fill(c.charCodeAt(0));
  return ui8;
}
function spyRead(obj) {
  const spy = {
    calls: 0
  };
  const orig = obj.read.bind(obj);
  obj.read = (p) => {
    spy.calls++;
    return orig(p);
  };
  return spy;
}
unitTest(async function copyWithDefaultBufferSize() {
  const xBytes = repeat("b", DEFAULT_BUF_SIZE);
  const reader = new Deno.Buffer(xBytes.buffer);
  const write = new Deno.Buffer();
  const readSpy = spyRead(reader);
  const n = await Deno.copy(reader, write);
  assertEquals(n, xBytes.length);
  assertEquals(write.length, xBytes.length);
  assertEquals(readSpy.calls, 2);
});
unitTest(async function copyWithCustomBufferSize() {
  const bufSize = 1024;
  const xBytes = repeat("b", DEFAULT_BUF_SIZE);
  const reader = new Deno.Buffer(xBytes.buffer);
  const write = new Deno.Buffer();
  const readSpy = spyRead(reader);
  const n = await Deno.copy(reader, write, {bufSize});
  assertEquals(n, xBytes.length);
  assertEquals(write.length, xBytes.length);
  assertEquals(readSpy.calls, DEFAULT_BUF_SIZE / bufSize + 1);
});
unitTest({perms: {write: true}}, async function copyBufferToFile() {
  const filePath = "test-file.txt";
  const bufSize = 32 * 1024;
  const xBytes = repeat("b", bufSize);
  const reader = new Deno.Buffer(xBytes.buffer);
  const write = await Deno.open(filePath, {write: true, create: true});
  const n = await Deno.copy(reader, write, {bufSize});
  assertEquals(n, xBytes.length);
  write.close();
  await Deno.remove(filePath);
});
