import * as path from "../path/mod.mjs";
import {ensureDir, ensureDirSync} from "./ensure_dir.mjs";
import {exists as exists2, existsSync} from "./exists.mjs";
import {getFileInfoType} from "./_util.mjs";
export async function ensureSymlink(src, dest) {
  const srcStatInfo = await Deno.lstat(src);
  const srcFilePathType = getFileInfoType(srcStatInfo);
  if (await exists2(dest)) {
    const destStatInfo = await Deno.lstat(dest);
    const destFilePathType = getFileInfoType(destStatInfo);
    if (destFilePathType !== "symlink") {
      throw new Error(`Ensure path exists, expected 'symlink', got '${destFilePathType}'`);
    }
    return;
  }
  await ensureDir(path.dirname(dest));
  if (Deno.build.os === "windows") {
    await Deno.symlink(src, dest, {
      type: srcFilePathType === "dir" ? "dir" : "file"
    });
  } else {
    await Deno.symlink(src, dest);
  }
}
export function ensureSymlinkSync(src, dest) {
  const srcStatInfo = Deno.lstatSync(src);
  const srcFilePathType = getFileInfoType(srcStatInfo);
  if (existsSync(dest)) {
    const destStatInfo = Deno.lstatSync(dest);
    const destFilePathType = getFileInfoType(destStatInfo);
    if (destFilePathType !== "symlink") {
      throw new Error(`Ensure path exists, expected 'symlink', got '${destFilePathType}'`);
    }
    return;
  }
  ensureDirSync(path.dirname(dest));
  if (Deno.build.os === "windows") {
    Deno.symlinkSync(src, dest, {
      type: srcFilePathType === "dir" ? "dir" : "file"
    });
  } else {
    Deno.symlinkSync(src, dest);
  }
}
