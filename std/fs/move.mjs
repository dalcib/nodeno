import {exists as exists2, existsSync} from "./exists.mjs";
import {isSubdir} from "./_util.mjs";
export async function move(src, dest, {overwrite = false} = {}) {
  const srcStat = await Deno.stat(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`);
  }
  if (overwrite) {
    if (await exists2(dest)) {
      await Deno.remove(dest, {recursive: true});
    }
    await Deno.rename(src, dest);
  } else {
    if (await exists2(dest)) {
      throw new Error("dest already exists.");
    }
    await Deno.rename(src, dest);
  }
  return;
}
export function moveSync(src, dest, {overwrite = false} = {}) {
  const srcStat = Deno.statSync(src);
  if (srcStat.isDirectory && isSubdir(src, dest)) {
    throw new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`);
  }
  if (overwrite) {
    if (existsSync(dest)) {
      Deno.removeSync(dest, {recursive: true});
    }
    Deno.renameSync(src, dest);
  } else {
    if (existsSync(dest)) {
      throw new Error("dest already exists.");
    }
    Deno.renameSync(src, dest);
  }
}
