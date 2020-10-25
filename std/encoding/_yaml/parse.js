import {load, loadAll} from "./loader/loader.js";
export function parse(content, options) {
  return load(content, options);
}
export function parseAll(content, iterator, options) {
  return loadAll(content, iterator, options);
}
