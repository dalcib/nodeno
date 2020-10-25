import {watch} from "./_fs_watch.js";
import {assertEquals} from "../../testing/asserts.js";
function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
Deno.test({
  name: "watching a file",
  async fn() {
    const file = Deno.makeTempFileSync();
    const result = [];
    const watcher = watch(file, (eventType, filename) => result.push([eventType, filename]));
    await wait(100);
    Deno.writeTextFileSync(file, "something");
    await wait(100);
    watcher.close();
    assertEquals(result, [
      ["modify", file],
      ["modify", file],
      ["access", file]
    ]);
  }
});
