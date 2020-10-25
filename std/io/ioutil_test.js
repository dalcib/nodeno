import {assertEquals} from "../testing/asserts.js";
import {
  copyN,
  readInt,
  readLong,
  readShort,
  sliceLongToBytes
} from "./ioutil.js";
import {StringReader} from "./readers.js";
import {BufReader} from "./bufio.js";
import {tempFile} from "./util.js";
import * as path from "../path/mod.js";
class BinaryReader {
  constructor(bytes = new Uint8Array(0)) {
    this.bytes = bytes;
    this.index = 0;
  }
  read(p) {
    p.set(this.bytes.subarray(this.index, p.byteLength));
    this.index += p.byteLength;
    return Promise.resolve(p.byteLength);
  }
}
Deno.test("testReadShort", async function() {
  const r = new BinaryReader(new Uint8Array([18, 52]));
  const short = await readShort(new BufReader(r));
  assertEquals(short, 4660);
});
Deno.test("testReadInt", async function() {
  const r = new BinaryReader(new Uint8Array([18, 52, 86, 120]));
  const int = await readInt(new BufReader(r));
  assertEquals(int, 305419896);
});
Deno.test("testReadLong", async function() {
  const r = new BinaryReader(new Uint8Array([0, 0, 0, 120, 18, 52, 86, 120]));
  const long = await readLong(new BufReader(r));
  assertEquals(long, 515701495416);
});
Deno.test("testReadLong2", async function() {
  const r = new BinaryReader(new Uint8Array([0, 0, 0, 0, 18, 52, 86, 120]));
  const long = await readLong(new BufReader(r));
  assertEquals(long, 305419896);
});
Deno.test("testSliceLongToBytes", function() {
  const arr = sliceLongToBytes(1311768467294899700);
  const actual = readLong(new BufReader(new BinaryReader(new Uint8Array(arr))));
  const expected = readLong(new BufReader(new BinaryReader(new Uint8Array([18, 52, 86, 120, 144, 171, 205, 239]))));
  assertEquals(actual, expected);
});
Deno.test("testSliceLongToBytes2", function() {
  const arr = sliceLongToBytes(305419896);
  assertEquals(arr, [0, 0, 0, 0, 18, 52, 86, 120]);
});
Deno.test("testCopyN1", async function() {
  const w = new Deno.Buffer();
  const r = new StringReader("abcdefghij");
  const n = await copyN(r, w, 3);
  assertEquals(n, 3);
  assertEquals(new TextDecoder().decode(w.bytes()), "abc");
});
Deno.test("testCopyN2", async function() {
  const w = new Deno.Buffer();
  const r = new StringReader("abcdefghij");
  const n = await copyN(r, w, 11);
  assertEquals(n, 10);
  assertEquals(new TextDecoder().decode(w.bytes()), "abcdefghij");
});
Deno.test("copyNWriteAllData", async function() {
  const {filepath, file} = await tempFile(path.resolve("io"));
  const size = 16 * 1024 + 1;
  const data = "a".repeat(32 * 1024);
  const r = new StringReader(data);
  const n = await copyN(r, file, size);
  file.close();
  await Deno.remove(filepath);
  assertEquals(n, size);
});
Deno.test("testStringReaderEof", async function() {
  const r = new StringReader("abc");
  assertEquals(await r.read(new Uint8Array()), 0);
  assertEquals(await r.read(new Uint8Array(4)), 3);
  assertEquals(await r.read(new Uint8Array(1)), null);
});
