import {assert, assertEquals, fail} from "../../testing/asserts.mjs";
import Dir from "./_fs_dir.mjs";
Deno.test({
  name: "Closing current directory with callback is successful",
  fn() {
    let calledBack = false;
    new Dir(".").close((valOrErr) => {
      assert(!valOrErr);
      calledBack = true;
    });
    assert(calledBack);
  }
});
Deno.test({
  name: "Closing current directory without callback returns void Promise",
  async fn() {
    await new Dir(".").close();
  }
});
Deno.test({
  name: "Closing current directory synchronously works",
  fn() {
    new Dir(".").closeSync();
  }
});
Deno.test({
  name: "Path is correctly returned",
  fn() {
    assertEquals(new Dir("std/node").path, "std/node");
    const enc = new TextEncoder().encode("std/node");
    assertEquals(new Dir(enc).path, "std/node");
  }
});
Deno.test({
  name: "read returns null for empty directory",
  async fn() {
    const testDir = Deno.makeTempDirSync();
    try {
      const file = await new Dir(testDir).read();
      assert(file === null);
      let calledBack = false;
      const fileFromCallback = await new Dir(testDir).read((err, res) => {
        assert(res === null);
        assert(err === null);
        calledBack = true;
      });
      assert(fileFromCallback === null);
      assert(calledBack);
      assertEquals(new Dir(testDir).readSync(), null);
    } finally {
      Deno.removeSync(testDir);
    }
  }
});
Deno.test({
  name: "Async read returns one file at a time",
  async fn() {
    const testDir = Deno.makeTempDirSync();
    const f1 = Deno.createSync(testDir + "/foo.txt");
    f1.close();
    const f2 = Deno.createSync(testDir + "/bar.txt");
    f2.close();
    try {
      let secondCallback = false;
      const dir = new Dir(testDir);
      const firstRead = await dir.read();
      const secondRead = await dir.read((err, secondResult) => {
        assert(secondResult.name === "bar.txt" || secondResult.name === "foo.txt");
        secondCallback = true;
      });
      const thirdRead = await dir.read();
      const fourthRead = await dir.read();
      if (firstRead?.name === "foo.txt") {
        assertEquals(secondRead?.name, "bar.txt");
      } else if (firstRead?.name === "bar.txt") {
        assertEquals(secondRead?.name, "foo.txt");
      } else {
        fail("File not found during read");
      }
      assert(secondCallback);
      assert(thirdRead === null);
      assert(fourthRead === null);
    } finally {
      Deno.removeSync(testDir, {recursive: true});
    }
  }
});
Deno.test({
  name: "Sync read returns one file at a time",
  fn() {
    const testDir = Deno.makeTempDirSync();
    const f1 = Deno.createSync(testDir + "/foo.txt");
    f1.close();
    const f2 = Deno.createSync(testDir + "/bar.txt");
    f2.close();
    try {
      const dir = new Dir(testDir);
      const firstRead = dir.readSync();
      const secondRead = dir.readSync();
      const thirdRead = dir.readSync();
      const fourthRead = dir.readSync();
      if (firstRead?.name === "foo.txt") {
        assertEquals(secondRead?.name, "bar.txt");
      } else if (firstRead?.name === "bar.txt") {
        assertEquals(secondRead?.name, "foo.txt");
      } else {
        fail("File not found during read");
      }
      assert(thirdRead === null);
      assert(fourthRead === null);
    } finally {
      Deno.removeSync(testDir, {recursive: true});
    }
  }
});
Deno.test({
  name: "Async iteration over existing directory",
  async fn() {
    const testDir = Deno.makeTempDirSync();
    const f1 = Deno.createSync(testDir + "/foo.txt");
    f1.close();
    const f2 = Deno.createSync(testDir + "/bar.txt");
    f2.close();
    try {
      const dir = new Dir(testDir);
      const results = [];
      for await (const file of dir[Symbol.asyncIterator]()) {
        results.push(file.name);
      }
      assert(results.length === 2);
      assert(results.includes("foo.txt"));
      assert(results.includes("bar.txt"));
    } finally {
      Deno.removeSync(testDir, {recursive: true});
    }
  }
});
