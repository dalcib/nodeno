import init, {
  source,
  create_hash as createHash,
  update_hash as updateHash,
  digest_hash as digestHash
} from "./wasm.js";
import * as hex from "../../encoding/hex.js";
import * as base64 from "../../encoding/base64.js";
await init(source);
const TYPE_ERROR_MSG = "hash: `data` is invalid type";
export class Hash {
  #hash;
  #digested;
  constructor(algorithm) {
    this.#hash = createHash(algorithm);
    this.#digested = false;
  }
  update(data) {
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
    updateHash(this.#hash, msg);
    return this;
  }
  digest() {
    if (this.#digested)
      throw new Error("hash: already digested");
    this.#digested = true;
    return digestHash(this.#hash);
  }
  toString(format = "hex") {
    const finalized = new Uint8Array(this.digest());
    switch (format) {
      case "hex":
        return hex.encodeToString(finalized);
      case "base64":
        return base64.encode(finalized);
      default:
        throw new Error("hash: invalid format");
    }
  }
}
