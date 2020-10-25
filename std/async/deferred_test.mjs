import {assertEquals, assertThrowsAsync} from "../testing/asserts.mjs";
import {deferred as deferred2} from "./deferred.mjs";
Deno.test("[async] deferred: resolve", async function() {
  const d = deferred2();
  d.resolve("🦕");
  assertEquals(await d, "🦕");
});
Deno.test("[async] deferred: reject", async function() {
  const d = deferred2();
  d.reject(new Error("A deno error 🦕"));
  await assertThrowsAsync(async () => {
    await d;
  });
});
