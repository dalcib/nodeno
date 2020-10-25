import {serve} from "../http/server.js";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent
} from "./mod.js";
async function handleWs(sock) {
  console.log("socket connected!");
  try {
    for await (const ev of sock) {
      if (typeof ev === "string") {
        console.log("ws:Text", ev);
        await sock.send(ev);
      } else if (ev instanceof Uint8Array) {
        console.log("ws:Binary", ev);
      } else if (isWebSocketPingEvent(ev)) {
        const [, body] = ev;
        console.log("ws:Ping", body);
      } else if (isWebSocketCloseEvent(ev)) {
        const {code, reason} = ev;
        console.log("ws:Close", code, reason);
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);
    if (!sock.isClosed) {
      await sock.close(1e3).catch(console.error);
    }
  }
}
if (import.meta.main) {
  const port = Deno.args[0] || "8080";
  console.log(`websocket server is running on :${port}`);
  for await (const req of serve(`:${port}`)) {
    const {conn, r: bufReader, w: bufWriter, headers} = req;
    acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers
    }).then(handleWs).catch(async (e) => {
      console.error(`failed to accept websocket: ${e}`);
      await req.respond({status: 400});
    });
  }
}
