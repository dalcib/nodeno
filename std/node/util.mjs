export {promisify} from "./_util/_util_promisify.mjs";
export {callbackify} from "./_util/_util_callbackify.mjs";
import {codes, errorMap} from "./_errors.mjs";
import * as types from "./_util/_util_types.mjs";
export {types};
const NumberIsSafeInteger = Number.isSafeInteger;
const {
  ERR_OUT_OF_RANGE,
  ERR_INVALID_ARG_TYPE
} = codes;
const DEFAULT_INSPECT_OPTIONS = {
  showHidden: false,
  depth: 2,
  colors: false,
  customInspect: true,
  showProxy: false,
  maxArrayLength: 100,
  maxStringLength: Infinity,
  breakLength: 80,
  compact: 3,
  sorted: false,
  getters: false
};
inspect.defaultOptions = DEFAULT_INSPECT_OPTIONS;
inspect.custom = Deno.customInspect;
export function inspect(object, ...opts) {
  opts = {...DEFAULT_INSPECT_OPTIONS, ...opts};
  return Deno.inspect(object, {
    depth: opts.depth,
    iterableLimit: opts.maxArrayLength,
    compact: !!opts.compact,
    sorted: !!opts.sorted,
    showProxy: !!opts.showProxy
  });
}
export function isArray(value) {
  return Array.isArray(value);
}
export function isBoolean(value) {
  return typeof value === "boolean" || value instanceof Boolean;
}
export function isNull(value) {
  return value === null;
}
export function isNullOrUndefined(value) {
  return value === null || value === void 0;
}
export function isNumber(value) {
  return typeof value === "number" || value instanceof Number;
}
export function isString(value) {
  return typeof value === "string" || value instanceof String;
}
export function isSymbol(value) {
  return typeof value === "symbol";
}
export function isUndefined(value) {
  return value === void 0;
}
export function isObject(value) {
  return value !== null && typeof value === "object";
}
export function isError(e) {
  return e instanceof Error;
}
export function isFunction(value) {
  return typeof value === "function";
}
export function isRegExp(value) {
  return value instanceof RegExp;
}
export function isPrimitive(value) {
  return value === null || typeof value !== "object" && typeof value !== "function";
}
export function getSystemErrorName(code) {
  if (typeof code !== "number") {
    throw new ERR_INVALID_ARG_TYPE("err", "number", code);
  }
  if (code >= 0 || !NumberIsSafeInteger(code)) {
    throw new ERR_OUT_OF_RANGE("err", "a negative integer", code);
  }
  return errorMap.get(code)?.[0];
}
import {_TextDecoder, _TextEncoder} from "./_utils.mjs";
export const TextDecoder = _TextDecoder;
export const TextEncoder = _TextEncoder;
