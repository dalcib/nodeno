import {notImplemented} from "../_utils.mjs";
import {fromFileUrl} from "../path.mjs";
import {Buffer} from "../buffer.mjs";
import {
  checkEncoding,
  getEncoding,
  getOpenOptions,
  isFileOptions
} from "./_fs_common.mjs";
export function writeFile(pathOrRid, data, optOrCallback, callback) {
  const callbackFn = optOrCallback instanceof Function ? optOrCallback : callback;
  const options = optOrCallback instanceof Function ? void 0 : optOrCallback;
  if (!callbackFn) {
    throw new TypeError("Callback must be a function.");
  }
  pathOrRid = pathOrRid instanceof URL ? fromFileUrl(pathOrRid) : pathOrRid;
  const flag = isFileOptions(options) ? options.flag : void 0;
  const mode = isFileOptions(options) ? options.mode : void 0;
  const encoding = checkEncoding(getEncoding(options)) || "utf8";
  const openOptions = getOpenOptions(flag || "w");
  if (typeof data === "string")
    data = Buffer.from(data, encoding);
  const isRid = typeof pathOrRid === "number";
  let file;
  let error = null;
  (async () => {
    try {
      file = isRid ? new Deno.File(pathOrRid) : await Deno.open(pathOrRid, openOptions);
      if (!isRid && mode) {
        if (Deno.build.os === "windows")
          notImplemented(`"mode" on Windows`);
        await Deno.chmod(pathOrRid, mode);
      }
      await Deno.writeAll(file, data);
    } catch (e) {
      error = e;
    } finally {
      if (!isRid && file)
        file.close();
      callbackFn(error);
    }
  })();
}
export function writeFileSync(pathOrRid, data, options) {
  pathOrRid = pathOrRid instanceof URL ? fromFileUrl(pathOrRid) : pathOrRid;
  const flag = isFileOptions(options) ? options.flag : void 0;
  const mode = isFileOptions(options) ? options.mode : void 0;
  const encoding = checkEncoding(getEncoding(options)) || "utf8";
  const openOptions = getOpenOptions(flag || "w");
  if (typeof data === "string")
    data = Buffer.from(data, encoding);
  const isRid = typeof pathOrRid === "number";
  let file;
  let error = null;
  try {
    file = isRid ? new Deno.File(pathOrRid) : Deno.openSync(pathOrRid, openOptions);
    if (!isRid && mode) {
      if (Deno.build.os === "windows")
        notImplemented(`"mode" on Windows`);
      Deno.chmodSync(pathOrRid, mode);
    }
    Deno.writeAllSync(file, data);
  } catch (e) {
    error = e;
  } finally {
    if (!isRid && file)
      file.close();
    if (error)
      throw error;
  }
}
