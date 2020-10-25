import {Sponge} from "./sponge.mjs";
import {keccakf as keccakf2} from "./keccakf.mjs";
export class Shake128 extends Sponge {
  constructor(bitsize) {
    if (bitsize < 8) {
      throw new Error("shake128: `bitsize` too small");
    }
    if (bitsize % 8 !== 0) {
      throw new Error("shake128: `bitsize` must be multiple of 8");
    }
    super({
      bitsize,
      rate: 168,
      dsbyte: 31,
      permutator: keccakf2
    });
  }
}
export class Shake256 extends Sponge {
  constructor(bitsize) {
    if (bitsize < 8) {
      throw new Error("shake256: `bitsize` too small");
    }
    if (bitsize % 8 !== 0) {
      throw new Error("shake256: `bitsize` must be multiple of 8");
    }
    super({
      bitsize,
      rate: 136,
      dsbyte: 31,
      permutator: keccakf2
    });
  }
}
