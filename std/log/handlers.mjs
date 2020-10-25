import {getLevelByName, LogLevels} from "./levels.mjs";
import {blue, bold, red, yellow} from "../fmt/colors.mjs";
import {exists as exists2, existsSync} from "../fs/exists.mjs";
import {BufWriterSync} from "../io/bufio.mjs";
const DEFAULT_FORMATTER = "{levelName} {msg}";
export class BaseHandler {
  constructor(levelName, options = {}) {
    this.level = getLevelByName(levelName);
    this.levelName = levelName;
    this.formatter = options.formatter || DEFAULT_FORMATTER;
  }
  handle(logRecord) {
    if (this.level > logRecord.level)
      return;
    const msg = this.format(logRecord);
    return this.log(msg);
  }
  format(logRecord) {
    if (this.formatter instanceof Function) {
      return this.formatter(logRecord);
    }
    return this.formatter.replace(/{(\S+)}/g, (match, p1) => {
      const value = logRecord[p1];
      if (value == null) {
        return match;
      }
      return String(value);
    });
  }
  log(_msg) {
  }
  async setup() {
  }
  async destroy() {
  }
}
export class ConsoleHandler extends BaseHandler {
  format(logRecord) {
    let msg = super.format(logRecord);
    switch (logRecord.level) {
      case LogLevels.INFO:
        msg = blue(msg);
        break;
      case LogLevels.WARNING:
        msg = yellow(msg);
        break;
      case LogLevels.ERROR:
        msg = red(msg);
        break;
      case LogLevels.CRITICAL:
        msg = bold(red(msg));
        break;
      default:
        break;
    }
    return msg;
  }
  log(msg) {
    console.log(msg);
  }
}
export class WriterHandler extends BaseHandler {
  constructor() {
    super(...arguments);
    this.#encoder = new TextEncoder();
  }
  #encoder;
}
export class FileHandler extends WriterHandler {
  constructor(levelName, options) {
    super(levelName, options);
    this._encoder = new TextEncoder();
    this.#unloadCallback = () => this.destroy();
    this._filename = options.filename;
    this._mode = options.mode ? options.mode : "a";
    this._openOptions = {
      createNew: this._mode === "x",
      create: this._mode !== "x",
      append: this._mode === "a",
      truncate: this._mode !== "a",
      write: true
    };
  }
  #unloadCallback;
  async setup() {
    this._file = await Deno.open(this._filename, this._openOptions);
    this._writer = this._file;
    this._buf = new BufWriterSync(this._file);
    addEventListener("unload", this.#unloadCallback);
  }
  handle(logRecord) {
    super.handle(logRecord);
    if (logRecord.level > LogLevels.ERROR) {
      this.flush();
    }
  }
  log(msg) {
    this._buf.writeSync(this._encoder.encode(msg + "\n"));
  }
  flush() {
    if (this._buf?.buffered() > 0) {
      this._buf.flush();
    }
  }
  destroy() {
    this.flush();
    this._file?.close();
    this._file = void 0;
    removeEventListener("unload", this.#unloadCallback);
    return Promise.resolve();
  }
}
export class RotatingFileHandler extends FileHandler {
  constructor(levelName, options) {
    super(levelName, options);
    this.#currentFileSize = 0;
    this.#maxBytes = options.maxBytes;
    this.#maxBackupCount = options.maxBackupCount;
  }
  #maxBytes;
  #maxBackupCount;
  #currentFileSize;
  async setup() {
    if (this.#maxBytes < 1) {
      this.destroy();
      throw new Error("maxBytes cannot be less than 1");
    }
    if (this.#maxBackupCount < 1) {
      this.destroy();
      throw new Error("maxBackupCount cannot be less than 1");
    }
    await super.setup();
    if (this._mode === "w") {
      for (let i = 1; i <= this.#maxBackupCount; i++) {
        if (await exists2(this._filename + "." + i)) {
          await Deno.remove(this._filename + "." + i);
        }
      }
    } else if (this._mode === "x") {
      for (let i = 1; i <= this.#maxBackupCount; i++) {
        if (await exists2(this._filename + "." + i)) {
          this.destroy();
          throw new Deno.errors.AlreadyExists("Backup log file " + this._filename + "." + i + " already exists");
        }
      }
    } else {
      this.#currentFileSize = (await Deno.stat(this._filename)).size;
    }
  }
  log(msg) {
    const msgByteLength = this._encoder.encode(msg).byteLength + 1;
    if (this.#currentFileSize + msgByteLength > this.#maxBytes) {
      this.rotateLogFiles();
      this.#currentFileSize = 0;
    }
    this._buf.writeSync(this._encoder.encode(msg + "\n"));
    this.#currentFileSize += msgByteLength;
  }
  rotateLogFiles() {
    this._buf.flush();
    Deno.close(this._file.rid);
    for (let i = this.#maxBackupCount - 1; i >= 0; i--) {
      const source = this._filename + (i === 0 ? "" : "." + i);
      const dest = this._filename + "." + (i + 1);
      if (existsSync(source)) {
        Deno.renameSync(source, dest);
      }
    }
    this._file = Deno.openSync(this._filename, this._openOptions);
    this._writer = this._file;
    this._buf = new BufWriterSync(this._file);
  }
}
