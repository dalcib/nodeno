import * as path from "../path/mod.mjs";
import {ensureDir, ensureDirSync} from "./ensure_dir.mjs";
import {getFileInfoType} from "./_util.mjs";
export async function ensureFile(filePath) {
  try {
    const stat = await Deno.lstat(filePath);
    if (!stat.isFile) {
      throw new Error(`Ensure path exists, expected 'file', got '${getFileInfoType(stat)}'`);
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await ensureDir(path.dirname(filePath));
      await Deno.writeFile(filePath, new Uint8Array());
      return;
    }
    throw err;
  }
}
export function ensureFileSync(filePath) {
  try {
    const stat = Deno.lstatSync(filePath);
    if (!stat.isFile) {
      throw new Error(`Ensure path exists, expected 'file', got '${getFileInfoType(stat)}'`);
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      ensureDirSync(path.dirname(filePath));
      Deno.writeFileSync(filePath, new Uint8Array());
      return;
    }
    throw err;
  }
}
