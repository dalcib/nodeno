class NodeFalsyValueRejectionError extends Error {
  constructor(reason) {
    super("Promise was rejected with falsy value");
    this.code = "ERR_FALSY_VALUE_REJECTION";
    this.reason = reason;
  }
}
class NodeInvalidArgTypeError extends TypeError {
  constructor(argumentName) {
    super(`The ${argumentName} argument must be of type function.`);
    this.code = "ERR_INVALID_ARG_TYPE";
  }
}
function callbackify(original) {
  if (typeof original !== "function") {
    throw new NodeInvalidArgTypeError('"original"');
  }
  const callbackified = function(...args) {
    const maybeCb = args.pop();
    if (typeof maybeCb !== "function") {
      throw new NodeInvalidArgTypeError("last");
    }
    const cb = (...args2) => {
      maybeCb.apply(this, args2);
    };
    original.apply(this, args).then((ret) => {
      queueMicrotask(cb.bind(this, null, ret));
    }, (rej) => {
      rej = rej || new NodeFalsyValueRejectionError(rej);
      queueMicrotask(cb.bind(this, rej));
    });
  };
  const descriptors = Object.getOwnPropertyDescriptors(original);
  if (typeof descriptors.length.value === "number") {
    descriptors.length.value++;
  }
  if (typeof descriptors.name.value === "string") {
    descriptors.name.value += "Callbackified";
  }
  Object.defineProperties(callbackified, descriptors);
  return callbackified;
}
export {callbackify};
