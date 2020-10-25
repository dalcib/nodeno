import {assert as assert2} from "../_util/assert.js";
import {basename, join, normalize} from "../path/mod.js";
export function _createWalkEntrySync(path) {
  path = normalize(path);
  const name = basename(path);
  const info = Deno.statSync(path);
  return {
    path,
    name,
    isFile: info.isFile,
    isDirectory: info.isDirectory,
    isSymlink: info.isSymlink
  };
}
export async function _createWalkEntry(path) {
  path = normalize(path);
  const name = basename(path);
  const info = await Deno.stat(path);
  return {
    path,
    name,
    isFile: info.isFile,
    isDirectory: info.isDirectory,
    isSymlink: info.isSymlink
  };
}
function include(path, exts, match, skip) {
  if (exts && !exts.some((ext) => path.endsWith(ext))) {
    return false;
  }
  if (match && !match.some((pattern) => !!path.match(pattern))) {
    return false;
  }
  if (skip && skip.some((pattern) => !!path.match(pattern))) {
    return false;
  }
  return true;
}
export async function* walk(root, {
  maxDepth = Infinity,
  includeFiles = true,
  includeDirs = true,
  followSymlinks = false,
  exts = void 0,
  match = void 0,
  skip = void 0
} = {}) {
  if (maxDepth < 0) {
    return;
  }
  if (includeDirs && include(root, exts, match, skip)) {
    yield await _createWalkEntry(root);
  }
  if (maxDepth < 1 || !include(root, void 0, void 0, skip)) {
    return;
  }
  for await (const entry of Deno.readDir(root)) {
    if (entry.isSymlink) {
      if (followSymlinks) {
        throw new Error("unimplemented");
      } else {
        continue;
      }
    }
    assert2(entry.name != null);
    const path = join(root, entry.name);
    if (entry.isFile) {
      if (includeFiles && include(path, exts, match, skip)) {
        yield {path, ...entry};
      }
    } else {
      yield* walk(path, {
        maxDepth: maxDepth - 1,
        includeFiles,
        includeDirs,
        followSymlinks,
        exts,
        match,
        skip
      });
    }
  }
}
export function* walkSync(root, {
  maxDepth = Infinity,
  includeFiles = true,
  includeDirs = true,
  followSymlinks = false,
  exts = void 0,
  match = void 0,
  skip = void 0
} = {}) {
  if (maxDepth < 0) {
    return;
  }
  if (includeDirs && include(root, exts, match, skip)) {
    yield _createWalkEntrySync(root);
  }
  if (maxDepth < 1 || !include(root, void 0, void 0, skip)) {
    return;
  }
  for (const entry of Deno.readDirSync(root)) {
    if (entry.isSymlink) {
      if (followSymlinks) {
        throw new Error("unimplemented");
      } else {
        continue;
      }
    }
    assert2(entry.name != null);
    const path = join(root, entry.name);
    if (entry.isFile) {
      if (includeFiles && include(path, exts, match, skip)) {
        yield {path, ...entry};
      }
    } else {
      yield* walkSync(path, {
        maxDepth: maxDepth - 1,
        includeFiles,
        includeDirs,
        followSymlinks,
        exts,
        match,
        skip
      });
    }
  }
}
