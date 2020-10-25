import {notImplemented} from "./_utils.js";
export const arch = Deno.build.arch;
export const chdir = Deno.chdir;
export const cwd = Deno.cwd;
export const exit = Deno.exit;
export const pid = Deno.pid;
export const platform = Deno.build.os === "windows" ? "win32" : Deno.build.os;
export const version = `v${Deno.version.deno}`;
export const versions = {
  node: Deno.version.deno,
  ...Deno.version
};
export const process = {
  arch,
  chdir,
  cwd,
  exit,
  pid,
  platform,
  version,
  versions,
  get stderr() {
    return {
      fd: Deno.stderr.rid,
      get isTTY() {
        return Deno.isatty(this.fd);
      },
      pipe(_destination, _options) {
        notImplemented();
      },
      write(_chunk, _callback) {
        notImplemented();
      },
      on(_event, _callback) {
        notImplemented();
      }
    };
  },
  get stdin() {
    return {
      fd: Deno.stdin.rid,
      get isTTY() {
        return Deno.isatty(this.fd);
      },
      read(_size) {
        notImplemented();
      },
      on(_event, _callback) {
        notImplemented();
      }
    };
  },
  get stdout() {
    return {
      fd: Deno.stdout.rid,
      get isTTY() {
        return Deno.isatty(this.fd);
      },
      pipe(_destination, _options) {
        notImplemented();
      },
      write(_chunk, _callback) {
        notImplemented();
      },
      on(_event, _callback) {
        notImplemented();
      }
    };
  },
  on(_event, _callback) {
    notImplemented();
  },
  get argv() {
    return [Deno.execPath(), ...Deno.args];
  },
  get env() {
    return Deno.env.toObject();
  }
};
export const argv = new Proxy(process.argv, {});
export const env = new Proxy(process.env, {});
export default process;
Object.defineProperty(process, Symbol.toStringTag, {
  enumerable: false,
  writable: true,
  configurable: false,
  value: "process"
});
Object.defineProperty(globalThis, "process", {
  value: process,
  enumerable: false,
  writable: true,
  configurable: true
});
