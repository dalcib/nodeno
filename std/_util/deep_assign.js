import {assert as assert2} from "../_util/assert.js";
export function deepAssign(target, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    if (!source || typeof source !== `object`) {
      return;
    }
    Object.entries(source).forEach(([key, value]) => {
      if (value instanceof Date) {
        target[key] = new Date(value);
        return;
      }
      if (!value || typeof value !== `object`) {
        target[key] = value;
        return;
      }
      if (Array.isArray(value)) {
        target[key] = [];
      }
      if (typeof target[key] !== `object` || !target[key]) {
        target[key] = {};
      }
      assert2(value);
      deepAssign(target[key], value);
    });
  }
  return target;
}
