import * as path from "../path/mod.js";
import {ensureDir, ensureDirSync} from "./ensure_dir.js";
import {getFileInfoType, isSubdir} from "./_util.js";
import {assert as assert2} from "../_util/assert.js";
const isWindows = Deno.build.os === "windows";
async function ensureValidCopy(src, dest, options, isCopyFolder = false) {
  let destStat;
  try {
    destStat = await Deno.lstat(dest);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }
    throw err;
  }
  if (isCopyFolder && !destStat.isDirectory) {
    throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
  }
  if (!options.overwrite) {
    throw new Error(`'${dest}' already exists.`);
  }
  return destStat;
}
function ensureValidCopySync(src, dest, options, isCopyFolder = false) {
  let destStat;
  try {
    destStat = Deno.lstatSync(dest);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return;
    }
    throw err;
  }
  if (isCopyFolder && !destStat.isDirectory) {
    throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
  }
  if (!options.overwrite) {
    throw new Error(`'${dest}' already exists.`);
  }
  return destStat;
}
async function copyFile(src, dest, options) {
  await ensureValidCopy(src, dest, options);
  await Deno.copyFile(src, dest);
  if (options.preserveTimestamps) {
    const statInfo = await Deno.stat(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await Deno.utime(dest, statInfo.atime, statInfo.mtime);
  }
}
function copyFileSync(src, dest, options) {
  ensureValidCopySync(src, dest, options);
  Deno.copyFileSync(src, dest);
  if (options.preserveTimestamps) {
    const statInfo = Deno.statSync(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
  }
}
async function copySymLink(src, dest, options) {
  await ensureValidCopy(src, dest, options);
  const originSrcFilePath = await Deno.readLink(src);
  const type = getFileInfoType(await Deno.lstat(src));
  if (isWindows) {
    await Deno.symlink(originSrcFilePath, dest, {
      type: type === "dir" ? "dir" : "file"
    });
  } else {
    await Deno.symlink(originSrcFilePath, dest);
  }
  if (options.preserveTimestamps) {
    const statInfo = await Deno.lstat(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await Deno.utime(dest, statInfo.atime, statInfo.mtime);
  }
}
function copySymlinkSync(src, dest, options) {
  ensureValidCopySync(src, dest, options);
  const originSrcFilePath = Deno.readLinkSync(src);
  const type = getFileInfoType(Deno.lstatSync(src));
  if (isWindows) {
    Deno.symlinkSync(originSrcFilePath, dest, {
      type: type === "dir" ? "dir" : "file"
    });
  } else {
    Deno.symlinkSync(originSrcFilePath, dest);
  }
  if (options.preserveTimestamps) {
    const statInfo = Deno.lstatSync(src);
    assert2(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
  }
}
async function copyDir(src, dest, options) {
  const destStat = await ensureValidCopy(src, dest, options, true);
  if (!destStat) {
    await ensureDir(dest);
  }
  if (options.preserveTimestamps) {
    const srcStatInfo = await Deno.stat(src);
    assert2(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    await Deno.utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
  }
  for await (const entry of Deno.readDir(src)) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, path.basename(srcPath));
    if (entry.isSymlink) {
      await copySymLink(srcPath, destPath, options);
    } else if (entry.isDirectory) {
      await copyDir(srcPath, destPath, options);
    } else if (entry.isFile) {
      await copyFile(srcPath, destPath, options);
    }
  }
}
function copyDirSync(src, dest, options) {
  const destStat = ensureValidCopySync(src, dest, options, true);
  if (!destStat) {
    ensureDirSync(dest);
  }
  if (options.preserveTimestamps) {
    const srcStatInfo = Deno.statSync(src);
    assert2(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
    assert2(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
    Deno.utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
  }
  for (const entry of Deno.readDirSync(src)) {
    assert2(entry.name != null, "file.name must be set");
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, path.basename(srcPath));
    if (entry.isSymlink) {
      copySymlinkSync(srcPath, destPath, options);
    } else if (entry.isDirectory) {
      copyDirSync(srcPath, destPath, options);
    } else if (entry.isFile) {
      copyFileSync(srcPath, destPath, options);
    }
  }
}
export async function copy(src, dest, options = {}) {
  src = path.resolve(src);
  dest = path.resolve(dest);
  if (src === dest) {
    throw new Error("Source and destination cannot be the same.");
  }
  const srcStat = await Deno.lstat(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
  }
  if (srcStat.isSymlink) {
    await copySymLink(src, dest, options);
  } else if (srcStat.isDirectory) {
    await copyDir(src, dest, options);
  } else if (srcStat.isFile) {
    await copyFile(src, dest, options);
  }
}
export function copySync(src, dest, options = {}) {
  src = path.resolve(src);
  dest = path.resolve(dest);
  if (src === dest) {
    throw new Error("Source and destination cannot be the same.");
  }
  const srcStat = Deno.lstatSync(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
  }
  if (srcStat.isSymlink) {
    copySymlinkSync(src, dest, options);
  } else if (srcStat.isDirectory) {
    copyDirSync(src, dest, options);
  } else if (srcStat.isFile) {
    copyFileSync(src, dest, options);
  }
}
