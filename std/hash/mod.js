import {Hash} from "./_wasm/hash.js";
export function createHash(algorithm) {
  return new Hash(algorithm);
}
