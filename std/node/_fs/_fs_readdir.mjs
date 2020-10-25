import {asyncIterableToCallback} from "./_fs_watch.mjs";
import Dirent from "./_fs_dirent.mjs";
import {fromFileUrl} from "../path.mjs";
function toDirent(val) {
  return new Dirent(val);
}
export function readdir(path2, optionsOrCallback, maybeCallback) {
  const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback;
  const options = typeof optionsOrCallback === "object" ? optionsOrCallback : null;
  const result = [];
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  if (!callback)
    throw new Error("No callback function supplied");
  if (options?.encoding) {
    try {
      new TextDecoder(options.encoding);
    } catch (error) {
      throw new Error(`TypeError [ERR_INVALID_OPT_VALUE_ENCODING]: The value "${options.encoding}" is invalid for option "encoding"`);
    }
  }
  try {
    asyncIterableToCallback(Deno.readDir(path2), (val, done) => {
      if (typeof path2 !== "string")
        return;
      if (done) {
        callback(void 0, result);
        return;
      }
      if (options?.withFileTypes) {
        result.push(toDirent(val));
      } else
        result.push(decode(val.name));
    });
  } catch (error) {
    callback(error, result);
  }
}
function decode(str, encoding) {
  if (!encoding)
    return str;
  else {
    const decoder = new TextDecoder(encoding);
    const encoder = new TextEncoder();
    return decoder.decode(encoder.encode(str));
  }
}
export function readdirSync(path2, options) {
  const result = [];
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  if (options?.encoding) {
    try {
      new TextDecoder(options.encoding);
    } catch (error) {
      throw new Error(`TypeError [ERR_INVALID_OPT_VALUE_ENCODING]: The value "${options.encoding}" is invalid for option "encoding"`);
    }
  }
  for (const file of Deno.readDirSync(path2)) {
    if (options?.withFileTypes) {
      result.push(toDirent(file));
    } else
      result.push(decode(file.name));
  }
  return result;
}
