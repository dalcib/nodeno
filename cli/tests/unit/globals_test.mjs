import {assert, unitTest} from "./test_util.mjs";
unitTest(function globalThisExists() {
  assert(globalThis != null);
});
unitTest(function noInternalGlobals() {
  for (const key of Object.keys(globalThis)) {
    assert(!key.startsWith("_"));
  }
});
unitTest(function windowExists() {
  assert(window != null);
});
unitTest(function selfExists() {
  assert(self != null);
});
unitTest(function windowWindowExists() {
  assert(window.window === window);
});
unitTest(function windowSelfExists() {
  assert(window.self === window);
});
unitTest(function globalThisEqualsWindow() {
  assert(globalThis === window);
});
unitTest(function globalThisEqualsSelf() {
  assert(globalThis === self);
});
unitTest(function DenoNamespaceExists() {
  assert(Deno != null);
});
unitTest(function DenoNamespaceEqualsWindowDeno() {
  assert(Deno === window.Deno);
});
unitTest(function DenoNamespaceIsFrozen() {
  assert(Object.isFrozen(Deno));
});
unitTest(function webAssemblyExists() {
  assert(typeof WebAssembly.compile === "function");
});
unitTest(function DenoNamespaceImmutable() {
  const denoCopy = window.Deno;
  try {
    Deno = 1;
  } catch {
  }
  assert(denoCopy === Deno);
  try {
    window.Deno = 1;
  } catch {
  }
  assert(denoCopy === Deno);
  try {
    delete window.Deno;
  } catch {
  }
  assert(denoCopy === Deno);
  const {readFile} = Deno;
  try {
    Deno.readFile = 1;
  } catch {
  }
  assert(readFile === Deno.readFile);
  try {
    delete window.Deno.readFile;
  } catch {
  }
  assert(readFile === Deno.readFile);
  const {print} = Deno.core;
  try {
    Deno.core.print = 1;
  } catch {
  }
  assert(print === Deno.core.print);
  try {
    delete Deno.core.print;
  } catch {
  }
  assert(print === Deno.core.print);
});
unitTest(async function windowQueueMicrotask() {
  let resolve1;
  let resolve2;
  let microtaskDone = false;
  const p1 = new Promise((res) => {
    resolve1 = () => {
      microtaskDone = true;
      res();
    };
  });
  const p2 = new Promise((res) => {
    resolve2 = () => {
      assert(microtaskDone);
      res();
    };
  });
  window.queueMicrotask(resolve1);
  setTimeout(resolve2, 0);
  await p1;
  await p2;
});
