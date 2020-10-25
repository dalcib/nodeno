import {assert, assertEquals} from "../../testing/asserts.mjs";
import {TextProtoReader} from "../../textproto/mod.mjs";
import {BufReader} from "../../io/bufio.mjs";
import {delay as delay2} from "../../async/delay.mjs";
import {dirname, fromFileUrl, resolve} from "../../path/mod.mjs";
const moduleDir = resolve(dirname(fromFileUrl(import.meta.url)));
async function startServer() {
  const server = Deno.run({
    cmd: [
      Deno.execPath(),
      "run",
      "--allow-net",
      "--allow-read",
      "server.ts"
    ],
    cwd: moduleDir,
    stdout: "piped"
  });
  try {
    assert(server.stdout != null);
    const r = new TextProtoReader(new BufReader(server.stdout));
    const s = await r.readLine();
    assert(s !== null && s.includes("chat server starting"));
  } catch (err) {
    server.stdout.close();
    server.close();
  }
  return server;
}
Deno.test({
  name: "[examples/chat] GET / should serve html",
  async fn() {
    const server = await startServer();
    try {
      const resp = await fetch("http://127.0.0.1:8080/");
      assertEquals(resp.status, 200);
      assertEquals(resp.headers.get("content-type"), "text/html");
      const html = await resp.text();
      assert(html.includes("ws chat example"), "body is ok");
    } finally {
      server.close();
      server.stdout.close();
    }
    await delay2(10);
  }
});
Deno.test({
  name: "[examples/chat] GET /ws should upgrade conn to ws",
  async fn() {
    const server = await startServer();
    let ws;
    try {
      ws = new WebSocket("ws://127.0.0.1:8080/ws");
      await new Promise((resolve2) => {
        ws.onmessage = (message) => {
          assertEquals(message.data, "Connected: [1]");
          ws.onmessage = (message2) => {
            assertEquals(message2.data, "[1]: Hello");
            ws.close();
            resolve2();
          };
          ws.send("Hello");
        };
      });
    } catch (err) {
      console.log(err);
    } finally {
      server.close();
      server.stdout.close();
    }
  }
});
