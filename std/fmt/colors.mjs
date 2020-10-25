const noColor = globalThis.Deno?.noColor ?? true;
let enabled = !noColor;
export function setColorEnabled(value) {
  if (noColor) {
    return;
  }
  enabled = value;
}
export function getColorEnabled() {
  return enabled;
}
function code(open, close) {
  return {
    open: `[${open.join(";")}m`,
    close: `[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g")
  };
}
function run(str, code2) {
  return enabled ? `${code2.open}${str.replace(code2.regexp, code2.open)}${code2.close}` : str;
}
export function reset(str) {
  return run(str, code([0], 0));
}
export function bold(str) {
  return run(str, code([1], 22));
}
export function dim(str) {
  return run(str, code([2], 22));
}
export function italic(str) {
  return run(str, code([3], 23));
}
export function underline(str) {
  return run(str, code([4], 24));
}
export function inverse(str) {
  return run(str, code([7], 27));
}
export function hidden(str) {
  return run(str, code([8], 28));
}
export function strikethrough(str) {
  return run(str, code([9], 29));
}
export function black(str) {
  return run(str, code([30], 39));
}
export function red(str) {
  return run(str, code([31], 39));
}
export function green(str) {
  return run(str, code([32], 39));
}
export function yellow(str) {
  return run(str, code([33], 39));
}
export function blue(str) {
  return run(str, code([34], 39));
}
export function magenta(str) {
  return run(str, code([35], 39));
}
export function cyan(str) {
  return run(str, code([36], 39));
}
export function white(str) {
  return run(str, code([37], 39));
}
export function gray(str) {
  return brightBlack(str);
}
export function brightBlack(str) {
  return run(str, code([90], 39));
}
export function brightRed(str) {
  return run(str, code([91], 39));
}
export function brightGreen(str) {
  return run(str, code([92], 39));
}
export function brightYellow(str) {
  return run(str, code([93], 39));
}
export function brightBlue(str) {
  return run(str, code([94], 39));
}
export function brightMagenta(str) {
  return run(str, code([95], 39));
}
export function brightCyan(str) {
  return run(str, code([96], 39));
}
export function brightWhite(str) {
  return run(str, code([97], 39));
}
export function bgBlack(str) {
  return run(str, code([40], 49));
}
export function bgRed(str) {
  return run(str, code([41], 49));
}
export function bgGreen(str) {
  return run(str, code([42], 49));
}
export function bgYellow(str) {
  return run(str, code([43], 49));
}
export function bgBlue(str) {
  return run(str, code([44], 49));
}
export function bgMagenta(str) {
  return run(str, code([45], 49));
}
export function bgCyan(str) {
  return run(str, code([46], 49));
}
export function bgWhite(str) {
  return run(str, code([47], 49));
}
export function bgBrightBlack(str) {
  return run(str, code([100], 49));
}
export function bgBrightRed(str) {
  return run(str, code([101], 49));
}
export function bgBrightGreen(str) {
  return run(str, code([102], 49));
}
export function bgBrightYellow(str) {
  return run(str, code([103], 49));
}
export function bgBrightBlue(str) {
  return run(str, code([104], 49));
}
export function bgBrightMagenta(str) {
  return run(str, code([105], 49));
}
export function bgBrightCyan(str) {
  return run(str, code([106], 49));
}
export function bgBrightWhite(str) {
  return run(str, code([107], 49));
}
function clampAndTruncate(n, max = 255, min = 0) {
  return Math.trunc(Math.max(Math.min(n, max), min));
}
export function rgb8(str, color) {
  return run(str, code([38, 5, clampAndTruncate(color)], 39));
}
export function bgRgb8(str, color) {
  return run(str, code([48, 5, clampAndTruncate(color)], 49));
}
export function rgb24(str, color) {
  if (typeof color === "number") {
    return run(str, code([38, 2, color >> 16 & 255, color >> 8 & 255, color & 255], 39));
  }
  return run(str, code([
    38,
    2,
    clampAndTruncate(color.r),
    clampAndTruncate(color.g),
    clampAndTruncate(color.b)
  ], 39));
}
export function bgRgb24(str, color) {
  if (typeof color === "number") {
    return run(str, code([48, 2, color >> 16 & 255, color >> 8 & 255, color & 255], 49));
  }
  return run(str, code([
    48,
    2,
    clampAndTruncate(color.r),
    clampAndTruncate(color.g),
    clampAndTruncate(color.b)
  ], 49));
}
const ANSI_PATTERN = new RegExp([
  "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
  "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
].join("|"), "g");
export function stripColor(string) {
  return string.replace(ANSI_PATTERN, "");
}
