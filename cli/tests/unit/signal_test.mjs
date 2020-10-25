import {
  assert,
  assertEquals,
  assertThrows,
  createResolvable,
  unitTest
} from "./test_util.mjs";
function defer(n) {
  return new Promise((resolve, _) => {
    setTimeout(resolve, n);
  });
}
unitTest({ignore: Deno.build.os !== "windows"}, function signalsNotImplemented() {
  assertThrows(() => {
    Deno.signal(1);
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.alarm();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.child();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.hungup();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.interrupt();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.io();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.pipe();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.quit();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.terminate();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.userDefined1();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.userDefined2();
  }, Error, "not implemented");
  assertThrows(() => {
    Deno.signals.windowChange();
  }, Error, "not implemented");
});
unitTest({ignore: Deno.build.os === "windows", perms: {run: true, net: true}}, async function signalStreamTest() {
  const resolvable = createResolvable();
  const t = setInterval(() => {
  }, 1e3);
  let c = 0;
  const sig = Deno.signal(Deno.Signal.SIGUSR1);
  setTimeout(async () => {
    await defer(20);
    for (const _ of Array(3)) {
      Deno.kill(Deno.pid, Deno.Signal.SIGUSR1);
      await defer(20);
    }
    sig.dispose();
    resolvable.resolve();
  });
  for await (const _ of sig) {
    c += 1;
  }
  assertEquals(c, 3);
  clearInterval(t);
  await resolvable;
});
unitTest({ignore: Deno.build.os === "windows", perms: {run: true}}, async function signalPromiseTest() {
  const resolvable = createResolvable();
  const t = setInterval(() => {
  }, 1e3);
  const sig = Deno.signal(Deno.Signal.SIGUSR1);
  setTimeout(() => {
    Deno.kill(Deno.pid, Deno.Signal.SIGUSR1);
    resolvable.resolve();
  }, 20);
  await sig;
  sig.dispose();
  clearInterval(t);
  await resolvable;
});
unitTest({ignore: Deno.build.os === "windows", perms: {run: true}}, function signalShorthandsTest() {
  let s;
  s = Deno.signals.alarm();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.child();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.hungup();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.interrupt();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.io();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.pipe();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.quit();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.terminate();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.userDefined1();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.userDefined2();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
  s = Deno.signals.windowChange();
  assert(s instanceof Deno.SignalStream);
  s.dispose();
});
