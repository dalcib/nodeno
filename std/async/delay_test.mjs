import {delay as delay2} from "./delay.mjs";
import {assert} from "../testing/asserts.mjs";
Deno.test("[async] delay", async function() {
  const start = new Date();
  const delayedPromise = delay2(100);
  const result = await delayedPromise;
  const diff = new Date().getTime() - start.getTime();
  assert(result === void 0);
  assert(diff >= 100);
});
