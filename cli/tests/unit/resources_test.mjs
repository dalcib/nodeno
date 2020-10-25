import {assert, assertEquals, assertThrows, unitTest} from "./test_util.mjs";
unitTest(function resourcesCloseBadArgs() {
  assertThrows(() => {
    Deno.close(null);
  }, TypeError);
});
unitTest(function resourcesStdio() {
  const res = Deno.resources();
  assertEquals(res[0], "stdin");
  assertEquals(res[1], "stdout");
  assertEquals(res[2], "stderr");
});
unitTest({perms: {net: true}}, async function resourcesNet() {
  const listener = Deno.listen({port: 4501});
  const dialerConn = await Deno.connect({port: 4501});
  const listenerConn = await listener.accept();
  const res = Deno.resources();
  assertEquals(Object.values(res).filter((r) => r === "tcpListener").length, 1);
  const tcpStreams = Object.values(res).filter((r) => r === "tcpStream");
  assert(tcpStreams.length >= 2);
  listenerConn.close();
  dialerConn.close();
  listener.close();
});
unitTest({perms: {read: true}}, async function resourcesFile() {
  const resourcesBefore = Deno.resources();
  const f = await Deno.open("cli/tests/hello.txt");
  const resourcesAfter = Deno.resources();
  f.close();
  assertEquals(Object.keys(resourcesAfter).length, Object.keys(resourcesBefore).length + 1);
  const newRid = +Object.keys(resourcesAfter).find((rid) => {
    return !resourcesBefore.hasOwnProperty(rid);
  });
  assertEquals(resourcesAfter[newRid], "fsFile");
});
