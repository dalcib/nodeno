import {decode, encode} from "../encoding/utf8.mjs";
import {hasOwnProperty} from "../_util/has_own_property.mjs";
import {BufReader, BufWriter} from "../io/bufio.mjs";
import {readLong, readShort, sliceLongToBytes} from "../io/ioutil.mjs";
import {Sha1} from "../hash/sha1.mjs";
import {writeResponse} from "../http/_io.mjs";
import {TextProtoReader} from "../textproto/mod.mjs";
import {deferred as deferred2} from "../async/deferred.mjs";
import {assert as assert2} from "../_util/assert.mjs";
import {concat} from "../bytes/mod.mjs";
export var OpCode;
(function(OpCode2) {
  OpCode2[OpCode2["Continue"] = 0] = "Continue";
  OpCode2[OpCode2["TextFrame"] = 1] = "TextFrame";
  OpCode2[OpCode2["BinaryFrame"] = 2] = "BinaryFrame";
  OpCode2[OpCode2["Close"] = 8] = "Close";
  OpCode2[OpCode2["Ping"] = 9] = "Ping";
  OpCode2[OpCode2["Pong"] = 10] = "Pong";
})(OpCode || (OpCode = {}));
export function isWebSocketCloseEvent(a) {
  return hasOwnProperty(a, "code");
}
export function isWebSocketPingEvent(a) {
  return Array.isArray(a) && a[0] === "ping" && a[1] instanceof Uint8Array;
}
export function isWebSocketPongEvent(a) {
  return Array.isArray(a) && a[0] === "pong" && a[1] instanceof Uint8Array;
}
export function unmask(payload, mask) {
  if (mask) {
    for (let i = 0, len = payload.length; i < len; i++) {
      payload[i] ^= mask[i & 3];
    }
  }
}
export async function writeFrame(frame, writer) {
  const payloadLength = frame.payload.byteLength;
  let header;
  const hasMask = frame.mask ? 128 : 0;
  if (frame.mask && frame.mask.byteLength !== 4) {
    throw new Error("invalid mask. mask must be 4 bytes: length=" + frame.mask.byteLength);
  }
  if (payloadLength < 126) {
    header = new Uint8Array([128 | frame.opcode, hasMask | payloadLength]);
  } else if (payloadLength < 65535) {
    header = new Uint8Array([
      128 | frame.opcode,
      hasMask | 126,
      payloadLength >>> 8,
      payloadLength & 255
    ]);
  } else {
    header = new Uint8Array([
      128 | frame.opcode,
      hasMask | 127,
      ...sliceLongToBytes(payloadLength)
    ]);
  }
  if (frame.mask) {
    header = concat(header, frame.mask);
  }
  unmask(frame.payload, frame.mask);
  header = concat(header, frame.payload);
  const w = BufWriter.create(writer);
  await w.write(header);
  await w.flush();
}
export async function readFrame(buf) {
  let b = await buf.readByte();
  assert2(b !== null);
  let isLastFrame = false;
  switch (b >>> 4) {
    case 8:
      isLastFrame = true;
      break;
    case 0:
      isLastFrame = false;
      break;
    default:
      throw new Error("invalid signature");
  }
  const opcode = b & 15;
  b = await buf.readByte();
  assert2(b !== null);
  const hasMask = b >>> 7;
  let payloadLength = b & 127;
  if (payloadLength === 126) {
    const l = await readShort(buf);
    assert2(l !== null);
    payloadLength = l;
  } else if (payloadLength === 127) {
    const l = await readLong(buf);
    assert2(l !== null);
    payloadLength = Number(l);
  }
  let mask;
  if (hasMask) {
    mask = new Uint8Array(4);
    assert2(await buf.readFull(mask) !== null);
  }
  const payload = new Uint8Array(payloadLength);
  assert2(await buf.readFull(payload) !== null);
  return {
    isLastFrame,
    opcode,
    mask,
    payload
  };
}
class WebSocketImpl {
  constructor({
    conn,
    bufReader,
    bufWriter,
    mask
  }) {
    this.sendQueue = [];
    this._isClosed = false;
    this.conn = conn;
    this.mask = mask;
    this.bufReader = bufReader || new BufReader(conn);
    this.bufWriter = bufWriter || new BufWriter(conn);
  }
  async *[Symbol.asyncIterator]() {
    let frames = [];
    let payloadsLength = 0;
    while (!this._isClosed) {
      let frame;
      try {
        frame = await readFrame(this.bufReader);
      } catch (e) {
        this.ensureSocketClosed();
        break;
      }
      unmask(frame.payload, frame.mask);
      switch (frame.opcode) {
        case 1:
        case 2:
        case 0:
          frames.push(frame);
          payloadsLength += frame.payload.length;
          if (frame.isLastFrame) {
            const concat2 = new Uint8Array(payloadsLength);
            let offs = 0;
            for (const frame2 of frames) {
              concat2.set(frame2.payload, offs);
              offs += frame2.payload.length;
            }
            if (frames[0].opcode === 1) {
              yield decode(concat2);
            } else {
              yield concat2;
            }
            frames = [];
            payloadsLength = 0;
          }
          break;
        case 8: {
          const code = frame.payload[0] << 8 | frame.payload[1];
          const reason = decode(frame.payload.subarray(2, frame.payload.length));
          await this.close(code, reason);
          yield {code, reason};
          return;
        }
        case 9:
          await this.enqueue({
            opcode: 10,
            payload: frame.payload,
            isLastFrame: true
          });
          yield ["ping", frame.payload];
          break;
        case 10:
          yield ["pong", frame.payload];
          break;
        default:
      }
    }
  }
  dequeue() {
    const [entry] = this.sendQueue;
    if (!entry)
      return;
    if (this._isClosed)
      return;
    const {d, frame} = entry;
    writeFrame(frame, this.bufWriter).then(() => d.resolve()).catch((e) => d.reject(e)).finally(() => {
      this.sendQueue.shift();
      this.dequeue();
    });
  }
  enqueue(frame) {
    if (this._isClosed) {
      throw new Deno.errors.ConnectionReset("Socket has already been closed");
    }
    const d = deferred2();
    this.sendQueue.push({d, frame});
    if (this.sendQueue.length === 1) {
      this.dequeue();
    }
    return d;
  }
  send(data) {
    const opcode = typeof data === "string" ? 1 : 2;
    const payload = typeof data === "string" ? encode(data) : data;
    const isLastFrame = true;
    const frame = {
      isLastFrame,
      opcode,
      payload,
      mask: this.mask
    };
    return this.enqueue(frame);
  }
  ping(data = "") {
    const payload = typeof data === "string" ? encode(data) : data;
    const frame = {
      isLastFrame: true,
      opcode: 9,
      mask: this.mask,
      payload
    };
    return this.enqueue(frame);
  }
  get isClosed() {
    return this._isClosed;
  }
  async close(code = 1e3, reason) {
    try {
      const header = [code >>> 8, code & 255];
      let payload;
      if (reason) {
        const reasonBytes = encode(reason);
        payload = new Uint8Array(2 + reasonBytes.byteLength);
        payload.set(header);
        payload.set(reasonBytes, 2);
      } else {
        payload = new Uint8Array(header);
      }
      await this.enqueue({
        isLastFrame: true,
        opcode: 8,
        mask: this.mask,
        payload
      });
    } catch (e) {
      throw e;
    } finally {
      this.ensureSocketClosed();
    }
  }
  closeForce() {
    this.ensureSocketClosed();
  }
  ensureSocketClosed() {
    if (this.isClosed)
      return;
    try {
      this.conn.close();
    } catch (e) {
      console.error(e);
    } finally {
      this._isClosed = true;
      const rest = this.sendQueue;
      this.sendQueue = [];
      rest.forEach((e) => e.d.reject(new Deno.errors.ConnectionReset("Socket has already been closed")));
    }
  }
}
export function acceptable(req) {
  const upgrade = req.headers.get("upgrade");
  if (!upgrade || upgrade.toLowerCase() !== "websocket") {
    return false;
  }
  const secKey = req.headers.get("sec-websocket-key");
  return req.headers.has("sec-websocket-key") && typeof secKey === "string" && secKey.length > 0;
}
const kGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
export function createSecAccept(nonce) {
  const sha12 = new Sha1();
  sha12.update(nonce + kGUID);
  const bytes = sha12.digest();
  return btoa(String.fromCharCode(...bytes));
}
export async function acceptWebSocket(req) {
  const {conn, headers, bufReader, bufWriter} = req;
  if (acceptable(req)) {
    const sock = new WebSocketImpl({conn, bufReader, bufWriter});
    const secKey = headers.get("sec-websocket-key");
    if (typeof secKey !== "string") {
      throw new Error("sec-websocket-key is not provided");
    }
    const secAccept = createSecAccept(secKey);
    await writeResponse(bufWriter, {
      status: 101,
      headers: new Headers({
        Upgrade: "websocket",
        Connection: "Upgrade",
        "Sec-WebSocket-Accept": secAccept
      })
    });
    return sock;
  }
  throw new Error("request is not acceptable");
}
const kSecChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~_";
export function createSecKey() {
  let key = "";
  for (let i = 0; i < 16; i++) {
    const j = Math.floor(Math.random() * kSecChars.length);
    key += kSecChars[j];
  }
  return btoa(key);
}
export async function handshake(url, headers, bufReader, bufWriter) {
  const {hostname, pathname, search} = url;
  const key = createSecKey();
  if (!headers.has("host")) {
    headers.set("host", hostname);
  }
  headers.set("upgrade", "websocket");
  headers.set("connection", "upgrade");
  headers.set("sec-websocket-key", key);
  headers.set("sec-websocket-version", "13");
  let headerStr = `GET ${pathname}${search} HTTP/1.1\r
`;
  for (const [key2, value] of headers) {
    headerStr += `${key2}: ${value}\r
`;
  }
  headerStr += "\r\n";
  await bufWriter.write(encode(headerStr));
  await bufWriter.flush();
  const tpReader = new TextProtoReader(bufReader);
  const statusLine = await tpReader.readLine();
  if (statusLine === null) {
    throw new Deno.errors.UnexpectedEof();
  }
  const m = statusLine.match(/^(?<version>\S+) (?<statusCode>\S+) /);
  if (!m) {
    throw new Error("ws: invalid status line: " + statusLine);
  }
  assert2(m.groups);
  const {version, statusCode} = m.groups;
  if (version !== "HTTP/1.1" || statusCode !== "101") {
    throw new Error(`ws: server didn't accept handshake: version=${version}, statusCode=${statusCode}`);
  }
  const responseHeaders = await tpReader.readMIMEHeader();
  if (responseHeaders === null) {
    throw new Deno.errors.UnexpectedEof();
  }
  const expectedSecAccept = createSecAccept(key);
  const secAccept = responseHeaders.get("sec-websocket-accept");
  if (secAccept !== expectedSecAccept) {
    throw new Error(`ws: unexpected sec-websocket-accept header: expected=${expectedSecAccept}, actual=${secAccept}`);
  }
}
export function createWebSocket(params) {
  return new WebSocketImpl(params);
}
