export function notImplemented(msg) {
  const message = msg ? `Not implemented: ${msg}` : "Not implemented";
  throw new Error(message);
}
export const _TextDecoder = TextDecoder;
export const _TextEncoder = TextEncoder;
export function intoCallbackAPI(func, cb, ...args) {
  func(...args).then((value) => cb && cb(null, value)).catch((err) => cb && cb(err, null));
}
export function intoCallbackAPIWithIntercept(func, interceptor, cb, ...args) {
  func(...args).then((value) => cb && cb(null, interceptor(value))).catch((err) => cb && cb(err, null));
}
export function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}
export function normalizeEncoding(enc) {
  if (enc == null || enc === "utf8" || enc === "utf-8")
    return "utf8";
  return slowCases(enc);
}
function slowCases(enc) {
  switch (enc.length) {
    case 4:
      if (enc === "UTF8")
        return "utf8";
      if (enc === "ucs2" || enc === "UCS2")
        return "utf16le";
      enc = `${enc}`.toLowerCase();
      if (enc === "utf8")
        return "utf8";
      if (enc === "ucs2")
        return "utf16le";
      break;
    case 3:
      if (enc === "hex" || enc === "HEX" || `${enc}`.toLowerCase() === "hex") {
        return "hex";
      }
      break;
    case 5:
      if (enc === "ascii")
        return "ascii";
      if (enc === "ucs-2")
        return "utf16le";
      if (enc === "UTF-8")
        return "utf8";
      if (enc === "ASCII")
        return "ascii";
      if (enc === "UCS-2")
        return "utf16le";
      enc = `${enc}`.toLowerCase();
      if (enc === "utf-8")
        return "utf8";
      if (enc === "ascii")
        return "ascii";
      if (enc === "ucs-2")
        return "utf16le";
      break;
    case 6:
      if (enc === "base64")
        return "base64";
      if (enc === "latin1" || enc === "binary")
        return "latin1";
      if (enc === "BASE64")
        return "base64";
      if (enc === "LATIN1" || enc === "BINARY")
        return "latin1";
      enc = `${enc}`.toLowerCase();
      if (enc === "base64")
        return "base64";
      if (enc === "latin1" || enc === "binary")
        return "latin1";
      break;
    case 7:
      if (enc === "utf16le" || enc === "UTF16LE" || `${enc}`.toLowerCase() === "utf16le") {
        return "utf16le";
      }
      break;
    case 8:
      if (enc === "utf-16le" || enc === "UTF-16LE" || `${enc}`.toLowerCase() === "utf-16le") {
        return "utf16le";
      }
      break;
    default:
      if (enc === "")
        return "utf8";
  }
}
export function validateIntegerRange(value, name, min = -2147483648, max = 2147483647) {
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be 'an integer' but was ${value}`);
  }
  if (value < min || value > max) {
    throw new Error(`${name} must be >= ${min} && <= ${max}. Value was ${value}`);
  }
}
