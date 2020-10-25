import {dump} from "./dumper/dumper.js";
export function stringify(obj, options) {
  return dump(obj, options);
}
