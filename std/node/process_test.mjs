import {assert, assertEquals, assertThrows} from "../testing/asserts.mjs";
import * as path from "../path/mod.mjs";
import * as all from "./process.mjs";
import {argv, env} from "./process.mjs";
Deno.test({
  name: "process exports are as they should be",
  fn() {
    const allKeys = new Set(Object.keys(all));
    allKeys.delete("process");
    allKeys.delete("default");
    allKeys.add("on");
    allKeys.add("stdin");
    allKeys.add("stderr");
    allKeys.add("stdout");
    const allStr = Array.from(allKeys).sort().join(" ");
    assertEquals(Object.keys(all.default).sort().join(" "), allStr);
    assertEquals(Object.keys(all.process).sort().join(" "), allStr);
    assertEquals(Object.keys(process).sort().join(" "), allStr);
  }
});
Deno.test({
  name: "process.cwd and process.chdir success",
  fn() {
    assertEquals(process.cwd(), Deno.cwd());
    const currentDir = Deno.cwd();
    const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
    process.chdir(path.resolve(moduleDir, ".."));
    assert(process.cwd().match(/\Wstd$/));
    process.chdir("node");
    assert(process.cwd().match(/\Wnode$/));
    process.chdir("..");
    assert(process.cwd().match(/\Wstd$/));
    process.chdir(currentDir);
  }
});
Deno.test({
  name: "process.chdir failure",
  fn() {
    assertThrows(() => {
      process.chdir("non-existent-directory-name");
    }, Deno.errors.NotFound, "file");
  }
});
Deno.test({
  name: "process.version",
  fn() {
    assertEquals(typeof process, "object");
    assertEquals(typeof process.version, "string");
    assertEquals(typeof process.versions, "object");
    assertEquals(typeof process.versions.node, "string");
  }
});
Deno.test({
  name: "process.platform",
  fn() {
    assertEquals(typeof process.platform, "string");
  }
});
Deno.test({
  name: "process.arch",
  fn() {
    assertEquals(typeof process.arch, "string");
    assertEquals(process.arch, Deno.build.arch);
  }
});
Deno.test({
  name: "process.pid",
  fn() {
    assertEquals(typeof process.pid, "number");
    assertEquals(process.pid, Deno.pid);
  }
});
Deno.test({
  name: "process.on",
  fn() {
    assertEquals(typeof process.on, "function");
    assertThrows(() => {
      process.on("uncaughtException", (_err) => {
      });
    }, Error, "implemented");
  }
});
Deno.test({
  name: "process.argv",
  fn() {
    assert(Array.isArray(process.argv));
    assert(Array.isArray(argv));
    assert(process.argv[0].match(/[^/\\]*deno[^/\\]*$/), "deno included in the file name of argv[0]");
  }
});
Deno.test({
  name: "process.env",
  fn() {
    assertEquals(typeof process.env.PATH, "string");
    assertEquals(typeof env.PATH, "string");
  }
});
Deno.test({
  name: "process.stdin",
  fn() {
    assertEquals(typeof process.stdin.fd, "number");
    assertEquals(process.stdin.fd, Deno.stdin.rid);
  }
});
Deno.test({
  name: "process.stdout",
  fn() {
    assertEquals(typeof process.stdout.fd, "number");
    assertEquals(process.stdout.fd, Deno.stdout.rid);
  }
});
Deno.test({
  name: "process.stderr",
  fn() {
    assertEquals(typeof process.stderr.fd, "number");
    assertEquals(process.stderr.fd, Deno.stderr.rid);
  }
});
