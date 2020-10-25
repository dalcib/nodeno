import {assert, assertEquals} from "../testing/asserts.js";
import {dirname, fromFileUrl, resolve} from "../path/mod.js";
import {Tar, Untar} from "./tar.js";
const moduleDir = dirname(fromFileUrl(import.meta.url));
const testdataDir = resolve(moduleDir, "testdata");
const filePath = resolve(testdataDir, "example.txt");
async function createTar(entries) {
  const tar2 = new Tar();
  for (const file of entries) {
    let options;
    if (file.content) {
      options = {
        reader: new Deno.Buffer(file.content),
        contentSize: file.content.byteLength
      };
    } else {
      options = {filePath: file.filePath};
    }
    await tar2.append(file.name, options);
  }
  return tar2;
}
Deno.test("createTarArchive", async function() {
  const tar2 = new Tar();
  const content = new TextEncoder().encode("hello tar world!");
  await tar2.append("output.txt", {
    reader: new Deno.Buffer(content),
    contentSize: content.byteLength
  });
  await tar2.append("dir/tar.ts", {filePath});
  const writer = new Deno.Buffer();
  const wrote = await Deno.copy(tar2.getReader(), writer);
  assertEquals(wrote, 3072);
});
Deno.test("deflateTarArchive", async function() {
  const fileName = "output.txt";
  const text = "hello tar world!";
  const tar2 = new Tar();
  const content = new TextEncoder().encode(text);
  await tar2.append(fileName, {
    reader: new Deno.Buffer(content),
    contentSize: content.byteLength
  });
  const untar = new Untar(tar2.getReader());
  const result = await untar.extract();
  assert(result !== null);
  const untarText = new TextDecoder("utf-8").decode(await Deno.readAll(result));
  assertEquals(await untar.extract(), null);
  assertEquals(result.fileName, fileName);
  assertEquals(untarText, text);
});
Deno.test("appendFileWithLongNameToTarArchive", async function() {
  const fileName = new Array(10).join("long-file-name/") + "file-name.txt";
  const text = "hello tar world!";
  const tar2 = new Tar();
  const content = new TextEncoder().encode(text);
  await tar2.append(fileName, {
    reader: new Deno.Buffer(content),
    contentSize: content.byteLength
  });
  const untar = new Untar(tar2.getReader());
  const result = await untar.extract();
  assert(result !== null);
  const untarText = new TextDecoder("utf-8").decode(await Deno.readAll(result));
  assertEquals(result.fileName, fileName);
  assertEquals(untarText, text);
});
Deno.test("untarAsyncIterator", async function() {
  const entries = [
    {
      name: "output.txt",
      content: new TextEncoder().encode("hello tar world!")
    },
    {
      name: "dir/tar.ts",
      filePath
    }
  ];
  const tar2 = await createTar(entries);
  const untar = new Untar(tar2.getReader());
  for await (const entry of untar) {
    const expected = entries.shift();
    assert(expected);
    let content = expected.content;
    if (expected.filePath) {
      content = await Deno.readFile(expected.filePath);
    }
    assertEquals(content, await Deno.readAll(entry));
    assertEquals(expected.name, entry.fileName);
  }
  assertEquals(entries.length, 0);
});
Deno.test("untarAsyncIteratorWithoutReadingBody", async function() {
  const entries = [
    {
      name: "output.txt",
      content: new TextEncoder().encode("hello tar world!")
    },
    {
      name: "dir/tar.ts",
      filePath
    }
  ];
  const tar2 = await createTar(entries);
  const untar = new Untar(tar2.getReader());
  for await (const entry of untar) {
    const expected = entries.shift();
    assert(expected);
    assertEquals(expected.name, entry.fileName);
  }
  assertEquals(entries.length, 0);
});
Deno.test("untarAsyncIteratorWithoutReadingBodyFromFileReader", async function() {
  const entries = [
    {
      name: "output.txt",
      content: new TextEncoder().encode("hello tar world!")
    },
    {
      name: "dir/tar.ts",
      filePath
    }
  ];
  const outputFile = resolve(testdataDir, "test.tar");
  const tar2 = await createTar(entries);
  const file = await Deno.open(outputFile, {create: true, write: true});
  await Deno.copy(tar2.getReader(), file);
  file.close();
  const reader = await Deno.open(outputFile, {read: true});
  const untar = new Untar(reader);
  for await (const entry of untar) {
    const expected = entries.shift();
    assert(expected);
    assertEquals(expected.name, entry.fileName);
  }
  reader.close();
  await Deno.remove(outputFile);
  assertEquals(entries.length, 0);
});
Deno.test("untarAsyncIteratorFromFileReader", async function() {
  const entries = [
    {
      name: "output.txt",
      content: new TextEncoder().encode("hello tar world!")
    },
    {
      name: "dir/tar.ts",
      filePath
    }
  ];
  const outputFile = resolve(testdataDir, "test.tar");
  const tar2 = await createTar(entries);
  const file = await Deno.open(outputFile, {create: true, write: true});
  await Deno.copy(tar2.getReader(), file);
  file.close();
  const reader = await Deno.open(outputFile, {read: true});
  const untar = new Untar(reader);
  for await (const entry of untar) {
    const expected = entries.shift();
    assert(expected);
    let content = expected.content;
    if (expected.filePath) {
      content = await Deno.readFile(expected.filePath);
    }
    assertEquals(content, await Deno.readAll(entry));
    assertEquals(expected.name, entry.fileName);
  }
  reader.close();
  await Deno.remove(outputFile);
  assertEquals(entries.length, 0);
});
Deno.test("untarAsyncIteratorReadingLessThanRecordSize", async function() {
  const bufSizes = [1, 53, 256, 511];
  for (const bufSize of bufSizes) {
    const entries = [
      {
        name: "output.txt",
        content: new TextEncoder().encode("hello tar world!".repeat(100))
      },
      {
        name: "deni.txt",
        content: new TextEncoder().encode("deno!".repeat(250))
      }
    ];
    const tar2 = await createTar(entries);
    const untar = new Untar(tar2.getReader());
    for await (const entry of untar) {
      const expected = entries.shift();
      assert(expected);
      assertEquals(expected.name, entry.fileName);
      const writer = new Deno.Buffer();
      while (true) {
        const buf = new Uint8Array(bufSize);
        const n = await entry.read(buf);
        if (n === null)
          break;
        await writer.write(buf.subarray(0, n));
      }
      assertEquals(writer.bytes(), expected.content);
    }
    assertEquals(entries.length, 0);
  }
});
Deno.test("untarLinuxGeneratedTar", async function() {
  const filePath2 = resolve(testdataDir, "deno.tar");
  const file = await Deno.open(filePath2, {read: true});
  const expectedEntries = [
    {
      fileName: "archive/",
      fileSize: 0,
      fileMode: 509,
      mtime: 1591800767,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "directory"
    },
    {
      fileName: "archive/deno/",
      fileSize: 0,
      fileMode: 509,
      mtime: 1591799635,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "directory"
    },
    {
      fileName: "archive/deno/land/",
      fileSize: 0,
      fileMode: 509,
      mtime: 1591799660,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "directory"
    },
    {
      fileName: "archive/deno/land/land.txt",
      fileMode: 436,
      fileSize: 5,
      mtime: 1591799660,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "file",
      content: new TextEncoder().encode("land\n")
    },
    {
      fileName: "archive/file.txt",
      fileMode: 436,
      fileSize: 5,
      mtime: 1591799626,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "file",
      content: new TextEncoder().encode("file\n")
    },
    {
      fileName: "archive/deno.txt",
      fileMode: 436,
      fileSize: 5,
      mtime: 1591799642,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "file",
      content: new TextEncoder().encode("deno\n")
    }
  ];
  const untar = new Untar(file);
  for await (const entry of untar) {
    const expected = expectedEntries.shift();
    assert(expected);
    const content = expected.content;
    delete expected.content;
    assertEquals(entry, expected);
    if (content) {
      assertEquals(content, await Deno.readAll(entry));
    }
  }
  file.close();
});
Deno.test("directoryEntryType", async function() {
  const tar2 = new Tar();
  tar2.append("directory/", {
    reader: new Deno.Buffer(),
    contentSize: 0,
    type: "directory"
  });
  const filePath2 = resolve(testdataDir);
  tar2.append("archive/testdata/", {
    filePath: filePath2
  });
  const outputFile = resolve(testdataDir, "directory_type_test.tar");
  const file = await Deno.open(outputFile, {create: true, write: true});
  await Deno.copy(tar2.getReader(), file);
  await file.close();
  const reader = await Deno.open(outputFile, {read: true});
  const untar = new Untar(reader);
  for await (const entry of untar) {
    assertEquals(entry.type, "directory");
  }
  await reader.close();
  await Deno.remove(outputFile);
});
