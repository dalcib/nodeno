import {getLevelByName, getLevelName, LogLevels} from "./levels.mjs";
export class LogRecord {
  #args;
  #datetime;
  constructor(options) {
    this.msg = options.msg;
    this.#args = [...options.args];
    this.level = options.level;
    this.loggerName = options.loggerName;
    this.#datetime = new Date();
    this.levelName = getLevelName(options.level);
  }
  get args() {
    return [...this.#args];
  }
  get datetime() {
    return new Date(this.#datetime.getTime());
  }
}
export class Logger {
  #level;
  #handlers;
  #loggerName;
  constructor(loggerName, levelName, options = {}) {
    this.#loggerName = loggerName;
    this.#level = getLevelByName(levelName);
    this.#handlers = options.handlers || [];
  }
  get level() {
    return this.#level;
  }
  set level(level) {
    this.#level = level;
  }
  get levelName() {
    return getLevelName(this.#level);
  }
  set levelName(levelName) {
    this.#level = getLevelByName(levelName);
  }
  get loggerName() {
    return this.#loggerName;
  }
  set handlers(hndls) {
    this.#handlers = hndls;
  }
  get handlers() {
    return this.#handlers;
  }
  _log(level, msg, ...args) {
    if (this.level > level) {
      return msg instanceof Function ? void 0 : msg;
    }
    let fnResult;
    let logMessage;
    if (msg instanceof Function) {
      fnResult = msg();
      logMessage = this.asString(fnResult);
    } else {
      logMessage = this.asString(msg);
    }
    const record = new LogRecord({
      msg: logMessage,
      args,
      level,
      loggerName: this.loggerName
    });
    this.#handlers.forEach((handler) => {
      handler.handle(record);
    });
    return msg instanceof Function ? fnResult : msg;
  }
  asString(data) {
    if (typeof data === "string") {
      return data;
    } else if (data === null || typeof data === "number" || typeof data === "bigint" || typeof data === "boolean" || typeof data === "undefined" || typeof data === "symbol") {
      return String(data);
    } else if (typeof data === "object") {
      return JSON.stringify(data);
    }
    return "undefined";
  }
  debug(msg, ...args) {
    return this._log(LogLevels.DEBUG, msg, ...args);
  }
  info(msg, ...args) {
    return this._log(LogLevels.INFO, msg, ...args);
  }
  warning(msg, ...args) {
    return this._log(LogLevels.WARNING, msg, ...args);
  }
  error(msg, ...args) {
    return this._log(LogLevels.ERROR, msg, ...args);
  }
  critical(msg, ...args) {
    return this._log(LogLevels.CRITICAL, msg, ...args);
  }
}
