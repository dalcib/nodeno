import {assert, assertEquals, assertThrows} from "../../testing/asserts.js";
import Dirent from "./_fs_dirent.js";
class DirEntryMock {
  constructor() {
    this.name = "";
    this.isFile = false;
    this.isDirectory = false;
    this.isSymlink = false;
  }
}
Deno.test({
  name: "Directories are correctly identified",
  fn() {
    const entry = new DirEntryMock();
    entry.isDirectory = true;
    entry.isFile = false;
    entry.isSymlink = false;
    assert(new Dirent(entry).isDirectory());
    assert(!new Dirent(entry).isFile());
    assert(!new Dirent(entry).isSymbolicLink());
  }
});
Deno.test({
  name: "Files are correctly identified",
  fn() {
    const entry = new DirEntryMock();
    entry.isDirectory = false;
    entry.isFile = true;
    entry.isSymlink = false;
    assert(!new Dirent(entry).isDirectory());
    assert(new Dirent(entry).isFile());
    assert(!new Dirent(entry).isSymbolicLink());
  }
});
Deno.test({
  name: "Symlinks are correctly identified",
  fn() {
    const entry = new DirEntryMock();
    entry.isDirectory = false;
    entry.isFile = false;
    entry.isSymlink = true;
    assert(!new Dirent(entry).isDirectory());
    assert(!new Dirent(entry).isFile());
    assert(new Dirent(entry).isSymbolicLink());
  }
});
Deno.test({
  name: "File name is correct",
  fn() {
    const entry = new DirEntryMock();
    entry.name = "my_file";
    assertEquals(new Dirent(entry).name, "my_file");
  }
});
Deno.test({
  name: "Socket and FIFO pipes aren't yet available",
  fn() {
    const entry = new DirEntryMock();
    assertThrows(() => {
      new Dirent(entry).isFIFO();
    }, Error, "does not yet support");
    assertThrows(() => {
      new Dirent(entry).isSocket();
    }, Error, "does not yet support");
  }
});
