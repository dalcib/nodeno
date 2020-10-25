import {
  getOpenOptions,
  isFileOptions
} from "./_fs_common.mjs";
import {notImplemented} from "../_utils.mjs";
import {fromFileUrl} from "../path.mjs";
export function appendFile(pathOrRid, data, optionsOrCallback, callback) {
  pathOrRid = pathOrRid instanceof URL ? fromFileUrl(pathOrRid) : pathOrRid;
  const callbackFn = optionsOrCallback instanceof Function ? optionsOrCallback : callback;
  const options = optionsOrCallback instanceof Function ? void 0 : optionsOrCallback;
  if (!callbackFn) {
    throw new Error("No callback function supplied");
  }
  validateEncoding(options);
  let rid = -1;
  const buffer = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
  new Promise((resolve, reject) => {
    if (typeof pathOrRid === "number") {
      rid = pathOrRid;
      Deno.write(rid, buffer).then(resolve).catch(reject);
    } else {
      const mode = isFileOptions(options) ? options.mode : void 0;
      const flag = isFileOptions(options) ? options.flag : void 0;
      if (mode) {
        notImplemented("Deno does not yet support setting mode on create");
      }
      Deno.open(pathOrRid, getOpenOptions(flag)).then(({rid: openedFileRid}) => {
        rid = openedFileRid;
        return Deno.write(openedFileRid, buffer);
      }).then(resolve).catch(reject);
    }
  }).then(() => {
    closeRidIfNecessary(typeof pathOrRid === "string", rid);
    callbackFn();
  }).catch((err) => {
    closeRidIfNecessary(typeof pathOrRid === "string", rid);
    callbackFn(err);
  });
}
function closeRidIfNecessary(isPathString, rid) {
  if (isPathString && rid != -1) {
    Deno.close(rid);
  }
}
export function appendFileSync(pathOrRid, data, options) {
  let rid = -1;
  validateEncoding(options);
  pathOrRid = pathOrRid instanceof URL ? fromFileUrl(pathOrRid) : pathOrRid;
  try {
    if (typeof pathOrRid === "number") {
      rid = pathOrRid;
    } else {
      const mode = isFileOptions(options) ? options.mode : void 0;
      const flag = isFileOptions(options) ? options.flag : void 0;
      if (mode) {
        notImplemented("Deno does not yet support setting mode on create");
      }
      const file = Deno.openSync(pathOrRid, getOpenOptions(flag));
      rid = file.rid;
    }
    const buffer = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
    Deno.writeSync(rid, buffer);
  } finally {
    closeRidIfNecessary(typeof pathOrRid === "string", rid);
  }
}
function validateEncoding(encodingOption) {
  if (!encodingOption)
    return;
  if (typeof encodingOption === "string") {
    if (encodingOption !== "utf8") {
      throw new Error("Only 'utf8' encoding is currently supported");
    }
  } else if (encodingOption.encoding && encodingOption.encoding !== "utf8") {
    throw new Error("Only 'utf8' encoding is currently supported");
  }
}
