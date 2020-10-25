export class OneByteReader {
  constructor(r) {
    this.r = r;
  }
  read(p) {
    if (p.byteLength === 0) {
      return Promise.resolve(0);
    }
    if (!(p instanceof Uint8Array)) {
      throw Error("expected Uint8Array");
    }
    return Promise.resolve(this.r.read(p.subarray(0, 1)));
  }
}
export class HalfReader {
  constructor(r) {
    this.r = r;
  }
  read(p) {
    if (!(p instanceof Uint8Array)) {
      throw Error("expected Uint8Array");
    }
    const half = Math.floor((p.byteLength + 1) / 2);
    return Promise.resolve(this.r.read(p.subarray(0, half)));
  }
}
export class TimeoutReader {
  constructor(r) {
    this.r = r;
    this.count = 0;
  }
  read(p) {
    this.count++;
    if (this.count === 2) {
      throw new Deno.errors.TimedOut();
    }
    return Promise.resolve(this.r.read(p));
  }
}
