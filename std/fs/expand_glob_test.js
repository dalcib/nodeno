import {decode} from "../encoding/utf8.js";
import {
  assert,
  assertEquals,
  assertStringContains
} from "../testing/asserts.js";
import {
  fromFileUrl,
  join,
  joinGlobs,
  normalize,
  relative
} from "../path/mod.js";
import {
  expandGlob,
  expandGlobSync
} from "./expand_glob.js";
async function expandGlobArray(globString, options) {
  const paths = [];
  for await (const {path} of expandGlob(globString, options)) {
    paths.push(path);
  }
  paths.sort();
  const pathsSync = [...expandGlobSync(globString, options)].map(({path}) => path);
  pathsSync.sort();
  assertEquals(paths, pathsSync);
  const root = normalize(options.root || Deno.cwd());
  for (const path of paths) {
    assert(path.startsWith(root));
  }
  const relativePaths = paths.map((path) => relative(root, path) || ".");
  relativePaths.sort();
  return relativePaths;
}
const EG_OPTIONS = {
  root: fromFileUrl(new URL(join("testdata", "glob"), import.meta.url)),
  includeDirs: true,
  extended: false,
  globstar: false
};
Deno.test("expandGlobWildcard", async function() {
  const options = EG_OPTIONS;
  assertEquals(await expandGlobArray("*", options), [
    "abc",
    "abcdef",
    "abcdefghi",
    "subdir"
  ]);
});
Deno.test("expandGlobTrailingSeparator", async function() {
  const options = EG_OPTIONS;
  assertEquals(await expandGlobArray("*/", options), ["subdir"]);
});
Deno.test("expandGlobParent", async function() {
  const options = EG_OPTIONS;
  assertEquals(await expandGlobArray("subdir/../*", options), [
    "abc",
    "abcdef",
    "abcdefghi",
    "subdir"
  ]);
});
Deno.test("expandGlobExt", async function() {
  const options = {...EG_OPTIONS, extended: true};
  assertEquals(await expandGlobArray("abc?(def|ghi)", options), [
    "abc",
    "abcdef"
  ]);
  assertEquals(await expandGlobArray("abc*(def|ghi)", options), [
    "abc",
    "abcdef",
    "abcdefghi"
  ]);
  assertEquals(await expandGlobArray("abc+(def|ghi)", options), [
    "abcdef",
    "abcdefghi"
  ]);
  assertEquals(await expandGlobArray("abc@(def|ghi)", options), ["abcdef"]);
  assertEquals(await expandGlobArray("abc{def,ghi}", options), ["abcdef"]);
  assertEquals(await expandGlobArray("abc!(def|ghi)", options), ["abc"]);
});
Deno.test("expandGlobGlobstar", async function() {
  const options = {...EG_OPTIONS, globstar: true};
  assertEquals(await expandGlobArray(joinGlobs(["**", "abc"], options), options), ["abc", join("subdir", "abc")]);
});
Deno.test("expandGlobGlobstarParent", async function() {
  const options = {...EG_OPTIONS, globstar: true};
  assertEquals(await expandGlobArray(joinGlobs(["subdir", "**", ".."], options), options), ["."]);
});
Deno.test("expandGlobIncludeDirs", async function() {
  const options = {...EG_OPTIONS, includeDirs: false};
  assertEquals(await expandGlobArray("subdir", options), []);
});
Deno.test("expandGlobPermError", async function() {
  const exampleUrl = new URL("testdata/expand_wildcard.js", import.meta.url);
  const p = Deno.run({
    cmd: [Deno.execPath(), "run", "--unstable", exampleUrl.toString()],
    stdin: "null",
    stdout: "piped",
    stderr: "piped"
  });
  assertEquals(await p.status(), {code: 1, success: false});
  assertEquals(decode(await p.output()), "");
  assertStringContains(decode(await p.stderrOutput()), "Uncaught PermissionDenied");
  p.close();
});
