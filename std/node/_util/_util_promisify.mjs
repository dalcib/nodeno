const kCustomPromisifiedSymbol = Symbol.for("nodejs.util.promisify.custom");
const kCustomPromisifyArgsSymbol = Symbol.for("nodejs.util.promisify.customArgs");
class NodeInvalidArgTypeError extends TypeError {
  constructor(argumentName, type, received) {
    super(`The "${argumentName}" argument must be of type ${type}. Received ${typeof received}`);
    this.code = "ERR_INVALID_ARG_TYPE";
  }
}
export function promisify(original) {
  if (typeof original !== "function") {
    throw new NodeInvalidArgTypeError("original", "Function", original);
  }
  if (original[kCustomPromisifiedSymbol]) {
    const fn2 = original[kCustomPromisifiedSymbol];
    if (typeof fn2 !== "function") {
      throw new NodeInvalidArgTypeError("util.promisify.custom", "Function", fn2);
    }
    return Object.defineProperty(fn2, kCustomPromisifiedSymbol, {
      value: fn2,
      enumerable: false,
      writable: false,
      configurable: true
    });
  }
  const argumentNames = original[kCustomPromisifyArgsSymbol];
  function fn(...args) {
    return new Promise((resolve, reject) => {
      original.call(this, ...args, (err, ...values) => {
        if (err) {
          return reject(err);
        }
        if (argumentNames !== void 0 && values.length > 1) {
          const obj = {};
          for (let i = 0; i < argumentNames.length; i++) {
            obj[argumentNames[i]] = values[i];
          }
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
    });
  }
  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
promisify.custom = kCustomPromisifiedSymbol;
