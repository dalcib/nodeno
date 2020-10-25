import {fromFileUrl} from "../path.mjs";
export function link(existingPath, newPath, callback) {
  existingPath = existingPath instanceof URL ? fromFileUrl(existingPath) : existingPath;
  newPath = newPath instanceof URL ? fromFileUrl(newPath) : newPath;
  Deno.link(existingPath, newPath).then(() => callback()).catch(callback);
}
export function linkSync(existingPath, newPath) {
  existingPath = existingPath instanceof URL ? fromFileUrl(existingPath) : existingPath;
  newPath = newPath instanceof URL ? fromFileUrl(newPath) : newPath;
  Deno.linkSync(existingPath, newPath);
}
