import {Logger} from "./logger.mjs";
import {
  BaseHandler,
  ConsoleHandler,
  FileHandler,
  RotatingFileHandler,
  WriterHandler
} from "./handlers.mjs";
import {assert as assert2} from "../_util/assert.mjs";
export {LogLevels} from "./levels.mjs";
export {Logger} from "./logger.mjs";
export class LoggerConfig {
}
const DEFAULT_LEVEL = "INFO";
const DEFAULT_CONFIG = {
  handlers: {
    default: new ConsoleHandler(DEFAULT_LEVEL)
  },
  loggers: {
    default: {
      level: DEFAULT_LEVEL,
      handlers: ["default"]
    }
  }
};
const state = {
  handlers: new Map(),
  loggers: new Map(),
  config: DEFAULT_CONFIG
};
export const handlers = {
  BaseHandler,
  ConsoleHandler,
  WriterHandler,
  FileHandler,
  RotatingFileHandler
};
export function getLogger(name) {
  if (!name) {
    const d = state.loggers.get("default");
    assert2(d != null, `"default" logger must be set for getting logger without name`);
    return d;
  }
  const result = state.loggers.get(name);
  if (!result) {
    const logger3 = new Logger(name, "NOTSET", {handlers: []});
    state.loggers.set(name, logger3);
    return logger3;
  }
  return result;
}
export function debug(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").debug(msg, ...args);
  }
  return getLogger("default").debug(msg, ...args);
}
export function info(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").info(msg, ...args);
  }
  return getLogger("default").info(msg, ...args);
}
export function warning(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").warning(msg, ...args);
  }
  return getLogger("default").warning(msg, ...args);
}
export function error(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").error(msg, ...args);
  }
  return getLogger("default").error(msg, ...args);
}
export function critical(msg, ...args) {
  if (msg instanceof Function) {
    return getLogger("default").critical(msg, ...args);
  }
  return getLogger("default").critical(msg, ...args);
}
export async function setup(config) {
  state.config = {
    handlers: {...DEFAULT_CONFIG.handlers, ...config.handlers},
    loggers: {...DEFAULT_CONFIG.loggers, ...config.loggers}
  };
  state.handlers.forEach((handler) => {
    handler.destroy();
  });
  state.handlers.clear();
  const handlers3 = state.config.handlers || {};
  for (const handlerName in handlers3) {
    const handler = handlers3[handlerName];
    await handler.setup();
    state.handlers.set(handlerName, handler);
  }
  state.loggers.clear();
  const loggers = state.config.loggers || {};
  for (const loggerName in loggers) {
    const loggerConfig = loggers[loggerName];
    const handlerNames = loggerConfig.handlers || [];
    const handlers4 = [];
    handlerNames.forEach((handlerName) => {
      const handler = state.handlers.get(handlerName);
      if (handler) {
        handlers4.push(handler);
      }
    });
    const levelName = loggerConfig.level || DEFAULT_LEVEL;
    const logger3 = new Logger(loggerName, levelName, {handlers: handlers4});
    state.loggers.set(loggerName, logger3);
  }
}
await setup(DEFAULT_CONFIG);
