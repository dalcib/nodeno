import {assertMatch, assertStrictEquals, unitTest} from "./test_util.mjs";
unitTest(function malformedJsonControlBuffer() {
  const opId = Deno.core.ops()["op_open_sync"];
  const argsBuf = new Uint8Array([1, 2, 3, 4, 5]);
  const resBuf = Deno.core.send(opId, argsBuf);
  const resText = new TextDecoder().decode(resBuf);
  const resObj = JSON.parse(resText);
  assertStrictEquals(resObj.ok, void 0);
  assertStrictEquals(resObj.err.className, "SyntaxError");
  assertMatch(resObj.err.message, /\bexpected value\b/);
});
unitTest(function invalidPromiseId() {
  const opId = Deno.core.ops()["op_open_async"];
  const argsObj = {
    promiseId: "1. NEIN!",
    path: "/tmp/P.I.S.C.I.X/yeah",
    mode: 438,
    options: {
      read: true,
      write: true,
      create: true,
      truncate: false,
      append: false,
      createNew: false
    }
  };
  const argsText = JSON.stringify(argsObj);
  const argsBuf = new TextEncoder().encode(argsText);
  const resBuf = Deno.core.send(opId, argsBuf);
  const resText = new TextDecoder().decode(resBuf);
  const resObj = JSON.parse(resText);
  console.error(resText);
  assertStrictEquals(resObj.ok, void 0);
  assertStrictEquals(resObj.err.className, "TypeError");
  assertMatch(resObj.err.message, /\bpromiseId\b/);
});
