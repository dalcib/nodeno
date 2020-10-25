import {fromFileUrl} from "../path.mjs";
export function copyFile(source, destination, callback) {
  source = source instanceof URL ? fromFileUrl(source) : source;
  Deno.copyFile(source, destination).then(() => callback()).catch(callback);
}
export function copyFileSync(source, destination) {
  source = source instanceof URL ? fromFileUrl(source) : source;
  Deno.copyFileSync(source, destination);
}
