import {Sponge} from "./sponge.mjs";
import {keccakf as keccakf2} from "./keccakf.mjs";
export class Sha3_224 extends Sponge {
  constructor() {
    super({
      bitsize: 224,
      rate: 144,
      dsbyte: 6,
      permutator: keccakf2
    });
  }
}
export class Sha3_256 extends Sponge {
  constructor() {
    super({
      bitsize: 256,
      rate: 136,
      dsbyte: 6,
      permutator: keccakf2
    });
  }
}
export class Sha3_384 extends Sponge {
  constructor() {
    super({
      bitsize: 384,
      rate: 104,
      dsbyte: 6,
      permutator: keccakf2
    });
  }
}
export class Sha3_512 extends Sponge {
  constructor() {
    super({
      bitsize: 512,
      rate: 72,
      dsbyte: 6,
      permutator: keccakf2
    });
  }
}
