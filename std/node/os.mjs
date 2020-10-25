import {notImplemented} from "./_utils.mjs";
import {validateIntegerRange} from "./_utils.mjs";
import {EOL as fsEOL} from "../fs/eol.mjs";
import process2 from "./process.mjs";
const SEE_GITHUB_ISSUE = "See https://github.com/denoland/deno/issues/3802";
arch[Symbol.toPrimitive] = () => arch();
endianness[Symbol.toPrimitive] = () => endianness();
freemem[Symbol.toPrimitive] = () => freemem();
homedir[Symbol.toPrimitive] = () => homedir();
hostname[Symbol.toPrimitive] = () => hostname();
platform[Symbol.toPrimitive] = () => platform();
release[Symbol.toPrimitive] = () => release();
totalmem[Symbol.toPrimitive] = () => totalmem();
type[Symbol.toPrimitive] = () => type();
uptime[Symbol.toPrimitive] = () => uptime();
export function arch() {
  return Deno.build.arch;
}
export function cpus() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function endianness() {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256 ? "LE" : "BE";
}
export function freemem() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function getPriority(pid = 0) {
  validateIntegerRange(pid, "pid");
  notImplemented(SEE_GITHUB_ISSUE);
}
export function homedir() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function hostname() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function loadavg() {
  if (Deno.build.os === "windows") {
    return [0, 0, 0];
  }
  return Deno.loadavg();
}
export function networkInterfaces() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function platform() {
  return process2.platform;
}
export function release() {
  return Deno.osRelease();
}
export function setPriority(pid, priority) {
  if (priority === void 0) {
    priority = pid;
    pid = 0;
  }
  validateIntegerRange(pid, "pid");
  validateIntegerRange(priority, "priority", -20, 19);
  notImplemented(SEE_GITHUB_ISSUE);
}
export function tmpdir() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function totalmem() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function type() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function uptime() {
  notImplemented(SEE_GITHUB_ISSUE);
}
export function userInfo(options = {encoding: "utf-8"}) {
  notImplemented(SEE_GITHUB_ISSUE);
}
export const constants = {
  dlopen: {},
  errno: {},
  signals: Deno.Signal,
  priority: {}
};
export const EOL = Deno.build.os == "windows" ? fsEOL.CRLF : fsEOL.LF;
