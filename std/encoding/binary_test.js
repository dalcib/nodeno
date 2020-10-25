import {assertEquals, assertThrowsAsync} from "../testing/asserts.js";
import {
  getNBytes,
  putVarbig,
  putVarnum,
  readVarbig,
  readVarnum,
  sizeof,
  varbig,
  varbigBytes,
  varnum,
  varnumBytes,
  writeVarbig,
  writeVarnum
} from "./binary.js";
Deno.test("testGetNBytes", async function() {
  const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const buff = new Deno.Buffer(data.buffer);
  const rslt = await getNBytes(buff, 8);
  assertEquals(rslt, data);
});
Deno.test("testGetNBytesThrows", async function() {
  const data = new Uint8Array([1, 2, 3, 4]);
  const buff = new Deno.Buffer(data.buffer);
  await assertThrowsAsync(async () => {
    await getNBytes(buff, 8);
  }, Deno.errors.UnexpectedEof);
});
Deno.test("testPutVarbig", function() {
  const buff = new Uint8Array(8);
  putVarbig(buff, 0xffeeddccbbaa9988n);
  assertEquals(buff, new Uint8Array([255, 238, 221, 204, 187, 170, 153, 136]));
});
Deno.test("testPutVarbigLittleEndian", function() {
  const buff = new Uint8Array(8);
  putVarbig(buff, 0x8899aabbccddeeffn, {endian: "little"});
  assertEquals(buff, new Uint8Array([255, 238, 221, 204, 187, 170, 153, 136]));
});
Deno.test("testPutVarnum", function() {
  const buff = new Uint8Array(4);
  putVarnum(buff, 4293844428);
  assertEquals(buff, new Uint8Array([255, 238, 221, 204]));
});
Deno.test("testPutVarnumLittleEndian", function() {
  const buff = new Uint8Array(4);
  putVarnum(buff, 3437096703, {endian: "little"});
  assertEquals(buff, new Uint8Array([255, 238, 221, 204]));
});
Deno.test("testReadVarbig", async function() {
  const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const buff = new Deno.Buffer(data.buffer);
  const rslt = await readVarbig(buff);
  assertEquals(rslt, 0x0102030405060708n);
});
Deno.test("testReadVarbigLittleEndian", async function() {
  const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const buff = new Deno.Buffer(data.buffer);
  const rslt = await readVarbig(buff, {endian: "little"});
  assertEquals(rslt, 0x0807060504030201n);
});
Deno.test("testReadVarnum", async function() {
  const data = new Uint8Array([1, 2, 3, 4]);
  const buff = new Deno.Buffer(data.buffer);
  const rslt = await readVarnum(buff);
  assertEquals(rslt, 16909060);
});
Deno.test("testReadVarnumLittleEndian", async function() {
  const data = new Uint8Array([1, 2, 3, 4]);
  const buff = new Deno.Buffer(data.buffer);
  const rslt = await readVarnum(buff, {endian: "little"});
  assertEquals(rslt, 67305985);
});
Deno.test("testSizeof", function() {
  assertEquals(1, sizeof("int8"));
  assertEquals(1, sizeof("uint8"));
  assertEquals(2, sizeof("int16"));
  assertEquals(2, sizeof("uint16"));
  assertEquals(4, sizeof("int32"));
  assertEquals(4, sizeof("uint32"));
  assertEquals(8, sizeof("int64"));
  assertEquals(8, sizeof("uint64"));
  assertEquals(4, sizeof("float32"));
  assertEquals(8, sizeof("float64"));
});
Deno.test("testVarbig", function() {
  const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const rslt = varbig(data);
  assertEquals(rslt, 0x0102030405060708n);
});
Deno.test("testVarbigLittleEndian", function() {
  const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const rslt = varbig(data, {endian: "little"});
  assertEquals(rslt, 0x0807060504030201n);
});
Deno.test("testVarnum", function() {
  const data = new Uint8Array([1, 2, 3, 4]);
  const rslt = varnum(data);
  assertEquals(rslt, 16909060);
});
Deno.test("testVarnumLittleEndian", function() {
  const data = new Uint8Array([1, 2, 3, 4]);
  const rslt = varnum(data, {endian: "little"});
  assertEquals(rslt, 67305985);
});
Deno.test("testWriteVarbig", async function() {
  const data = new Uint8Array(8);
  const buff = new Deno.Buffer();
  await writeVarbig(buff, 0x0102030405060708n);
  await buff.read(data);
  assertEquals(data, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
});
Deno.test("testWriteVarbigLittleEndian", async function() {
  const data = new Uint8Array(8);
  const buff = new Deno.Buffer();
  await writeVarbig(buff, 0x0807060504030201n, {endian: "little"});
  await buff.read(data);
  assertEquals(data, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
});
Deno.test("testWriteVarnum", async function() {
  const data = new Uint8Array(4);
  const buff = new Deno.Buffer();
  await writeVarnum(buff, 16909060);
  await buff.read(data);
  assertEquals(data, new Uint8Array([1, 2, 3, 4]));
});
Deno.test("testWriteVarnumLittleEndian", async function() {
  const data = new Uint8Array(4);
  const buff = new Deno.Buffer();
  await writeVarnum(buff, 67305985, {endian: "little"});
  await buff.read(data);
  assertEquals(data, new Uint8Array([1, 2, 3, 4]));
});
Deno.test("testVarbigBytes", function() {
  const rslt = varbigBytes(0x0102030405060708n);
  assertEquals(rslt, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
});
Deno.test("testVarbigBytesLittleEndian", function() {
  const rslt = varbigBytes(0x0807060504030201n, {endian: "little"});
  assertEquals(rslt, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
});
Deno.test("testVarnumBytes", function() {
  const rslt = varnumBytes(16909060);
  assertEquals(rslt, new Uint8Array([1, 2, 3, 4]));
});
Deno.test("testVarnumBytesLittleEndian", function() {
  const rslt = varnumBytes(67305985, {endian: "little"});
  assertEquals(rslt, new Uint8Array([1, 2, 3, 4]));
});
