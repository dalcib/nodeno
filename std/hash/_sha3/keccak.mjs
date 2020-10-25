import {Sponge} from "./sponge.mjs";
import {keccakf as keccakf2} from "./keccakf.mjs";
export class Keccak224 extends Sponge {
  constructor() {
    super({
      bitsize: 224,
      rate: 144,
      dsbyte: 1,
      permutator: keccakf2
    });
  }
}
export class Keccak256 extends Sponge {
  constructor() {
    super({
      bitsize: 256,
      rate: 136,
      dsbyte: 1,
      permutator: keccakf2
    });
  }
}
export class Keccak384 extends Sponge {
  constructor() {
    super({
      bitsize: 384,
      rate: 104,
      dsbyte: 1,
      permutator: keccakf2
    });
  }
}
export class Keccak512 extends Sponge {
  constructor() {
    super({
      bitsize: 512,
      rate: 72,
      dsbyte: 1,
      permutator: keccakf2
    });
  }
}
