import {fromFileUrl} from "../path.mjs";
export function chown(path2, uid, gid, callback) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  Deno.chown(path2, uid, gid).then(() => callback()).catch(callback);
}
export function chownSync(path2, uid, gid) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  Deno.chownSync(path2, uid, gid);
}
