import * as hex from "../../encoding/hex.js";
const STATE_SIZE = 200;
const TYPE_ERROR_MSG = "sha3: `data` is invalid type";
export class Sponge {
  #option;
  #state;
  #rp;
  #absorbing;
  constructor(option) {
    this.#option = option;
    this.#state = new Uint8Array(STATE_SIZE);
    this.#rp = 0;
    this.#absorbing = true;
  }
  pad() {
    this.#state[this.#rp] ^= this.#option.dsbyte;
    this.#state[this.#option.rate - 1] ^= 128;
  }
  squeeze(length) {
    if (length < 0) {
      throw new Error("sha3: length cannot be negative");
    }
    this.pad();
    const hash = new Uint8Array(length);
    let pos = 0;
    while (length > 0) {
      const r = length > this.#option.rate ? this.#option.rate : length;
      this.#option.permutator(this.#state);
      hash.set(this.#state.slice(0, r), pos);
      length -= r;
      pos += r;
    }
    this.#absorbing = false;
    return hash;
  }
  update(data) {
    if (!this.#absorbing) {
      throw new Error("sha3: cannot update already finalized hash");
    }
    let msg;
    if (typeof data === "string") {
      msg = new TextEncoder().encode(data);
    } else if (typeof data === "object") {
      if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
        msg = new Uint8Array(data);
      } else {
        throw new Error(TYPE_ERROR_MSG);
      }
    } else {
      throw new Error(TYPE_ERROR_MSG);
    }
    let rp = this.#rp;
    for (let i = 0; i < msg.length; ++i) {
      this.#state[rp++] ^= msg[i];
      if (rp >= this.#option.rate) {
        this.#option.permutator(this.#state);
        rp = 0;
      }
    }
    this.#rp = rp;
    return this;
  }
  digest() {
    return this.squeeze(this.#option.bitsize >> 3);
  }
  toString(format = "hex") {
    const rawOutput = this.squeeze(this.#option.bitsize >> 3);
    switch (format) {
      case "hex":
        return hex.encodeToString(rawOutput);
      default:
        throw new Error("sha3: invalid output format");
    }
  }
}
