Object.defineProperty(globalThis, Symbol.toStringTag, {
  value: "global",
  writable: false,
  enumerable: false,
  configurable: true
});
globalThis["global"] = globalThis;
