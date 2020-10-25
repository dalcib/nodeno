import {mul32} from "./util.mjs";
const offset32 = 2166136261;
const prime32 = 16777619;
class Fnv32Base {
  #state;
  constructor() {
    this.#state = offset32;
  }
  _updateState(newState) {
    this.#state = newState;
  }
  reset() {
    this.#state = offset32;
  }
  size() {
    return 4;
  }
  blockSize() {
    return 1;
  }
  sum32() {
    return this.#state;
  }
  sum() {
    return Uint8Array.from([
      this.#state >> 24 & 255,
      this.#state >> 16 & 255,
      this.#state >> 8 & 255,
      this.#state & 255
    ]);
  }
}
export class Fnv32 extends Fnv32Base {
  write(data) {
    let hash = this.sum32();
    data.forEach((c) => {
      hash = mul32(hash, prime32);
      hash ^= c;
    });
    this._updateState(hash);
    return this;
  }
}
export class Fnv32a extends Fnv32Base {
  write(data) {
    let hash = this.sum32();
    data.forEach((c) => {
      hash ^= c;
      hash = mul32(hash, prime32);
    });
    this._updateState(hash);
    return this;
  }
}
