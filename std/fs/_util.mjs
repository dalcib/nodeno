import * as path from "../path/mod.mjs";
export function isSubdir(src, dest, sep = path.sep) {
  if (src === dest) {
    return false;
  }
  const srcArray = src.split(sep);
  const destArray = dest.split(sep);
  return srcArray.every((current, i) => destArray[i] === current);
}
export function getFileInfoType(fileInfo) {
  return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : void 0;
}
