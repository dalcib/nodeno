import {BufReader, BufWriter} from "../io/bufio.mjs";
import {assert, assertEquals, assertThrowsAsync} from "../testing/asserts.mjs";
import {TextProtoReader} from "../textproto/mod.mjs";
import * as bytes from "../bytes/mod.mjs";
import {
  acceptable,
  createSecAccept,
  createSecKey,
  createWebSocket,
  handshake,
  OpCode,
  readFrame,
  unmask,
  writeFrame
} from "./mod.mjs";
import {decode, encode} from "../encoding/utf8.mjs";
import {delay as delay2} from "../async/delay.mjs";
Deno.test("[ws] read unmasked text frame", async () => {
  const buf = new BufReader(new Deno.Buffer(new Uint8Array([129, 5, 72, 101, 108, 108, 111])));
  const frame = await readFrame(buf);
  assertEquals(frame.opcode, OpCode.TextFrame);
  assertEquals(frame.mask, void 0);
  const actual = new TextDecoder().decode(new Deno.Buffer(frame.payload).bytes());
  assertEquals(actual, "Hello");
  assertEquals(frame.isLastFrame, true);
});
Deno.test("[ws] read masked text frame", async () => {
  const buf = new BufReader(new Deno.Buffer(new Uint8Array([
    129,
    133,
    55,
    250,
    33,
    61,
    127,
    159,
    77,
    81,
    88
  ])));
  const frame = await readFrame(buf);
  assertEquals(frame.opcode, OpCode.TextFrame);
  unmask(frame.payload, frame.mask);
  const actual = new TextDecoder().decode(new Deno.Buffer(frame.payload).bytes());
  assertEquals(actual, "Hello");
  assertEquals(frame.isLastFrame, true);
});
Deno.test("[ws] read unmasked split text frames", async () => {
  const buf1 = new BufReader(new Deno.Buffer(new Uint8Array([1, 3, 72, 101, 108])));
  const buf2 = new BufReader(new Deno.Buffer(new Uint8Array([128, 2, 108, 111])));
  const [f1, f2] = await Promise.all([readFrame(buf1), readFrame(buf2)]);
  assertEquals(f1.isLastFrame, false);
  assertEquals(f1.mask, void 0);
  assertEquals(f1.opcode, OpCode.TextFrame);
  const actual1 = new TextDecoder().decode(new Deno.Buffer(f1.payload).bytes());
  assertEquals(actual1, "Hel");
  assertEquals(f2.isLastFrame, true);
  assertEquals(f2.mask, void 0);
  assertEquals(f2.opcode, OpCode.Continue);
  const actual2 = new TextDecoder().decode(new Deno.Buffer(f2.payload).bytes());
  assertEquals(actual2, "lo");
});
Deno.test("[ws] read unmasked ping / pong frame", async () => {
  const buf = new BufReader(new Deno.Buffer(new Uint8Array([137, 5, 72, 101, 108, 108, 111])));
  const ping = await readFrame(buf);
  assertEquals(ping.opcode, OpCode.Ping);
  const actual1 = new TextDecoder().decode(new Deno.Buffer(ping.payload).bytes());
  assertEquals(actual1, "Hello");
  const pongFrame = [138, 133, 55, 250, 33, 61, 127, 159, 77, 81, 88];
  const buf2 = new BufReader(new Deno.Buffer(new Uint8Array(pongFrame)));
  const pong = await readFrame(buf2);
  assertEquals(pong.opcode, OpCode.Pong);
  assert(pong.mask !== void 0);
  unmask(pong.payload, pong.mask);
  const actual2 = new TextDecoder().decode(new Deno.Buffer(pong.payload).bytes());
  assertEquals(actual2, "Hello");
});
Deno.test("[ws] read unmasked big binary frame", async () => {
  const payloadLength = 256;
  const a = [130, 126, 1, 0];
  for (let i = 0; i < payloadLength; i++) {
    a.push(i);
  }
  const buf = new BufReader(new Deno.Buffer(new Uint8Array(a)));
  const bin = await readFrame(buf);
  assertEquals(bin.opcode, OpCode.BinaryFrame);
  assertEquals(bin.isLastFrame, true);
  assertEquals(bin.mask, void 0);
  assertEquals(bin.payload.length, payloadLength);
});
Deno.test("[ws] read unmasked bigger binary frame", async () => {
  const payloadLength = 65536;
  const a = [130, 127, 0, 0, 0, 0, 0, 1, 0, 0];
  for (let i = 0; i < payloadLength; i++) {
    a.push(i);
  }
  const buf = new BufReader(new Deno.Buffer(new Uint8Array(a)));
  const bin = await readFrame(buf);
  assertEquals(bin.opcode, OpCode.BinaryFrame);
  assertEquals(bin.isLastFrame, true);
  assertEquals(bin.mask, void 0);
  assertEquals(bin.payload.length, payloadLength);
});
Deno.test("[ws] createSecAccept", () => {
  const nonce = "dGhlIHNhbXBsZSBub25jZQ==";
  const d = createSecAccept(nonce);
  assertEquals(d, "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=");
});
Deno.test("[ws] acceptable", () => {
  const ret = acceptable({
    headers: new Headers({
      upgrade: "websocket",
      "sec-websocket-key": "aaa"
    })
  });
  assertEquals(ret, true);
  assert(acceptable({
    headers: new Headers([
      ["connection", "Upgrade"],
      ["host", "127.0.0.1:9229"],
      [
        "sec-websocket-extensions",
        "permessage-deflate; client_max_window_bits"
      ],
      ["sec-websocket-key", "dGhlIHNhbXBsZSBub25jZQ=="],
      ["sec-websocket-version", "13"],
      ["upgrade", "WebSocket"]
    ])
  }));
});
Deno.test("[ws] acceptable should return false when headers invalid", () => {
  assertEquals(acceptable({
    headers: new Headers({"sec-websocket-key": "aaa"})
  }), false);
  assertEquals(acceptable({
    headers: new Headers({upgrade: "websocket"})
  }), false);
  assertEquals(acceptable({
    headers: new Headers({upgrade: "invalid", "sec-websocket-key": "aaa"})
  }), false);
  assertEquals(acceptable({
    headers: new Headers({upgrade: "websocket", "sec-websocket-ky": ""})
  }), false);
});
Deno.test("[ws] write and read masked frame", async () => {
  const mask = new Uint8Array([0, 1, 2, 3]);
  const msg = "hello";
  const buf = new Deno.Buffer();
  const r = new BufReader(buf);
  await writeFrame({
    isLastFrame: true,
    mask,
    opcode: OpCode.TextFrame,
    payload: encode(msg)
  }, buf);
  const frame = await readFrame(r);
  assertEquals(frame.opcode, OpCode.TextFrame);
  assertEquals(frame.isLastFrame, true);
  assertEquals(frame.mask, mask);
  unmask(frame.payload, frame.mask);
  assertEquals(frame.payload, encode(msg));
});
Deno.test("[ws] handshake should not send search when it's empty", async () => {
  const writer = new Deno.Buffer();
  const reader = new Deno.Buffer(encode("HTTP/1.1 400\r\n"));
  await assertThrowsAsync(async () => {
    await handshake(new URL("ws://example.com"), new Headers(), new BufReader(reader), new BufWriter(writer));
  });
  const tpReader = new TextProtoReader(new BufReader(writer));
  const statusLine = await tpReader.readLine();
  assertEquals(statusLine, "GET / HTTP/1.1");
});
Deno.test("[ws] handshake should send search correctly", async function wsHandshakeWithSearch() {
  const writer = new Deno.Buffer();
  const reader = new Deno.Buffer(encode("HTTP/1.1 400\r\n"));
  await assertThrowsAsync(async () => {
    await handshake(new URL("ws://example.com?a=1"), new Headers(), new BufReader(reader), new BufWriter(writer));
  });
  const tpReader = new TextProtoReader(new BufReader(writer));
  const statusLine = await tpReader.readLine();
  assertEquals(statusLine, "GET /?a=1 HTTP/1.1");
});
Deno.test("[ws] ws.close() should use 1000 as close code", async () => {
  const buf = new Deno.Buffer();
  const bufr = new BufReader(buf);
  const conn = dummyConn(buf, buf);
  const ws = createWebSocket({conn});
  await ws.close();
  const frame = await readFrame(bufr);
  assertEquals(frame.opcode, OpCode.Close);
  const code = frame.payload[0] << 8 | frame.payload[1];
  assertEquals(code, 1e3);
});
function dummyConn(r, w) {
  return {
    rid: -1,
    closeWrite: () => {
    },
    read: (x) => r.read(x),
    write: (x) => w.write(x),
    close: () => {
    },
    localAddr: {transport: "tcp", hostname: "0.0.0.0", port: 0},
    remoteAddr: {transport: "tcp", hostname: "0.0.0.0", port: 0}
  };
}
function delayedWriter(ms, dest) {
  return {
    write(p) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          resolve(await dest.write(p));
        }, ms);
      });
    }
  };
}
Deno.test({
  name: "[ws] WebSocket.send(), WebSocket.ping() should be exclusive",
  fn: async () => {
    const buf = new Deno.Buffer();
    const conn = dummyConn(new Deno.Buffer(), delayedWriter(1, buf));
    const sock = createWebSocket({conn});
    await Promise.all([
      sock.send("first"),
      sock.send("second"),
      sock.ping(),
      sock.send(new Uint8Array([3]))
    ]);
    const bufr = new BufReader(buf);
    const first = await readFrame(bufr);
    const second = await readFrame(bufr);
    const ping = await readFrame(bufr);
    const third = await readFrame(bufr);
    assertEquals(first.opcode, OpCode.TextFrame);
    assertEquals(decode(first.payload), "first");
    assertEquals(first.opcode, OpCode.TextFrame);
    assertEquals(decode(second.payload), "second");
    assertEquals(ping.opcode, OpCode.Ping);
    assertEquals(third.opcode, OpCode.BinaryFrame);
    assertEquals(bytes.equal(third.payload, new Uint8Array([3])), true);
  }
});
Deno.test("[ws] createSecKeyHasCorrectLength", () => {
  const secKey = createSecKey();
  assertEquals(atob(secKey).length, 16);
});
Deno.test("[ws] WebSocket should throw `Deno.errors.ConnectionReset` when peer closed connection without close frame", async () => {
  const buf = new Deno.Buffer();
  const eofReader = {
    read(_) {
      return Promise.resolve(null);
    }
  };
  const conn = dummyConn(eofReader, buf);
  const sock = createWebSocket({conn});
  sock.closeForce();
  await assertThrowsAsync(() => sock.send("hello"), Deno.errors.ConnectionReset);
  await assertThrowsAsync(() => sock.ping(), Deno.errors.ConnectionReset);
  await assertThrowsAsync(() => sock.close(0), Deno.errors.ConnectionReset);
});
Deno.test("[ws] WebSocket shouldn't throw `Deno.errors.UnexpectedEof`", async () => {
  const buf = new Deno.Buffer();
  const eofReader = {
    read(_) {
      return Promise.resolve(null);
    }
  };
  const conn = dummyConn(eofReader, buf);
  const sock = createWebSocket({conn});
  const it = sock[Symbol.asyncIterator]();
  const {value, done} = await it.next();
  assertEquals(value, void 0);
  assertEquals(done, true);
});
Deno.test({
  name: "[ws] WebSocket should reject sending promise when connection reset forcely",
  fn: async () => {
    const buf = new Deno.Buffer();
    let timer;
    const lazyWriter = {
      write(_) {
        return new Promise((resolve) => {
          timer = setTimeout(() => resolve(0), 1e3);
        });
      }
    };
    const conn = dummyConn(buf, lazyWriter);
    const sock = createWebSocket({conn});
    const onError = (e) => e;
    const p = Promise.all([
      sock.send("hello").catch(onError),
      sock.send(new Uint8Array([1, 2])).catch(onError),
      sock.ping().catch(onError)
    ]);
    sock.closeForce();
    assertEquals(sock.isClosed, true);
    const [a, b, c] = await p;
    assert(a instanceof Deno.errors.ConnectionReset);
    assert(b instanceof Deno.errors.ConnectionReset);
    assert(c instanceof Deno.errors.ConnectionReset);
    clearTimeout(timer);
    await delay2(10);
  }
});
Deno.test("[ws] WebSocket should act as asyncIterator", async () => {
  const pingHello = new Uint8Array([137, 5, 72, 101, 108, 108, 111]);
  const hello = new Uint8Array([129, 5, 72, 101, 108, 108, 111]);
  const close = new Uint8Array([136, 4, 3, 243, 52, 50]);
  var Frames;
  (function(Frames2) {
    Frames2[Frames2["ping"] = 0] = "ping";
    Frames2[Frames2["hello"] = 1] = "hello";
    Frames2[Frames2["close"] = 2] = "close";
    Frames2[Frames2["end"] = 3] = "end";
  })(Frames || (Frames = {}));
  let frame = 0;
  const reader = {
    read(p) {
      if (frame === 0) {
        frame = 1;
        p.set(pingHello);
        return Promise.resolve(pingHello.byteLength);
      }
      if (frame === 1) {
        frame = 2;
        p.set(hello);
        return Promise.resolve(hello.byteLength);
      }
      if (frame === 2) {
        frame = 3;
        p.set(close);
        return Promise.resolve(close.byteLength);
      }
      return Promise.resolve(null);
    }
  };
  const conn = dummyConn(reader, new Deno.Buffer());
  const sock = createWebSocket({conn});
  const events = [];
  for await (const wsEvent of sock) {
    events.push(wsEvent);
  }
  assertEquals(events.length, 3);
  assertEquals(events[0], ["ping", encode("Hello")]);
  assertEquals(events[1], "Hello");
  assertEquals(events[2], {code: 1011, reason: "42"});
});
