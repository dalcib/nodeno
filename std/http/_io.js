import {BufWriter} from "../io/bufio.js";
import {TextProtoReader} from "../textproto/mod.js";
import {assert as assert2} from "../_util/assert.js";
import {encoder} from "../encoding/utf8.js";
import {ServerRequest} from "./server.js";
import {STATUS_TEXT} from "./http_status.js";
export function emptyReader() {
  return {
    read(_) {
      return Promise.resolve(null);
    }
  };
}
export function bodyReader(contentLength, r) {
  let totalRead = 0;
  let finished = false;
  async function read(buf) {
    if (finished)
      return null;
    let result;
    const remaining = contentLength - totalRead;
    if (remaining >= buf.byteLength) {
      result = await r.read(buf);
    } else {
      const readBuf = buf.subarray(0, remaining);
      result = await r.read(readBuf);
    }
    if (result !== null) {
      totalRead += result;
    }
    finished = totalRead === contentLength;
    return result;
  }
  return {read};
}
export function chunkedBodyReader(h, r) {
  const tp = new TextProtoReader(r);
  let finished = false;
  const chunks = [];
  async function read(buf) {
    if (finished)
      return null;
    const [chunk] = chunks;
    if (chunk) {
      const chunkRemaining = chunk.data.byteLength - chunk.offset;
      const readLength = Math.min(chunkRemaining, buf.byteLength);
      for (let i = 0; i < readLength; i++) {
        buf[i] = chunk.data[chunk.offset + i];
      }
      chunk.offset += readLength;
      if (chunk.offset === chunk.data.byteLength) {
        chunks.shift();
        if (await tp.readLine() === null) {
          throw new Deno.errors.UnexpectedEof();
        }
      }
      return readLength;
    }
    const line = await tp.readLine();
    if (line === null)
      throw new Deno.errors.UnexpectedEof();
    const [chunkSizeString] = line.split(";");
    const chunkSize = parseInt(chunkSizeString, 16);
    if (Number.isNaN(chunkSize) || chunkSize < 0) {
      throw new Error("Invalid chunk size");
    }
    if (chunkSize > 0) {
      if (chunkSize > buf.byteLength) {
        let eof = await r.readFull(buf);
        if (eof === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        const restChunk = new Uint8Array(chunkSize - buf.byteLength);
        eof = await r.readFull(restChunk);
        if (eof === null) {
          throw new Deno.errors.UnexpectedEof();
        } else {
          chunks.push({
            offset: 0,
            data: restChunk
          });
        }
        return buf.byteLength;
      } else {
        const bufToFill = buf.subarray(0, chunkSize);
        const eof = await r.readFull(bufToFill);
        if (eof === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        if (await tp.readLine() === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        return chunkSize;
      }
    } else {
      assert2(chunkSize === 0);
      if (await r.readLine() === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      await readTrailers(h, r);
      finished = true;
      return null;
    }
  }
  return {read};
}
function isProhibidedForTrailer(key) {
  const s = new Set(["transfer-encoding", "content-length", "trailer"]);
  return s.has(key.toLowerCase());
}
export async function readTrailers(headers, r) {
  const trailers = parseTrailer(headers.get("trailer"));
  if (trailers == null)
    return;
  const trailerNames = [...trailers.keys()];
  const tp = new TextProtoReader(r);
  const result = await tp.readMIMEHeader();
  if (result == null) {
    throw new Deno.errors.InvalidData("Missing trailer header.");
  }
  const undeclared = [...result.keys()].filter((k) => !trailerNames.includes(k));
  if (undeclared.length > 0) {
    throw new Deno.errors.InvalidData(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
  }
  for (const [k, v] of result) {
    headers.append(k, v);
  }
  const missingTrailers = trailerNames.filter((k) => !result.has(k));
  if (missingTrailers.length > 0) {
    throw new Deno.errors.InvalidData(`Missing trailers: ${Deno.inspect(missingTrailers)}.`);
  }
  headers.delete("trailer");
}
function parseTrailer(field) {
  if (field == null) {
    return void 0;
  }
  const trailerNames = field.split(",").map((v) => v.trim().toLowerCase());
  if (trailerNames.length === 0) {
    throw new Deno.errors.InvalidData("Empty trailer header.");
  }
  const prohibited = trailerNames.filter((k) => isProhibidedForTrailer(k));
  if (prohibited.length > 0) {
    throw new Deno.errors.InvalidData(`Prohibited trailer names: ${Deno.inspect(prohibited)}.`);
  }
  return new Headers(trailerNames.map((key) => [key, ""]));
}
export async function writeChunkedBody(w, r) {
  const writer = BufWriter.create(w);
  for await (const chunk of Deno.iter(r)) {
    if (chunk.byteLength <= 0)
      continue;
    const start = encoder.encode(`${chunk.byteLength.toString(16)}\r
`);
    const end = encoder.encode("\r\n");
    await writer.write(start);
    await writer.write(chunk);
    await writer.write(end);
  }
  const endChunk = encoder.encode("0\r\n\r\n");
  await writer.write(endChunk);
}
export async function writeTrailers(w, headers, trailers) {
  const trailer = headers.get("trailer");
  if (trailer === null) {
    throw new TypeError("Missing trailer header.");
  }
  const transferEncoding = headers.get("transfer-encoding");
  if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
    throw new TypeError(`Trailers are only allowed for "transfer-encoding: chunked", got "transfer-encoding: ${transferEncoding}".`);
  }
  const writer = BufWriter.create(w);
  const trailerNames = trailer.split(",").map((s) => s.trim().toLowerCase());
  const prohibitedTrailers = trailerNames.filter((k) => isProhibidedForTrailer(k));
  if (prohibitedTrailers.length > 0) {
    throw new TypeError(`Prohibited trailer names: ${Deno.inspect(prohibitedTrailers)}.`);
  }
  const undeclared = [...trailers.keys()].filter((k) => !trailerNames.includes(k));
  if (undeclared.length > 0) {
    throw new TypeError(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
  }
  for (const [key, value] of trailers) {
    await writer.write(encoder.encode(`${key}: ${value}\r
`));
  }
  await writer.write(encoder.encode("\r\n"));
  await writer.flush();
}
export async function writeResponse(w, r) {
  const protoMajor = 1;
  const protoMinor = 1;
  const statusCode = r.status || 200;
  const statusText = STATUS_TEXT.get(statusCode);
  const writer = BufWriter.create(w);
  if (!statusText) {
    throw new Deno.errors.InvalidData("Bad status code");
  }
  if (!r.body) {
    r.body = new Uint8Array();
  }
  if (typeof r.body === "string") {
    r.body = encoder.encode(r.body);
  }
  let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r
`;
  const headers = r.headers ?? new Headers();
  if (r.body && !headers.get("content-length")) {
    if (r.body instanceof Uint8Array) {
      out += `content-length: ${r.body.byteLength}\r
`;
    } else if (!headers.get("transfer-encoding")) {
      out += "transfer-encoding: chunked\r\n";
    }
  }
  for (const [key, value] of headers) {
    out += `${key}: ${value}\r
`;
  }
  out += `\r
`;
  const header = encoder.encode(out);
  const n = await writer.write(header);
  assert2(n === header.byteLength);
  if (r.body instanceof Uint8Array) {
    const n2 = await writer.write(r.body);
    assert2(n2 === r.body.byteLength);
  } else if (headers.has("content-length")) {
    const contentLength = headers.get("content-length");
    assert2(contentLength != null);
    const bodyLength = parseInt(contentLength);
    const n2 = await Deno.copy(r.body, writer);
    assert2(n2 === bodyLength);
  } else {
    await writeChunkedBody(writer, r.body);
  }
  if (r.trailers) {
    const t = await r.trailers();
    await writeTrailers(writer, headers, t);
  }
  await writer.flush();
}
export function parseHTTPVersion(vers) {
  switch (vers) {
    case "HTTP/1.1":
      return [1, 1];
    case "HTTP/1.0":
      return [1, 0];
    default: {
      const Big = 1e6;
      if (!vers.startsWith("HTTP/")) {
        break;
      }
      const dot = vers.indexOf(".");
      if (dot < 0) {
        break;
      }
      const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
      const major = Number(majorStr);
      if (!Number.isInteger(major) || major < 0 || major > Big) {
        break;
      }
      const minorStr = vers.substring(dot + 1);
      const minor = Number(minorStr);
      if (!Number.isInteger(minor) || minor < 0 || minor > Big) {
        break;
      }
      return [major, minor];
    }
  }
  throw new Error(`malformed HTTP version ${vers}`);
}
export async function readRequest(conn, bufr) {
  const tp = new TextProtoReader(bufr);
  const firstLine = await tp.readLine();
  if (firstLine === null)
    return null;
  const headers = await tp.readMIMEHeader();
  if (headers === null)
    throw new Deno.errors.UnexpectedEof();
  const req = new ServerRequest();
  req.conn = conn;
  req.r = bufr;
  [req.method, req.url, req.proto] = firstLine.split(" ", 3);
  [req.protoMinor, req.protoMajor] = parseHTTPVersion(req.proto);
  req.headers = headers;
  fixLength(req);
  return req;
}
function fixLength(req) {
  const contentLength = req.headers.get("Content-Length");
  if (contentLength) {
    const arrClen = contentLength.split(",");
    if (arrClen.length > 1) {
      const distinct = [...new Set(arrClen.map((e) => e.trim()))];
      if (distinct.length > 1) {
        throw Error("cannot contain multiple Content-Length headers");
      } else {
        req.headers.set("Content-Length", distinct[0]);
      }
    }
    const c = req.headers.get("Content-Length");
    if (req.method === "HEAD" && c && c !== "0") {
      throw Error("http: method cannot contain a Content-Length");
    }
    if (c && req.headers.has("transfer-encoding")) {
      throw new Error("http: Transfer-Encoding and Content-Length cannot be send together");
    }
  }
}
