import {assert, assertEquals} from "../testing/asserts.mjs";
import {
  critical,
  debug,
  error,
  getLogger,
  info,
  Logger,
  LogLevels,
  setup,
  warning
} from "./mod.mjs";
import {BaseHandler} from "./handlers.mjs";
class TestHandler extends BaseHandler {
  constructor() {
    super(...arguments);
    this.messages = [];
  }
  log(str) {
    this.messages.push(str);
  }
}
let logger = null;
try {
  logger = getLogger();
} catch {
}
Deno.test("logger is initialized", function() {
  assert(logger instanceof Logger);
});
Deno.test("default loggers work as expected", function() {
  const sym = Symbol("a");
  const debugData = debug("foo");
  const debugResolver = debug(() => "foo");
  const infoData = info(456, 1, 2, 3);
  const infoResolver = info(() => true);
  const warningData = warning(sym);
  const warningResolver = warning(() => null);
  const errorData = error(void 0, 1, 2, 3);
  const errorResolver = error(() => 5n);
  const criticalData = critical("foo");
  const criticalResolver = critical(() => "bar");
  assertEquals(debugData, "foo");
  assertEquals(debugResolver, void 0);
  assertEquals(infoData, 456);
  assertEquals(infoResolver, true);
  assertEquals(warningData, sym);
  assertEquals(warningResolver, null);
  assertEquals(errorData, void 0);
  assertEquals(errorResolver, 5n);
  assertEquals(criticalData, "foo");
  assertEquals(criticalResolver, "bar");
});
Deno.test({
  name: "Logging config works as expected with logger names",
  async fn() {
    const consoleHandler = new TestHandler("DEBUG");
    const anotherConsoleHandler = new TestHandler("DEBUG", {
      formatter: "[{loggerName}] {levelName} {msg}"
    });
    await setup({
      handlers: {
        console: consoleHandler,
        anotherConsole: anotherConsoleHandler
      },
      loggers: {
        default: {
          level: "DEBUG",
          handlers: ["console"]
        },
        tasks: {
          level: "ERROR",
          handlers: ["anotherConsole"]
        }
      }
    });
    getLogger().debug("hello");
    getLogger("tasks").error("world");
    assertEquals(consoleHandler.messages[0], "DEBUG hello");
    assertEquals(anotherConsoleHandler.messages[0], "[tasks] ERROR world");
  }
});
Deno.test({
  name: "Loggers have level and levelName to get/set loglevels",
  async fn() {
    const testHandler = new TestHandler("DEBUG");
    await setup({
      handlers: {
        test: testHandler
      },
      loggers: {
        default: {
          level: "DEBUG",
          handlers: ["test"]
        }
      }
    });
    const logger2 = getLogger();
    assertEquals(logger2.levelName, "DEBUG");
    assertEquals(logger2.level, LogLevels.DEBUG);
    logger2.debug("debug");
    logger2.error("error");
    logger2.critical("critical");
    assertEquals(testHandler.messages.length, 3);
    assertEquals(testHandler.messages[0], "DEBUG debug");
    assertEquals(testHandler.messages[1], "ERROR error");
    assertEquals(testHandler.messages[2], "CRITICAL critical");
    testHandler.messages = [];
    logger2.level = LogLevels.WARNING;
    assertEquals(logger2.levelName, "WARNING");
    assertEquals(logger2.level, LogLevels.WARNING);
    logger2.debug("debug2");
    logger2.error("error2");
    logger2.critical("critical2");
    assertEquals(testHandler.messages.length, 2);
    assertEquals(testHandler.messages[0], "ERROR error2");
    assertEquals(testHandler.messages[1], "CRITICAL critical2");
    testHandler.messages = [];
    const setLevelName = "CRITICAL";
    logger2.levelName = setLevelName;
    assertEquals(logger2.levelName, "CRITICAL");
    assertEquals(logger2.level, LogLevels.CRITICAL);
    logger2.debug("debug3");
    logger2.error("error3");
    logger2.critical("critical3");
    assertEquals(testHandler.messages.length, 1);
    assertEquals(testHandler.messages[0], "CRITICAL critical3");
  }
});
Deno.test({
  name: "Loggers have loggerName to get logger name",
  async fn() {
    const testHandler = new TestHandler("DEBUG");
    await setup({
      handlers: {
        test: testHandler
      },
      loggers: {
        namedA: {
          level: "DEBUG",
          handlers: ["test"]
        },
        namedB: {
          level: "DEBUG",
          handlers: ["test"]
        }
      }
    });
    assertEquals(getLogger("namedA").loggerName, "namedA");
    assertEquals(getLogger("namedB").loggerName, "namedB");
    assertEquals(getLogger().loggerName, "default");
    assertEquals(getLogger("nonsetupname").loggerName, "nonsetupname");
  }
});
Deno.test({
  name: "Logger has mutable handlers",
  async fn() {
    const testHandlerA = new TestHandler("DEBUG");
    const testHandlerB = new TestHandler("DEBUG");
    await setup({
      handlers: {
        testA: testHandlerA,
        testB: testHandlerB
      },
      loggers: {
        default: {
          level: "DEBUG",
          handlers: ["testA"]
        }
      }
    });
    const logger2 = getLogger();
    logger2.info("msg1");
    assertEquals(testHandlerA.messages.length, 1);
    assertEquals(testHandlerA.messages[0], "INFO msg1");
    assertEquals(testHandlerB.messages.length, 0);
    logger2.handlers = [testHandlerA, testHandlerB];
    logger2.info("msg2");
    assertEquals(testHandlerA.messages.length, 2);
    assertEquals(testHandlerA.messages[1], "INFO msg2");
    assertEquals(testHandlerB.messages.length, 1);
    assertEquals(testHandlerB.messages[0], "INFO msg2");
    logger2.handlers = [testHandlerB];
    logger2.info("msg3");
    assertEquals(testHandlerA.messages.length, 2);
    assertEquals(testHandlerB.messages.length, 2);
    assertEquals(testHandlerB.messages[1], "INFO msg3");
    logger2.handlers = [];
    logger2.info("msg4");
    assertEquals(testHandlerA.messages.length, 2);
    assertEquals(testHandlerB.messages.length, 2);
  }
});
