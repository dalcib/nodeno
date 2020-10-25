import {Buffer} from "./buffer.js";
import {normalizeEncoding as castEncoding, notImplemented} from "./_utils.js";
var NotImplemented;
(function(NotImplemented2) {
  NotImplemented2[NotImplemented2["ascii"] = 0] = "ascii";
  NotImplemented2[NotImplemented2["latin1"] = 1] = "latin1";
  NotImplemented2[NotImplemented2["utf16le"] = 2] = "utf16le";
})(NotImplemented || (NotImplemented = {}));
function normalizeEncoding(enc) {
  const encoding = castEncoding(enc ?? null);
  if (encoding && encoding in NotImplemented)
    notImplemented(encoding);
  if (!encoding && typeof enc === "string" && enc.toLowerCase() !== "raw") {
    throw new Error(`Unknown encoding: ${enc}`);
  }
  return String(encoding);
}
function utf8CheckByte(byte) {
  if (byte <= 127)
    return 0;
  else if (byte >> 5 === 6)
    return 2;
  else if (byte >> 4 === 14)
    return 3;
  else if (byte >> 3 === 30)
    return 4;
  return byte >> 6 === 2 ? -1 : -2;
}
function utf8CheckIncomplete(self, buf, i) {
  let j = buf.length - 1;
  if (j < i)
    return 0;
  let nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0)
      self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2)
    return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0)
      self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2)
    return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2)
        nb = 0;
      else
        self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}
function utf8CheckExtraBytes(self, buf) {
  if ((buf[0] & 192) !== 128) {
    self.lastNeed = 0;
    return "�";
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 192) !== 128) {
      self.lastNeed = 1;
      return "�";
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 192) !== 128) {
        self.lastNeed = 2;
        return "�";
      }
    }
  }
}
function utf8FillLastComplete(buf) {
  const p = this.lastTotal - this.lastNeed;
  const r = utf8CheckExtraBytes(this, buf);
  if (r !== void 0)
    return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}
function utf8FillLastIncomplete(buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
}
function utf8Text(buf, i) {
  const total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed)
    return buf.toString("utf8", i);
  this.lastTotal = total;
  const end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString("utf8", i, end);
}
function utf8End(buf) {
  const r = buf && buf.length ? this.write(buf) : "";
  if (this.lastNeed)
    return r + "�";
  return r;
}
function utf8Write(buf) {
  if (buf.length === 0)
    return "";
  let r;
  let i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === void 0)
      return "";
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length)
    return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || "";
}
function base64Text(buf, i) {
  const n = (buf.length - i) % 3;
  if (n === 0)
    return buf.toString("base64", i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString("base64", i, buf.length - n);
}
function base64End(buf) {
  const r = buf && buf.length ? this.write(buf) : "";
  if (this.lastNeed) {
    return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
  }
  return r;
}
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}
function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : "";
}
class StringDecoderBase {
  constructor(encoding, nb) {
    this.encoding = encoding;
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer.allocUnsafe(nb);
  }
}
class Base64Decoder extends StringDecoderBase {
  constructor(encoding) {
    super(normalizeEncoding(encoding), 3);
    this.end = base64End;
    this.fillLast = utf8FillLastIncomplete;
    this.text = base64Text;
    this.write = utf8Write;
  }
}
class GenericDecoder extends StringDecoderBase {
  constructor(encoding) {
    super(normalizeEncoding(encoding), 4);
    this.end = simpleEnd;
    this.fillLast = void 0;
    this.text = utf8Text;
    this.write = simpleWrite;
  }
}
class Utf8Decoder extends StringDecoderBase {
  constructor(encoding) {
    super(normalizeEncoding(encoding), 4);
    this.end = utf8End;
    this.fillLast = utf8FillLastComplete;
    this.text = utf8Text;
    this.write = utf8Write;
  }
}
export class StringDecoder {
  constructor(encoding) {
    let decoder;
    switch (encoding) {
      case "utf8":
        decoder = new Utf8Decoder(encoding);
        break;
      case "base64":
        decoder = new Base64Decoder(encoding);
        break;
      default:
        decoder = new GenericDecoder(encoding);
    }
    this.encoding = decoder.encoding;
    this.end = decoder.end;
    this.fillLast = decoder.fillLast;
    this.lastChar = decoder.lastChar;
    this.lastNeed = decoder.lastNeed;
    this.lastTotal = decoder.lastTotal;
    this.text = decoder.text;
    this.write = decoder.write;
  }
}
