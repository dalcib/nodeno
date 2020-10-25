import * as v1 from "./v1.js";
import * as v4 from "./v4.js";
import * as v5 from "./v5.js";
export const NIL_UUID = "00000000-0000-0000-0000-000000000000";
export function isNil(val) {
  return val === NIL_UUID;
}
export {v1, v4, v5};
