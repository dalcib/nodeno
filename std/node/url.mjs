import {
  CHAR_BACKWARD_SLASH,
  CHAR_FORWARD_SLASH,
  CHAR_LOWERCASE_A,
  CHAR_LOWERCASE_Z
} from "../path/_constants.mjs";
import * as path from "./path.mjs";
const isWindows = Deno.build.os === "windows";
const forwardSlashRegEx = /\//g;
const percentRegEx = /%/g;
const backslashRegEx = /\\/g;
const newlineRegEx = /\n/g;
const carriageReturnRegEx = /\r/g;
const tabRegEx = /\t/g;
const _url = URL;
export {_url as URL};
export function fileURLToPath(path2) {
  if (typeof path2 === "string")
    path2 = new URL(path2);
  else if (!(path2 instanceof URL)) {
    throw new Deno.errors.InvalidData("invalid argument path , must be a string or URL");
  }
  if (path2.protocol !== "file:") {
    throw new Deno.errors.InvalidData("invalid url scheme");
  }
  return isWindows ? getPathFromURLWin(path2) : getPathFromURLPosix(path2);
}
function getPathFromURLWin(url) {
  const hostname = url.hostname;
  let pathname = url.pathname;
  for (let n = 0; n < pathname.length; n++) {
    if (pathname[n] === "%") {
      const third = pathname.codePointAt(n + 2) || 32;
      if (pathname[n + 1] === "2" && third === 102 || pathname[n + 1] === "5" && third === 99) {
        throw new Deno.errors.InvalidData("must not include encoded \\ or / characters");
      }
    }
  }
  pathname = pathname.replace(forwardSlashRegEx, "\\");
  pathname = decodeURIComponent(pathname);
  if (hostname !== "") {
    return `\\\\${hostname}${pathname}`;
  } else {
    const letter = pathname.codePointAt(1) | 32;
    const sep = pathname[2];
    if (letter < CHAR_LOWERCASE_A || letter > CHAR_LOWERCASE_Z || sep !== ":") {
      throw new Deno.errors.InvalidData("file url path must be absolute");
    }
    return pathname.slice(1);
  }
}
function getPathFromURLPosix(url) {
  if (url.hostname !== "") {
    throw new Deno.errors.InvalidData("invalid file url hostname");
  }
  const pathname = url.pathname;
  for (let n = 0; n < pathname.length; n++) {
    if (pathname[n] === "%") {
      const third = pathname.codePointAt(n + 2) || 32;
      if (pathname[n + 1] === "2" && third === 102) {
        throw new Deno.errors.InvalidData("must not include encoded / characters");
      }
    }
  }
  return decodeURIComponent(pathname);
}
export function pathToFileURL(filepath) {
  let resolved = path.resolve(filepath);
  const filePathLast = filepath.charCodeAt(filepath.length - 1);
  if ((filePathLast === CHAR_FORWARD_SLASH || isWindows && filePathLast === CHAR_BACKWARD_SLASH) && resolved[resolved.length - 1] !== path.sep) {
    resolved += "/";
  }
  const outURL = new URL("file://");
  if (resolved.includes("%"))
    resolved = resolved.replace(percentRegEx, "%25");
  if (!isWindows && resolved.includes("\\")) {
    resolved = resolved.replace(backslashRegEx, "%5C");
  }
  if (resolved.includes("\n"))
    resolved = resolved.replace(newlineRegEx, "%0A");
  if (resolved.includes("\r")) {
    resolved = resolved.replace(carriageReturnRegEx, "%0D");
  }
  if (resolved.includes("	"))
    resolved = resolved.replace(tabRegEx, "%09");
  outURL.pathname = resolved;
  return outURL;
}
