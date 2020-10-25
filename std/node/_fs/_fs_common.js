import {notImplemented} from "../_utils.js";
export function isFileOptions(fileOptions) {
  if (!fileOptions)
    return false;
  return fileOptions.encoding != void 0 || fileOptions.flag != void 0 || fileOptions.mode != void 0;
}
export function getEncoding(optOrCallback) {
  if (!optOrCallback || typeof optOrCallback === "function") {
    return null;
  }
  const encoding = typeof optOrCallback === "string" ? optOrCallback : optOrCallback.encoding;
  if (!encoding)
    return null;
  return encoding;
}
export function checkEncoding(encoding) {
  if (!encoding)
    return null;
  encoding = encoding.toLowerCase();
  if (["utf8", "hex", "base64"].includes(encoding))
    return encoding;
  if (encoding === "utf-8") {
    return "utf8";
  }
  if (encoding === "binary") {
    return "binary";
  }
  const notImplementedEncodings = ["utf16le", "latin1", "ascii", "ucs2"];
  if (notImplementedEncodings.includes(encoding)) {
    notImplemented(`"${encoding}" encoding`);
  }
  throw new Error(`The value "${encoding}" is invalid for option "encoding"`);
}
export function getOpenOptions(flag) {
  if (!flag) {
    return {create: true, append: true};
  }
  let openOptions;
  switch (flag) {
    case "a": {
      openOptions = {create: true, append: true};
      break;
    }
    case "ax": {
      openOptions = {createNew: true, write: true, append: true};
      break;
    }
    case "a+": {
      openOptions = {read: true, create: true, append: true};
      break;
    }
    case "ax+": {
      openOptions = {read: true, createNew: true, append: true};
      break;
    }
    case "r": {
      openOptions = {read: true};
      break;
    }
    case "r+": {
      openOptions = {read: true, write: true};
      break;
    }
    case "w": {
      openOptions = {create: true, write: true, truncate: true};
      break;
    }
    case "wx": {
      openOptions = {createNew: true, write: true};
      break;
    }
    case "w+": {
      openOptions = {create: true, write: true, truncate: true, read: true};
      break;
    }
    case "wx+": {
      openOptions = {createNew: true, write: true, read: true};
      break;
    }
    case "as": {
      openOptions = {create: true, append: true};
      break;
    }
    case "as+": {
      openOptions = {create: true, read: true, append: true};
      break;
    }
    case "rs+": {
      openOptions = {create: true, read: true, write: true};
      break;
    }
    default: {
      throw new Error(`Unrecognized file system flag: ${flag}`);
    }
  }
  return openOptions;
}
