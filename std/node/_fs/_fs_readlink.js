import {
  intoCallbackAPIWithIntercept,
  notImplemented
} from "../_utils.js";
import {fromFileUrl} from "../path.js";
function maybeEncode(data, encoding) {
  if (encoding === "buffer") {
    return new TextEncoder().encode(data);
  }
  return data;
}
function getEncoding(optOrCallback) {
  if (!optOrCallback || typeof optOrCallback === "function") {
    return null;
  } else {
    if (optOrCallback.encoding) {
      if (optOrCallback.encoding === "utf8" || optOrCallback.encoding === "utf-8") {
        return "utf8";
      } else if (optOrCallback.encoding === "buffer") {
        return "buffer";
      } else {
        notImplemented();
      }
    }
    return null;
  }
}
export function readlink(path2, optOrCallback, callback) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  let cb;
  if (typeof optOrCallback === "function") {
    cb = optOrCallback;
  } else {
    cb = callback;
  }
  const encoding = getEncoding(optOrCallback);
  intoCallbackAPIWithIntercept(Deno.readLink, (data) => maybeEncode(data, encoding), cb, path2);
}
export function readlinkSync(path2, opt) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  return maybeEncode(Deno.readLinkSync(path2), getEncoding(opt));
}
