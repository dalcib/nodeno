import {listenAndServe} from "../../http/server.mjs";
import {
  acceptable,
  acceptWebSocket,
  isWebSocketCloseEvent
} from "../../ws/mod.mjs";
import {fromFileUrl} from "../../path/mod.mjs";
const clients = new Map();
let clientId = 0;
function dispatch(msg) {
  for (const client of clients.values()) {
    client.send(msg);
  }
}
async function wsHandler(ws) {
  const id = ++clientId;
  clients.set(id, ws);
  dispatch(`Connected: [${id}]`);
  for await (const msg of ws) {
    console.log(`msg:${id}`, msg);
    if (typeof msg === "string") {
      dispatch(`[${id}]: ${msg}`);
    } else if (isWebSocketCloseEvent(msg)) {
      clients.delete(id);
      dispatch(`Closed: [${id}]`);
      break;
    }
  }
}
listenAndServe({port: 8080}, async (req) => {
  if (req.method === "GET" && req.url === "/") {
    const u = new URL("./index.html", import.meta.url);
    if (u.protocol.startsWith("http")) {
      fetch(u.href).then(async (resp) => {
        const body = new Uint8Array(await resp.arrayBuffer());
        return req.respond({
          status: resp.status,
          headers: new Headers({
            "content-type": "text/html"
          }),
          body
        });
      });
    } else {
      const file = await Deno.open(fromFileUrl(u));
      req.respond({
        status: 200,
        headers: new Headers({
          "content-type": "text/html"
        }),
        body: file
      });
    }
  }
  if (req.method === "GET" && req.url === "/favicon.ico") {
    req.respond({
      status: 302,
      headers: new Headers({
        location: "https://deno.land/favicon.ico"
      })
    });
  }
  if (req.method === "GET" && req.url === "/ws") {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers
      }).then(wsHandler);
    }
  }
});
console.log("chat server starting on :8080....");
