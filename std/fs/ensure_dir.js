import {getFileInfoType} from "./_util.js";
export async function ensureDir(dir) {
  try {
    const fileInfo = await Deno.lstat(dir);
    if (!fileInfo.isDirectory) {
      throw new Error(`Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`);
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await Deno.mkdir(dir, {recursive: true});
      return;
    }
    throw err;
  }
}
export function ensureDirSync(dir) {
  try {
    const fileInfo = Deno.lstatSync(dir);
    if (!fileInfo.isDirectory) {
      throw new Error(`Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`);
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      Deno.mkdirSync(dir, {recursive: true});
      return;
    }
    throw err;
  }
}
