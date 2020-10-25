import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  createResolvable,
  unitTest
} from "./test_util.mjs";
import {BufReader, BufWriter} from "../../../std/io/bufio.mjs";
import {TextProtoReader} from "../../../std/textproto/mod.mjs";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
unitTest(async function connectTLSNoPerm() {
  await assertThrowsAsync(async () => {
    await Deno.connectTls({hostname: "github.com", port: 443});
  }, Deno.errors.PermissionDenied);
});
unitTest(async function connectTLSCertFileNoReadPerm() {
  await assertThrowsAsync(async () => {
    await Deno.connectTls({
      hostname: "github.com",
      port: 443,
      certFile: "cli/tests/tls/RootCA.crt"
    });
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {read: true, net: true}}, function listenTLSNonExistentCertKeyFiles() {
  const options = {
    hostname: "localhost",
    port: 3500,
    certFile: "cli/tests/tls/localhost.crt",
    keyFile: "cli/tests/tls/localhost.key"
  };
  assertThrows(() => {
    Deno.listenTls({
      ...options,
      certFile: "./non/existent/file"
    });
  }, Deno.errors.NotFound);
  assertThrows(() => {
    Deno.listenTls({
      ...options,
      keyFile: "./non/existent/file"
    });
  }, Deno.errors.NotFound);
});
unitTest({perms: {net: true}}, function listenTLSNoReadPerm() {
  assertThrows(() => {
    Deno.listenTls({
      hostname: "localhost",
      port: 3500,
      certFile: "cli/tests/tls/localhost.crt",
      keyFile: "cli/tests/tls/localhost.key"
    });
  }, Deno.errors.PermissionDenied);
});
unitTest({
  perms: {read: true, write: true, net: true}
}, function listenTLSEmptyKeyFile() {
  const options = {
    hostname: "localhost",
    port: 3500,
    certFile: "cli/tests/tls/localhost.crt",
    keyFile: "cli/tests/tls/localhost.key"
  };
  const testDir = Deno.makeTempDirSync();
  const keyFilename = testDir + "/key.pem";
  Deno.writeFileSync(keyFilename, new Uint8Array([]), {
    mode: 438
  });
  assertThrows(() => {
    Deno.listenTls({
      ...options,
      keyFile: keyFilename
    });
  }, Error);
});
unitTest({perms: {read: true, write: true, net: true}}, function listenTLSEmptyCertFile() {
  const options = {
    hostname: "localhost",
    port: 3500,
    certFile: "cli/tests/tls/localhost.crt",
    keyFile: "cli/tests/tls/localhost.key"
  };
  const testDir = Deno.makeTempDirSync();
  const certFilename = testDir + "/cert.crt";
  Deno.writeFileSync(certFilename, new Uint8Array([]), {
    mode: 438
  });
  assertThrows(() => {
    Deno.listenTls({
      ...options,
      certFile: certFilename
    });
  }, Error);
});
unitTest({perms: {read: true, net: true}}, async function dialAndListenTLS() {
  const resolvable = createResolvable();
  const hostname = "localhost";
  const port = 3500;
  const listener = Deno.listenTls({
    hostname,
    port,
    certFile: "cli/tests/tls/localhost.crt",
    keyFile: "cli/tests/tls/localhost.key"
  });
  const response = encoder.encode("HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello World\n");
  listener.accept().then(async (conn2) => {
    assert(conn2.remoteAddr != null);
    assert(conn2.localAddr != null);
    await conn2.write(response);
    setTimeout(() => {
      conn2.close();
      resolvable.resolve();
    }, 0);
  });
  const conn = await Deno.connectTls({
    hostname,
    port,
    certFile: "cli/tests/tls/RootCA.pem"
  });
  assert(conn.rid > 0);
  const w = new BufWriter(conn);
  const r = new BufReader(conn);
  const body = `GET / HTTP/1.1\r
Host: ${hostname}:${port}\r
\r
`;
  const writeResult = await w.write(encoder.encode(body));
  assertEquals(body.length, writeResult);
  await w.flush();
  const tpr = new TextProtoReader(r);
  const statusLine = await tpr.readLine();
  assert(statusLine !== null, `line must be read: ${String(statusLine)}`);
  const m = statusLine.match(/^(.+?) (.+?) (.+?)$/);
  assert(m !== null, "must be matched");
  const [_, proto, status, ok] = m;
  assertEquals(proto, "HTTP/1.1");
  assertEquals(status, "200");
  assertEquals(ok, "OK");
  const headers = await tpr.readMIMEHeader();
  assert(headers !== null);
  const contentLength = parseInt(headers.get("content-length"));
  const bodyBuf = new Uint8Array(contentLength);
  await r.readFull(bodyBuf);
  assertEquals(decoder.decode(bodyBuf), "Hello World\n");
  conn.close();
  listener.close();
  await resolvable;
});
unitTest({perms: {read: true, net: true}}, async function startTls() {
  const hostname = "smtp.gmail.com";
  const port = 587;
  const encoder2 = new TextEncoder();
  let conn = await Deno.connect({
    hostname,
    port
  });
  let writer = new BufWriter(conn);
  let reader = new TextProtoReader(new BufReader(conn));
  let line = await reader.readLine();
  assert(line.startsWith("220"));
  await writer.write(encoder2.encode(`EHLO ${hostname}\r
`));
  await writer.flush();
  while (line = await reader.readLine()) {
    assert(line.startsWith("250"));
    if (line.startsWith("250 "))
      break;
  }
  await writer.write(encoder2.encode("STARTTLS\r\n"));
  await writer.flush();
  line = await reader.readLine();
  assertEquals(line, "220 2.0.0 Ready to start TLS");
  conn = await Deno.startTls(conn, {hostname});
  writer = new BufWriter(conn);
  reader = new TextProtoReader(new BufReader(conn));
  await writer.write(encoder2.encode(`EHLO ${hostname}\r
`));
  await writer.flush();
  while (line = await reader.readLine()) {
    assert(line.startsWith("250"));
    if (line.startsWith("250 "))
      break;
  }
  conn.close();
});
