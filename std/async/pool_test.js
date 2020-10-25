import {pooledMap} from "./pool.js";
import {assert} from "../testing/asserts.js";
Deno.test("[async] pooledMap", async function() {
  const start = new Date();
  const results = pooledMap(2, [1, 2, 3], (i) => new Promise((r) => setTimeout(() => r(i), 1e3)));
  for await (const value of results) {
    console.log(value);
  }
  const diff = new Date().getTime() - start.getTime();
  assert(diff >= 2e3);
  assert(diff < 3e3);
});
