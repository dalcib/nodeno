import {assertEquals, assertThrowsAsync} from "../testing/asserts.mjs";
import {MuxAsyncIterator} from "./mux_async_iterator.mjs";
async function* gen123() {
  yield 1;
  yield 2;
  yield 3;
}
async function* gen456() {
  yield 4;
  yield 5;
  yield 6;
}
async function* genThrows() {
  yield 7;
  throw new Error("something went wrong");
}
Deno.test("[async] MuxAsyncIterator", async function() {
  const mux = new MuxAsyncIterator();
  mux.add(gen123());
  mux.add(gen456());
  const results = new Set();
  for await (const value of mux) {
    results.add(value);
  }
  assertEquals(results.size, 6);
});
Deno.test({
  name: "[async] MuxAsyncIterator throws",
  async fn() {
    const mux = new MuxAsyncIterator();
    mux.add(gen123());
    mux.add(genThrows());
    const results = new Set();
    await assertThrowsAsync(async () => {
      for await (const value of mux) {
        results.add(value);
      }
    }, Error, "something went wrong");
  }
});
