import {isWindows} from "./_constants.mjs";
import * as _win32 from "./win32.mjs";
import * as _posix from "./posix.mjs";
const path = isWindows ? _win32 : _posix;
export const win32 = _win32;
export const posix = _posix;
export const {
  basename,
  delimiter,
  dirname,
  extname,
  format,
  fromFileUrl,
  isAbsolute,
  join,
  normalize,
  parse,
  relative,
  resolve,
  sep,
  toNamespacedPath
} = path;
export * from "./common.mjs";
export {SEP, SEP_PATTERN} from "./separator.mjs";
export * from "./_interface.mjs";
export * from "./glob.mjs";
