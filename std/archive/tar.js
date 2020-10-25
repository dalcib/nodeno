import {MultiReader} from "../io/readers.js";
import {PartialReadError} from "../io/bufio.js";
import {assert as assert2} from "../_util/assert.js";
const recordSize = 512;
const ustar = "ustar\x0000";
const initialChecksum = 8 * 32;
async function readBlock(reader, p) {
  let bytesRead = 0;
  while (bytesRead < p.length) {
    const rr = await reader.read(p.subarray(bytesRead));
    if (rr === null) {
      if (bytesRead === 0) {
        return null;
      } else {
        throw new PartialReadError();
      }
    }
    bytesRead += rr;
  }
  return bytesRead;
}
class FileReader {
  constructor(filePath) {
    this.filePath = filePath;
  }
  async read(p) {
    if (!this.file) {
      this.file = await Deno.open(this.filePath, {read: true});
    }
    const res = await Deno.read(this.file.rid, p);
    if (res === null) {
      Deno.close(this.file.rid);
      this.file = void 0;
    }
    return res;
  }
}
function trim(buffer) {
  const index = buffer.findIndex((v) => v === 0);
  if (index < 0)
    return buffer;
  return buffer.subarray(0, index);
}
function clean(length) {
  const buffer = new Uint8Array(length);
  buffer.fill(0, 0, length - 1);
  return buffer;
}
function pad(num, bytes, base) {
  const numString = num.toString(base || 8);
  return "000000000000".substr(numString.length + 12 - bytes) + numString;
}
var FileTypes;
(function(FileTypes2) {
  FileTypes2[FileTypes2["file"] = 0] = "file";
  FileTypes2[FileTypes2["link"] = 1] = "link";
  FileTypes2[FileTypes2["symlink"] = 2] = "symlink";
  FileTypes2[FileTypes2["character-device"] = 3] = "character-device";
  FileTypes2[FileTypes2["block-device"] = 4] = "block-device";
  FileTypes2[FileTypes2["directory"] = 5] = "directory";
  FileTypes2[FileTypes2["fifo"] = 6] = "fifo";
  FileTypes2[FileTypes2["contiguous-file"] = 7] = "contiguous-file";
})(FileTypes || (FileTypes = {}));
const ustarStructure = [
  {
    field: "fileName",
    length: 100
  },
  {
    field: "fileMode",
    length: 8
  },
  {
    field: "uid",
    length: 8
  },
  {
    field: "gid",
    length: 8
  },
  {
    field: "fileSize",
    length: 12
  },
  {
    field: "mtime",
    length: 12
  },
  {
    field: "checksum",
    length: 8
  },
  {
    field: "type",
    length: 1
  },
  {
    field: "linkName",
    length: 100
  },
  {
    field: "ustar",
    length: 8
  },
  {
    field: "owner",
    length: 32
  },
  {
    field: "group",
    length: 32
  },
  {
    field: "majorNumber",
    length: 8
  },
  {
    field: "minorNumber",
    length: 8
  },
  {
    field: "fileNamePrefix",
    length: 155
  },
  {
    field: "padding",
    length: 12
  }
];
function formatHeader(data) {
  const encoder = new TextEncoder(), buffer = clean(512);
  let offset = 0;
  ustarStructure.forEach(function(value) {
    const entry = encoder.encode(data[value.field] || "");
    buffer.set(entry, offset);
    offset += value.length;
  });
  return buffer;
}
function parseHeader(buffer) {
  const data = {};
  let offset = 0;
  ustarStructure.forEach(function(value) {
    const arr = buffer.subarray(offset, offset + value.length);
    data[value.field] = arr;
    offset += value.length;
  });
  return data;
}
export class Tar {
  constructor() {
    this.data = [];
  }
  async append(fn, opts) {
    if (typeof fn !== "string") {
      throw new Error("file name not specified");
    }
    let fileName = fn;
    let fileNamePrefix;
    if (fileName.length > 100) {
      let i = fileName.length;
      while (i >= 0) {
        i = fileName.lastIndexOf("/", i);
        if (i <= 155) {
          fileNamePrefix = fileName.substr(0, i);
          fileName = fileName.substr(i + 1);
          break;
        }
        i--;
      }
      const errMsg = "ustar format does not allow a long file name (length of [file nameprefix] + / + [file name] must be shorter than 256 bytes)";
      if (i < 0 || fileName.length > 100) {
        throw new Error(errMsg);
      } else {
        assert2(fileNamePrefix != null);
        if (fileNamePrefix.length > 155) {
          throw new Error(errMsg);
        }
      }
    }
    opts = opts || {};
    let info;
    if (opts.filePath) {
      info = await Deno.stat(opts.filePath);
      if (info.isDirectory) {
        info.size = 0;
        opts.reader = new Deno.Buffer();
      }
    }
    const mode = opts.fileMode || info && info.mode || parseInt("777", 8) & 4095, mtime = Math.floor(opts.mtime ?? (info?.mtime ?? new Date()).valueOf() / 1e3), uid = opts.uid || 0, gid = opts.gid || 0;
    if (typeof opts.owner === "string" && opts.owner.length >= 32) {
      throw new Error("ustar format does not allow owner name length >= 32 bytes");
    }
    if (typeof opts.group === "string" && opts.group.length >= 32) {
      throw new Error("ustar format does not allow group name length >= 32 bytes");
    }
    const fileSize = info?.size ?? opts.contentSize;
    assert2(fileSize != null, "fileSize must be set");
    const type = opts.type ? FileTypes[opts.type] : info?.isDirectory ? 5 : 0;
    const tarData = {
      fileName,
      fileNamePrefix,
      fileMode: pad(mode, 7),
      uid: pad(uid, 7),
      gid: pad(gid, 7),
      fileSize: pad(fileSize, 11),
      mtime: pad(mtime, 11),
      checksum: "        ",
      type: type.toString(),
      ustar,
      owner: opts.owner || "",
      group: opts.group || "",
      filePath: opts.filePath,
      reader: opts.reader
    };
    let checksum = 0;
    const encoder = new TextEncoder();
    Object.keys(tarData).filter((key) => ["filePath", "reader"].indexOf(key) < 0).forEach(function(key) {
      checksum += encoder.encode(tarData[key]).reduce((p, c) => p + c, 0);
    });
    tarData.checksum = pad(checksum, 6) + "\0 ";
    this.data.push(tarData);
  }
  getReader() {
    const readers2 = [];
    this.data.forEach((tarData) => {
      let {reader} = tarData;
      const {filePath} = tarData;
      const headerArr = formatHeader(tarData);
      readers2.push(new Deno.Buffer(headerArr));
      if (!reader) {
        assert2(filePath != null);
        reader = new FileReader(filePath);
      }
      readers2.push(reader);
      assert2(tarData.fileSize != null, "fileSize must be set");
      readers2.push(new Deno.Buffer(clean(recordSize - (parseInt(tarData.fileSize, 8) % recordSize || recordSize))));
    });
    readers2.push(new Deno.Buffer(clean(recordSize * 2)));
    return new MultiReader(...readers2);
  }
}
class TarEntry {
  constructor(meta, header, reader) {
    this.#read = 0;
    this.#consumed = false;
    Object.assign(this, meta);
    this.#header = header;
    this.#reader = reader;
    this.#size = this.fileSize || 0;
    const blocks = Math.ceil(this.#size / recordSize);
    this.#entrySize = blocks * recordSize;
  }
  #header;
  #reader;
  #size;
  #read;
  #consumed;
  #entrySize;
  get consumed() {
    return this.#consumed;
  }
  async read(p) {
    const entryBytesLeft = this.#entrySize - this.#read;
    const bufSize = Math.min(p.length, entryBytesLeft);
    if (entryBytesLeft <= 0)
      return null;
    const block = new Uint8Array(bufSize);
    const n = await readBlock(this.#reader, block);
    const bytesLeft = this.#size - this.#read;
    this.#read += n || 0;
    if (n === null || bytesLeft <= 0) {
      if (null)
        this.#consumed = true;
      return null;
    }
    const offset = bytesLeft < n ? bytesLeft : n;
    p.set(block.subarray(0, offset), 0);
    return offset < 0 ? n - Math.abs(offset) : offset;
  }
  async discard() {
    if (this.#consumed)
      return;
    this.#consumed = true;
    if (typeof this.#reader.seek === "function") {
      await this.#reader.seek(this.#entrySize - this.#read, Deno.SeekMode.Current);
      this.#read = this.#entrySize;
    } else {
      await Deno.readAll(this);
    }
  }
}
export class Untar {
  constructor(reader) {
    this.#checksum = (header) => {
      let sum = initialChecksum;
      for (let i = 0; i < 512; i++) {
        if (i >= 148 && i < 156) {
          continue;
        }
        sum += header[i];
      }
      return sum;
    };
    this.#getHeader = async () => {
      await readBlock(this.reader, this.block);
      const header = parseHeader(this.block);
      const decoder = new TextDecoder();
      const checksum = this.#checksum(this.block);
      if (parseInt(decoder.decode(header.checksum), 8) !== checksum) {
        if (checksum === initialChecksum) {
          return null;
        }
        throw new Error("checksum error");
      }
      const magic = decoder.decode(header.ustar);
      if (magic.indexOf("ustar")) {
        throw new Error(`unsupported archive format: ${magic}`);
      }
      return header;
    };
    this.#getMetadata = (header) => {
      const decoder = new TextDecoder();
      const meta = {
        fileName: decoder.decode(trim(header.fileName))
      };
      const fileNamePrefix = trim(header.fileNamePrefix);
      if (fileNamePrefix.byteLength > 0) {
        meta.fileName = decoder.decode(fileNamePrefix) + "/" + meta.fileName;
      }
      ["fileMode", "mtime", "uid", "gid"].forEach((key) => {
        const arr = trim(header[key]);
        if (arr.byteLength > 0) {
          meta[key] = parseInt(decoder.decode(arr), 8);
        }
      });
      ["owner", "group", "type"].forEach((key) => {
        const arr = trim(header[key]);
        if (arr.byteLength > 0) {
          meta[key] = decoder.decode(arr);
        }
      });
      meta.fileSize = parseInt(decoder.decode(header.fileSize), 8);
      meta.type = FileTypes[parseInt(meta.type)] ?? meta.type;
      return meta;
    };
    this.reader = reader;
    this.block = new Uint8Array(recordSize);
  }
  #entry;
  #checksum;
  #getHeader;
  #getMetadata;
  async extract() {
    if (this.#entry && !this.#entry.consumed) {
      await this.#entry.discard();
    }
    const header = await this.#getHeader();
    if (header === null)
      return null;
    const meta = this.#getMetadata(header);
    this.#entry = new TarEntry(meta, header, this.reader);
    return this.#entry;
  }
  async *[Symbol.asyncIterator]() {
    while (true) {
      const entry = await this.extract();
      if (entry === null)
        return;
      yield entry;
    }
  }
}
