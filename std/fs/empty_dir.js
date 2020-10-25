import {join} from "../path/mod.js";
export async function emptyDir(dir) {
  try {
    const items = [];
    for await (const dirEntry of Deno.readDir(dir)) {
      items.push(dirEntry);
    }
    while (items.length) {
      const item = items.shift();
      if (item && item.name) {
        const filepath = join(dir, item.name);
        await Deno.remove(filepath, {recursive: true});
      }
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
    await Deno.mkdir(dir, {recursive: true});
  }
}
export function emptyDirSync(dir) {
  try {
    const items = [...Deno.readDirSync(dir)];
    while (items.length) {
      const item = items.shift();
      if (item && item.name) {
        const filepath = join(dir, item.name);
        Deno.removeSync(filepath, {recursive: true});
      }
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
    Deno.mkdirSync(dir, {recursive: true});
    return;
  }
}
