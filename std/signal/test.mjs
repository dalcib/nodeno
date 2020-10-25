import {assertEquals, assertThrows} from "../testing/asserts.mjs";
import {delay as delay2} from "../async/delay.mjs";
import {onSignal, signal} from "./mod.mjs";
Deno.test({
  name: "signal() throws when called with empty signals",
  ignore: Deno.build.os === "windows",
  fn() {
    assertThrows(() => {
      signal();
    }, Error, "No signals are given. You need to specify at least one signal to create a signal stream.");
  }
});
Deno.test({
  name: "signal() iterates for multiple signals",
  ignore: Deno.build.os === "windows",
  fn: async () => {
    const t = setInterval(() => {
    }, 1e3);
    let c = 0;
    const sig = signal(Deno.Signal.SIGUSR1, Deno.Signal.SIGUSR2, Deno.Signal.SIGINT);
    setTimeout(async () => {
      await delay2(20);
      Deno.kill(Deno.pid, Deno.Signal.SIGINT);
      await delay2(20);
      Deno.kill(Deno.pid, Deno.Signal.SIGUSR2);
      await delay2(20);
      Deno.kill(Deno.pid, Deno.Signal.SIGUSR1);
      await delay2(20);
      Deno.kill(Deno.pid, Deno.Signal.SIGUSR2);
      await delay2(20);
      Deno.kill(Deno.pid, Deno.Signal.SIGUSR1);
      await delay2(20);
      Deno.kill(Deno.pid, Deno.Signal.SIGINT);
      await delay2(20);
      sig.dispose();
    });
    for await (const _ of sig) {
      c += 1;
    }
    assertEquals(c, 6);
    clearTimeout(t);
  }
});
Deno.test({
  name: "onSignal() registers and disposes of event handler",
  ignore: Deno.build.os === "windows",
  async fn() {
    const t = setInterval(() => {
    }, 1e3);
    let calledCount = 0;
    const handle = onSignal(Deno.Signal.SIGINT, () => {
      calledCount++;
    });
    await delay2(20);
    Deno.kill(Deno.pid, Deno.Signal.SIGINT);
    await delay2(20);
    Deno.kill(Deno.pid, Deno.Signal.SIGINT);
    await delay2(20);
    Deno.kill(Deno.pid, Deno.Signal.SIGUSR2);
    await delay2(20);
    handle.dispose();
    await delay2(20);
    Deno.kill(Deno.pid, Deno.Signal.SIGUSR1);
    await delay2(20);
    Deno.kill(Deno.pid, Deno.Signal.SIGINT);
    await delay2(20);
    assertEquals(calledCount, 2);
    clearTimeout(t);
  }
});
