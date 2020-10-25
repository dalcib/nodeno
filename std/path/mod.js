import {isWindows} from "./_constants.js";
import * as _win32 from "./win32.js";
import * as _posix from "./posix.js";
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
export * from "./common.js";
export {SEP, SEP_PATTERN} from "./separator.js";
export * from "./_interface.js";
export * from "./glob.js";
