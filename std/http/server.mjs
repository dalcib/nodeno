import {encode} from "../encoding/utf8.mjs";
import {BufReader, BufWriter} from "../io/bufio.mjs";
import {assert as assert2} from "../_util/assert.mjs";
import {deferred, MuxAsyncIterator} from "../async/mod.mjs";
import {
  bodyReader,
  chunkedBodyReader,
  emptyReader,
  readRequest,
  writeResponse
} from "./_io.mjs";
export class ServerRequest {
  constructor() {
    this.done = deferred();
    this._contentLength = void 0;
    this._body = null;
    this.finalized = false;
  }
  get contentLength() {
    if (this._contentLength === void 0) {
      const cl = this.headers.get("content-length");
      if (cl) {
        this._contentLength = parseInt(cl);
        if (Number.isNaN(this._contentLength)) {
          this._contentLength = null;
        }
      } else {
        this._contentLength = null;
      }
    }
    return this._contentLength;
  }
  get body() {
    if (!this._body) {
      if (this.contentLength != null) {
        this._body = bodyReader(this.contentLength, this.r);
      } else {
        const transferEncoding = this.headers.get("transfer-encoding");
        if (transferEncoding != null) {
          const parts = transferEncoding.split(",").map((e) => e.trim().toLowerCase());
          assert2(parts.includes("chunked"), 'transfer-encoding must include "chunked" if content-length is not set');
          this._body = chunkedBodyReader(this.headers, this.r);
        } else {
          this._body = emptyReader();
        }
      }
    }
    return this._body;
  }
  async respond(r) {
    let err;
    try {
      await writeResponse(this.w, r);
    } catch (e) {
      try {
        this.conn.close();
      } catch {
      }
      err = e;
    }
    this.done.resolve(err);
    if (err) {
      throw err;
    }
  }
  async finalize() {
    if (this.finalized)
      return;
    const body = this.body;
    const buf = new Uint8Array(1024);
    while (await body.read(buf) !== null) {
    }
    this.finalized = true;
  }
}
export class Server {
  constructor(listener) {
    this.listener = listener;
    this.closing = false;
    this.connections = [];
  }
  close() {
    this.closing = true;
    this.listener.close();
    for (const conn of this.connections) {
      try {
        conn.close();
      } catch (e) {
        if (!(e instanceof Deno.errors.BadResource)) {
          throw e;
        }
      }
    }
  }
  async *iterateHttpRequests(conn) {
    const reader = new BufReader(conn);
    const writer = new BufWriter(conn);
    while (!this.closing) {
      let request;
      try {
        request = await readRequest(conn, reader);
      } catch (error) {
        if (error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof) {
          await writeResponse(writer, {
            status: 400,
            body: encode(`${error.message}\r
\r
`)
          });
        }
        break;
      }
      if (request === null) {
        break;
      }
      request.w = writer;
      yield request;
      const responseError = await request.done;
      if (responseError) {
        this.untrackConnection(request.conn);
        return;
      }
      await request.finalize();
    }
    this.untrackConnection(conn);
    try {
      conn.close();
    } catch (e) {
    }
  }
  trackConnection(conn) {
    this.connections.push(conn);
  }
  untrackConnection(conn) {
    const index = this.connections.indexOf(conn);
    if (index !== -1) {
      this.connections.splice(index, 1);
    }
  }
  async *acceptConnAndIterateHttpRequests(mux) {
    if (this.closing)
      return;
    let conn;
    try {
      conn = await this.listener.accept();
    } catch (error) {
      if (error instanceof Deno.errors.BadResource || error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof) {
        return mux.add(this.acceptConnAndIterateHttpRequests(mux));
      }
      throw error;
    }
    this.trackConnection(conn);
    mux.add(this.acceptConnAndIterateHttpRequests(mux));
    yield* this.iterateHttpRequests(conn);
  }
  [Symbol.asyncIterator]() {
    const mux = new MuxAsyncIterator();
    mux.add(this.acceptConnAndIterateHttpRequests(mux));
    return mux.iterate();
  }
}
export function _parseAddrFromStr(addr) {
  let url;
  try {
    const host = addr.startsWith(":") ? `0.0.0.0${addr}` : addr;
    url = new URL(`http://${host}`);
  } catch {
    throw new TypeError("Invalid address.");
  }
  if (url.username || url.password || url.pathname != "/" || url.search || url.hash) {
    throw new TypeError("Invalid address.");
  }
  return {
    hostname: url.hostname,
    port: url.port === "" ? 80 : Number(url.port)
  };
}
export function serve(addr) {
  if (typeof addr === "string") {
    addr = _parseAddrFromStr(addr);
  }
  const listener = Deno.listen(addr);
  return new Server(listener);
}
export async function listenAndServe(addr, handler) {
  const server = serve(addr);
  for await (const request of server) {
    handler(request);
  }
}
export function serveTLS(options) {
  const tlsOptions = {
    ...options,
    transport: "tcp"
  };
  const listener = Deno.listenTls(tlsOptions);
  return new Server(listener);
}
export async function listenAndServeTLS(options, handler) {
  const server = serveTLS(options);
  for await (const request of server) {
    handler(request);
  }
}
