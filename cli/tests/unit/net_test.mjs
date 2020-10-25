import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
  assertThrowsAsync,
  createResolvable,
  unitTest
} from "./test_util.mjs";
unitTest({perms: {net: true}}, function netTcpListenClose() {
  const listener = Deno.listen({hostname: "127.0.0.1", port: 3500});
  assert(listener.addr.transport === "tcp");
  assertEquals(listener.addr.hostname, "127.0.0.1");
  assertEquals(listener.addr.port, 3500);
  assertNotEquals(listener.rid, 0);
  listener.close();
});
unitTest({
  perms: {net: true},
  ignore: Deno.build.os === "windows"
}, function netUdpListenClose() {
  const socket = Deno.listenDatagram({
    hostname: "127.0.0.1",
    port: 3500,
    transport: "udp"
  });
  assert(socket.addr.transport === "udp");
  assertEquals(socket.addr.hostname, "127.0.0.1");
  assertEquals(socket.addr.port, 3500);
  socket.close();
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, function netUnixListenClose() {
  const filePath = Deno.makeTempFileSync();
  const socket = Deno.listen({
    path: filePath,
    transport: "unix"
  });
  assert(socket.addr.transport === "unix");
  assertEquals(socket.addr.path, filePath);
  socket.close();
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, function netUnixPacketListenClose() {
  const filePath = Deno.makeTempFileSync();
  const socket = Deno.listenDatagram({
    path: filePath,
    transport: "unixpacket"
  });
  assert(socket.addr.transport === "unixpacket");
  assertEquals(socket.addr.path, filePath);
  socket.close();
});
unitTest({
  perms: {net: true}
}, async function netTcpCloseWhileAccept() {
  const listener = Deno.listen({port: 4501});
  const p = listener.accept();
  listener.close();
  await assertThrowsAsync(async () => {
    await p;
  }, Deno.errors.BadResource, "Listener has been closed");
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, async function netUnixCloseWhileAccept() {
  const filePath = await Deno.makeTempFile();
  const listener = Deno.listen({
    path: filePath,
    transport: "unix"
  });
  const p = listener.accept();
  listener.close();
  await assertThrowsAsync(async () => {
    await p;
  }, Deno.errors.BadResource, "Listener has been closed");
});
unitTest({perms: {net: true}}, async function netTcpConcurrentAccept() {
  const listener = Deno.listen({port: 4502});
  let acceptErrCount = 0;
  const checkErr = (e) => {
    if (e.message === "Listener has been closed") {
      assertEquals(acceptErrCount, 1);
    } else if (e.message === "Another accept task is ongoing") {
      acceptErrCount++;
    } else {
      throw new Error("Unexpected error message");
    }
  };
  const p = listener.accept().catch(checkErr);
  const p1 = listener.accept().catch(checkErr);
  await Promise.race([p, p1]);
  listener.close();
  await Promise.all([p, p1]);
  assertEquals(acceptErrCount, 1);
});
unitTest({ignore: true, perms: {read: true, write: true}}, async function netUnixConcurrentAccept() {
  const filePath = await Deno.makeTempFile();
  const listener = Deno.listen({transport: "unix", path: filePath});
  let acceptErrCount = 0;
  const checkErr = (e) => {
    if (e.message === "Listener has been closed") {
      assertEquals(acceptErrCount, 1);
    } else if (e.message === "Another accept task is ongoing") {
      acceptErrCount++;
    } else {
      throw new Error("Unexpected error message");
    }
  };
  const p = listener.accept().catch(checkErr);
  const p1 = listener.accept().catch(checkErr);
  await Promise.race([p, p1]);
  listener.close();
  await [p, p1];
  assertEquals(acceptErrCount, 1);
});
unitTest({perms: {net: true}}, async function netTcpDialListen() {
  const listener = Deno.listen({port: 3500});
  listener.accept().then(async (conn2) => {
    assert(conn2.remoteAddr != null);
    assert(conn2.localAddr.transport === "tcp");
    assertEquals(conn2.localAddr.hostname, "127.0.0.1");
    assertEquals(conn2.localAddr.port, 3500);
    await conn2.write(new Uint8Array([1, 2, 3]));
    conn2.close();
  });
  const conn = await Deno.connect({hostname: "127.0.0.1", port: 3500});
  assert(conn.remoteAddr.transport === "tcp");
  assertEquals(conn.remoteAddr.hostname, "127.0.0.1");
  assertEquals(conn.remoteAddr.port, 3500);
  assert(conn.localAddr != null);
  const buf = new Uint8Array(1024);
  const readResult = await conn.read(buf);
  assertEquals(3, readResult);
  assertEquals(1, buf[0]);
  assertEquals(2, buf[1]);
  assertEquals(3, buf[2]);
  assert(conn.rid > 0);
  assert(readResult !== null);
  const readResult2 = await conn.read(buf);
  assertEquals(readResult2, null);
  listener.close();
  conn.close();
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, async function netUnixDialListen() {
  const filePath = await Deno.makeTempFile();
  const listener = Deno.listen({path: filePath, transport: "unix"});
  listener.accept().then(async (conn2) => {
    assert(conn2.remoteAddr != null);
    assert(conn2.localAddr.transport === "unix");
    assertEquals(conn2.localAddr.path, filePath);
    await conn2.write(new Uint8Array([1, 2, 3]));
    conn2.close();
  });
  const conn = await Deno.connect({path: filePath, transport: "unix"});
  assert(conn.remoteAddr.transport === "unix");
  assertEquals(conn.remoteAddr.path, filePath);
  assert(conn.remoteAddr != null);
  const buf = new Uint8Array(1024);
  const readResult = await conn.read(buf);
  assertEquals(3, readResult);
  assertEquals(1, buf[0]);
  assertEquals(2, buf[1]);
  assertEquals(3, buf[2]);
  assert(conn.rid > 0);
  assert(readResult !== null);
  const readResult2 = await conn.read(buf);
  assertEquals(readResult2, null);
  listener.close();
  conn.close();
});
unitTest({ignore: Deno.build.os === "windows", perms: {net: true}}, async function netUdpSendReceive() {
  const alice = Deno.listenDatagram({port: 3500, transport: "udp"});
  assert(alice.addr.transport === "udp");
  assertEquals(alice.addr.port, 3500);
  assertEquals(alice.addr.hostname, "127.0.0.1");
  const bob = Deno.listenDatagram({port: 4501, transport: "udp"});
  assert(bob.addr.transport === "udp");
  assertEquals(bob.addr.port, 4501);
  assertEquals(bob.addr.hostname, "127.0.0.1");
  const sent = new Uint8Array([1, 2, 3]);
  const byteLength = await alice.send(sent, bob.addr);
  assertEquals(byteLength, 3);
  const [recvd, remote] = await bob.receive();
  assert(remote.transport === "udp");
  assertEquals(remote.port, 3500);
  assertEquals(recvd.length, 3);
  assertEquals(1, recvd[0]);
  assertEquals(2, recvd[1]);
  assertEquals(3, recvd[2]);
  alice.close();
  bob.close();
});
unitTest({ignore: Deno.build.os === "windows", perms: {net: true}}, async function netUdpBorrowMutError() {
  const socket = Deno.listenDatagram({
    port: 4501,
    transport: "udp"
  });
  const a = socket.send(new Uint8Array(), socket.addr);
  const b = socket.send(new Uint8Array(), socket.addr);
  await Promise.all([a, b]);
  socket.close();
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, async function netUnixPacketSendReceive() {
  const filePath = await Deno.makeTempFile();
  const alice = Deno.listenDatagram({
    path: filePath,
    transport: "unixpacket"
  });
  assert(alice.addr.transport === "unixpacket");
  assertEquals(alice.addr.path, filePath);
  const bob = Deno.listenDatagram({
    path: filePath,
    transport: "unixpacket"
  });
  assert(bob.addr.transport === "unixpacket");
  assertEquals(bob.addr.path, filePath);
  const sent = new Uint8Array([1, 2, 3]);
  const byteLength = await alice.send(sent, bob.addr);
  assertEquals(byteLength, 3);
  const [recvd, remote] = await bob.receive();
  assert(remote.transport === "unixpacket");
  assertEquals(remote.path, filePath);
  assertEquals(recvd.length, 3);
  assertEquals(1, recvd[0]);
  assertEquals(2, recvd[1]);
  assertEquals(3, recvd[2]);
  alice.close();
  bob.close();
});
unitTest({perms: {net: true}}, async function netTcpListenIteratorBreakClosesResource() {
  const promise = createResolvable();
  async function iterate(listener2) {
    let i = 0;
    for await (const conn of listener2) {
      conn.close();
      i++;
      if (i > 1) {
        break;
      }
    }
    promise.resolve();
  }
  const addr = {hostname: "127.0.0.1", port: 8888};
  const listener = Deno.listen(addr);
  iterate(listener);
  await new Promise((resolve, _) => {
    setTimeout(resolve, 100);
  });
  const conn1 = await Deno.connect(addr);
  conn1.close();
  const conn2 = await Deno.connect(addr);
  conn2.close();
  await promise;
});
unitTest({perms: {net: true}}, async function netTcpListenCloseWhileIterating() {
  const listener = Deno.listen({port: 8e3});
  const nextWhileClosing = listener[Symbol.asyncIterator]().next();
  listener.close();
  assertEquals(await nextWhileClosing, {value: void 0, done: true});
  const nextAfterClosing = listener[Symbol.asyncIterator]().next();
  assertEquals(await nextAfterClosing, {value: void 0, done: true});
});
unitTest({ignore: Deno.build.os === "windows", perms: {net: true}}, async function netUdpListenCloseWhileIterating() {
  const socket = Deno.listenDatagram({port: 8e3, transport: "udp"});
  const nextWhileClosing = socket[Symbol.asyncIterator]().next();
  socket.close();
  assertEquals(await nextWhileClosing, {value: void 0, done: true});
  const nextAfterClosing = socket[Symbol.asyncIterator]().next();
  assertEquals(await nextAfterClosing, {value: void 0, done: true});
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, async function netUnixListenCloseWhileIterating() {
  const filePath = Deno.makeTempFileSync();
  const socket = Deno.listen({path: filePath, transport: "unix"});
  const nextWhileClosing = socket[Symbol.asyncIterator]().next();
  socket.close();
  assertEquals(await nextWhileClosing, {value: void 0, done: true});
  const nextAfterClosing = socket[Symbol.asyncIterator]().next();
  assertEquals(await nextAfterClosing, {value: void 0, done: true});
});
unitTest({ignore: Deno.build.os === "windows", perms: {read: true, write: true}}, async function netUnixPacketListenCloseWhileIterating() {
  const filePath = Deno.makeTempFileSync();
  const socket = Deno.listenDatagram({
    path: filePath,
    transport: "unixpacket"
  });
  const nextWhileClosing = socket[Symbol.asyncIterator]().next();
  socket.close();
  assertEquals(await nextWhileClosing, {value: void 0, done: true});
  const nextAfterClosing = socket[Symbol.asyncIterator]().next();
  assertEquals(await nextAfterClosing, {value: void 0, done: true});
});
unitTest({
  ignore: true,
  perms: {net: true}
}, async function netListenAsyncIterator() {
  const addr = {hostname: "127.0.0.1", port: 3500};
  const listener = Deno.listen(addr);
  const runAsyncIterator = async () => {
    for await (const conn2 of listener) {
      await conn2.write(new Uint8Array([1, 2, 3]));
      conn2.close();
    }
  };
  runAsyncIterator();
  const conn = await Deno.connect(addr);
  const buf = new Uint8Array(1024);
  const readResult = await conn.read(buf);
  assertEquals(3, readResult);
  assertEquals(1, buf[0]);
  assertEquals(2, buf[1]);
  assertEquals(3, buf[2]);
  assert(conn.rid > 0);
  assert(readResult !== null);
  const readResult2 = await conn.read(buf);
  assertEquals(readResult2, null);
  listener.close();
  conn.close();
});
unitTest({
  ignore: true,
  perms: {net: true}
}, async function netCloseWriteSuccess() {
  const addr = {hostname: "127.0.0.1", port: 3500};
  const listener = Deno.listen(addr);
  const closeDeferred = createResolvable();
  listener.accept().then(async (conn2) => {
    await conn2.write(new Uint8Array([1, 2, 3]));
    await closeDeferred;
    conn2.close();
  });
  const conn = await Deno.connect(addr);
  conn.closeWrite();
  const buf = new Uint8Array(1024);
  const readResult = await conn.read(buf);
  assertEquals(3, readResult);
  assertEquals(1, buf[0]);
  assertEquals(2, buf[1]);
  assertEquals(3, buf[2]);
  await assertThrowsAsync(async () => {
    await conn.write(new Uint8Array([1, 2, 3]));
  }, Deno.errors.BrokenPipe);
  closeDeferred.resolve();
  listener.close();
  conn.close();
});
unitTest({
  ignore: true,
  perms: {net: true}
}, async function netDoubleCloseWrite() {
  const addr = {hostname: "127.0.0.1", port: 3500};
  const listener = Deno.listen(addr);
  const closeDeferred = createResolvable();
  listener.accept().then(async (conn2) => {
    await closeDeferred;
    conn2.close();
  });
  const conn = await Deno.connect(addr);
  conn.closeWrite();
  assertThrows(() => {
    conn.closeWrite();
  }, Deno.errors.NotConnected);
  closeDeferred.resolve();
  listener.close();
  conn.close();
});
unitTest({
  perms: {net: true}
}, async function netHangsOnClose() {
  let acceptedConn;
  const resolvable = createResolvable();
  async function iteratorReq(listener2) {
    const p = new Uint8Array(10);
    const conn2 = await listener2.accept();
    acceptedConn = conn2;
    try {
      while (true) {
        const nread = await conn2.read(p);
        if (nread === null) {
          break;
        }
        await conn2.write(new Uint8Array([1, 2, 3]));
      }
    } catch (err) {
      assert(!!err);
      assert(err instanceof Deno.errors.BadResource);
    }
    resolvable.resolve();
  }
  const addr = {hostname: "127.0.0.1", port: 3500};
  const listener = Deno.listen(addr);
  iteratorReq(listener);
  const conn = await Deno.connect(addr);
  await conn.write(new Uint8Array([1, 2, 3, 4]));
  const buf = new Uint8Array(10);
  await conn.read(buf);
  conn.close();
  acceptedConn.close();
  listener.close();
  await resolvable;
});
unitTest({
  perms: {net: true}
}, function netExplicitUndefinedHostname() {
  const listener = Deno.listen({hostname: void 0, port: 8080});
  assertEquals(listener.addr.hostname, "0.0.0.0");
  listener.close();
});
