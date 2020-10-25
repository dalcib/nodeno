import {
  bytesToUuid,
  createBuffer,
  stringToBytes,
  uuidToBytes
} from "./_common.js";
import {Sha1} from "../hash/sha1.js";
import {assert as assert2} from "../_util/assert.js";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validate(id) {
  return UUID_RE.test(id);
}
export function generate(options, buf, offset) {
  const i = buf && offset || 0;
  let {value, namespace} = options;
  if (typeof value == "string") {
    value = stringToBytes(value);
  }
  if (typeof namespace == "string") {
    namespace = uuidToBytes(namespace);
  }
  assert2(namespace.length === 16, "namespace must be uuid string or an Array of 16 byte values");
  const content = namespace.concat(value);
  const bytes = new Sha1().update(createBuffer(content)).digest();
  bytes[6] = bytes[6] & 15 | 80;
  bytes[8] = bytes[8] & 63 | 128;
  if (buf) {
    for (let idx = 0; idx < 16; ++idx) {
      buf[i + idx] = bytes[idx];
    }
  }
  return buf || bytesToUuid(bytes);
}
