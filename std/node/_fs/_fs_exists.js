import {fromFileUrl} from "../path.js";
export function exists(path2, callback) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  Deno.lstat(path2).then(() => {
    callback(true);
  }).catch(() => callback(false));
}
export function existsSync(path2) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  try {
    Deno.lstatSync(path2);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
