export var LogLevels;
(function(LogLevels2) {
  LogLevels2[LogLevels2["NOTSET"] = 0] = "NOTSET";
  LogLevels2[LogLevels2["DEBUG"] = 10] = "DEBUG";
  LogLevels2[LogLevels2["INFO"] = 20] = "INFO";
  LogLevels2[LogLevels2["WARNING"] = 30] = "WARNING";
  LogLevels2[LogLevels2["ERROR"] = 40] = "ERROR";
  LogLevels2[LogLevels2["CRITICAL"] = 50] = "CRITICAL";
})(LogLevels || (LogLevels = {}));
export const LogLevelNames = Object.keys(LogLevels).filter((key) => isNaN(Number(key)));
const byLevel = {
  [String(0)]: "NOTSET",
  [String(10)]: "DEBUG",
  [String(20)]: "INFO",
  [String(30)]: "WARNING",
  [String(40)]: "ERROR",
  [String(50)]: "CRITICAL"
};
export function getLevelByName(name) {
  switch (name) {
    case "NOTSET":
      return 0;
    case "DEBUG":
      return 10;
    case "INFO":
      return 20;
    case "WARNING":
      return 30;
    case "ERROR":
      return 40;
    case "CRITICAL":
      return 50;
    default:
      throw new Error(`no log level found for "${name}"`);
  }
}
export function getLevelName(level) {
  const levelName = byLevel[level];
  if (levelName) {
    return levelName;
  }
  throw new Error(`no level name found for level: ${level}`);
}
