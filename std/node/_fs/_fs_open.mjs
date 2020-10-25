import {existsSync} from "../../fs/mod.mjs";
import {fromFileUrl} from "../path.mjs";
import {getOpenOptions} from "./_fs_common.mjs";
function convertFlagAndModeToOptions(flag, mode) {
  if (!flag && !mode)
    return void 0;
  if (!flag && mode)
    return {mode};
  return {...getOpenOptions(flag), mode};
}
export function open(path2, flagsOrCallback, callbackOrMode, maybeCallback) {
  const flags = typeof flagsOrCallback === "string" ? flagsOrCallback : void 0;
  const callback = typeof flagsOrCallback === "function" ? flagsOrCallback : typeof callbackOrMode === "function" ? callbackOrMode : maybeCallback;
  const mode = typeof callbackOrMode === "number" ? callbackOrMode : void 0;
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  if (!callback)
    throw new Error("No callback function supplied");
  if (["ax", "ax+", "wx", "wx+"].includes(flags || "") && existsSync(path2)) {
    const err = new Error(`EEXIST: file already exists, open '${path2}'`);
    callback(err, 0);
  } else {
    if (flags === "as" || flags === "as+") {
      try {
        const res = openSync(path2, flags, mode);
        callback(void 0, res);
      } catch (error) {
        callback(error, error);
      }
      return;
    }
    Deno.open(path2, convertFlagAndModeToOptions(flags, mode)).then((file) => callback(void 0, file.rid)).catch((err) => callback(err, err));
  }
}
export function openSync(path2, flagsOrMode, maybeMode) {
  const flags = typeof flagsOrMode === "string" ? flagsOrMode : void 0;
  const mode = typeof flagsOrMode === "number" ? flagsOrMode : maybeMode;
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  if (["ax", "ax+", "wx", "wx+"].includes(flags || "") && existsSync(path2)) {
    throw new Error(`EEXIST: file already exists, open '${path2}'`);
  }
  return Deno.openSync(path2, convertFlagAndModeToOptions(flags, mode)).rid;
}
