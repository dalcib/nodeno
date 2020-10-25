import {assert, assertEquals} from "../testing/asserts.mjs";
import {fromStreamReader, fromStreamWriter} from "./streams.mjs";
function repeat(c, bytes) {
  assertEquals(c.length, 1);
  const ui8 = new Uint8Array(bytes);
  ui8.fill(c.charCodeAt(0));
  return ui8;
}
Deno.test("toWriterCheck", async function() {
  const written = [];
  const chunks = ["hello", "deno", "land"];
  const writableStream = new WritableStream({
    write(chunk) {
      const decoder = new TextDecoder();
      written.push(decoder.decode(chunk));
    }
  });
  const encoder = new TextEncoder();
  const writer = fromStreamWriter(writableStream.getWriter());
  for (const chunk of chunks) {
    const n = await writer.write(encoder.encode(chunk));
    assertEquals(n, chunk.length);
  }
  assertEquals(written, chunks);
});
Deno.test("toReaderCheck", async function() {
  const chunks = ["hello", "deno", "land"];
  const expected = chunks.slice();
  const readChunks = [];
  const readableStream = new ReadableStream({
    pull(controller) {
      const encoder = new TextEncoder();
      const chunk = chunks.shift();
      if (!chunk)
        return controller.close();
      controller.enqueue(encoder.encode(chunk));
    }
  });
  const decoder = new TextDecoder();
  const reader = fromStreamReader(readableStream.getReader());
  let i = 0;
  while (true) {
    const b = new Uint8Array(1024);
    const n = await reader.read(b);
    if (n === null)
      break;
    readChunks.push(b.subarray(0, n));
    assert(i < expected.length);
    i++;
  }
  assertEquals(expected, readChunks.map((chunk) => decoder.decode(chunk)));
});
Deno.test("toReaderBigChunksCheck", async function() {
  const bufSize = 1024;
  const chunkSize = 3 * bufSize;
  const writer = new Deno.Buffer();
  const chunks = [
    "a".repeat(chunkSize),
    "b".repeat(chunkSize),
    "c".repeat(chunkSize)
  ];
  const expected = chunks.slice();
  const readableStream = new ReadableStream({
    pull(controller) {
      const encoder = new TextEncoder();
      const chunk = chunks.shift();
      if (!chunk)
        return controller.close();
      controller.enqueue(encoder.encode(chunk));
    }
  });
  const reader = fromStreamReader(readableStream.getReader());
  const n = await Deno.copy(reader, writer, {bufSize});
  const expectedWritten = chunkSize * expected.length;
  assertEquals(n, chunkSize * expected.length);
  assertEquals(writer.length, expectedWritten);
});
Deno.test("toReaderBigIrregularChunksCheck", async function() {
  const bufSize = 1024;
  const chunkSize = 3 * bufSize;
  const writer = new Deno.Buffer();
  const chunks = [
    repeat("a", chunkSize),
    repeat("b", chunkSize + 253),
    repeat("c", chunkSize + 8)
  ];
  const expected = new Uint8Array(chunks.slice().map((chunk) => [...chunk]).flat());
  const readableStream = new ReadableStream({
    pull(controller) {
      const chunk = chunks.shift();
      if (!chunk)
        return controller.close();
      controller.enqueue(chunk);
    }
  });
  const reader = fromStreamReader(readableStream.getReader());
  const n = await Deno.copy(reader, writer, {bufSize});
  assertEquals(n, expected.length);
  assertEquals(expected, writer.bytes());
});
