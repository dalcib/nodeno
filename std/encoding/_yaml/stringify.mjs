import {dump} from "./dumper/dumper.mjs";
export function stringify(obj, options) {
  return dump(obj, options);
}
