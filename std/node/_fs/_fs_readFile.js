import {
  getEncoding
} from "./_fs_common.js";
import {Buffer} from "../buffer.js";
import {fromFileUrl} from "../path.js";
function maybeDecode(data, encoding) {
  const buffer2 = new Buffer(data.buffer, data.byteOffset, data.byteLength);
  if (encoding && encoding !== "binary")
    return buffer2.toString(encoding);
  return buffer2;
}
export function readFile(path2, optOrCallback, callback) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  let cb;
  if (typeof optOrCallback === "function") {
    cb = optOrCallback;
  } else {
    cb = callback;
  }
  const encoding = getEncoding(optOrCallback);
  const p = Deno.readFile(path2);
  if (cb) {
    p.then((data) => {
      if (encoding && encoding !== "binary") {
        const text = maybeDecode(data, encoding);
        return cb(null, text);
      }
      const buffer2 = maybeDecode(data, encoding);
      cb(null, buffer2);
    }).catch((err) => cb && cb(err));
  }
}
export function readFileSync(path2, opt) {
  path2 = path2 instanceof URL ? fromFileUrl(path2) : path2;
  const data = Deno.readFileSync(path2);
  const encoding = getEncoding(opt);
  if (encoding && encoding !== "binary") {
    const text = maybeDecode(data, encoding);
    return text;
  }
  const buffer2 = maybeDecode(data, encoding);
  return buffer2;
}
