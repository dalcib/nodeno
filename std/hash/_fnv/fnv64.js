import {mul64} from "./util.js";
const offset64Lo = 2216829733;
const offset64Hi = 3421674724;
const prime64Lo = 435;
const prime64Hi = 256;
class Fnv64Base {
  #stateHi;
  #stateLo;
  constructor() {
    this.#stateHi = offset64Hi;
    this.#stateLo = offset64Lo;
  }
  _updateState([newStateHi, newStateLo]) {
    this.#stateHi = newStateHi;
    this.#stateLo = newStateLo;
  }
  reset() {
    this.#stateHi = offset64Hi;
    this.#stateLo = offset64Lo;
  }
  size() {
    return 8;
  }
  blockSize() {
    return 1;
  }
  sum64() {
    return [this.#stateHi, this.#stateLo];
  }
  sum() {
    return Uint8Array.from([
      this.#stateHi >> 24 & 255,
      this.#stateHi >> 16 & 255,
      this.#stateHi >> 8 & 255,
      this.#stateHi & 255,
      this.#stateLo >> 24 & 255,
      this.#stateLo >> 16 & 255,
      this.#stateLo >> 8 & 255,
      this.#stateLo & 255
    ]);
  }
}
export class Fnv64 extends Fnv64Base {
  write(data) {
    let [hashHi, hashLo] = this.sum64();
    data.forEach((c) => {
      [hashHi, hashLo] = mul64([hashHi, hashLo], [prime64Hi, prime64Lo]);
      hashLo ^= c;
    });
    this._updateState([hashHi, hashLo]);
    return this;
  }
}
export class Fnv64a extends Fnv64Base {
  write(data) {
    let [hashHi, hashLo] = this.sum64();
    data.forEach((c) => {
      hashLo ^= c;
      [hashHi, hashLo] = mul64([hashHi, hashLo], [prime64Hi, prime64Lo]);
    });
    this._updateState([hashHi, hashLo]);
    return this;
  }
}
