import {bytesToUuid} from "./_common.js";
const UUID_RE = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", "i");
export function validate(id) {
  return UUID_RE.test(id);
}
export function generate() {
  const rnds = crypto.getRandomValues(new Uint8Array(16));
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return bytesToUuid(rnds);
}
