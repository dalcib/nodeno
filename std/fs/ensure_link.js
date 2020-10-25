import * as path from "../path/mod.js";
import {ensureDir, ensureDirSync} from "./ensure_dir.js";
import {exists as exists2, existsSync} from "./exists.js";
import {getFileInfoType} from "./_util.js";
export async function ensureLink(src, dest) {
  if (await exists2(dest)) {
    const destStatInfo = await Deno.lstat(dest);
    const destFilePathType = getFileInfoType(destStatInfo);
    if (destFilePathType !== "file") {
      throw new Error(`Ensure path exists, expected 'file', got '${destFilePathType}'`);
    }
    return;
  }
  await ensureDir(path.dirname(dest));
  await Deno.link(src, dest);
}
export function ensureLinkSync(src, dest) {
  if (existsSync(dest)) {
    const destStatInfo = Deno.lstatSync(dest);
    const destFilePathType = getFileInfoType(destStatInfo);
    if (destFilePathType !== "file") {
      throw new Error(`Ensure path exists, expected 'file', got '${destFilePathType}'`);
    }
    return;
  }
  ensureDirSync(path.dirname(dest));
  Deno.linkSync(src, dest);
}
