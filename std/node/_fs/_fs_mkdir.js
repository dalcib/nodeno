import {fromFileUrl} from "../path.js";
export function mkdir(path2, options, callback) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  let mode = 511;
  let recursive = false;
  if (typeof options == "function") {
    callback = options;
  } else if (typeof options === "number") {
    mode = options;
  } else if (typeof options === "boolean") {
    recursive = options;
  } else if (options) {
    if (options.recursive !== void 0)
      recursive = options.recursive;
    if (options.mode !== void 0)
      mode = options.mode;
  }
  if (typeof recursive !== "boolean") {
    throw new Deno.errors.InvalidData("invalid recursive option , must be a boolean");
  }
  Deno.mkdir(path2, {recursive, mode}).then(() => {
    if (typeof callback === "function") {
      callback();
    }
  }).catch((err) => {
    if (typeof callback === "function") {
      callback(err);
    }
  });
}
export function mkdirSync(path2, options) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  let mode = 511;
  let recursive = false;
  if (typeof options === "number") {
    mode = options;
  } else if (typeof options === "boolean") {
    recursive = options;
  } else if (options) {
    if (options.recursive !== void 0)
      recursive = options.recursive;
    if (options.mode !== void 0)
      mode = options.mode;
  }
  if (typeof recursive !== "boolean") {
    throw new Deno.errors.InvalidData("invalid recursive option , must be a boolean");
  }
  Deno.mkdirSync(path2, {recursive, mode});
}
