import {fromFileUrl} from "../path.mjs";
const allowedModes = /^[0-7]{3}/;
export function chmod(path2, mode, callback) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  Deno.chmod(path2, getResolvedMode(mode)).then(() => callback()).catch(callback);
}
export function chmodSync(path2, mode) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  Deno.chmodSync(path2, getResolvedMode(mode));
}
function getResolvedMode(mode) {
  if (typeof mode === "number") {
    return mode;
  }
  if (typeof mode === "string" && !allowedModes.test(mode)) {
    throw new Error("Unrecognized mode: " + mode);
  }
  return parseInt(mode, 8);
}
