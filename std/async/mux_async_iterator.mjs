import {deferred as deferred2} from "./deferred.mjs";
export class MuxAsyncIterator {
  constructor() {
    this.iteratorCount = 0;
    this.yields = [];
    this.throws = [];
    this.signal = deferred2();
  }
  add(iterator) {
    ++this.iteratorCount;
    this.callIteratorNext(iterator);
  }
  async callIteratorNext(iterator) {
    try {
      const {value, done} = await iterator.next();
      if (done) {
        --this.iteratorCount;
      } else {
        this.yields.push({iterator, value});
      }
    } catch (e) {
      this.throws.push(e);
    }
    this.signal.resolve();
  }
  async *iterate() {
    while (this.iteratorCount > 0) {
      await this.signal;
      for (let i = 0; i < this.yields.length; i++) {
        const {iterator, value} = this.yields[i];
        yield value;
        this.callIteratorNext(iterator);
      }
      if (this.throws.length) {
        for (const e of this.throws) {
          throw e;
        }
        this.throws.length = 0;
      }
      this.yields.length = 0;
      this.signal = deferred2();
    }
  }
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
}
