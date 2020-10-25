import {assert, assertEquals, fail} from "../testing/asserts.mjs";
import {
  BufferFullError,
  BufReader,
  BufWriter,
  BufWriterSync,
  PartialReadError,
  readLines,
  readStringDelim
} from "./bufio.mjs";
import * as iotest from "./_iotest.mjs";
import {StringReader} from "./readers.mjs";
import {StringWriter} from "./writers.mjs";
import {charCode} from "./util.mjs";
import {copyBytes} from "../bytes/mod.mjs";
const encoder = new TextEncoder();
async function readBytes(buf) {
  const b = new Uint8Array(1e3);
  let nb = 0;
  while (true) {
    const c = await buf.readByte();
    if (c === null) {
      break;
    }
    b[nb] = c;
    nb++;
  }
  const decoder = new TextDecoder();
  return decoder.decode(b.subarray(0, nb));
}
Deno.test("bufioReaderSimple", async function() {
  const data = "hello world";
  const b = new BufReader(new StringReader(data));
  const s = await readBytes(b);
  assertEquals(s, data);
});
const readMakers = [
  {name: "full", fn: (r) => r},
  {
    name: "byte",
    fn: (r) => new iotest.OneByteReader(r)
  },
  {name: "half", fn: (r) => new iotest.HalfReader(r)}
];
async function reads(buf, m) {
  const b = new Uint8Array(1e3);
  let nb = 0;
  while (true) {
    const result = await buf.read(b.subarray(nb, nb + m));
    if (result === null) {
      break;
    }
    nb += result;
  }
  const decoder = new TextDecoder();
  return decoder.decode(b.subarray(0, nb));
}
const bufreaders = [
  {name: "1", fn: (b) => reads(b, 1)},
  {name: "2", fn: (b) => reads(b, 2)},
  {name: "3", fn: (b) => reads(b, 3)},
  {name: "4", fn: (b) => reads(b, 4)},
  {name: "5", fn: (b) => reads(b, 5)},
  {name: "7", fn: (b) => reads(b, 7)},
  {name: "bytes", fn: readBytes}
];
const MIN_READ_BUFFER_SIZE = 16;
const bufsizes = [
  0,
  MIN_READ_BUFFER_SIZE,
  23,
  32,
  46,
  64,
  93,
  128,
  1024,
  4096
];
Deno.test("bufioBufReader", async function() {
  const texts = new Array(31);
  let str = "";
  let all = "";
  for (let i = 0; i < texts.length - 1; i++) {
    texts[i] = str + "\n";
    all += texts[i];
    str += String.fromCharCode(i % 26 + 97);
  }
  texts[texts.length - 1] = all;
  for (const text of texts) {
    for (const readmaker of readMakers) {
      for (const bufreader of bufreaders) {
        for (const bufsize of bufsizes) {
          const read = readmaker.fn(new StringReader(text));
          const buf = new BufReader(read, bufsize);
          const s = await bufreader.fn(buf);
          const debugStr = `reader=${readmaker.name} fn=${bufreader.name} bufsize=${bufsize} want=${text} got=${s}`;
          assertEquals(s, text, debugStr);
        }
      }
    }
  }
});
Deno.test("bufioBufferFull", async function() {
  const longString = "And now, hello, world! It is the time for all good men to come to the aid of their party";
  const buf = new BufReader(new StringReader(longString), MIN_READ_BUFFER_SIZE);
  const decoder = new TextDecoder();
  try {
    await buf.readSlice(charCode("!"));
    fail("readSlice should throw");
  } catch (err) {
    assert(err instanceof BufferFullError);
    assert(err.partial instanceof Uint8Array);
    assertEquals(decoder.decode(err.partial), "And now, hello, ");
  }
  const line = await buf.readSlice(charCode("!"));
  assert(line !== null);
  const actual = decoder.decode(line);
  assertEquals(actual, "world!");
});
Deno.test("bufioReadString", async function() {
  const string = "And now, hello world!";
  const buf = new BufReader(new StringReader(string), MIN_READ_BUFFER_SIZE);
  const line = await buf.readString(",");
  assert(line !== null);
  assertEquals(line, "And now,");
  assertEquals(line.length, 8);
  const line2 = await buf.readString(",");
  assert(line2 !== null);
  assertEquals(line2, " hello world!");
  assertEquals(await buf.readString(","), null);
  try {
    await buf.readString("deno");
    fail("should throw");
  } catch (err) {
    assert(err.message, "Delimiter should be a single character");
  }
});
const testInput = encoder.encode("012\n345\n678\n9ab\ncde\nfgh\nijk\nlmn\nopq\nrst\nuvw\nxy");
const testInputrn = encoder.encode("012\r\n345\r\n678\r\n9ab\r\ncde\r\nfgh\r\nijk\r\nlmn\r\nopq\r\nrst\r\nuvw\r\nxy\r\n\n\r\n");
const testOutput = encoder.encode("0123456789abcdefghijklmnopqrstuvwxy");
class TestReader {
  constructor(data, stride) {
    this.data = data;
    this.stride = stride;
  }
  read(buf) {
    let nread = this.stride;
    if (nread > this.data.byteLength) {
      nread = this.data.byteLength;
    }
    if (nread > buf.byteLength) {
      nread = buf.byteLength;
    }
    if (nread === 0) {
      return Promise.resolve(null);
    }
    copyBytes(this.data, buf);
    this.data = this.data.subarray(nread);
    return Promise.resolve(nread);
  }
}
async function testReadLine(input) {
  for (let stride = 1; stride < 2; stride++) {
    let done = 0;
    const reader = new TestReader(input, stride);
    const l = new BufReader(reader, input.byteLength + 1);
    while (true) {
      const r = await l.readLine();
      if (r === null) {
        break;
      }
      const {line, more} = r;
      assertEquals(more, false);
      const want = testOutput.subarray(done, done + line.byteLength);
      assertEquals(line, want, `Bad line at stride ${stride}: want: ${want} got: ${line}`);
      done += line.byteLength;
    }
    assertEquals(done, testOutput.byteLength, `readLine didn't return everything: got: ${done}, want: ${testOutput} (stride: ${stride})`);
  }
}
Deno.test("bufioReadLine", async function() {
  await testReadLine(testInput);
  await testReadLine(testInputrn);
});
Deno.test("bufioPeek", async function() {
  const decoder = new TextDecoder();
  const p = new Uint8Array(10);
  const buf = new BufReader(new StringReader("abcdefghijklmnop"), MIN_READ_BUFFER_SIZE);
  let actual = await buf.peek(1);
  assert(actual !== null);
  assertEquals(decoder.decode(actual), "a");
  actual = await buf.peek(4);
  assert(actual !== null);
  assertEquals(decoder.decode(actual), "abcd");
  try {
    await buf.peek(32);
    fail("peek() should throw");
  } catch (err) {
    assert(err instanceof BufferFullError);
    assert(err.partial instanceof Uint8Array);
    assertEquals(decoder.decode(err.partial), "abcdefghijklmnop");
  }
  await buf.read(p.subarray(0, 3));
  assertEquals(decoder.decode(p.subarray(0, 3)), "abc");
  actual = await buf.peek(1);
  assert(actual !== null);
  assertEquals(decoder.decode(actual), "d");
  actual = await buf.peek(1);
  assert(actual !== null);
  assertEquals(decoder.decode(actual), "d");
  actual = await buf.peek(1);
  assert(actual !== null);
  assertEquals(decoder.decode(actual), "d");
  actual = await buf.peek(2);
  assert(actual !== null);
  assertEquals(decoder.decode(actual), "de");
  const res = await buf.read(p.subarray(0, 3));
  assertEquals(decoder.decode(p.subarray(0, 3)), "def");
  assert(res !== null);
  actual = await buf.peek(4);
  assert(actual !== null);
  assertEquals(decoder.decode(actual), "ghij");
  await buf.read(p);
  assertEquals(decoder.decode(p), "ghijklmnop");
  actual = await buf.peek(0);
  assert(actual !== null);
  assertEquals(decoder.decode(actual), "");
  const r = await buf.peek(1);
  assert(r === null);
});
Deno.test("bufioWriter", async function() {
  const data = new Uint8Array(8192);
  for (let i = 0; i < data.byteLength; i++) {
    data[i] = charCode(" ") + i % (charCode("~") - charCode(" "));
  }
  const w = new Deno.Buffer();
  for (const nwrite of bufsizes) {
    for (const bs of bufsizes) {
      w.reset();
      const buf = new BufWriter(w, bs);
      const context = `nwrite=${nwrite} bufsize=${bs}`;
      const n = await buf.write(data.subarray(0, nwrite));
      assertEquals(n, nwrite, context);
      await buf.flush();
      const written = w.bytes();
      assertEquals(written.byteLength, nwrite);
      for (let l = 0; l < written.byteLength; l++) {
        assertEquals(written[l], data[l]);
      }
    }
  }
});
Deno.test("bufioWriterSync", function() {
  const data = new Uint8Array(8192);
  for (let i = 0; i < data.byteLength; i++) {
    data[i] = charCode(" ") + i % (charCode("~") - charCode(" "));
  }
  const w = new Deno.Buffer();
  for (const nwrite of bufsizes) {
    for (const bs of bufsizes) {
      w.reset();
      const buf = new BufWriterSync(w, bs);
      const context = `nwrite=${nwrite} bufsize=${bs}`;
      const n = buf.writeSync(data.subarray(0, nwrite));
      assertEquals(n, nwrite, context);
      buf.flush();
      const written = w.bytes();
      assertEquals(written.byteLength, nwrite);
      for (let l = 0; l < written.byteLength; l++) {
        assertEquals(written[l], data[l]);
      }
    }
  }
});
Deno.test("bufReaderReadFull", async function() {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const text = "Hello World";
  const data = new Deno.Buffer(enc.encode(text));
  const bufr = new BufReader(data, 3);
  {
    const buf = new Uint8Array(6);
    const r = await bufr.readFull(buf);
    assert(r !== null);
    assertEquals(r, buf);
    assertEquals(dec.decode(buf), "Hello ");
  }
  {
    const buf = new Uint8Array(6);
    try {
      await bufr.readFull(buf);
      fail("readFull() should throw PartialReadError");
    } catch (err) {
      assert(err instanceof PartialReadError);
      assert(err.partial instanceof Uint8Array);
      assertEquals(err.partial.length, 5);
      assertEquals(dec.decode(buf.subarray(0, 5)), "World");
    }
  }
});
Deno.test("readStringDelimAndLines", async function() {
  const enc = new TextEncoder();
  const data = new Deno.Buffer(enc.encode("Hello World	Hello World 2	Hello World 3"));
  const chunks_ = [];
  for await (const c of readStringDelim(data, "	")) {
    chunks_.push(c);
  }
  assertEquals(chunks_.length, 3);
  assertEquals(chunks_, ["Hello World", "Hello World 2", "Hello World 3"]);
  const linesData = new Deno.Buffer(enc.encode("0\n1\n2\n3\n4\n5\n6\n7\n8\n9"));
  const lines_ = [];
  for await (const l of readLines(linesData)) {
    lines_.push(l);
  }
  assertEquals(lines_.length, 10);
  assertEquals(lines_, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
});
Deno.test("bufReaderShouldNotShareArrayBufferAcrossReads", async function() {
  const decoder = new TextDecoder();
  const data = "abcdefghijklmnopqrstuvwxyz";
  const bufSize = 25;
  const b = new BufReader(new StringReader(data), bufSize);
  const r1 = await b.readLine();
  assert(r1 !== null);
  assertEquals(decoder.decode(r1.line), "abcdefghijklmnopqrstuvwxy");
  const r2 = await b.readLine();
  assert(r2 !== null);
  assertEquals(decoder.decode(r2.line), "z");
  assert(r1.line.buffer !== r2.line.buffer, "array buffer should not be shared across reads");
});
Deno.test({
  name: "Reset buffer after flush",
  async fn() {
    const stringWriter = new StringWriter();
    const bufWriter = new BufWriter(stringWriter);
    const encoder2 = new TextEncoder();
    await bufWriter.write(encoder2.encode("hello\nworld\nhow\nare\nyou?\n\n"));
    await bufWriter.flush();
    await bufWriter.write(encoder2.encode("foobar\n\n"));
    await bufWriter.flush();
    const actual = stringWriter.toString();
    assertEquals(actual, "hello\nworld\nhow\nare\nyou?\n\nfoobar\n\n");
  }
});
Deno.test({
  name: "Reset buffer after flush sync",
  fn() {
    const stringWriter = new StringWriter();
    const bufWriter = new BufWriterSync(stringWriter);
    const encoder2 = new TextEncoder();
    bufWriter.writeSync(encoder2.encode("hello\nworld\nhow\nare\nyou?\n\n"));
    bufWriter.flush();
    bufWriter.writeSync(encoder2.encode("foobar\n\n"));
    bufWriter.flush();
    const actual = stringWriter.toString();
    assertEquals(actual, "hello\nworld\nhow\nare\nyou?\n\nfoobar\n\n");
  }
});
Deno.test({
  name: "BufWriter.flush should write all bytes",
  async fn() {
    const bufSize = 16 * 1024;
    const data = new Uint8Array(bufSize);
    data.fill("a".charCodeAt(0));
    const cache = [];
    const writer = {
      write(p) {
        cache.push(p.subarray(0, 1));
        return Promise.resolve(1);
      }
    };
    const bufWriter = new BufWriter(writer);
    await bufWriter.write(data);
    await bufWriter.flush();
    const buf = new Uint8Array(cache.length);
    for (let i = 0; i < cache.length; i++)
      buf.set(cache[i], i);
    assertEquals(data, buf);
  }
});
Deno.test({
  name: "BufWriterSync.flush should write all bytes",
  fn() {
    const bufSize = 16 * 1024;
    const data = new Uint8Array(bufSize);
    data.fill("a".charCodeAt(0));
    const cache = [];
    const writer = {
      writeSync(p) {
        cache.push(p.subarray(0, 1));
        return 1;
      }
    };
    const bufWriter = new BufWriterSync(writer);
    bufWriter.writeSync(data);
    bufWriter.flush();
    const buf = new Uint8Array(cache.length);
    for (let i = 0; i < cache.length; i++)
      buf.set(cache[i], i);
    assertEquals(data, buf);
  }
});
