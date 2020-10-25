import {TextProtoReader} from "../textproto/mod.js";
import {
  assert,
  assertEquals,
  assertMatch,
  assertStringContains,
  assertThrowsAsync
} from "../testing/asserts.js";
import {
  _parseAddrFromStr,
  serve,
  ServerRequest,
  serveTLS
} from "./server.js";
import {BufReader, BufWriter} from "../io/bufio.js";
import {delay as delay2} from "../async/delay.js";
import {decode, encode} from "../encoding/utf8.js";
import {mockConn} from "./_mock_conn.js";
import {dirname, fromFileUrl, join, resolve} from "../path/mod.js";
const moduleDir = dirname(fromFileUrl(import.meta.url));
const testdataDir = resolve(moduleDir, "testdata");
const responseTests = [
  {
    response: {},
    raw: "HTTP/1.1 200 OK\r\ncontent-length: 0\r\n\r\n"
  },
  {
    response: {
      status: 404
    },
    raw: "HTTP/1.1 404 Not Found\r\ncontent-length: 0\r\n\r\n"
  },
  {
    response: {
      status: 200,
      body: new Deno.Buffer(new TextEncoder().encode("abcdef"))
    },
    raw: "HTTP/1.1 200 OK\r\ntransfer-encoding: chunked\r\n\r\n6\r\nabcdef\r\n0\r\n\r\n"
  }
];
Deno.test("responseWrite", async function() {
  for (const testCase of responseTests) {
    const buf = new Deno.Buffer();
    const bufw = new BufWriter(buf);
    const request = new ServerRequest();
    request.w = bufw;
    request.conn = mockConn();
    await request.respond(testCase.response);
    assertEquals(new TextDecoder().decode(buf.bytes()), testCase.raw);
    await request.done;
  }
});
Deno.test("requestContentLength", function() {
  {
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("content-length", "5");
    const buf = new Deno.Buffer(encode("Hello"));
    req.r = new BufReader(buf);
    assertEquals(req.contentLength, 5);
  }
  {
    const shortText = "Hello";
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("transfer-encoding", "chunked");
    let chunksData = "";
    let chunkOffset = 0;
    const maxChunkSize = 70;
    while (chunkOffset < shortText.length) {
      const chunkSize = Math.min(maxChunkSize, shortText.length - chunkOffset);
      chunksData += `${chunkSize.toString(16)}\r
${shortText.substr(chunkOffset, chunkSize)}\r
`;
      chunkOffset += chunkSize;
    }
    chunksData += "0\r\n\r\n";
    const buf = new Deno.Buffer(encode(chunksData));
    req.r = new BufReader(buf);
    assertEquals(req.contentLength, null);
  }
});
function totalReader(r) {
  let _total = 0;
  async function read(p) {
    const result = await r.read(p);
    if (typeof result === "number") {
      _total += result;
    }
    return result;
  }
  return {
    read,
    get total() {
      return _total;
    }
  };
}
Deno.test("requestBodyWithContentLength", async function() {
  {
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("content-length", "5");
    const buf = new Deno.Buffer(encode("Hello"));
    req.r = new BufReader(buf);
    const body = decode(await Deno.readAll(req.body));
    assertEquals(body, "Hello");
  }
  {
    const longText = "1234\n".repeat(1e3);
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("Content-Length", "5000");
    const buf = new Deno.Buffer(encode(longText));
    req.r = new BufReader(buf);
    const body = decode(await Deno.readAll(req.body));
    assertEquals(body, longText);
  }
});
Deno.test("ServerRequest.finalize() should consume unread body / content-length", async () => {
  const text = "deno.land";
  const req = new ServerRequest();
  req.headers = new Headers();
  req.headers.set("content-length", "" + text.length);
  const tr = totalReader(new Deno.Buffer(encode(text)));
  req.r = new BufReader(tr);
  req.w = new BufWriter(new Deno.Buffer());
  await req.respond({status: 200, body: "ok"});
  assertEquals(tr.total, 0);
  await req.finalize();
  assertEquals(tr.total, text.length);
});
Deno.test("ServerRequest.finalize() should consume unread body / chunked, trailers", async () => {
  const text = [
    "5",
    "Hello",
    "4",
    "Deno",
    "0",
    "",
    "deno: land",
    "node: js",
    "",
    ""
  ].join("\r\n");
  const req = new ServerRequest();
  req.headers = new Headers();
  req.headers.set("transfer-encoding", "chunked");
  req.headers.set("trailer", "deno,node");
  const body = encode(text);
  const tr = totalReader(new Deno.Buffer(body));
  req.r = new BufReader(tr);
  req.w = new BufWriter(new Deno.Buffer());
  await req.respond({status: 200, body: "ok"});
  assertEquals(tr.total, 0);
  assertEquals(req.headers.has("trailer"), true);
  assertEquals(req.headers.has("deno"), false);
  assertEquals(req.headers.has("node"), false);
  await req.finalize();
  assertEquals(tr.total, body.byteLength);
  assertEquals(req.headers.has("trailer"), false);
  assertEquals(req.headers.get("deno"), "land");
  assertEquals(req.headers.get("node"), "js");
});
Deno.test("requestBodyWithTransferEncoding", async function() {
  {
    const shortText = "Hello";
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("transfer-encoding", "chunked");
    let chunksData = "";
    let chunkOffset = 0;
    const maxChunkSize = 70;
    while (chunkOffset < shortText.length) {
      const chunkSize = Math.min(maxChunkSize, shortText.length - chunkOffset);
      chunksData += `${chunkSize.toString(16)}\r
${shortText.substr(chunkOffset, chunkSize)}\r
`;
      chunkOffset += chunkSize;
    }
    chunksData += "0\r\n\r\n";
    const buf = new Deno.Buffer(encode(chunksData));
    req.r = new BufReader(buf);
    const body = decode(await Deno.readAll(req.body));
    assertEquals(body, shortText);
  }
  {
    const longText = "1234\n".repeat(1e3);
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("transfer-encoding", "chunked");
    let chunksData = "";
    let chunkOffset = 0;
    const maxChunkSize = 70;
    while (chunkOffset < longText.length) {
      const chunkSize = Math.min(maxChunkSize, longText.length - chunkOffset);
      chunksData += `${chunkSize.toString(16)}\r
${longText.substr(chunkOffset, chunkSize)}\r
`;
      chunkOffset += chunkSize;
    }
    chunksData += "0\r\n\r\n";
    const buf = new Deno.Buffer(encode(chunksData));
    req.r = new BufReader(buf);
    const body = decode(await Deno.readAll(req.body));
    assertEquals(body, longText);
  }
});
Deno.test("requestBodyReaderWithContentLength", async function() {
  {
    const shortText = "Hello";
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("content-length", "" + shortText.length);
    const buf = new Deno.Buffer(encode(shortText));
    req.r = new BufReader(buf);
    const readBuf = new Uint8Array(6);
    let offset = 0;
    while (offset < shortText.length) {
      const nread2 = await req.body.read(readBuf);
      assert(nread2 !== null);
      const s = decode(readBuf.subarray(0, nread2));
      assertEquals(shortText.substr(offset, nread2), s);
      offset += nread2;
    }
    const nread = await req.body.read(readBuf);
    assertEquals(nread, null);
  }
  {
    const longText = "1234\n".repeat(1e3);
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("Content-Length", "5000");
    const buf = new Deno.Buffer(encode(longText));
    req.r = new BufReader(buf);
    const readBuf = new Uint8Array(1e3);
    let offset = 0;
    while (offset < longText.length) {
      const nread2 = await req.body.read(readBuf);
      assert(nread2 !== null);
      const s = decode(readBuf.subarray(0, nread2));
      assertEquals(longText.substr(offset, nread2), s);
      offset += nread2;
    }
    const nread = await req.body.read(readBuf);
    assertEquals(nread, null);
  }
});
Deno.test("requestBodyReaderWithTransferEncoding", async function() {
  {
    const shortText = "Hello";
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("transfer-encoding", "chunked");
    let chunksData = "";
    let chunkOffset = 0;
    const maxChunkSize = 70;
    while (chunkOffset < shortText.length) {
      const chunkSize = Math.min(maxChunkSize, shortText.length - chunkOffset);
      chunksData += `${chunkSize.toString(16)}\r
${shortText.substr(chunkOffset, chunkSize)}\r
`;
      chunkOffset += chunkSize;
    }
    chunksData += "0\r\n\r\n";
    const buf = new Deno.Buffer(encode(chunksData));
    req.r = new BufReader(buf);
    const readBuf = new Uint8Array(6);
    let offset = 0;
    while (offset < shortText.length) {
      const nread2 = await req.body.read(readBuf);
      assert(nread2 !== null);
      const s = decode(readBuf.subarray(0, nread2));
      assertEquals(shortText.substr(offset, nread2), s);
      offset += nread2;
    }
    const nread = await req.body.read(readBuf);
    assertEquals(nread, null);
  }
  {
    const longText = "1234\n".repeat(1e3);
    const req = new ServerRequest();
    req.headers = new Headers();
    req.headers.set("transfer-encoding", "chunked");
    let chunksData = "";
    let chunkOffset = 0;
    const maxChunkSize = 70;
    while (chunkOffset < longText.length) {
      const chunkSize = Math.min(maxChunkSize, longText.length - chunkOffset);
      chunksData += `${chunkSize.toString(16)}\r
${longText.substr(chunkOffset, chunkSize)}\r
`;
      chunkOffset += chunkSize;
    }
    chunksData += "0\r\n\r\n";
    const buf = new Deno.Buffer(encode(chunksData));
    req.r = new BufReader(buf);
    const readBuf = new Uint8Array(1e3);
    let offset = 0;
    while (offset < longText.length) {
      const nread2 = await req.body.read(readBuf);
      assert(nread2 !== null);
      const s = decode(readBuf.subarray(0, nread2));
      assertEquals(longText.substr(offset, nread2), s);
      offset += nread2;
    }
    const nread = await req.body.read(readBuf);
    assertEquals(nread, null);
  }
});
Deno.test({
  name: "destroyed connection",
  fn: async () => {
    const p = Deno.run({
      cmd: [
        Deno.execPath(),
        "run",
        "--allow-net",
        "testdata/simple_server.ts"
      ],
      cwd: moduleDir,
      stdout: "piped"
    });
    let serverIsRunning = true;
    const statusPromise = p.status().then(() => {
      serverIsRunning = false;
    }).catch((_) => {
    });
    try {
      const r = new TextProtoReader(new BufReader(p.stdout));
      const s = await r.readLine();
      assert(s !== null && s.includes("server listening"));
      await delay2(100);
      const conn = await Deno.connect({port: 4502});
      await conn.write(new TextEncoder().encode("GET / HTTP/1.0\n\n"));
      conn.close();
      await delay2(100);
      assert(serverIsRunning);
    } finally {
      Deno.kill(p.pid, Deno.Signal.SIGKILL);
      await statusPromise;
      p.stdout.close();
      p.close();
    }
  }
});
Deno.test({
  name: "serveTLS",
  fn: async () => {
    const p = Deno.run({
      cmd: [
        Deno.execPath(),
        "run",
        "--allow-net",
        "--allow-read",
        "testdata/simple_https_server.ts"
      ],
      cwd: moduleDir,
      stdout: "piped"
    });
    let serverIsRunning = true;
    const statusPromise = p.status().then(() => {
      serverIsRunning = false;
    }).catch((_) => {
    });
    try {
      const r = new TextProtoReader(new BufReader(p.stdout));
      const s = await r.readLine();
      assert(s !== null && s.includes("server listening"), "server must be started");
      const conn = await Deno.connectTls({
        hostname: "localhost",
        port: 4503,
        certFile: join(testdataDir, "tls/RootCA.pem")
      });
      await Deno.writeAll(conn, new TextEncoder().encode("GET / HTTP/1.0\r\n\r\n"));
      const res = new Uint8Array(100);
      const nread = await conn.read(res);
      assert(nread !== null);
      conn.close();
      const resStr = new TextDecoder().decode(res.subarray(0, nread));
      assert(resStr.includes("Hello HTTPS"));
      assert(serverIsRunning);
    } finally {
      Deno.kill(p.pid, Deno.Signal.SIGKILL);
      await statusPromise;
      p.stdout.close();
      p.close();
    }
  }
});
Deno.test("close server while iterating", async () => {
  const server2 = serve(":8123");
  const nextWhileClosing = server2[Symbol.asyncIterator]().next();
  server2.close();
  assertEquals(await nextWhileClosing, {value: void 0, done: true});
  const nextAfterClosing = server2[Symbol.asyncIterator]().next();
  assertEquals(await nextAfterClosing, {value: void 0, done: true});
});
Deno.test({
  name: "[http] close server while connection is open",
  async fn() {
    async function iteratorReq(server3) {
      for await (const req of server3) {
        await req.respond({body: new TextEncoder().encode(req.url)});
      }
    }
    const server2 = serve(":8123");
    const p = iteratorReq(server2);
    const conn = await Deno.connect({hostname: "127.0.0.1", port: 8123});
    await Deno.writeAll(conn, new TextEncoder().encode("GET /hello HTTP/1.1\r\n\r\n"));
    const res = new Uint8Array(100);
    const nread = await conn.read(res);
    assert(nread !== null);
    const resStr = new TextDecoder().decode(res.subarray(0, nread));
    assertStringContains(resStr, "/hello");
    server2.close();
    await p;
    const resources = Deno.resources();
    assertEquals(resources[conn.rid], "tcpStream");
    conn.close();
  }
});
Deno.test({
  name: "respond error closes connection",
  async fn() {
    const serverRoutine = async () => {
      const server2 = serve(":8124");
      for await (const req of server2) {
        await assertThrowsAsync(async () => {
          await req.respond({
            status: 12345,
            body: new TextEncoder().encode("Hello World")
          });
        }, Deno.errors.InvalidData);
        assert(!(req.conn.rid in Deno.resources()));
        server2.close();
      }
    };
    const p = serverRoutine();
    const conn = await Deno.connect({
      hostname: "127.0.0.1",
      port: 8124
    });
    await Deno.writeAll(conn, new TextEncoder().encode("GET / HTTP/1.1\r\n\r\n"));
    conn.close();
    await p;
  }
});
Deno.test({
  name: "[http] request error gets 400 response",
  async fn() {
    const server2 = serve(":8124");
    const entry = server2[Symbol.asyncIterator]().next();
    const conn = await Deno.connect({
      hostname: "127.0.0.1",
      port: 8124
    });
    await Deno.writeAll(conn, encode("GET / HTTP/1.1\r\nmalformedHeader\r\n\r\n\r\n\r\n"));
    const responseString = decode(await Deno.readAll(conn));
    assertMatch(responseString, /^HTTP\/1\.1 400 Bad Request\r\ncontent-length: \d+\r\n\r\n.*\r\n\r\n$/ms);
    conn.close();
    server2.close();
    assert((await entry).done);
  }
});
Deno.test({
  name: "serveTLS Invalid Cert",
  fn: async () => {
    async function iteratorReq(server3) {
      for await (const req of server3) {
        await req.respond({body: new TextEncoder().encode("Hello HTTPS")});
      }
    }
    const port = 9122;
    const tlsOptions = {
      hostname: "localhost",
      port,
      certFile: join(testdataDir, "tls/localhost.crt"),
      keyFile: join(testdataDir, "tls/localhost.key")
    };
    const server2 = serveTLS(tlsOptions);
    const p = iteratorReq(server2);
    try {
      assertThrowsAsync(() => Deno.connectTls({
        hostname: "localhost",
        port
      }), Deno.errors.InvalidData);
      const conn = await Deno.connectTls({
        hostname: "localhost",
        port,
        certFile: join(testdataDir, "tls/RootCA.pem")
      });
      await Deno.writeAll(conn, new TextEncoder().encode("GET / HTTP/1.0\r\n\r\n"));
      const res = new Uint8Array(100);
      const nread = await conn.read(res);
      assert(nread !== null);
      conn.close();
      const resStr = new TextDecoder().decode(res.subarray(0, nread));
      assert(resStr.includes("Hello HTTPS"));
    } finally {
      server2.close();
      await p;
    }
  }
});
Deno.test({
  name: "server.serve() should be able to parse IPV4 address",
  fn: () => {
    const server2 = serve("127.0.0.1:8124");
    const expected = {
      hostname: "127.0.0.1",
      port: 8124,
      transport: "tcp"
    };
    assertEquals(server2.listener.addr, expected);
    server2.close();
  }
});
Deno.test({
  name: "server._parseAddrFromStr() should be able to parse IPV6 address",
  fn: () => {
    const addr = _parseAddrFromStr("[::1]:8124");
    const expected = {
      hostname: "[::1]",
      port: 8124
    };
    assertEquals(addr, expected);
  }
});
Deno.test({
  name: "server.serve() should be able to parse IPV6 address",
  fn: () => {
    const server2 = serve("[::1]:8124");
    const expected = {
      hostname: "::1",
      port: 8124,
      transport: "tcp"
    };
    assertEquals(server2.listener.addr, expected);
    server2.close();
  }
});
Deno.test({
  name: "server._parseAddrFromStr() port 80",
  fn: () => {
    const addr = _parseAddrFromStr(":80");
    assertEquals(addr.port, 80);
    assertEquals(addr.hostname, "0.0.0.0");
  }
});
