const _toString = Object.prototype.toString;
const _isObjectLike = (value) => value !== null && typeof value === "object";
const _isFunctionLike = (value) => value !== null && typeof value === "function";
export function isAnyArrayBuffer(value) {
  return _isObjectLike(value) && (_toString.call(value) === "[object ArrayBuffer]" || _toString.call(value) === "[object SharedArrayBuffer]");
}
export function isArrayBufferView(value) {
  return ArrayBuffer.isView(value);
}
export function isArgumentsObject(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Arguments]";
}
export function isArrayBuffer(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object ArrayBuffer]";
}
export function isAsyncFunction(value) {
  return _isFunctionLike(value) && _toString.call(value) === "[object AsyncFunction]";
}
export function isBigInt64Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object BigInt64Array]";
}
export function isBigUint64Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object BigUint64Array]";
}
export function isBooleanObject(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Boolean]";
}
export function isBoxedPrimitive(value) {
  return isBooleanObject(value) || isStringObject(value) || isNumberObject(value) || isSymbolObject(value) || isBigIntObject(value);
}
export function isDataView(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object DataView]";
}
export function isDate(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Date]";
}
export function isFloat32Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Float32Array]";
}
export function isFloat64Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Float64Array]";
}
export function isGeneratorFunction(value) {
  return _isFunctionLike(value) && _toString.call(value) === "[object GeneratorFunction]";
}
export function isGeneratorObject(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Generator]";
}
export function isInt8Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Int8Array]";
}
export function isInt16Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Int16Array]";
}
export function isInt32Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Int32Array]";
}
export function isMap(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Map]";
}
export function isMapIterator(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Map Iterator]";
}
export function isModuleNamespaceObject(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Module]";
}
export function isNativeError(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Error]";
}
export function isNumberObject(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Number]";
}
export function isBigIntObject(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object BigInt]";
}
export function isPromise(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Promise]";
}
export function isRegExp(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object RegExp]";
}
export function isSet(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Set]";
}
export function isSetIterator(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Set Iterator]";
}
export function isSharedArrayBuffer(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object SharedArrayBuffer]";
}
export function isStringObject(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object String]";
}
export function isSymbolObject(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Symbol]";
}
export function isTypedArray(value) {
  const reTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;
  return _isObjectLike(value) && reTypedTag.test(_toString.call(value));
}
export function isUint8Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Uint8Array]";
}
export function isUint8ClampedArray(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Uint8ClampedArray]";
}
export function isUint16Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Uint16Array]";
}
export function isUint32Array(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object Uint32Array]";
}
export function isWeakMap(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object WeakMap]";
}
export function isWeakSet(value) {
  return _isObjectLike(value) && _toString.call(value) === "[object WeakSet]";
}
