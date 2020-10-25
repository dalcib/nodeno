import {Hash} from "./_wasm/hash.mjs";
export function createHash(algorithm) {
  return new Hash(algorithm);
}
