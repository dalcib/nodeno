(() => {
  var __defineProperty = Object.defineProperty;
  var __hasOwnProperty = Object.prototype.hasOwnProperty;
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __markAsModule = (target) => {
    return __defineProperty(target, "__esModule", {value: true});
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defineProperty(target, name, {get: all[name], enumerable: true});
  };
  var __exportStar = (target, module) => {
    __markAsModule(target);
    if (typeof module === "object" || typeof module === "function") {
      for (let key in module)
        if (!__hasOwnProperty.call(target, key) && key !== "default")
          __defineProperty(target, key, {get: () => module[key], enumerable: true});
    }
    return target;
  };
  var __toModule = (module) => {
    if (module && module.__esModule)
      return module;
    return __exportStar(__defineProperty({}, "default", {value: module, enumerable: true}), module);
  };

  // src/deno.ts
  var require_deno = __commonJS((exports) => {
    __export(exports, {
      opsCache: () => opsCache
    });
    const fs6 = __toModule(require("fs"));
    const os5 = __toModule(require("os"));
    const util3 = __toModule(require("util"));
    globalThis.__bootstrap = globalThis.__bootstrap || {};
    const unsupported = () => {
      throw new Error("unsupported");
    };
    function convUint8ToNum(ui8) {
      const header = ui8.subarray(0, 12);
      const buf32 = new Int32Array(header.buffer, header.byteOffset, header.byteLength / 4);
      return buf32[1];
    }
    function convNumUint8(ui8, res) {
      const buf32 = new Int32Array(ui8.buffer, ui8.byteOffset, ui8.byteLength / 4);
      buf32[2] = res;
      return ui8;
    }
    const opsCache = {
      op_apply_source_map: (location) => location,
      op_chdir: process.chdir,
      op_chmod_sync: fs6.default.chmodSync,
      op_chown_sync: fs6.default.chownSync,
      op_console_size: () => process.stdout.columns,
      op_copy_file_sync: fs6.default.copyFileSync,
      op_create_worker: unsupported,
      op_cwd: process.cwd,
      op_domain_to_ascii: (domain, beStrict) => {
      },
      op_delete_env: (key) => delete process.env[key],
      op_env: () => process.env,
      op_exec_path: () => process.execPath,
      op_exit: process.exit,
      op_fdatasync_sync: fs6.default.fdatasyncSync,
      op_format_diagnostic: unsupported,
      op_fs_events_open: unsupported,
      op_fs_events_poll: unsupported,
      op_fsync_sync: fs6.default.fsyncSync,
      op_ftruncate_sync: fs6.default.ftruncateSync,
      op_futime_sync: fs6.default.futimesSync,
      op_get_env: (key) => process.env[key],
      op_get_random_values: (ui8) => crypto.randomFillSync(ui8),
      op_global_timer_start: unsupported,
      op_global_timer_stop: unsupported,
      op_host_post_message: unsupported,
      op_host_terminate_worker: unsupported,
      op_hostname: os5.default.hostname,
      op_isatty: isTTY,
      op_kill: process.kill,
      op_link_sync: fs6.default.linkSync,
      op_listen: unsupported,
      op_listen_tl: unsupported,
      op_loadavg: os5.default.loadavg,
      op_main_module: unsupported,
      op_make_temp_dir_sync: make_temp_dir_sync,
      op_make_temp_file_sync: make_temp_file_sync,
      op_metrics: metrics,
      op_mkdir_sync: fs6.default.mkdirSync,
      op_now: () => {
        const time = process.hrtime();
        return {seconds: time[0], subsecNanos: time[1]};
      },
      op_open_plugin: unsupported,
      op_open_sync: (path4, options) => fs6.default.openSync(path4, getOpenFlag(options)),
      op_os_release: os5.default.release,
      op_query_permission: permissions.query,
      op_request_permission: permissions.query,
      op_read: (fd, buffer2) => {
        const res = fs6.default.readSync(convUint8ToNum(fd), buffer2);
        return convNumUint8(fd, res);
      },
      op_read_dir_sync: readDirSync,
      op_read_link_sync: fs6.default.readlinkSync,
      op_realpath_sync: fs6.default.realpathSync,
      op_remove_sync: removeSync,
      op_rename_sync: fs6.default.renameSync,
      op_run: run,
      op_seek_sync: seekSync,
      op_set_env: (key, value) => {
        process.env[key] = value;
      },
      op_set_raw: (rid, mode) => process.stdin.setRawMode(mode),
      op_shutdown: unsupported,
      op_signal_bind: unsupported,
      op_signal_unbind: unsupported,
      op_sleep_sync: unsupported,
      op_start: start,
      op_stat_sync: statSync,
      op_symlink_sync: fs6.default.symlinkSync,
      op_system_memory_info: unsupported,
      op_truncate_sync: fs6.default.truncateSync,
      op_umask: process.umask,
      op_utime_sync: fs6.default.utimesSync,
      op_worker_close: unsupported,
      op_worker_post_message: unsupported,
      op_accept: unsupported,
      op_accept_tls: unsupported,
      op_chmod_async: fs6.default.promises.chmod,
      op_chown_async: fs6.default.promises.chown,
      op_close: fs6.default.closeSync,
      op_compile: unsupported,
      op_connect: unsupported,
      op_connect_tls: unsupported,
      op_copy_file_async: fs6.default.promises.copyFile,
      op_datagram_receive: (rid, transport) => {
      },
      op_datagram_send: unsupported,
      op_fdatasync_async: fs6.default.promises.fdatasync,
      op_fstat_async: fs6.default.fstat,
      op_fsync_async: fs6.default.fsync,
      op_ftruncate_async: fs6.default.ftruncate,
      op_futime_async: fs6.default.futimes,
      op_global_timer: unsupported,
      op_host_get_message: unsupported,
      op_link_async: fs6.default.promises.link,
      op_mkdir_async: fs6.default.promises.mkdir,
      op_make_temp_dir_async: make_temp_dir_async,
      op_make_temp_file_async: make_temp_file_async,
      op_open_async: (path4, options) => fs6.default.promises.open(path4, getOpenFlag(options)),
      op_read_dir_async: readDir,
      op_read_link_async: fs6.default.promises.readlink,
      op_realpath_async: fs6.default.promises.realpath,
      op_remove_async: remove,
      op_rename_async: fs6.default.promises.rename,
      op_run_status: unsupported,
      op_seek_async: seek,
      op_signal_poll: unsupported,
      op_start_tls: unsupported,
      op_stat_async: stat,
      op_symlink_async: fs6.default.promises.symlink,
      op_transpile: unsupported,
      op_truncate_async: fs6.default.promises.truncate,
      op_utime_async: fs6.default.promises.utimes,
      op_write: (fd, buffer2) => {
        const res = fs6.default.writeSync(convUint8ToNum(fd), buffer2);
        return convNumUint8(fd, res);
      },
      op_ws_next_event: unsupported,
      op_ws_close: unsupported,
      op_ws_create: unsupported,
      op_ws_send: unsupported
    };
    const Deno = {
      core: {
        encode: (text) => {
          const encoder2 = new util3.TextEncoder();
          return encoder2.encode(text);
        },
        decode: (bytes) => {
          const decoder2 = new util3.TextDecoder();
          return decoder2.decode(bytes);
        },
        setMacrotaskCallback: () => {
        },
        print: (text) => {
          process.stdout.write(text);
        },
        getProxyDetails: () => null,
        send: (opName, args2, ...zeroCopy) => {
          let objArgs;
          if (opName === 0)
            return opsCache;
          if (args2) {
            if (Object.prototype.toString.call(args2) !== "[object Object]") {
              objArgs = {key: args2};
            } else {
              objArgs = args2;
            }
          }
          let res;
          if (zeroCopy) {
            res = opName(...Object.values(objArgs), ...zeroCopy);
          } else {
            res = opName(...Object.values(objArgs));
          }
          return res;
        },
        recv: () => {
        }
      }
    };
    globalThis.Deno = Deno;
  });

  // src/utils.ts
  const fs = __toModule(require("fs"));
  const os = __toModule(require("os"));
  const path = __toModule(require("path"));
  const make_temp_dir_async = (options) => {
    if (!options) {
      return fs.default.promises.mkdtemp("");
    } else {
      const ret = tempDir(options);
      return new Promise((resolve, reject) => {
        fs.default.mkdir(ret, {recursive: true}, (err) => {
          err ? reject(err) : resolve(ret);
        });
      });
    }
  };
  const make_temp_file_async = (options) => {
    const ret = tempDir(options);
    return new Promise((resolve, reject) => {
      fs.default.writeFile(ret, "", (err) => {
        err ? reject(err) : resolve(ret);
      });
    });
  };
  const make_temp_dir_sync = (options) => {
    if (!options) {
      return fs.default.mkdtempSync("");
    } else {
      const ret = tempDir(options);
      if (!fs.default.existsSync(ret)) {
        fs.default.mkdirSync(ret);
      }
      return ret;
    }
  };
  const make_temp_file_sync = (options) => {
    const ret = tempDir(options);
    if (!fs.default.existsSync(ret)) {
      fs.default.writeFileSync(ret, "");
    }
    return ret;
  };
  function tempDir(options = {}) {
    const dir = options.dir || os.default.tmpdir();
    const prefix = options.prefix || "";
    const suffix = options.suffix || "";
    const rand = Math.random() * 1e5;
    return path.default.join(dir, `${prefix}${rand}${suffix}`);
  }
  function removeSync(path4, recursive) {
    const stats = fs.default.statSync(path4);
    if (stats.isDirectory()) {
      fs.default.rmdirSync(path4, {recursive});
    } else {
      fs.default.unlinkSync(path4);
    }
  }
  async function remove(path4, recursive) {
    const stats = await fs.default.promises.stat(path4);
    if (stats.isDirectory()) {
      await fs.default.promises.rmdir(path4, {recursive});
    } else {
      await fs.default.promises.unlink(path4);
    }
  }
  function start() {
    return {
      args: process.argv,
      cwd: process.cwd(),
      debugFlag: false,
      denoVersion: "1.4.6",
      noColor: false,
      pid: process.pid,
      ppid: process.pid,
      target: os.default.arch() + "-vendor-" + os.default.platform() + "-env",
      tsVersion: process.version.slice(1),
      unstableFlag: true,
      v8Version: process.versions.v8,
      versionFlag: false
    };
  }
  function statToFileInfo(filename, stats) {
    return {
      isFile: stats.isFile,
      isDirectory: stats.isDirectory,
      isSymlink: stats.isSymbolicLink,
      size: stats.size,
      mtime: stats.mtimeMs != null ? new Date(stats.mtimeMs) : null,
      atime: stats.atimeMs != null ? new Date(stats.atimeMs) : null,
      birthtime: stats.ctimeMs != null ? new Date(stats.ctimeMs) : null,
      dev: null,
      ino: null,
      mode: null,
      nlink: null,
      uid: null,
      gid: null,
      rdev: null,
      blksize: null,
      blocks: null
    };
  }
  async function stat(filename) {
    const stats = await fs.default.promises.stat(filename);
    return statToFileInfo(filename, stats);
  }
  function statSync(filename) {
    const stats = fs.default.statSync(filename);
    const res = statToFileInfo(filename, stats);
    console.log(filename, "asdfasdfad", res);
    return res;
  }
  function readDirSync(path4) {
    return fs.default.readdirSync(path4).map(statSync);
  }
  async function readDir(path4) {
    const arr = await fs.default.promises.readdir(path4);
    return Promise.all(arr.map(stat));
  }
  function isTTY() {
    return {
      stdin: process.stdin.isTTY,
      stdout: process.stdout.isTTY,
      stderr: process.stderr.isTTY
    };
  }
  function metrics() {
    return {
      opsCompleted: 0,
      opsDispatched: 0,
      bytesReceived: 0,
      bytesSentControl: 0,
      bytesSentData: 0
    };
  }
  function getOpenFlag(options) {
    const flag = options.create && options.append ? "a" : options.create && options.append && options.createNew ? "ax" : options.create && options.append && options.read ? "a+" : options.createNew && options.append && options.read ? "ax+" : options.read ? "r" : options.read && options.write ? "r+" : options.create && options.write && options.truncate ? "w" : options.createNew && options.write ? "wx" : options.create && options.write && options.read ? "w+" : options.createNew && options.write && options.read ? "wx+" : options.create && options.append ? "as" : options.create && options.append && options.read ? "as+" : options.create && options.write && options.read ? "rs+" : void 0;
    if (!flag)
      throw new Error(`Unrecognized file system flag: ${options}`);
    return flag;
  }

  // src/denode/deno.ts
  const fs4 = __toModule(require("fs"));
  const util2 = __toModule(require("util"));
  const os3 = __toModule(require("os"));
  const path3 = __toModule(require("path"));
  const cp = __toModule(require("child_process"));

  // src/denode/encoding.ts
  class TextEncoder {
    encode(s) {
      return Buffer.from(s);
    }
  }
  class TextDecoder {
    decode(u) {
      return Buffer.from(u).toString();
    }
  }

  // src/denode/util.ts
  function deferred() {
    let resolve, reject;
    let st;
    const p = new Promise((a, b) => {
      resolve = (...args2) => {
        try {
          a(...args2);
        } finally {
          st = "resolved";
        }
      };
      reject = (...args2) => {
        try {
          b(...args2);
        } finally {
          st = "rejected";
        }
      };
    });
    return Object.assign(p, {
      resolve,
      reject,
      status() {
        return st;
      }
    });
  }
  function concatBytes(...chunks) {
    const total = chunks.reduce((sum, i) => sum + i.byteLength, 0);
    const ret = new Uint8Array(total);
    let done = 0;
    for (const chunk of chunks) {
      ret.set(chunk, done);
      done += chunk.byteLength;
    }
    return ret;
  }
  function streamToReader(stream) {
    let ended = false;
    let err;
    let buf = new Uint8Array();
    let currDeferred = deferred();
    stream.on("data", (chunk) => {
      buf = concatBytes(buf, chunk);
      currDeferred.resolve();
      currDeferred = deferred();
    }).on("end", () => {
      ended = true;
    }).on("error", (e) => {
      err = e;
    });
    async function read2(p) {
      if (ended) {
        return EOF;
      } else if (err) {
        throw err;
      }
      const rem = Math.min(p.byteLength, buf.byteLength);
      if (rem > 0) {
        p.set(buf.subarray(0, rem));
        buf = buf.subarray(rem);
        return rem;
      } else {
        await currDeferred;
        return read2(p);
      }
    }
    return {read: read2};
  }
  function streamToWriter(stream) {
    async function write2(p) {
      return new Promise((resolve, reject) => {
        stream.write(p, (err) => {
          err ? reject(err) : resolve(p.byteLength);
        });
      });
    }
    return {write: write2};
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // src/denode/buffer.ts
  const MIN_READ = 512;
  const MAX_SIZE = 2 ** 32 - 2;
  function copyBytes(dst, src, off = 0) {
    const r = dst.byteLength - off;
    if (src.byteLength > r) {
      src = src.subarray(0, r);
    }
    dst.set(src, off);
    return src.byteLength;
  }
  class Buffer2 {
    constructor(ab) {
      this.off = 0;
      if (ab == null) {
        this.buf = new Uint8Array(0);
        return;
      }
      this.buf = new Uint8Array(ab);
    }
    bytes() {
      return this.buf.subarray(this.off);
    }
    toString() {
      const decoder2 = new TextDecoder();
      return decoder2.decode(this.buf.subarray(this.off));
    }
    empty() {
      return this.buf.byteLength <= this.off;
    }
    get length() {
      return this.buf.byteLength - this.off;
    }
    get capacity() {
      return this.buf.buffer.byteLength;
    }
    truncate(n) {
      if (n === 0) {
        this.reset();
        return;
      }
      if (n < 0 || n > this.length) {
        throw Error("bytes.Buffer: truncation out of range");
      }
      this._reslice(this.off + n);
    }
    reset() {
      this._reslice(0);
      this.off = 0;
    }
    _tryGrowByReslice(n) {
      const l = this.buf.byteLength;
      if (n <= this.capacity - l) {
        this._reslice(l + n);
        return l;
      }
      return -1;
    }
    _reslice(len) {
      if (len > this.buf.buffer.byteLength) {
        throw new Error("short len");
      }
      this.buf = new Uint8Array(this.buf.buffer, 0, len);
    }
    readSync(p) {
      if (this.empty()) {
        this.reset();
        if (p.byteLength === 0) {
          return 0;
        }
        return EOF;
      }
      const nread = copyBytes(p, this.buf.subarray(this.off));
      this.off += nread;
      return nread;
    }
    async read(p) {
      const rr = this.readSync(p);
      return Promise.resolve(rr);
    }
    writeSync(p) {
      const m = this._grow(p.byteLength);
      return copyBytes(this.buf, p, m);
    }
    async write(p) {
      const n = this.writeSync(p);
      return Promise.resolve(n);
    }
    _grow(n) {
      const m = this.length;
      if (m === 0 && this.off !== 0) {
        this.reset();
      }
      const i = this._tryGrowByReslice(n);
      if (i >= 0) {
        return i;
      }
      const c = this.capacity;
      if (n <= Math.floor(c / 2) - m) {
        copyBytes(this.buf, this.buf.subarray(this.off));
      } else if (c > MAX_SIZE - c - n) {
        throw new DenoError(ErrorKind.TooLarge, "The buffer cannot be grown beyond the maximum size.");
      } else {
        const buf = new Uint8Array(2 * c + n);
        copyBytes(buf, this.buf.subarray(this.off));
        this.buf = buf;
      }
      this.off = 0;
      this._reslice(m + n);
      return m;
    }
    grow(n) {
      if (n < 0) {
        throw Error("Buffer.grow: negative count");
      }
      const m = this._grow(n);
      this._reslice(m);
    }
    async readFrom(r) {
      let n = 0;
      while (true) {
        try {
          const i = this._grow(MIN_READ);
          this._reslice(i);
          const fub = new Uint8Array(this.buf.buffer, i);
          const nread = await r.read(fub);
          if (nread === EOF) {
            return n;
          }
          this._reslice(i + nread);
          n += nread;
        } catch (e) {
          return n;
        }
      }
    }
    readFromSync(r) {
      let n = 0;
      while (true) {
        try {
          const i = this._grow(MIN_READ);
          this._reslice(i);
          const fub = new Uint8Array(this.buf.buffer, i);
          const nread = r.readSync(fub);
          if (nread === EOF) {
            return n;
          }
          this._reslice(i + nread);
          n += nread;
        } catch (e) {
          return n;
        }
      }
    }
  }
  async function readAll(r) {
    const buf = new Buffer2();
    await buf.readFrom(r);
    return buf.bytes();
  }

  // src/denode/process.ts
  class DenoProcessImpl {
    constructor(rid, proc) {
      this.proc = proc;
      this.statusDeferred = deferred();
      this.rid = rid;
      this.pid = proc.pid;
      if (proc.stdin) {
        const w = streamToWriter(proc.stdin);
        this.stdin = {
          ...w,
          close() {
          }
        };
      }
      if (proc.stdout) {
        const r = streamToReader(proc.stdout);
        this.stdout = {
          ...r,
          close() {
          }
        };
      }
      if (proc.stderr) {
        const r = streamToReader(proc.stderr);
        this.stderr = {
          ...r,
          close() {
          }
        };
      }
      proc.on("exit", (code, sig) => {
        const status = {success: false};
        if (code === 0) {
          status.success = true;
        }
        if (code != null) {
          status.code = code;
        }
        if (sig != null) {
          status.signal = Signal[sig];
        }
        this.statusDeferred.resolve(status);
      });
      proc.on("error", (err) => this.statusDeferred.reject(err));
    }
    status() {
      return this.statusDeferred;
    }
    output() {
      return readAll(this.stdout);
    }
    stderrOutput() {
      return readAll(this.stderr);
    }
    close() {
      try {
        const st = this.statusDeferred.status();
        if (!st) {
          process.kill(this.pid);
        }
      } finally {
        ResourceTable.delete(this.rid);
      }
    }
    kill(signo) {
      try {
        process.kill(this.pid, signo);
      } finally {
        ResourceTable.delete(this.rid);
      }
    }
  }

  // src/denode/file.ts
  const fs3 = __toModule(require("fs"));
  class DenoFileImpl {
    constructor(rid, handle) {
      this.rid = rid;
      this.handle = handle;
      this.loc = 0;
    }
    async write(p) {
      const result = await this.handle.write(p, 0, p.byteLength, this.loc);
      this.loc += result.bytesWritten;
      return result.bytesWritten;
    }
    writeSync(p) {
      const written = fs3.writeSync(this.handle.fd, p);
      this.loc += written;
      return written;
    }
    async read(p) {
      const result = await this.handle.read(p, 0, p.byteLength, this.loc);
      this.loc += result.bytesRead;
      return result.bytesRead === 0 ? EOF : result.bytesRead;
    }
    readSync(p) {
      const result = fs3.readSync(this.handle.fd, p, 0, p.byteLength, this.loc);
      this.loc += result;
      return result === 0 ? EOF : result;
    }
    async seek(offset, whence) {
      if (whence === SeekMode.SEEK_START) {
        this.loc = offset;
      } else if (whence === SeekMode.SEEK_CURRENT) {
        this.loc += offset;
      } else if (whence === SeekMode.SEEK_END) {
        const stats = await this.handle.stat();
        this.loc = stats.size - offset;
      }
    }
    seekSync(offset, whence) {
      if (whence === SeekMode.SEEK_START) {
        this.loc = offset;
      } else if (whence === SeekMode.SEEK_CURRENT) {
        this.loc += offset;
      } else if (whence === SeekMode.SEEK_END) {
        const stats = fs3.fstatSync(this.handle.fd);
        this.loc = stats.size - offset;
      }
    }
    close() {
      try {
        fs3.closeSync(this.handle.fd);
      } finally {
        ResourceTable.delete(this.rid);
      }
    }
  }

  // src/denode/resources.ts
  function resourceTable() {
    const files = new Map();
    const processes = new Map();
    const conns = new Map();
    let resourceId = 3;
    function openFile(file3) {
      const rid = resourceId++;
      const ret = new DenoFileImpl(rid, file3);
      files.set(rid, ret);
      return ret;
    }
    function openProcess(proc) {
      const rid = resourceId++;
      const ret = new DenoProcessImpl(rid, proc);
      processes.set(rid, ret);
      return ret;
    }
    function close(rid) {
      if (files.has(rid)) {
        const file3 = files.get(rid);
        file3.close();
      } else if (processes.has(rid)) {
        const proc = processes.get(rid);
        proc.close();
      } else if (conns.has(rid)) {
        const conn = conns.get(rid);
        conn.close();
      }
    }
    function del(rid) {
      if (files.has(rid)) {
        files.delete(rid);
      } else if (processes.has(rid)) {
        processes.delete(rid);
      } else if (conns.has(rid)) {
        processes.delete(rid);
      }
    }
    function getFile(rid) {
      const file3 = files.get(rid);
      if (!file3) {
        throw new Error("file not found: rid=" + rid);
      }
      return file3;
    }
    function getProcess(rid) {
      const proc = processes.get(rid);
      if (!proc) {
        throw new Error("process not found: rid=" + rid);
      }
      return;
    }
    function map() {
      return Object.fromEntries([
        ...[...files.entries()].map((e) => [e[0], "file"]),
        ...[...processes.entries()].map((e) => [e[0], "process"]),
        ...[...conns.entries()].map((e) => [e[0], "conn"])
      ]);
    }
    return {
      getFile,
      getProcess,
      openFile,
      openProcess,
      close,
      delete: del,
      map
    };
  }
  const ResourceTable = resourceTable();

  // src/denode/deno.ts
  let pid = process.pid;
  const EOF = Symbol("EOF");
  var SeekMode;
  (function(SeekMode2) {
    SeekMode2[SeekMode2["SEEK_START"] = 0] = "SEEK_START";
    SeekMode2[SeekMode2["SEEK_CURRENT"] = 1] = "SEEK_CURRENT";
    SeekMode2[SeekMode2["SEEK_END"] = 2] = "SEEK_END";
  })(SeekMode || (SeekMode = {}));
  class DenoStdioImpl {
    constructor(fd) {
      this.fd = fd;
      this.rid = this.fd;
      this.offs = 0;
    }
    close() {
    }
    read(p) {
      return new Promise((resolve, reject) => {
        fs4.read(this.fd, p, 0, p.byteLength, this.offs, (err, bytesRead) => {
          if (err) {
            reject(err);
          } else if (bytesRead === 0) {
            resolve(EOF);
          } else {
            this.offs += bytesRead;
            resolve(bytesRead);
          }
        });
      });
    }
    readSync(p) {
      const bytesRead = fs4.readSync(this.fd, p, 0, p.byteLength, this.offs);
      this.offs += bytesRead;
      return bytesRead === 0 ? EOF : bytesRead;
    }
    seek(offset, whence) {
      throw new Error("stdin/stdout/stderr can't be seeked");
    }
    seekSync(offset, whence) {
      throw new Error("stdin/stdout/stderr can't be seeked");
    }
    write(p) {
      return new Promise((resolve, reject) => {
        fs4.write(this.fd, p, 0, p.byteLength, this.offs, (err, written) => {
          if (err) {
            reject(err);
          } else {
            this.offs += written;
            resolve(written);
          }
        });
      });
    }
    writeSync(p) {
      return fs4.writeSync(this.fd, p, 0, p.byteLength, this.offs);
    }
  }
  function seekSync(rid, offset, whence) {
    ResourceTable.getFile(rid).seekSync(offset, whence);
  }
  function seek(rid, offset, whence) {
    return ResourceTable.getFile(rid).seek(offset, whence);
  }
  const stdin = new DenoStdioImpl(0);
  const stdout = new DenoStdioImpl(1);
  const stderr = new DenoStdioImpl(2);
  var ErrorKind;
  (function(ErrorKind2) {
    ErrorKind2[ErrorKind2["NoError"] = 0] = "NoError";
    ErrorKind2[ErrorKind2["NotFound"] = 1] = "NotFound";
    ErrorKind2[ErrorKind2["PermissionDenied"] = 2] = "PermissionDenied";
    ErrorKind2[ErrorKind2["ConnectionRefused"] = 3] = "ConnectionRefused";
    ErrorKind2[ErrorKind2["ConnectionReset"] = 4] = "ConnectionReset";
    ErrorKind2[ErrorKind2["ConnectionAborted"] = 5] = "ConnectionAborted";
    ErrorKind2[ErrorKind2["NotConnected"] = 6] = "NotConnected";
    ErrorKind2[ErrorKind2["AddrInUse"] = 7] = "AddrInUse";
    ErrorKind2[ErrorKind2["AddrNotAvailable"] = 8] = "AddrNotAvailable";
    ErrorKind2[ErrorKind2["BrokenPipe"] = 9] = "BrokenPipe";
    ErrorKind2[ErrorKind2["AlreadyExists"] = 10] = "AlreadyExists";
    ErrorKind2[ErrorKind2["WouldBlock"] = 11] = "WouldBlock";
    ErrorKind2[ErrorKind2["InvalidInput"] = 12] = "InvalidInput";
    ErrorKind2[ErrorKind2["InvalidData"] = 13] = "InvalidData";
    ErrorKind2[ErrorKind2["TimedOut"] = 14] = "TimedOut";
    ErrorKind2[ErrorKind2["Interrupted"] = 15] = "Interrupted";
    ErrorKind2[ErrorKind2["WriteZero"] = 16] = "WriteZero";
    ErrorKind2[ErrorKind2["Other"] = 17] = "Other";
    ErrorKind2[ErrorKind2["UnexpectedEof"] = 18] = "UnexpectedEof";
    ErrorKind2[ErrorKind2["BadResource"] = 19] = "BadResource";
    ErrorKind2[ErrorKind2["CommandFailed"] = 20] = "CommandFailed";
    ErrorKind2[ErrorKind2["EmptyHost"] = 21] = "EmptyHost";
    ErrorKind2[ErrorKind2["IdnaError"] = 22] = "IdnaError";
    ErrorKind2[ErrorKind2["InvalidPort"] = 23] = "InvalidPort";
    ErrorKind2[ErrorKind2["InvalidIpv4Address"] = 24] = "InvalidIpv4Address";
    ErrorKind2[ErrorKind2["InvalidIpv6Address"] = 25] = "InvalidIpv6Address";
    ErrorKind2[ErrorKind2["InvalidDomainCharacter"] = 26] = "InvalidDomainCharacter";
    ErrorKind2[ErrorKind2["RelativeUrlWithoutBase"] = 27] = "RelativeUrlWithoutBase";
    ErrorKind2[ErrorKind2["RelativeUrlWithCannotBeABaseBase"] = 28] = "RelativeUrlWithCannotBeABaseBase";
    ErrorKind2[ErrorKind2["SetHostOnCannotBeABaseUrl"] = 29] = "SetHostOnCannotBeABaseUrl";
    ErrorKind2[ErrorKind2["Overflow"] = 30] = "Overflow";
    ErrorKind2[ErrorKind2["HttpUser"] = 31] = "HttpUser";
    ErrorKind2[ErrorKind2["HttpClosed"] = 32] = "HttpClosed";
    ErrorKind2[ErrorKind2["HttpCanceled"] = 33] = "HttpCanceled";
    ErrorKind2[ErrorKind2["HttpParse"] = 34] = "HttpParse";
    ErrorKind2[ErrorKind2["HttpOther"] = 35] = "HttpOther";
    ErrorKind2[ErrorKind2["TooLarge"] = 36] = "TooLarge";
    ErrorKind2[ErrorKind2["InvalidUri"] = 37] = "InvalidUri";
    ErrorKind2[ErrorKind2["InvalidSeekMode"] = 38] = "InvalidSeekMode";
    ErrorKind2[ErrorKind2["OpNotAvailable"] = 39] = "OpNotAvailable";
    ErrorKind2[ErrorKind2["WorkerInitFailed"] = 40] = "WorkerInitFailed";
    ErrorKind2[ErrorKind2["UnixError"] = 41] = "UnixError";
    ErrorKind2[ErrorKind2["NoAsyncSupport"] = 42] = "NoAsyncSupport";
    ErrorKind2[ErrorKind2["NoSyncSupport"] = 43] = "NoSyncSupport";
    ErrorKind2[ErrorKind2["ImportMapError"] = 44] = "ImportMapError";
    ErrorKind2[ErrorKind2["InvalidPath"] = 45] = "InvalidPath";
    ErrorKind2[ErrorKind2["ImportPrefixMissing"] = 46] = "ImportPrefixMissing";
    ErrorKind2[ErrorKind2["UnsupportedFetchScheme"] = 47] = "UnsupportedFetchScheme";
    ErrorKind2[ErrorKind2["TooManyRedirects"] = 48] = "TooManyRedirects";
    ErrorKind2[ErrorKind2["Diagnostic"] = 49] = "Diagnostic";
    ErrorKind2[ErrorKind2["JSError"] = 50] = "JSError";
  })(ErrorKind || (ErrorKind = {}));
  class DenoError extends Error {
    constructor(kind, msg) {
      super(msg);
      this.kind = kind;
    }
  }
  class Permissions {
    async query(d) {
      return new PermissionStatus("granted");
    }
    async revoke(d) {
      return new PermissionStatus("granted");
    }
  }
  const permissions = new Permissions();
  class PermissionStatus {
    constructor(state) {
      this.state = state;
    }
  }
  function run(opt) {
    const [cmd, ...args2] = opt.args;
    const p = cp.spawn(cmd, args2, {
      cwd: opt.cwd,
      env: opt.env
    });
    return ResourceTable.openProcess(p);
  }
  var LinuxSignal;
  (function(LinuxSignal2) {
    LinuxSignal2[LinuxSignal2["SIGHUP"] = 1] = "SIGHUP";
    LinuxSignal2[LinuxSignal2["SIGINT"] = 2] = "SIGINT";
    LinuxSignal2[LinuxSignal2["SIGQUIT"] = 3] = "SIGQUIT";
    LinuxSignal2[LinuxSignal2["SIGILL"] = 4] = "SIGILL";
    LinuxSignal2[LinuxSignal2["SIGTRAP"] = 5] = "SIGTRAP";
    LinuxSignal2[LinuxSignal2["SIGABRT"] = 6] = "SIGABRT";
    LinuxSignal2[LinuxSignal2["SIGBUS"] = 7] = "SIGBUS";
    LinuxSignal2[LinuxSignal2["SIGFPE"] = 8] = "SIGFPE";
    LinuxSignal2[LinuxSignal2["SIGKILL"] = 9] = "SIGKILL";
    LinuxSignal2[LinuxSignal2["SIGUSR1"] = 10] = "SIGUSR1";
    LinuxSignal2[LinuxSignal2["SIGSEGV"] = 11] = "SIGSEGV";
    LinuxSignal2[LinuxSignal2["SIGUSR2"] = 12] = "SIGUSR2";
    LinuxSignal2[LinuxSignal2["SIGPIPE"] = 13] = "SIGPIPE";
    LinuxSignal2[LinuxSignal2["SIGALRM"] = 14] = "SIGALRM";
    LinuxSignal2[LinuxSignal2["SIGTERM"] = 15] = "SIGTERM";
    LinuxSignal2[LinuxSignal2["SIGSTKFLT"] = 16] = "SIGSTKFLT";
    LinuxSignal2[LinuxSignal2["SIGCHLD"] = 17] = "SIGCHLD";
    LinuxSignal2[LinuxSignal2["SIGCONT"] = 18] = "SIGCONT";
    LinuxSignal2[LinuxSignal2["SIGSTOP"] = 19] = "SIGSTOP";
    LinuxSignal2[LinuxSignal2["SIGTSTP"] = 20] = "SIGTSTP";
    LinuxSignal2[LinuxSignal2["SIGTTIN"] = 21] = "SIGTTIN";
    LinuxSignal2[LinuxSignal2["SIGTTOU"] = 22] = "SIGTTOU";
    LinuxSignal2[LinuxSignal2["SIGURG"] = 23] = "SIGURG";
    LinuxSignal2[LinuxSignal2["SIGXCPU"] = 24] = "SIGXCPU";
    LinuxSignal2[LinuxSignal2["SIGXFSZ"] = 25] = "SIGXFSZ";
    LinuxSignal2[LinuxSignal2["SIGVTALRM"] = 26] = "SIGVTALRM";
    LinuxSignal2[LinuxSignal2["SIGPROF"] = 27] = "SIGPROF";
    LinuxSignal2[LinuxSignal2["SIGWINCH"] = 28] = "SIGWINCH";
    LinuxSignal2[LinuxSignal2["SIGIO"] = 29] = "SIGIO";
    LinuxSignal2[LinuxSignal2["SIGPWR"] = 30] = "SIGPWR";
    LinuxSignal2[LinuxSignal2["SIGSYS"] = 31] = "SIGSYS";
  })(LinuxSignal || (LinuxSignal = {}));
  var MacOSSignal;
  (function(MacOSSignal2) {
    MacOSSignal2[MacOSSignal2["SIGHUP"] = 1] = "SIGHUP";
    MacOSSignal2[MacOSSignal2["SIGINT"] = 2] = "SIGINT";
    MacOSSignal2[MacOSSignal2["SIGQUIT"] = 3] = "SIGQUIT";
    MacOSSignal2[MacOSSignal2["SIGILL"] = 4] = "SIGILL";
    MacOSSignal2[MacOSSignal2["SIGTRAP"] = 5] = "SIGTRAP";
    MacOSSignal2[MacOSSignal2["SIGABRT"] = 6] = "SIGABRT";
    MacOSSignal2[MacOSSignal2["SIGEMT"] = 7] = "SIGEMT";
    MacOSSignal2[MacOSSignal2["SIGFPE"] = 8] = "SIGFPE";
    MacOSSignal2[MacOSSignal2["SIGKILL"] = 9] = "SIGKILL";
    MacOSSignal2[MacOSSignal2["SIGBUS"] = 10] = "SIGBUS";
    MacOSSignal2[MacOSSignal2["SIGSEGV"] = 11] = "SIGSEGV";
    MacOSSignal2[MacOSSignal2["SIGSYS"] = 12] = "SIGSYS";
    MacOSSignal2[MacOSSignal2["SIGPIPE"] = 13] = "SIGPIPE";
    MacOSSignal2[MacOSSignal2["SIGALRM"] = 14] = "SIGALRM";
    MacOSSignal2[MacOSSignal2["SIGTERM"] = 15] = "SIGTERM";
    MacOSSignal2[MacOSSignal2["SIGURG"] = 16] = "SIGURG";
    MacOSSignal2[MacOSSignal2["SIGSTOP"] = 17] = "SIGSTOP";
    MacOSSignal2[MacOSSignal2["SIGTSTP"] = 18] = "SIGTSTP";
    MacOSSignal2[MacOSSignal2["SIGCONT"] = 19] = "SIGCONT";
    MacOSSignal2[MacOSSignal2["SIGCHLD"] = 20] = "SIGCHLD";
    MacOSSignal2[MacOSSignal2["SIGTTIN"] = 21] = "SIGTTIN";
    MacOSSignal2[MacOSSignal2["SIGTTOU"] = 22] = "SIGTTOU";
    MacOSSignal2[MacOSSignal2["SIGIO"] = 23] = "SIGIO";
    MacOSSignal2[MacOSSignal2["SIGXCPU"] = 24] = "SIGXCPU";
    MacOSSignal2[MacOSSignal2["SIGXFSZ"] = 25] = "SIGXFSZ";
    MacOSSignal2[MacOSSignal2["SIGVTALRM"] = 26] = "SIGVTALRM";
    MacOSSignal2[MacOSSignal2["SIGPROF"] = 27] = "SIGPROF";
    MacOSSignal2[MacOSSignal2["SIGWINCH"] = 28] = "SIGWINCH";
    MacOSSignal2[MacOSSignal2["SIGINFO"] = 29] = "SIGINFO";
    MacOSSignal2[MacOSSignal2["SIGUSR1"] = 30] = "SIGUSR1";
    MacOSSignal2[MacOSSignal2["SIGUSR2"] = 31] = "SIGUSR2";
  })(MacOSSignal || (MacOSSignal = {}));
  const Signal = os3.platform() === "darwin" ? MacOSSignal : LinuxSignal;
  const customInspect = Symbol("customInspect");
  const build = {
    arch: os3.arch(),
    os: os3.platform()
  };
  const args = [...process.argv];
  require_deno();
})();

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/*
SharedQueue Binary Layout
+-------------------------------+-------------------------------+
|                        NUM_RECORDS (32)                       |
+---------------------------------------------------------------+
|                        NUM_SHIFTED_OFF (32)                   |
+---------------------------------------------------------------+
|                        HEAD (32)                              |
+---------------------------------------------------------------+
|                        OFFSETS (32)                           |
+---------------------------------------------------------------+
|                        RECORD_ENDS (*MAX_RECORDS)           ...
+---------------------------------------------------------------+
|                        RECORDS (*MAX_RECORDS)               ...
+---------------------------------------------------------------+
 */

/* eslint-disable @typescript-eslint/no-use-before-define */

((window) => {
  const MAX_RECORDS = 100;
  const INDEX_NUM_RECORDS = 0;
  const INDEX_NUM_SHIFTED_OFF = 1;
  const INDEX_HEAD = 2;
  const INDEX_OFFSETS = 3;
  const INDEX_RECORDS = INDEX_OFFSETS + 2 * MAX_RECORDS;
  const HEAD_INIT = 4 * INDEX_RECORDS;

  // Available on start due to bindings.
  const core = window.Deno.core;
  const { recv, send } = core;

  let sharedBytes;
  let shared32;

  let asyncHandlers = [];

  let initialized = false;
  let opsCache = {};
  const errorMap = {};

  function maybeInit() {
    if (!initialized) {
      init();
      initialized = true;
    }
  }

  function init() {
    /*     const shared = core.shared;
    assert(shared.byteLength > 0);
    assert(sharedBytes == null);
    assert(shared32 == null);
    sharedBytes = new Uint8Array(shared);
    shared32 = new Int32Array(shared);
    asyncHandlers = [];
    // Callers should not call core.recv, use setAsyncHandler.
    recv(handleAsyncMsgFromRust); */
  }

  function ops() {
    // op id 0 is a special value to retrieve the map of registered ops.
    opsCache = send(0);
    /*     const opsMapBytes = send(0);
    const opsMapJson = String.fromCharCode.apply(null, opsMapBytes);
    opsCache = JSON.parse(opsMapJson); */
    return { ...opsCache };
  }

  function assert(cond) {
    if (!cond) {
      throw Error("assert");
    }
  }

  function reset() {
    maybeInit();
    shared32[INDEX_NUM_RECORDS] = 0;
    shared32[INDEX_NUM_SHIFTED_OFF] = 0;
    shared32[INDEX_HEAD] = HEAD_INIT;
  }

  function head() {
    maybeInit();
    return shared32[INDEX_HEAD];
  }

  function numRecords() {
    return shared32[INDEX_NUM_RECORDS];
  }

  function size() {
    return shared32[INDEX_NUM_RECORDS] - shared32[INDEX_NUM_SHIFTED_OFF];
  }

  function setMeta(index, end, opId) {
    shared32[INDEX_OFFSETS + 2 * index] = end;
    shared32[INDEX_OFFSETS + 2 * index + 1] = opId;
  }

  function getMeta(index) {
    if (index < numRecords()) {
      const buf = shared32[INDEX_OFFSETS + 2 * index];
      const opId = shared32[INDEX_OFFSETS + 2 * index + 1];
      return [opId, buf];
    } else {
      return null;
    }
  }

  function getOffset(index) {
    if (index < numRecords()) {
      if (index == 0) {
        return HEAD_INIT;
      } else {
        const prevEnd = shared32[INDEX_OFFSETS + 2 * (index - 1)];
        return (prevEnd + 3) & ~3;
      }
    } else {
      return null;
    }
  }

  function push(opId, buf) {
    const off = head();
    const end = off + buf.byteLength;
    const alignedEnd = (end + 3) & ~3;
    const index = numRecords();
    if (alignedEnd > shared32.byteLength || index >= MAX_RECORDS) {
      // console.log("shared_queue.js push fail");
      return false;
    }
    setMeta(index, end, opId);
    assert(alignedEnd % 4 === 0);
    assert(end - off == buf.byteLength);
    sharedBytes.set(buf, off);
    shared32[INDEX_NUM_RECORDS] += 1;
    shared32[INDEX_HEAD] = alignedEnd;
    return true;
  }

  /// Returns null if empty.
  function shift() {
    const i = shared32[INDEX_NUM_SHIFTED_OFF];
    if (size() == 0) {
      assert(i == 0);
      return null;
    }

    const off = getOffset(i);
    const [opId, end] = getMeta(i);

    if (size() > 1) {
      shared32[INDEX_NUM_SHIFTED_OFF] += 1;
    } else {
      reset();
    }

    assert(off != null);
    assert(end != null);
    const buf = sharedBytes.subarray(off, end);
    return [opId, buf];
  }

  function setAsyncHandler(opId, cb) {
    maybeInit();
    assert(opId != null);
    asyncHandlers[opId] = cb;
  }

  function handleAsyncMsgFromRust(opId, buf) {
    if (buf) {
      // This is the overflow_response case of deno::JsRuntime::poll().
      asyncHandlers[opId](buf);
    } else {
      while (true) {
        const opIdBuf = shift();
        if (opIdBuf == null) {
          break;
        }
        assert(asyncHandlers[opIdBuf[0]] != null);
        asyncHandlers[opIdBuf[0]](opIdBuf[1]);
      }
    }
  }

  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  function dispatch(opName, control, ...zeroCopy) {
    //if (opName !== "op_apply_source_map") console.log("Dispatch", opName, control);
    const res = send(opsCache[opName], control, ...zeroCopy);
    //if (opName !== "op_apply_source_map") console.log(res);
    return res;
  }

  function registerErrorClass(errorName, className) {
    if (typeof errorMap[errorName] !== "undefined") {
      throw new TypeError(`Error class for "${errorName}" already registered`);
    }
    errorMap[errorName] = className;
  }

  function getErrorClass(errorName) {
    return errorMap[errorName];
  }

  /*   // Returns Uint8Array
  function encodeJson(args) {
    const s = JSON.stringify(args);
    return core.encode(s);
  }

  function decodeJson(ui8) {
    const s = core.decode(ui8);
    return JSON.parse(s);
  } */

  let nextPromiseId = 1;
  const promiseTable = {};

  /*   function processResponse(res) {
    if ("ok" in res) {
      return res.ok;
    } else {
      const ErrorClass = getErrorClass(res.err.className);
      if (!ErrorClass) {
        throw new Error(
          `Unregistered error class: "${res.err.className}"\n  ${res.err.message}\n  Classes of errors returned from ops should be registered via Deno.core.registerErrorClass().`
        );
      }
      throw new ErrorClass(res.err.message);
    }
  } */

  async function jsonOpAsync(opName, args = {}, ...zeroCopy) {
    setAsyncHandler(opsCache[opName], jsonOpAsyncHandler);

    args.promiseId = nextPromiseId++;
    //const argsBuf = encodeJson(args);
    dispatch(opName, args, ...zeroCopy);
    let resolve, reject;
    const promise = new Promise((resolve_, reject_) => {
      resolve = resolve_;
      reject = reject_;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    promiseTable[args.promiseId] = promise;
    //return processResponse(await promise);
    return await promise;
  }

  function jsonOpSync(opName, args = {}, ...zeroCopy) {
    //const argsBuf = encodeJson(args);
    const res = dispatch(opName, args, ...zeroCopy);
    //return processResponse(decodeJson(res));
    return res; //decodeJson(res);
  }

  function jsonOpAsyncHandler(buf) {
    // Json Op.
    const res = buf; //decodeJson(buf);
    const promise = promiseTable[res.promiseId];
    delete promiseTable[res.promiseId];
    promise.resolve(res);
  }

  function resources() {
    return jsonOpSync("op_resources");
  }

  function close(rid) {
    jsonOpSync("op_close", { rid });
  }

  Object.assign(window.Deno.core, {
    jsonOpAsync,
    jsonOpSync,
    setAsyncHandler,
    dispatch: send,
    dispatchByName: dispatch,
    ops,
    close,
    resources,
    registerErrorClass,
    getErrorClass,
    // sharedQueue is private but exposed for testing.
    sharedQueue: {
      MAX_RECORDS,
      head,
      numRecords,
      size,
      push,
      reset,
      shift,
    },
  });
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// The only purpose of this file is to set up "globalThis.__bootstrap" namespace,
// that is used by scripts in this directory to reference exports between
// the files.

// This namespace is removed during runtime bootstrapping process.

globalThis.__bootstrap = globalThis.__bootstrap || {};

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DOMException extends Error {
  #name = "";

  constructor(message = "", name = "Error") {
    super(message);
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
}

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const build = {
    target: "unknown",
    arch: "unknown",
    os: "unknown",
    vendor: "unknown",
    env: undefined,
  };

  function setBuildInfo(target) {
    const [arch, vendor, os, env] = target.split("-", 4);
    build.target = target;
    build.arch = arch;
    build.vendor = vendor;
    build.os = os;
    build.env = env;
    Object.freeze(build);
  }

  window.__bootstrap.build = {
    build,
    setBuildInfo,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  function code(open, close) {
    return {
      open: `\x1b[${open}m`,
      close: `\x1b[${close}m`,
      regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
    };
  }

  function run(str, code) {
    return !globalThis || !globalThis.Deno || globalThis.Deno.noColor
      ? str
      : `${code.open}${str.replace(code.regexp, code.open)}${code.close}`;
  }

  function bold(str) {
    return run(str, code(1, 22));
  }

  function italic(str) {
    return run(str, code(3, 23));
  }

  function yellow(str) {
    return run(str, code(33, 39));
  }

  function cyan(str) {
    return run(str, code(36, 39));
  }

  function red(str) {
    return run(str, code(31, 39));
  }

  function green(str) {
    return run(str, code(32, 39));
  }

  function bgRed(str) {
    return run(str, code(41, 49));
  }

  function white(str) {
    return run(str, code(37, 39));
  }

  function gray(str) {
    return run(str, code(90, 39));
  }

  function magenta(str) {
    return run(str, code(35, 39));
  }

  function dim(str) {
    return run(str, code(2, 22));
  }

  // https://github.com/chalk/ansi-regex/blob/2b56fb0c7a07108e5b54241e8faec160d393aedb/index.js
  const ANSI_PATTERN = new RegExp(
    [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
    ].join("|"),
    "g",
  );

  function stripColor(string) {
    return string.replace(ANSI_PATTERN, "");
  }

  window.__bootstrap.colors = {
    bold,
    italic,
    yellow,
    cyan,
    red,
    green,
    bgRed,
    white,
    gray,
    magenta,
    dim,
    stripColor,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  class NotFound extends Error {
    constructor(msg) {
      super(msg);
      this.name = "NotFound";
    }
  }

  class PermissionDenied extends Error {
    constructor(msg) {
      super(msg);
      this.name = "PermissionDenied";
    }
  }

  class ConnectionRefused extends Error {
    constructor(msg) {
      super(msg);
      this.name = "ConnectionRefused";
    }
  }

  class ConnectionReset extends Error {
    constructor(msg) {
      super(msg);
      this.name = "ConnectionReset";
    }
  }

  class ConnectionAborted extends Error {
    constructor(msg) {
      super(msg);
      this.name = "ConnectionAborted";
    }
  }

  class NotConnected extends Error {
    constructor(msg) {
      super(msg);
      this.name = "NotConnected";
    }
  }

  class AddrInUse extends Error {
    constructor(msg) {
      super(msg);
      this.name = "AddrInUse";
    }
  }

  class AddrNotAvailable extends Error {
    constructor(msg) {
      super(msg);
      this.name = "AddrNotAvailable";
    }
  }

  class BrokenPipe extends Error {
    constructor(msg) {
      super(msg);
      this.name = "BrokenPipe";
    }
  }

  class AlreadyExists extends Error {
    constructor(msg) {
      super(msg);
      this.name = "AlreadyExists";
    }
  }

  class InvalidData extends Error {
    constructor(msg) {
      super(msg);
      this.name = "InvalidData";
    }
  }

  class TimedOut extends Error {
    constructor(msg) {
      super(msg);
      this.name = "TimedOut";
    }
  }

  class Interrupted extends Error {
    constructor(msg) {
      super(msg);
      this.name = "Interrupted";
    }
  }

  class WriteZero extends Error {
    constructor(msg) {
      super(msg);
      this.name = "WriteZero";
    }
  }

  class UnexpectedEof extends Error {
    constructor(msg) {
      super(msg);
      this.name = "UnexpectedEof";
    }
  }

  class BadResource extends Error {
    constructor(msg) {
      super(msg);
      this.name = "BadResource";
    }
  }

  class Http extends Error {
    constructor(msg) {
      super(msg);
      this.name = "Http";
    }
  }

  class Busy extends Error {
    constructor(msg) {
      super(msg);
      this.name = "Busy";
    }
  }

  class NotSupported extends Error {
    constructor(msg) {
      super(msg);
      this.name = "NotSupported";
    }
  }

  const errors = {
    NotFound,
    PermissionDenied,
    ConnectionRefused,
    ConnectionReset,
    ConnectionAborted,
    NotConnected,
    AddrInUse,
    AddrNotAvailable,
    BrokenPipe,
    AlreadyExists,
    InvalidData,
    TimedOut,
    Interrupted,
    WriteZero,
    UnexpectedEof,
    BadResource,
    Http,
    Busy,
    NotSupported,
  };

  window.__bootstrap.errors = {
    errors,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This module follows most of the WHATWG Living Standard for the DOM logic.
// Many parts of the DOM are not implemented in Deno, but the logic for those
// parts still exists.  This means you will observe a lot of strange structures
// and impossible logic branches based on what Deno currently supports.

((window) => {
  const eventData = new WeakMap();

  function requiredArguments(
    name,
    length,
    required,
  ) {
    if (length < required) {
      const errMsg = `${name} requires at least ${required} argument${
        required === 1 ? "" : "s"
      }, but only ${length} present`;
      throw new TypeError(errMsg);
    }
  }

  // accessors for non runtime visible data

  function getDispatched(event) {
    return Boolean(eventData.get(event)?.dispatched);
  }

  function getPath(event) {
    return eventData.get(event)?.path ?? [];
  }

  function getStopImmediatePropagation(event) {
    return Boolean(eventData.get(event)?.stopImmediatePropagation);
  }

  function setCurrentTarget(
    event,
    value,
  ) {
    event.currentTarget = value;
  }

  function setDispatched(event, value) {
    const data = eventData.get(event);
    if (data) {
      data.dispatched = value;
    }
  }

  function setEventPhase(event, value) {
    event.eventPhase = value;
  }

  function setInPassiveListener(event, value) {
    const data = eventData.get(event);
    if (data) {
      data.inPassiveListener = value;
    }
  }

  function setPath(event, value) {
    const data = eventData.get(event);
    if (data) {
      data.path = value;
    }
  }

  function setRelatedTarget(
    event,
    value,
  ) {
    if ("relatedTarget" in event) {
      event.relatedTarget = value;
    }
  }

  function setTarget(event, value) {
    event.target = value;
  }

  function setStopImmediatePropagation(
    event,
    value,
  ) {
    const data = eventData.get(event);
    if (data) {
      data.stopImmediatePropagation = value;
    }
  }

  // Type guards that widen the event type

  function hasRelatedTarget(
    event,
  ) {
    return "relatedTarget" in event;
  }

  function isTrusted() {
    return eventData.get(this).isTrusted;
  }

  class Event {
    #canceledFlag = false;
    #stopPropagationFlag = false;
    #attributes = {};

    constructor(type, eventInitDict = {}) {
      requiredArguments("Event", arguments.length, 1);
      type = String(type);
      this.#attributes = {
        type,
        bubbles: eventInitDict.bubbles ?? false,
        cancelable: eventInitDict.cancelable ?? false,
        composed: eventInitDict.composed ?? false,
        currentTarget: null,
        eventPhase: Event.NONE,
        target: null,
        timeStamp: Date.now(),
      };
      eventData.set(this, {
        dispatched: false,
        inPassiveListener: false,
        isTrusted: false,
        path: [],
        stopImmediatePropagation: false,
      });
      Reflect.defineProperty(this, "isTrusted", {
        enumerable: true,
        get: isTrusted,
      });
    }

    get bubbles() {
      return this.#attributes.bubbles;
    }

    get cancelBubble() {
      return this.#stopPropagationFlag;
    }

    set cancelBubble(value) {
      this.#stopPropagationFlag = value;
    }

    get cancelable() {
      return this.#attributes.cancelable;
    }

    get composed() {
      return this.#attributes.composed;
    }

    get currentTarget() {
      return this.#attributes.currentTarget;
    }

    set currentTarget(value) {
      this.#attributes = {
        type: this.type,
        bubbles: this.bubbles,
        cancelable: this.cancelable,
        composed: this.composed,
        currentTarget: value,
        eventPhase: this.eventPhase,
        target: this.target,
        timeStamp: this.timeStamp,
      };
    }

    get defaultPrevented() {
      return this.#canceledFlag;
    }

    get eventPhase() {
      return this.#attributes.eventPhase;
    }

    set eventPhase(value) {
      this.#attributes = {
        type: this.type,
        bubbles: this.bubbles,
        cancelable: this.cancelable,
        composed: this.composed,
        currentTarget: this.currentTarget,
        eventPhase: value,
        target: this.target,
        timeStamp: this.timeStamp,
      };
    }

    get initialized() {
      return true;
    }

    get target() {
      return this.#attributes.target;
    }

    set target(value) {
      this.#attributes = {
        type: this.type,
        bubbles: this.bubbles,
        cancelable: this.cancelable,
        composed: this.composed,
        currentTarget: this.currentTarget,
        eventPhase: this.eventPhase,
        target: value,
        timeStamp: this.timeStamp,
      };
    }

    get timeStamp() {
      return this.#attributes.timeStamp;
    }

    get type() {
      return this.#attributes.type;
    }

    composedPath() {
      const path = eventData.get(this).path;
      if (path.length === 0) {
        return [];
      }

      if (!this.currentTarget) {
        throw new Error("assertion error");
      }
      const composedPath = [
        {
          item: this.currentTarget,
          itemInShadowTree: false,
          relatedTarget: null,
          rootOfClosedTree: false,
          slotInClosedTree: false,
          target: null,
          touchTargetList: [],
        },
      ];

      let currentTargetIndex = 0;
      let currentTargetHiddenSubtreeLevel = 0;

      for (let index = path.length - 1; index >= 0; index--) {
        const { item, rootOfClosedTree, slotInClosedTree } = path[index];

        if (rootOfClosedTree) {
          currentTargetHiddenSubtreeLevel++;
        }

        if (item === this.currentTarget) {
          currentTargetIndex = index;
          break;
        }

        if (slotInClosedTree) {
          currentTargetHiddenSubtreeLevel--;
        }
      }

      let currentHiddenLevel = currentTargetHiddenSubtreeLevel;
      let maxHiddenLevel = currentTargetHiddenSubtreeLevel;

      for (let i = currentTargetIndex - 1; i >= 0; i--) {
        const { item, rootOfClosedTree, slotInClosedTree } = path[i];

        if (rootOfClosedTree) {
          currentHiddenLevel++;
        }

        if (currentHiddenLevel <= maxHiddenLevel) {
          composedPath.unshift({
            item,
            itemInShadowTree: false,
            relatedTarget: null,
            rootOfClosedTree: false,
            slotInClosedTree: false,
            target: null,
            touchTargetList: [],
          });
        }

        if (slotInClosedTree) {
          currentHiddenLevel--;

          if (currentHiddenLevel < maxHiddenLevel) {
            maxHiddenLevel = currentHiddenLevel;
          }
        }
      }

      currentHiddenLevel = currentTargetHiddenSubtreeLevel;
      maxHiddenLevel = currentTargetHiddenSubtreeLevel;

      for (let index = currentTargetIndex + 1; index < path.length; index++) {
        const { item, rootOfClosedTree, slotInClosedTree } = path[index];

        if (slotInClosedTree) {
          currentHiddenLevel++;
        }

        if (currentHiddenLevel <= maxHiddenLevel) {
          composedPath.push({
            item,
            itemInShadowTree: false,
            relatedTarget: null,
            rootOfClosedTree: false,
            slotInClosedTree: false,
            target: null,
            touchTargetList: [],
          });
        }

        if (rootOfClosedTree) {
          currentHiddenLevel--;

          if (currentHiddenLevel < maxHiddenLevel) {
            maxHiddenLevel = currentHiddenLevel;
          }
        }
      }
      return composedPath.map((p) => p.item);
    }

    preventDefault() {
      if (this.cancelable && !eventData.get(this).inPassiveListener) {
        this.#canceledFlag = true;
      }
    }

    stopPropagation() {
      this.#stopPropagationFlag = true;
    }

    stopImmediatePropagation() {
      this.#stopPropagationFlag = true;
      eventData.get(this).stopImmediatePropagation = true;
    }

    get NONE() {
      return Event.NONE;
    }

    get CAPTURING_PHASE() {
      return Event.CAPTURING_PHASE;
    }

    get AT_TARGET() {
      return Event.AT_TARGET;
    }

    get BUBBLING_PHASE() {
      return Event.BUBBLING_PHASE;
    }

    static get NONE() {
      return 0;
    }

    static get CAPTURING_PHASE() {
      return 1;
    }

    static get AT_TARGET() {
      return 2;
    }

    static get BUBBLING_PHASE() {
      return 3;
    }
  }

  function defineEnumerableProps(
    Ctor,
    props,
  ) {
    for (const prop of props) {
      Reflect.defineProperty(Ctor.prototype, prop, { enumerable: true });
    }
  }

  defineEnumerableProps(Event, [
    "bubbles",
    "cancelable",
    "composed",
    "currentTarget",
    "defaultPrevented",
    "eventPhase",
    "target",
    "timeStamp",
    "type",
  ]);

  // This is currently the only node type we are using, so instead of implementing
  // the whole of the Node interface at the moment, this just gives us the one
  // value to power the standards based logic
  const DOCUMENT_FRAGMENT_NODE = 11;

  // DOM Logic Helper functions and type guards

  /** Get the parent node, for event targets that have a parent.
   *
   * Ref: https://dom.spec.whatwg.org/#get-the-parent */
  function getParent(eventTarget) {
    return isNode(eventTarget) ? eventTarget.parentNode : null;
  }

  function getRoot(eventTarget) {
    return isNode(eventTarget)
      ? eventTarget.getRootNode({ composed: true })
      : null;
  }

  function isNode(
    eventTarget,
  ) {
    return Boolean(eventTarget && "nodeType" in eventTarget);
  }

  // https://dom.spec.whatwg.org/#concept-shadow-including-inclusive-ancestor
  function isShadowInclusiveAncestor(
    ancestor,
    node,
  ) {
    while (isNode(node)) {
      if (node === ancestor) {
        return true;
      }

      if (isShadowRoot(node)) {
        node = node && getHost(node);
      } else {
        node = getParent(node);
      }
    }

    return false;
  }

  function isShadowRoot(nodeImpl) {
    return Boolean(
      nodeImpl &&
        isNode(nodeImpl) &&
        nodeImpl.nodeType === DOCUMENT_FRAGMENT_NODE &&
        getHost(nodeImpl) != null,
    );
  }

  function isSlotable(
    nodeImpl,
  ) {
    return Boolean(isNode(nodeImpl) && "assignedSlot" in nodeImpl);
  }

  // DOM Logic functions

  /** Append a path item to an event's path.
   *
   * Ref: https://dom.spec.whatwg.org/#concept-event-path-append
   */
  function appendToEventPath(
    eventImpl,
    target,
    targetOverride,
    relatedTarget,
    touchTargets,
    slotInClosedTree,
  ) {
    const itemInShadowTree = isNode(target) && isShadowRoot(getRoot(target));
    const rootOfClosedTree = isShadowRoot(target) &&
      getMode(target) === "closed";

    getPath(eventImpl).push({
      item: target,
      itemInShadowTree,
      target: targetOverride,
      relatedTarget,
      touchTargetList: touchTargets,
      rootOfClosedTree,
      slotInClosedTree,
    });
  }

  function dispatch(
    targetImpl,
    eventImpl,
    targetOverride,
  ) {
    let clearTargets = false;
    let activationTarget = null;

    setDispatched(eventImpl, true);

    targetOverride = targetOverride ?? targetImpl;
    const eventRelatedTarget = hasRelatedTarget(eventImpl)
      ? eventImpl.relatedTarget
      : null;
    let relatedTarget = retarget(eventRelatedTarget, targetImpl);

    if (targetImpl !== relatedTarget || targetImpl === eventRelatedTarget) {
      const touchTargets = [];

      appendToEventPath(
        eventImpl,
        targetImpl,
        targetOverride,
        relatedTarget,
        touchTargets,
        false,
      );

      const isActivationEvent = eventImpl.type === "click";

      if (isActivationEvent && getHasActivationBehavior(targetImpl)) {
        activationTarget = targetImpl;
      }

      let slotInClosedTree = false;
      let slotable = isSlotable(targetImpl) && getAssignedSlot(targetImpl)
        ? targetImpl
        : null;
      let parent = getParent(targetImpl);

      // Populate event path
      // https://dom.spec.whatwg.org/#event-path
      while (parent !== null) {
        if (slotable !== null) {
          slotable = null;

          const parentRoot = getRoot(parent);
          if (
            isShadowRoot(parentRoot) &&
            parentRoot &&
            getMode(parentRoot) === "closed"
          ) {
            slotInClosedTree = true;
          }
        }

        relatedTarget = retarget(eventRelatedTarget, parent);

        if (
          isNode(parent) &&
          isShadowInclusiveAncestor(getRoot(targetImpl), parent)
        ) {
          appendToEventPath(
            eventImpl,
            parent,
            null,
            relatedTarget,
            touchTargets,
            slotInClosedTree,
          );
        } else if (parent === relatedTarget) {
          parent = null;
        } else {
          targetImpl = parent;

          if (
            isActivationEvent &&
            activationTarget === null &&
            getHasActivationBehavior(targetImpl)
          ) {
            activationTarget = targetImpl;
          }

          appendToEventPath(
            eventImpl,
            parent,
            targetImpl,
            relatedTarget,
            touchTargets,
            slotInClosedTree,
          );
        }

        if (parent !== null) {
          parent = getParent(parent);
        }

        slotInClosedTree = false;
      }

      let clearTargetsTupleIndex = -1;
      const path = getPath(eventImpl);
      for (
        let i = path.length - 1;
        i >= 0 && clearTargetsTupleIndex === -1;
        i--
      ) {
        if (path[i].target !== null) {
          clearTargetsTupleIndex = i;
        }
      }
      const clearTargetsTuple = path[clearTargetsTupleIndex];

      clearTargets = (isNode(clearTargetsTuple.target) &&
        isShadowRoot(getRoot(clearTargetsTuple.target))) ||
        (isNode(clearTargetsTuple.relatedTarget) &&
          isShadowRoot(getRoot(clearTargetsTuple.relatedTarget)));

      setEventPhase(eventImpl, Event.CAPTURING_PHASE);

      for (let i = path.length - 1; i >= 0; --i) {
        const tuple = path[i];

        if (tuple.target === null) {
          invokeEventListeners(tuple, eventImpl);
        }
      }

      for (let i = 0; i < path.length; i++) {
        const tuple = path[i];

        if (tuple.target !== null) {
          setEventPhase(eventImpl, Event.AT_TARGET);
        } else {
          setEventPhase(eventImpl, Event.BUBBLING_PHASE);
        }

        if (
          (eventImpl.eventPhase === Event.BUBBLING_PHASE &&
            eventImpl.bubbles) ||
          eventImpl.eventPhase === Event.AT_TARGET
        ) {
          invokeEventListeners(tuple, eventImpl);
        }
      }
    }

    setEventPhase(eventImpl, Event.NONE);
    setCurrentTarget(eventImpl, null);
    setPath(eventImpl, []);
    setDispatched(eventImpl, false);
    eventImpl.cancelBubble = false;
    setStopImmediatePropagation(eventImpl, false);

    if (clearTargets) {
      setTarget(eventImpl, null);
      setRelatedTarget(eventImpl, null);
    }

    // TODO: invoke activation targets if HTML nodes will be implemented
    // if (activationTarget !== null) {
    //   if (!eventImpl.defaultPrevented) {
    //     activationTarget._activationBehavior();
    //   }
    // }

    return !eventImpl.defaultPrevented;
  }

  /** Inner invoking of the event listeners where the resolved listeners are
   * called.
   *
   * Ref: https://dom.spec.whatwg.org/#concept-event-listener-inner-invoke */
  function innerInvokeEventListeners(
    eventImpl,
    targetListeners,
  ) {
    let found = false;

    const { type } = eventImpl;

    if (!targetListeners || !targetListeners[type]) {
      return found;
    }

    // Copy event listeners before iterating since the list can be modified during the iteration.
    const handlers = targetListeners[type].slice();

    for (let i = 0; i < handlers.length; i++) {
      const listener = handlers[i];

      let capture, once, passive;
      if (typeof listener.options === "boolean") {
        capture = listener.options;
        once = false;
        passive = false;
      } else {
        capture = listener.options.capture;
        once = listener.options.once;
        passive = listener.options.passive;
      }

      // Check if the event listener has been removed since the listeners has been cloned.
      if (!targetListeners[type].includes(listener)) {
        continue;
      }

      found = true;

      if (
        (eventImpl.eventPhase === Event.CAPTURING_PHASE && !capture) ||
        (eventImpl.eventPhase === Event.BUBBLING_PHASE && capture)
      ) {
        continue;
      }

      if (once) {
        targetListeners[type].splice(
          targetListeners[type].indexOf(listener),
          1,
        );
      }

      if (passive) {
        setInPassiveListener(eventImpl, true);
      }

      if (typeof listener.callback === "object") {
        if (typeof listener.callback.handleEvent === "function") {
          listener.callback.handleEvent(eventImpl);
        }
      } else {
        listener.callback.call(eventImpl.currentTarget, eventImpl);
      }

      setInPassiveListener(eventImpl, false);

      if (getStopImmediatePropagation(eventImpl)) {
        return found;
      }
    }

    return found;
  }

  /** Invokes the listeners on a given event path with the supplied event.
   *
   * Ref: https://dom.spec.whatwg.org/#concept-event-listener-invoke */
  function invokeEventListeners(tuple, eventImpl) {
    const path = getPath(eventImpl);
    const tupleIndex = path.indexOf(tuple);
    for (let i = tupleIndex; i >= 0; i--) {
      const t = path[i];
      if (t.target) {
        setTarget(eventImpl, t.target);
        break;
      }
    }

    setRelatedTarget(eventImpl, tuple.relatedTarget);

    if (eventImpl.cancelBubble) {
      return;
    }

    setCurrentTarget(eventImpl, tuple.item);

    innerInvokeEventListeners(eventImpl, getListeners(tuple.item));
  }

  function normalizeAddEventHandlerOptions(
    options,
  ) {
    if (typeof options === "boolean" || typeof options === "undefined") {
      return {
        capture: Boolean(options),
        once: false,
        passive: false,
      };
    } else {
      return options;
    }
  }

  function normalizeEventHandlerOptions(
    options,
  ) {
    if (typeof options === "boolean" || typeof options === "undefined") {
      return {
        capture: Boolean(options),
      };
    } else {
      return options;
    }
  }

  /** Retarget the target following the spec logic.
   *
   * Ref: https://dom.spec.whatwg.org/#retarget */
  function retarget(a, b) {
    while (true) {
      if (!isNode(a)) {
        return a;
      }

      const aRoot = a.getRootNode();

      if (aRoot) {
        if (
          !isShadowRoot(aRoot) ||
          (isNode(b) && isShadowInclusiveAncestor(aRoot, b))
        ) {
          return a;
        }

        a = getHost(aRoot);
      }
    }
  }

  // Accessors for non-public data

  const eventTargetData = new WeakMap();

  function setEventTargetData(value) {
    eventTargetData.set(value, getDefaultTargetData());
  }

  function getAssignedSlot(target) {
    return Boolean(eventTargetData.get(target)?.assignedSlot);
  }

  function getHasActivationBehavior(target) {
    return Boolean(
      eventTargetData.get(target)?.hasActivationBehavior,
    );
  }

  function getHost(target) {
    return eventTargetData.get(target)?.host ?? null;
  }

  function getListeners(target) {
    return eventTargetData.get(target)?.listeners ?? {};
  }

  function getMode(target) {
    return eventTargetData.get(target)?.mode ?? null;
  }

  function getDefaultTargetData() {
    return {
      assignedSlot: false,
      hasActivationBehavior: false,
      host: null,
      listeners: Object.create(null),
      mode: "",
    };
  }

  class EventTarget {
    constructor() {
      eventTargetData.set(this, getDefaultTargetData());
    }

    addEventListener(
      type,
      callback,
      options,
    ) {
      requiredArguments("EventTarget.addEventListener", arguments.length, 2);
      if (callback === null) {
        return;
      }

      options = normalizeAddEventHandlerOptions(options);
      const { listeners } = eventTargetData.get(this ?? globalThis);

      if (!(type in listeners)) {
        listeners[type] = [];
      }

      for (const listener of listeners[type]) {
        if (
          ((typeof listener.options === "boolean" &&
            listener.options === options.capture) ||
            (typeof listener.options === "object" &&
              listener.options.capture === options.capture)) &&
          listener.callback === callback
        ) {
          return;
        }
      }

      listeners[type].push({ callback, options });
    }

    removeEventListener(
      type,
      callback,
      options,
    ) {
      requiredArguments("EventTarget.removeEventListener", arguments.length, 2);

      const listeners = eventTargetData.get(this ?? globalThis).listeners;
      if (callback !== null && type in listeners) {
        listeners[type] = listeners[type].filter(
          (listener) => listener.callback !== callback,
        );
      } else if (callback === null || !listeners[type]) {
        return;
      }

      options = normalizeEventHandlerOptions(options);

      for (let i = 0; i < listeners[type].length; ++i) {
        const listener = listeners[type][i];
        if (
          ((typeof listener.options === "boolean" &&
            listener.options === options.capture) ||
            (typeof listener.options === "object" &&
              listener.options.capture === options.capture)) &&
          listener.callback === callback
        ) {
          listeners[type].splice(i, 1);
          break;
        }
      }
    }

    dispatchEvent(event) {
      requiredArguments("EventTarget.dispatchEvent", arguments.length, 1);
      const self = this ?? globalThis;

      const listeners = eventTargetData.get(self).listeners;
      if (!(event.type in listeners)) {
        return true;
      }

      if (getDispatched(event)) {
        throw new DOMException("Invalid event state.", "InvalidStateError");
      }

      if (event.eventPhase !== Event.NONE) {
        throw new DOMException("Invalid event state.", "InvalidStateError");
      }

      return dispatch(self, event);
    }

    get [Symbol.toStringTag]() {
      return "EventTarget";
    }

    getParent(_event) {
      return null;
    }
  }

  defineEnumerableProps(EventTarget, [
    "addEventListener",
    "removeEventListener",
    "dispatchEvent",
  ]);

  class ErrorEvent extends Event {
    #message = "";
    #filename = "";
    #lineno = "";
    #colno = "";
    #error = "";

    get message() {
      return this.#message;
    }
    get filename() {
      return this.#filename;
    }
    get lineno() {
      return this.#lineno;
    }
    get colno() {
      return this.#colno;
    }
    get error() {
      return this.#error;
    }

    constructor(
      type,
      {
        bubbles,
        cancelable,
        composed,
        message = "",
        filename = "",
        lineno = 0,
        colno = 0,
        error = null,
      } = {},
    ) {
      super(type, {
        bubbles: bubbles,
        cancelable: cancelable,
        composed: composed,
      });

      this.#message = message;
      this.#filename = filename;
      this.#lineno = lineno;
      this.#colno = colno;
      this.#error = error;
    }

    get [Symbol.toStringTag]() {
      return "ErrorEvent";
    }
  }

  defineEnumerableProps(ErrorEvent, [
    "message",
    "filename",
    "lineno",
    "colno",
    "error",
  ]);

  class CloseEvent extends Event {
    #wasClean = "";
    #code = "";
    #reason = "";

    get wasClean() {
      return this.#wasClean;
    }
    get code() {
      return this.#code;
    }
    get reason() {
      return this.#reason;
    }

    constructor(type, {
      bubbles,
      cancelable,
      composed,
      wasClean = false,
      code = 0,
      reason = "",
    } = {}) {
      super(type, {
        bubbles: bubbles,
        cancelable: cancelable,
        composed: composed,
      });

      this.#wasClean = wasClean;
      this.#code = code;
      this.#reason = reason;
    }
  }

  class MessageEvent extends Event {
    constructor(type, eventInitDict) {
      super(type, {
        bubbles: eventInitDict?.bubbles ?? false,
        cancelable: eventInitDict?.cancelable ?? false,
        composed: eventInitDict?.composed ?? false,
      });

      this.data = eventInitDict?.data ?? null;
      this.origin = eventInitDict?.origin ?? "";
      this.lastEventId = eventInitDict?.lastEventId ?? "";
    }
  }

  class CustomEvent extends Event {
    #detail = null;

    constructor(type, eventInitDict = {}) {
      super(type, eventInitDict);
      requiredArguments("CustomEvent", arguments.length, 1);
      const { detail } = eventInitDict;
      this.#detail = detail;
    }

    get detail() {
      return this.#detail;
    }

    get [Symbol.toStringTag]() {
      return "CustomEvent";
    }
  }

  Reflect.defineProperty(CustomEvent.prototype, "detail", {
    enumerable: true,
  });

  // ProgressEvent could also be used in other DOM progress event emits.
  // Current use is for FileReader.
  class ProgressEvent extends Event {
    constructor(type, eventInitDict = {}) {
      super(type, eventInitDict);

      this.lengthComputable = eventInitDict?.lengthComputable ?? false;
      this.loaded = eventInitDict?.loaded ?? 0;
      this.total = eventInitDict?.total ?? 0;
    }
  }

  window.Event = Event;
  window.EventTarget = EventTarget;
  window.ErrorEvent = ErrorEvent;
  window.CloseEvent = CloseEvent;
  window.MessageEvent = MessageEvent;
  window.CustomEvent = CustomEvent;
  window.ProgressEvent = ProgressEvent;
  window.dispatchEvent = EventTarget.prototype.dispatchEvent;
  window.addEventListener = EventTarget.prototype.addEventListener;
  window.removeEventListener = EventTarget.prototype.removeEventListener;
  window.__bootstrap = (window.__bootstrap || {});
  window.__bootstrap.eventTarget = {
    setEventTargetData,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  function requiredArguments(
    name,
    length,
    required,
  ) {
    if (length < required) {
      const errMsg = `${name} requires at least ${required} argument${
        required === 1 ? "" : "s"
      }, but only ${length} present`;
      throw new TypeError(errMsg);
    }
  }

  window.__bootstrap.fetchUtil = {
    requiredArguments,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const internalSymbol = Symbol("Deno.internal");

  // The object where all the internal fields for testing will be living.
  const internalObject = {};

  // Register a field to internalObject for test access,
  // through Deno[Deno.internal][name].
  function exposeForTest(name, value) {
    Object.defineProperty(internalObject, name, {
      value,
      enumerable: false,
    });
  }

  window.__bootstrap.internals = {
    internalSymbol,
    internalObject,
    exposeForTest,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const version = {
    deno: "",
    v8: "",
    typescript: "",
  };

  function setVersions(
    denoVersion,
    v8Version,
    tsVersion,
  ) {
    version.deno = denoVersion;
    version.v8 = v8Version;
    version.typescript = tsVersion;

    Object.freeze(version);
  }

  window.__bootstrap.version = {
    version,
    setVersions,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const illegalConstructorKey = Symbol("illegalConstructorKey");

  function requiredArguments(
    name,
    length,
    required,
  ) {
    if (length < required) {
      const errMsg = `${name} requires at least ${required} argument${
        required === 1 ? "" : "s"
      }, but only ${length} present`;
      throw new TypeError(errMsg);
    }
  }

  const objectCloneMemo = new WeakMap();

  function cloneArrayBuffer(
    srcBuffer,
    srcByteOffset,
    srcLength,
    _cloneConstructor,
  ) {
    // this function fudges the return type but SharedArrayBuffer is disabled for a while anyway
    return srcBuffer.slice(
      srcByteOffset,
      srcByteOffset + srcLength,
    );
  }

  /** Clone a value in a similar way to structured cloning.  It is similar to a
 * StructureDeserialize(StructuredSerialize(...)). */
  function cloneValue(value) {
    switch (typeof value) {
      case "number":
      case "string":
      case "boolean":
      case "undefined":
      case "bigint":
        return value;
      case "object": {
        if (objectCloneMemo.has(value)) {
          return objectCloneMemo.get(value);
        }
        if (value === null) {
          return value;
        }
        if (value instanceof Date) {
          return new Date(value.valueOf());
        }
        if (value instanceof RegExp) {
          return new RegExp(value);
        }
        if (value instanceof SharedArrayBuffer) {
          return value;
        }
        if (value instanceof ArrayBuffer) {
          const cloned = cloneArrayBuffer(
            value,
            0,
            value.byteLength,
            ArrayBuffer,
          );
          objectCloneMemo.set(value, cloned);
          return cloned;
        }
        if (ArrayBuffer.isView(value)) {
          const clonedBuffer = cloneValue(value.buffer);
          // Use DataViewConstructor type purely for type-checking, can be a
          // DataView or TypedArray.  They use the same constructor signature,
          // only DataView has a length in bytes and TypedArrays use a length in
          // terms of elements, so we adjust for that.
          let length;
          if (value instanceof DataView) {
            length = value.byteLength;
          } else {
            length = value.length;
          }
          return new (value.constructor)(
            clonedBuffer,
            value.byteOffset,
            length,
          );
        }
        if (value instanceof Map) {
          const clonedMap = new Map();
          objectCloneMemo.set(value, clonedMap);
          value.forEach((v, k) => clonedMap.set(k, cloneValue(v)));
          return clonedMap;
        }
        if (value instanceof Set) {
          const clonedSet = new Map();
          objectCloneMemo.set(value, clonedSet);
          value.forEach((v, k) => clonedSet.set(k, cloneValue(v)));
          return clonedSet;
        }

        const clonedObj = {};
        objectCloneMemo.set(value, clonedObj);
        const sourceKeys = Object.getOwnPropertyNames(value);
        for (const key of sourceKeys) {
          clonedObj[key] = cloneValue(value[key]);
        }
        return clonedObj;
      }
      case "symbol":
      case "function":
      default:
        throw new DOMException("Uncloneable value in stream", "DataCloneError");
    }
  }

  window.__bootstrap.webUtil = {
    illegalConstructorKey,
    requiredArguments,
    cloneValue,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const add = Symbol("add");
  const signalAbort = Symbol("signalAbort");
  const remove = Symbol("remove");

  class AbortSignal extends EventTarget {
    #aborted = false;
    #abortAlgorithms = new Set();

    [add](algorithm) {
      this.#abortAlgorithms.add(algorithm);
    }

    [signalAbort]() {
      if (this.#aborted) {
        return;
      }
      this.#aborted = true;
      for (const algorithm of this.#abortAlgorithms) {
        algorithm();
      }
      this.#abortAlgorithms.clear();
      this.dispatchEvent(new Event("abort"));
    }

    [remove](algorithm) {
      this.#abortAlgorithms.delete(algorithm);
    }

    constructor() {
      super();
      this.onabort = null;
      this.addEventListener("abort", (evt) => {
        const { onabort } = this;
        if (typeof onabort === "function") {
          onabort.call(this, evt);
        }
      });
    }

    get aborted() {
      return Boolean(this.#aborted);
    }

    get [Symbol.toStringTag]() {
      return "AbortSignal";
    }
  }

  class AbortController {
    #signal = new AbortSignal();

    get signal() {
      return this.#signal;
    }

    abort() {
      this.#signal[signalAbort]();
    }

    get [Symbol.toStringTag]() {
      return "AbortController";
    }
  }

  window.AbortSignal = AbortSignal;
  window.AbortController = AbortController;
  window.__bootstrap = window.__bootstrap || {};
  window.__bootstrap.abortSignal = {
    add,
    signalAbort,
    remove,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const exposeForTest = window.__bootstrap.internals.exposeForTest;
  const colors = window.__bootstrap.colors;

  function isInvalidDate(x) {
    return isNaN(x.getTime());
  }

  function hasOwnProperty(obj, v) {
    if (obj == null) {
      return false;
    }
    return Object.prototype.hasOwnProperty.call(obj, v);
  }

  // Copyright Joyent, Inc. and other Node contributors. MIT license.
  // Forked from Node's lib/internal/cli_table.js

  function isTypedArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }

  const tableChars = {
    middleMiddle: "─",
    rowMiddle: "┼",
    topRight: "┐",
    topLeft: "┌",
    leftMiddle: "├",
    topMiddle: "┬",
    bottomRight: "┘",
    bottomLeft: "└",
    bottomMiddle: "┴",
    rightMiddle: "┤",
    left: "│ ",
    right: " │",
    middle: " │ ",
  };

  function isFullWidthCodePoint(code) {
    // Code points are partially derived from:
    // http://www.unicode.org/Public/UNIDATA/EastAsianWidth.txt
    return (
      code >= 0x1100 &&
      (code <= 0x115f || // Hangul Jamo
        code === 0x2329 || // LEFT-POINTING ANGLE BRACKET
        code === 0x232a || // RIGHT-POINTING ANGLE BRACKET
        // CJK Radicals Supplement .. Enclosed CJK Letters and Months
        (code >= 0x2e80 && code <= 0x3247 && code !== 0x303f) ||
        // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
        (code >= 0x3250 && code <= 0x4dbf) ||
        // CJK Unified Ideographs .. Yi Radicals
        (code >= 0x4e00 && code <= 0xa4c6) ||
        // Hangul Jamo Extended-A
        (code >= 0xa960 && code <= 0xa97c) ||
        // Hangul Syllables
        (code >= 0xac00 && code <= 0xd7a3) ||
        // CJK Compatibility Ideographs
        (code >= 0xf900 && code <= 0xfaff) ||
        // Vertical Forms
        (code >= 0xfe10 && code <= 0xfe19) ||
        // CJK Compatibility Forms .. Small Form Variants
        (code >= 0xfe30 && code <= 0xfe6b) ||
        // Halfwidth and Fullwidth Forms
        (code >= 0xff01 && code <= 0xff60) ||
        (code >= 0xffe0 && code <= 0xffe6) ||
        // Kana Supplement
        (code >= 0x1b000 && code <= 0x1b001) ||
        // Enclosed Ideographic Supplement
        (code >= 0x1f200 && code <= 0x1f251) ||
        // Miscellaneous Symbols and Pictographs 0x1f300 - 0x1f5ff
        // Emoticons 0x1f600 - 0x1f64f
        (code >= 0x1f300 && code <= 0x1f64f) ||
        // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
        (code >= 0x20000 && code <= 0x3fffd))
    );
  }

  function getStringWidth(str) {
    str = colors.stripColor(str).normalize("NFC");
    let width = 0;

    for (const ch of str) {
      width += isFullWidthCodePoint(ch.codePointAt(0)) ? 2 : 1;
    }

    return width;
  }

  function renderRow(row, columnWidths) {
    let out = tableChars.left;
    for (let i = 0; i < row.length; i++) {
      const cell = row[i];
      const len = getStringWidth(cell);
      const needed = (columnWidths[i] - len) / 2;
      // round(needed) + ceil(needed) will always add up to the amount
      // of spaces we need while also left justifying the output.
      out += `${" ".repeat(needed)}${cell}${" ".repeat(Math.ceil(needed))}`;
      if (i !== row.length - 1) {
        out += tableChars.middle;
      }
    }
    out += tableChars.right;
    return out;
  }

  function cliTable(head, columns) {
    const rows = [];
    const columnWidths = head.map((h) => getStringWidth(h));
    const longestColumn = columns.reduce(
      (n, a) => Math.max(n, a.length),
      0,
    );

    for (let i = 0; i < head.length; i++) {
      const column = columns[i];
      for (let j = 0; j < longestColumn; j++) {
        if (rows[j] === undefined) {
          rows[j] = [];
        }
        const value = (rows[j][i] = hasOwnProperty(column, j) ? column[j] : "");
        const width = columnWidths[i] || 0;
        const counted = getStringWidth(value);
        columnWidths[i] = Math.max(width, counted);
      }
    }

    const divider = columnWidths.map((i) =>
      tableChars.middleMiddle.repeat(i + 2)
    );

    let result = `${tableChars.topLeft}${divider.join(tableChars.topMiddle)}` +
      `${tableChars.topRight}\n${renderRow(head, columnWidths)}\n` +
      `${tableChars.leftMiddle}${divider.join(tableChars.rowMiddle)}` +
      `${tableChars.rightMiddle}\n`;

    for (const row of rows) {
      result += `${renderRow(row, columnWidths)}\n`;
    }

    result +=
      `${tableChars.bottomLeft}${divider.join(tableChars.bottomMiddle)}` +
      tableChars.bottomRight;

    return result;
  }
  /* End of forked part */

  const DEFAULT_INSPECT_OPTIONS = {
    depth: 4,
    indentLevel: 0,
    sorted: false,
    trailingComma: false,
    compact: true,
    iterableLimit: 100,
    showProxy: false,
    colors: false,
  };

  const DEFAULT_INDENT = "  "; // Default indent string

  const LINE_BREAKING_LENGTH = 80;
  const MIN_GROUP_LENGTH = 6;
  const STR_ABBREVIATE_SIZE = 100;

  const PROMISE_STRING_BASE_LENGTH = 12;

  class CSI {
    static kClear = "\x1b[1;1H";
    static kClearScreenDown = "\x1b[0J";
  }

  /* eslint-disable @typescript-eslint/no-use-before-define */

  function getClassInstanceName(instance) {
    if (typeof instance != "object") {
      return "";
    }
    const constructor = instance?.constructor;
    if (typeof constructor == "function") {
      return constructor.name ?? "";
    }
    return "";
  }

  function maybeColor(fn, inspectOptions) {
    return inspectOptions.colors ? fn : (s) => s;
  }

  function inspectFunction(value, _ctx) {
    if (customInspect in value && typeof value[customInspect] === "function") {
      try {
        return String(value[customInspect]());
      } catch {}
    }
    // Might be Function/AsyncFunction/GeneratorFunction
    const cstrName = Object.getPrototypeOf(value).constructor.name;
    if (value.name && value.name !== "anonymous") {
      // from MDN spec
      return `[${cstrName}: ${value.name}]`;
    }
    return `[${cstrName}]`;
  }

  function inspectIterable(
    value,
    ctx,
    level,
    options,
    inspectOptions,
  ) {
    const cyan = maybeColor(colors.cyan, inspectOptions);
    if (level >= inspectOptions.depth) {
      return cyan(`[${options.typeName}]`);
    }
    ctx.add(value);

    const entries = [];

    const iter = value.entries();
    let entriesLength = 0;
    const next = () => {
      return iter.next();
    };
    for (const el of iter) {
      if (entriesLength < inspectOptions.iterableLimit) {
        entries.push(
          options.entryHandler(
            el,
            ctx,
            level + 1,
            inspectOptions,
            next.bind(iter),
          ),
        );
      }
      entriesLength++;
    }
    ctx.delete(value);

    if (options.sort) {
      entries.sort();
    }

    if (entriesLength > inspectOptions.iterableLimit) {
      const nmore = entriesLength - inspectOptions.iterableLimit;
      entries.push(`... ${nmore} more items`);
    }

    const iPrefix = `${options.displayName ? options.displayName + " " : ""}`;

    const initIndentation = `\n${DEFAULT_INDENT.repeat(level + 1)}`;
    const entryIndentation = `,\n${DEFAULT_INDENT.repeat(level + 1)}`;
    const closingIndentation = `${inspectOptions.trailingComma ? "," : ""}\n${
      DEFAULT_INDENT.repeat(level)
    }`;

    let iContent;
    if (options.group && entries.length > MIN_GROUP_LENGTH) {
      const groups = groupEntries(entries, level, value);
      iContent = `${initIndentation}${
        groups.join(entryIndentation)
      }${closingIndentation}`;
    } else {
      iContent = entries.length === 0 ? "" : ` ${entries.join(", ")} `;
      if (
        colors.stripColor(iContent).length > LINE_BREAKING_LENGTH ||
        !inspectOptions.compact
      ) {
        iContent = `${initIndentation}${
          entries.join(entryIndentation)
        }${closingIndentation}`;
      }
    }

    return `${iPrefix}${options.delims[0]}${iContent}${options.delims[1]}`;
  }

  // Ported from Node.js
  // Copyright Node.js contributors. All rights reserved.
  function groupEntries(
    entries,
    level,
    value,
    iterableLimit = 100,
  ) {
    let totalLength = 0;
    let maxLength = 0;
    let entriesLength = entries.length;
    if (iterableLimit < entriesLength) {
      // This makes sure the "... n more items" part is not taken into account.
      entriesLength--;
    }
    const separatorSpace = 2; // Add 1 for the space and 1 for the separator.
    const dataLen = new Array(entriesLength);
    // Calculate the total length of all output entries and the individual max
    // entries length of all output entries.
    // IN PROGRESS: Colors are being taken into account.
    for (let i = 0; i < entriesLength; i++) {
      // Taking colors into account: removing the ANSI color
      // codes from the string before measuring its length
      const len = colors.stripColor(entries[i]).length;
      dataLen[i] = len;
      totalLength += len + separatorSpace;
      if (maxLength < len) maxLength = len;
    }
    // Add two to `maxLength` as we add a single whitespace character plus a comma
    // in-between two entries.
    const actualMax = maxLength + separatorSpace;
    // Check if at least three entries fit next to each other and prevent grouping
    // of arrays that contains entries of very different length (i.e., if a single
    // entry is longer than 1/5 of all other entries combined). Otherwise the
    // space in-between small entries would be enormous.
    if (
      actualMax * 3 + (level + 1) < LINE_BREAKING_LENGTH &&
      (totalLength / actualMax > 5 || maxLength <= 6)
    ) {
      const approxCharHeights = 2.5;
      const averageBias = Math.sqrt(actualMax - totalLength / entries.length);
      const biasedMax = Math.max(actualMax - 3 - averageBias, 1);
      // Dynamically check how many columns seem possible.
      const columns = Math.min(
        // Ideally a square should be drawn. We expect a character to be about 2.5
        // times as high as wide. This is the area formula to calculate a square
        // which contains n rectangles of size `actualMax * approxCharHeights`.
        // Divide that by `actualMax` to receive the correct number of columns.
        // The added bias increases the columns for short entries.
        Math.round(
          Math.sqrt(approxCharHeights * biasedMax * entriesLength) / biasedMax,
        ),
        // Do not exceed the breakLength.
        Math.floor((LINE_BREAKING_LENGTH - (level + 1)) / actualMax),
        // Limit the columns to a maximum of fifteen.
        15,
      );
      // Return with the original output if no grouping should happen.
      if (columns <= 1) {
        return entries;
      }
      const tmp = [];
      const maxLineLength = [];
      for (let i = 0; i < columns; i++) {
        let lineMaxLength = 0;
        for (let j = i; j < entries.length; j += columns) {
          if (dataLen[j] > lineMaxLength) lineMaxLength = dataLen[j];
        }
        lineMaxLength += separatorSpace;
        maxLineLength[i] = lineMaxLength;
      }
      let order = "padStart";
      if (value !== undefined) {
        for (let i = 0; i < entries.length; i++) {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          if (
            typeof value[i] !== "number" &&
            typeof value[i] !== "bigint"
          ) {
            order = "padEnd";
            break;
          }
          /* eslint-enable */
        }
      }
      // Each iteration creates a single line of grouped entries.
      for (let i = 0; i < entriesLength; i += columns) {
        // The last lines may contain less entries than columns.
        const max = Math.min(i + columns, entriesLength);
        let str = "";
        let j = i;
        for (; j < max - 1; j++) {
          const lengthOfColorCodes = entries[j].length - dataLen[j];
          const padding = maxLineLength[j - i] + lengthOfColorCodes;
          str += `${entries[j]}, `[order](padding, " ");
        }
        if (order === "padStart") {
          const lengthOfColorCodes = entries[j].length - dataLen[j];
          const padding = maxLineLength[j - i] +
            lengthOfColorCodes -
            separatorSpace;
          str += entries[j].padStart(padding, " ");
        } else {
          str += entries[j];
        }
        tmp.push(str);
      }
      if (iterableLimit < entries.length) {
        tmp.push(entries[entriesLength]);
      }
      entries = tmp;
    }
    return entries;
  }

  function inspectValue(
    value,
    ctx,
    level,
    inspectOptions,
  ) {
    const proxyDetails = core.getProxyDetails(value);
    if (proxyDetails != null) {
      return inspectOptions.showProxy
        ? inspectProxy(proxyDetails, ctx, level, inspectOptions)
        : inspectValue(proxyDetails[0], ctx, level, inspectOptions);
    }

    const green = maybeColor(colors.green, inspectOptions);
    const yellow = maybeColor(colors.yellow, inspectOptions);
    const dim = maybeColor(colors.dim, inspectOptions);
    const cyan = maybeColor(colors.cyan, inspectOptions);
    const bold = maybeColor(colors.bold, inspectOptions);
    const red = maybeColor(colors.red, inspectOptions);

    switch (typeof value) {
      case "string":
        return green(quoteString(value));
      case "number": // Numbers are yellow
        // Special handling of -0
        return yellow(Object.is(value, -0) ? "-0" : `${value}`);
      case "boolean": // booleans are yellow
        return yellow(String(value));
      case "undefined": // undefined is dim
        return dim(String(value));
      case "symbol": // Symbols are green
        return green(maybeQuoteSymbol(value));
      case "bigint": // Bigints are yellow
        return yellow(`${value}n`);
      case "function": // Function string is cyan
        return cyan(inspectFunction(value, ctx));
      case "object": // null is bold
        if (value === null) {
          return bold("null");
        }

        if (ctx.has(value)) {
          // Circular string is cyan
          return cyan("[Circular]");
        }

        return inspectObject(value, ctx, level, inspectOptions);
      default:
        // Not implemented is red
        return red("[Not Implemented]");
    }
  }

  // We can match Node's quoting behavior exactly by swapping the double quote and
  // single quote in this array. That would give preference to single quotes.
  // However, we prefer double quotes as the default.
  const QUOTES = ['"', "'", "`"];

  /** Surround the string in quotes.
   *
   * The quote symbol is chosen by taking the first of the `QUOTES` array which
   * does not occur in the string. If they all occur, settle with `QUOTES[0]`.
   *
   * Insert a backslash before any occurrence of the chosen quote symbol and
   * before any backslash.
   */
  function quoteString(string) {
    const quote = QUOTES.find((c) => !string.includes(c)) ?? QUOTES[0];
    const escapePattern = new RegExp(`(?=[${quote}\\\\])`, "g");
    string = string.replace(escapePattern, "\\");
    string = replaceEscapeSequences(string);
    return `${quote}${string}${quote}`;
  }

  // Replace escape sequences that can modify output.
  function replaceEscapeSequences(string) {
    return string
      .replace(/[\b]/g, "\\b")
      .replace(/\f/g, "\\f")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\v/g, "\\v")
      .replace(
        /[\x00-\x1f\x7f-\x9f]/g,
        (c) => "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0"),
      );
  }

  // Surround a string with quotes when it is required (e.g the string not a valid identifier).
  function maybeQuoteString(string) {
    if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(string)) {
      return replaceEscapeSequences(string);
    }

    return quoteString(string);
  }

  // Surround a symbol's description in quotes when it is required (e.g the description has non printable characters).
  function maybeQuoteSymbol(symbol) {
    if (symbol.description === undefined) {
      return symbol.toString();
    }

    if (/^[a-zA-Z_][a-zA-Z_.0-9]*$/.test(symbol.description)) {
      return symbol.toString();
    }

    return `Symbol(${quoteString(symbol.description)})`;
  }

  // Print strings when they are inside of arrays or objects with quotes
  function inspectValueWithQuotes(
    value,
    ctx,
    level,
    inspectOptions,
  ) {
    const green = maybeColor(colors.green, inspectOptions);
    switch (typeof value) {
      case "string":
        const trunc = value.length > STR_ABBREVIATE_SIZE
          ? value.slice(0, STR_ABBREVIATE_SIZE) + "..."
          : value;
        return green(quoteString(trunc)); // Quoted strings are green
      default:
        return inspectValue(value, ctx, level, inspectOptions);
    }
  }

  function inspectArray(
    value,
    ctx,
    level,
    inspectOptions,
  ) {
    const dim = maybeColor(colors.dim, inspectOptions);
    const options = {
      typeName: "Array",
      displayName: "",
      delims: ["[", "]"],
      entryHandler: (entry, ctx, level, inspectOptions, next) => {
        const [index, val] = entry;
        let i = index;
        if (!value.hasOwnProperty(i)) {
          i++;
          while (!value.hasOwnProperty(i) && i < value.length) {
            next();
            i++;
          }
          const emptyItems = i - index;
          const ending = emptyItems > 1 ? "s" : "";
          return dim(`<${emptyItems} empty item${ending}>`);
        } else {
          return inspectValueWithQuotes(val, ctx, level, inspectOptions);
        }
      },
      group: inspectOptions.compact,
      sort: false,
    };
    return inspectIterable(value, ctx, level, options, inspectOptions);
  }

  function inspectTypedArray(
    typedArrayName,
    value,
    ctx,
    level,
    inspectOptions,
  ) {
    const valueLength = value.length;
    const options = {
      typeName: typedArrayName,
      displayName: `${typedArrayName}(${valueLength})`,
      delims: ["[", "]"],
      entryHandler: (entry, ctx, level, inspectOptions) => {
        const val = entry[1];
        return inspectValueWithQuotes(val, ctx, level + 1, inspectOptions);
      },
      group: inspectOptions.compact,
      sort: false,
    };
    return inspectIterable(value, ctx, level, options, inspectOptions);
  }

  function inspectSet(
    value,
    ctx,
    level,
    inspectOptions,
  ) {
    const options = {
      typeName: "Set",
      displayName: "Set",
      delims: ["{", "}"],
      entryHandler: (entry, ctx, level, inspectOptions) => {
        const val = entry[1];
        return inspectValueWithQuotes(val, ctx, level + 1, inspectOptions);
      },
      group: false,
      sort: inspectOptions.sorted,
    };
    return inspectIterable(value, ctx, level, options, inspectOptions);
  }

  function inspectMap(
    value,
    ctx,
    level,
    inspectOptions,
  ) {
    const options = {
      typeName: "Map",
      displayName: "Map",
      delims: ["{", "}"],
      entryHandler: (entry, ctx, level, inspectOptions) => {
        const [key, val] = entry;
        return `${
          inspectValueWithQuotes(
            key,
            ctx,
            level + 1,
            inspectOptions,
          )
        } => ${inspectValueWithQuotes(val, ctx, level + 1, inspectOptions)}`;
      },
      group: false,
      sort: inspectOptions.sorted,
    };
    return inspectIterable(
      value,
      ctx,
      level,
      options,
      inspectOptions,
    );
  }

  function inspectWeakSet(inspectOptions) {
    const cyan = maybeColor(colors.cyan, inspectOptions);
    return `WeakSet { ${cyan("[items unknown]")} }`; // as seen in Node, with cyan color
  }

  function inspectWeakMap(inspectOptions) {
    const cyan = maybeColor(colors.cyan, inspectOptions);
    return `WeakMap { ${cyan("[items unknown]")} }`; // as seen in Node, with cyan color
  }

  function inspectDate(value, inspectOptions) {
    // without quotes, ISO format, in magenta like before
    const magenta = maybeColor(colors.magenta, inspectOptions);
    return magenta(isInvalidDate(value) ? "Invalid Date" : value.toISOString());
  }

  function inspectRegExp(value, inspectOptions) {
    const red = maybeColor(colors.red, inspectOptions);
    return red(value.toString()); // RegExps are red
  }

  function inspectStringObject(value, inspectOptions) {
    const cyan = maybeColor(colors.cyan, inspectOptions);
    return cyan(`[String: "${value.toString()}"]`); // wrappers are in cyan
  }

  function inspectBooleanObject(value, inspectOptions) {
    const cyan = maybeColor(colors.cyan, inspectOptions);
    return cyan(`[Boolean: ${value.toString()}]`); // wrappers are in cyan
  }

  function inspectNumberObject(value, inspectOptions) {
    const cyan = maybeColor(colors.cyan, inspectOptions);
    return cyan(`[Number: ${value.toString()}]`); // wrappers are in cyan
  }

  const PromiseState = {
    Pending: 0,
    Fulfilled: 1,
    Rejected: 2,
  };

  function inspectPromise(
    value,
    ctx,
    level,
    inspectOptions,
  ) {
    const cyan = maybeColor(colors.cyan, inspectOptions);
    const red = maybeColor(colors.red, inspectOptions);

    const [state, result] = core.getPromiseDetails(value);

    if (state === PromiseState.Pending) {
      return `Promise { ${cyan("<pending>")} }`;
    }

    const prefix = state === PromiseState.Fulfilled
      ? ""
      : `${red("<rejected>")} `;

    const str = `${prefix}${
      inspectValueWithQuotes(
        result,
        ctx,
        level + 1,
        inspectOptions,
      )
    }`;

    if (str.length + PROMISE_STRING_BASE_LENGTH > LINE_BREAKING_LENGTH) {
      return `Promise {\n${DEFAULT_INDENT.repeat(level + 1)}${str}\n}`;
    }

    return `Promise { ${str} }`;
  }

  function inspectProxy(
    targetAndHandler,
    ctx,
    level,
    inspectOptions,
  ) {
    return `Proxy ${
      inspectArray(targetAndHandler, ctx, level, inspectOptions)
    }`;
  }

  function inspectRawObject(
    value,
    ctx,
    level,
    inspectOptions,
  ) {
    const cyan = maybeColor(colors.cyan, inspectOptions);

    if (level >= inspectOptions.depth) {
      return cyan("[Object]"); // wrappers are in cyan
    }
    ctx.add(value);

    let baseString;

    let shouldShowDisplayName = false;
    let displayName = value[
      Symbol.toStringTag
    ];
    if (!displayName) {
      displayName = getClassInstanceName(value);
    }
    if (
      displayName && displayName !== "Object" && displayName !== "anonymous"
    ) {
      shouldShowDisplayName = true;
    }

    const entries = [];
    const stringKeys = Object.keys(value);
    const symbolKeys = Object.getOwnPropertySymbols(value);
    if (inspectOptions.sorted) {
      stringKeys.sort();
      symbolKeys.sort((s1, s2) =>
        (s1.description ?? "").localeCompare(s2.description ?? "")
      );
    }

    const red = maybeColor(colors.red, inspectOptions);

    for (const key of stringKeys) {
      let propertyValue;
      let error = null;
      try {
        propertyValue = value[key];
      } catch (error_) {
        error = error_;
      }
      const inspectedValue = error == null
        ? inspectValueWithQuotes(propertyValue, ctx, level + 1, inspectOptions)
        : red(`[Thrown ${error.name}: ${error.message}]`);
      entries.push(`${maybeQuoteString(key)}: ${inspectedValue}`);
    }
    for (const key of symbolKeys) {
      let propertyValue;
      let error;
      try {
        propertyValue = value[key];
      } catch (error_) {
        error = error_;
      }
      const inspectedValue = error == null
        ? inspectValueWithQuotes(propertyValue, ctx, level + 1, inspectOptions)
        : red(`Thrown ${error.name}: ${error.message}`);
      entries.push(`[${maybeQuoteSymbol(key)}]: ${inspectedValue}`);
    }
    // Making sure color codes are ignored when calculating the total length
    const totalLength = entries.length + level +
      colors.stripColor(entries.join("")).length;

    ctx.delete(value);

    if (entries.length === 0) {
      baseString = "{}";
    } else if (totalLength > LINE_BREAKING_LENGTH || !inspectOptions.compact) {
      const entryIndent = DEFAULT_INDENT.repeat(level + 1);
      const closingIndent = DEFAULT_INDENT.repeat(level);
      baseString = `{\n${entryIndent}${entries.join(`,\n${entryIndent}`)}${
        inspectOptions.trailingComma ? "," : ""
      }\n${closingIndent}}`;
    } else {
      baseString = `{ ${entries.join(", ")} }`;
    }

    if (shouldShowDisplayName) {
      baseString = `${displayName} ${baseString}`;
    }

    return baseString;
  }

  function inspectObject(
    value,
    consoleContext,
    level,
    inspectOptions,
  ) {
    if (customInspect in value && typeof value[customInspect] === "function") {
      try {
        return String(value[customInspect]());
      } catch {}
    }
    // This non-unique symbol is used to support op_crates, ie.
    // in op_crates/web we don't want to depend on unique "Deno.customInspect"
    // symbol defined in the public API. Internal only, shouldn't be used
    // by users.
    const nonUniqueCustomInspect = Symbol.for("Deno.customInspect");
    if (
      nonUniqueCustomInspect in value &&
      typeof value[nonUniqueCustomInspect] === "function"
    ) {
      try {
        return String(value[nonUniqueCustomInspect]());
      } catch {}
    }
    if (value instanceof Error) {
      return String(value.stack);
    } else if (Array.isArray(value)) {
      return inspectArray(value, consoleContext, level, inspectOptions);
    } else if (value instanceof Number) {
      return inspectNumberObject(value, inspectOptions);
    } else if (value instanceof Boolean) {
      return inspectBooleanObject(value, inspectOptions);
    } else if (value instanceof String) {
      return inspectStringObject(value, inspectOptions);
    } else if (value instanceof Promise) {
      return inspectPromise(value, consoleContext, level, inspectOptions);
    } else if (value instanceof RegExp) {
      return inspectRegExp(value, inspectOptions);
    } else if (value instanceof Date) {
      return inspectDate(value, inspectOptions);
    } else if (value instanceof Set) {
      return inspectSet(value, consoleContext, level, inspectOptions);
    } else if (value instanceof Map) {
      return inspectMap(value, consoleContext, level, inspectOptions);
    } else if (value instanceof WeakSet) {
      return inspectWeakSet(inspectOptions);
    } else if (value instanceof WeakMap) {
      return inspectWeakMap(inspectOptions);
    } else if (isTypedArray(value)) {
      return inspectTypedArray(
        Object.getPrototypeOf(value).constructor.name,
        value,
        consoleContext,
        level,
        inspectOptions,
      );
    } else {
      // Otherwise, default object formatting
      return inspectRawObject(value, consoleContext, level, inspectOptions);
    }
  }

  const colorKeywords = new Map([
    ["black", "#000000"],
    ["silver", "#c0c0c0"],
    ["gray", "#808080"],
    ["white", "#ffffff"],
    ["maroon", "#800000"],
    ["red", "#ff0000"],
    ["purple", "#800080"],
    ["fuchsia", "#ff00ff"],
    ["green", "#008000"],
    ["lime", "#00ff00"],
    ["olive", "#808000"],
    ["yellow", "#ffff00"],
    ["navy", "#000080"],
    ["blue", "#0000ff"],
    ["teal", "#008080"],
    ["aqua", "#00ffff"],
    ["orange", "#ffa500"],
    ["aliceblue", "#f0f8ff"],
    ["antiquewhite", "#faebd7"],
    ["aquamarine", "#7fffd4"],
    ["azure", "#f0ffff"],
    ["beige", "#f5f5dc"],
    ["bisque", "#ffe4c4"],
    ["blanchedalmond", "#ffebcd"],
    ["blueviolet", "#8a2be2"],
    ["brown", "#a52a2a"],
    ["burlywood", "#deb887"],
    ["cadetblue", "#5f9ea0"],
    ["chartreuse", "#7fff00"],
    ["chocolate", "#d2691e"],
    ["coral", "#ff7f50"],
    ["cornflowerblue", "#6495ed"],
    ["cornsilk", "#fff8dc"],
    ["crimson", "#dc143c"],
    ["cyan", "#00ffff"],
    ["darkblue", "#00008b"],
    ["darkcyan", "#008b8b"],
    ["darkgoldenrod", "#b8860b"],
    ["darkgray", "#a9a9a9"],
    ["darkgreen", "#006400"],
    ["darkgrey", "#a9a9a9"],
    ["darkkhaki", "#bdb76b"],
    ["darkmagenta", "#8b008b"],
    ["darkolivegreen", "#556b2f"],
    ["darkorange", "#ff8c00"],
    ["darkorchid", "#9932cc"],
    ["darkred", "#8b0000"],
    ["darksalmon", "#e9967a"],
    ["darkseagreen", "#8fbc8f"],
    ["darkslateblue", "#483d8b"],
    ["darkslategray", "#2f4f4f"],
    ["darkslategrey", "#2f4f4f"],
    ["darkturquoise", "#00ced1"],
    ["darkviolet", "#9400d3"],
    ["deeppink", "#ff1493"],
    ["deepskyblue", "#00bfff"],
    ["dimgray", "#696969"],
    ["dimgrey", "#696969"],
    ["dodgerblue", "#1e90ff"],
    ["firebrick", "#b22222"],
    ["floralwhite", "#fffaf0"],
    ["forestgreen", "#228b22"],
    ["gainsboro", "#dcdcdc"],
    ["ghostwhite", "#f8f8ff"],
    ["gold", "#ffd700"],
    ["goldenrod", "#daa520"],
    ["greenyellow", "#adff2f"],
    ["grey", "#808080"],
    ["honeydew", "#f0fff0"],
    ["hotpink", "#ff69b4"],
    ["indianred", "#cd5c5c"],
    ["indigo", "#4b0082"],
    ["ivory", "#fffff0"],
    ["khaki", "#f0e68c"],
    ["lavender", "#e6e6fa"],
    ["lavenderblush", "#fff0f5"],
    ["lawngreen", "#7cfc00"],
    ["lemonchiffon", "#fffacd"],
    ["lightblue", "#add8e6"],
    ["lightcoral", "#f08080"],
    ["lightcyan", "#e0ffff"],
    ["lightgoldenrodyellow", "#fafad2"],
    ["lightgray", "#d3d3d3"],
    ["lightgreen", "#90ee90"],
    ["lightgrey", "#d3d3d3"],
    ["lightpink", "#ffb6c1"],
    ["lightsalmon", "#ffa07a"],
    ["lightseagreen", "#20b2aa"],
    ["lightskyblue", "#87cefa"],
    ["lightslategray", "#778899"],
    ["lightslategrey", "#778899"],
    ["lightsteelblue", "#b0c4de"],
    ["lightyellow", "#ffffe0"],
    ["limegreen", "#32cd32"],
    ["linen", "#faf0e6"],
    ["magenta", "#ff00ff"],
    ["mediumaquamarine", "#66cdaa"],
    ["mediumblue", "#0000cd"],
    ["mediumorchid", "#ba55d3"],
    ["mediumpurple", "#9370db"],
    ["mediumseagreen", "#3cb371"],
    ["mediumslateblue", "#7b68ee"],
    ["mediumspringgreen", "#00fa9a"],
    ["mediumturquoise", "#48d1cc"],
    ["mediumvioletred", "#c71585"],
    ["midnightblue", "#191970"],
    ["mintcream", "#f5fffa"],
    ["mistyrose", "#ffe4e1"],
    ["moccasin", "#ffe4b5"],
    ["navajowhite", "#ffdead"],
    ["oldlace", "#fdf5e6"],
    ["olivedrab", "#6b8e23"],
    ["orangered", "#ff4500"],
    ["orchid", "#da70d6"],
    ["palegoldenrod", "#eee8aa"],
    ["palegreen", "#98fb98"],
    ["paleturquoise", "#afeeee"],
    ["palevioletred", "#db7093"],
    ["papayawhip", "#ffefd5"],
    ["peachpuff", "#ffdab9"],
    ["peru", "#cd853f"],
    ["pink", "#ffc0cb"],
    ["plum", "#dda0dd"],
    ["powderblue", "#b0e0e6"],
    ["rosybrown", "#bc8f8f"],
    ["royalblue", "#4169e1"],
    ["saddlebrown", "#8b4513"],
    ["salmon", "#fa8072"],
    ["sandybrown", "#f4a460"],
    ["seagreen", "#2e8b57"],
    ["seashell", "#fff5ee"],
    ["sienna", "#a0522d"],
    ["skyblue", "#87ceeb"],
    ["slateblue", "#6a5acd"],
    ["slategray", "#708090"],
    ["slategrey", "#708090"],
    ["snow", "#fffafa"],
    ["springgreen", "#00ff7f"],
    ["steelblue", "#4682b4"],
    ["tan", "#d2b48c"],
    ["thistle", "#d8bfd8"],
    ["tomato", "#ff6347"],
    ["turquoise", "#40e0d0"],
    ["violet", "#ee82ee"],
    ["wheat", "#f5deb3"],
    ["whitesmoke", "#f5f5f5"],
    ["yellowgreen", "#9acd32"],
    ["rebeccapurple", "#663399"],
  ]);

  function parseCssColor(colorString) {
    if (colorKeywords.has(colorString)) {
      colorString = colorKeywords.get(colorString);
    }
    // deno-fmt-ignore
    const hashMatch = colorString.match(/^#([\dA-Fa-f]{2})([\dA-Fa-f]{2})([\dA-Fa-f]{2})([\dA-Fa-f]{2})?$/);
    if (hashMatch != null) {
      return [
        Number(`0x${hashMatch[1]}`),
        Number(`0x${hashMatch[2]}`),
        Number(`0x${hashMatch[3]}`),
      ];
    }
    // deno-fmt-ignore
    const smallHashMatch = colorString.match(/^#([\dA-Fa-f])([\dA-Fa-f])([\dA-Fa-f])([\dA-Fa-f])?$/);
    if (smallHashMatch != null) {
      return [
        Number(`0x${smallHashMatch[1]}0`),
        Number(`0x${smallHashMatch[2]}0`),
        Number(`0x${smallHashMatch[3]}0`),
      ];
    }
    // deno-fmt-ignore
    const rgbMatch = colorString.match(/^rgba?\(\s*([+\-]?\d*\.?\d+)\s*,\s*([+\-]?\d*\.?\d+)\s*,\s*([+\-]?\d*\.?\d+)\s*(,\s*([+\-]?\d*\.?\d+)\s*)?\)$/);
    if (rgbMatch != null) {
      return [
        Math.round(Math.max(0, Math.min(255, Number(rgbMatch[1])))),
        Math.round(Math.max(0, Math.min(255, Number(rgbMatch[2])))),
        Math.round(Math.max(0, Math.min(255, Number(rgbMatch[3])))),
      ];
    }
    // deno-fmt-ignore
    const hslMatch = colorString.match(/^hsla?\(\s*([+\-]?\d*\.?\d+)\s*,\s*([+\-]?\d*\.?\d+)%\s*,\s*([+\-]?\d*\.?\d+)%\s*(,\s*([+\-]?\d*\.?\d+)\s*)?\)$/);
    if (hslMatch != null) {
      // https://www.rapidtables.com/convert/color/hsl-to-rgb.html
      let h = Number(hslMatch[1]) % 360;
      if (h < 0) {
        h += 360;
      }
      const s = Math.max(0, Math.min(100, Number(hslMatch[2]))) / 100;
      const l = Math.max(0, Math.min(100, Number(hslMatch[3]))) / 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r_;
      let g_;
      let b_;
      if (h < 60) {
        [r_, g_, b_] = [c, x, 0];
      } else if (h < 120) {
        [r_, g_, b_] = [x, c, 0];
      } else if (h < 180) {
        [r_, g_, b_] = [0, c, x];
      } else if (h < 240) {
        [r_, g_, b_] = [0, x, c];
      } else if (h < 300) {
        [r_, g_, b_] = [x, 0, c];
      } else {
        [r_, g_, b_] = [c, 0, x];
      }
      return [
        Math.round((r_ + m) * 255),
        Math.round((g_ + m) * 255),
        Math.round((b_ + m) * 255),
      ];
    }
    return null;
  }

  function getDefaultCss() {
    return {
      backgroundColor: null,
      color: null,
      fontWeight: null,
      fontStyle: null,
      textDecorationColor: null,
      textDecorationLine: [],
    };
  }

  function parseCss(cssString) {
    const css = getDefaultCss();

    const rawEntries = [];
    let inValue = false;
    let currentKey = null;
    let parenthesesDepth = 0;
    currentPart = "";
    for (let i = 0; i < cssString.length; i++) {
      const c = cssString[i];
      if (c == "(") {
        parenthesesDepth++;
      } else if (parenthesesDepth > 0) {
        if (c == ")") {
          parenthesesDepth--;
        }
      } else if (inValue) {
        if (c == ";") {
          const value = currentPart.trim();
          if (value != "") {
            rawEntries.push([currentKey, value]);
          }
          currentKey = null;
          currentPart = "";
          inValue = false;
          continue;
        }
      } else if (c == ":") {
        currentKey = currentPart.trim();
        currentPart = "";
        inValue = true;
        continue;
      }
      currentPart += c;
    }
    if (inValue && parenthesesDepth == 0) {
      const value = currentPart.trim();
      if (value != "") {
        rawEntries.push([currentKey, value]);
      }
      currentKey = null;
      currentPart = "";
    }

    for (const [key, value] of rawEntries) {
      if (key == "background-color") {
        const color = parseCssColor(value);
        if (color != null) {
          css.backgroundColor = color;
        }
      } else if (key == "color") {
        const color = parseCssColor(value);
        if (color != null) {
          css.color = color;
        }
      } else if (key == "font-weight") {
        if (value == "bold") {
          css.fontWeight = value;
        }
      } else if (key == "font-style") {
        if (["italic", "oblique", "oblique 14deg"].includes(value)) {
          css.fontStyle = "italic";
        }
      } else if (key == "text-decoration-line") {
        css.textDecorationLine = [];
        for (const lineType of value.split(/\s+/g)) {
          if (["line-through", "overline", "underline"].includes(lineType)) {
            css.textDecorationLine.push(lineType);
          }
        }
      } else if (key == "text-decoration-color") {
        const color = parseCssColor(value);
        if (color != null) {
          css.textDecorationColor = color;
        }
      } else if (key == "text-decoration") {
        css.textDecorationColor = null;
        css.textDecorationLine = [];
        for (const arg of value.split(/\s+/g)) {
          const maybeColor = parseCssColor(arg);
          if (maybeColor != null) {
            css.textDecorationColor = maybeColor;
          } else if (["line-through", "overline", "underline"].includes(arg)) {
            css.textDecorationLine.push(arg);
          }
        }
      }
    }

    return css;
  }

  function colorEquals(color1, color2) {
    return color1?.[0] == color2?.[0] && color1?.[1] == color2?.[1] &&
      color1?.[2] == color2?.[2];
  }

  function cssToAnsi(css, prevCss = null) {
    prevCss = prevCss ?? getDefaultCss();
    let ansi = "";
    if (!colorEquals(css.backgroundColor, prevCss.backgroundColor)) {
      if (css.backgroundColor != null) {
        const [r, g, b] = css.backgroundColor;
        ansi += `\x1b[48;2;${r};${g};${b}m`;
      } else {
        ansi += "\x1b[49m";
      }
    }
    if (!colorEquals(css.color, prevCss.color)) {
      if (css.color != null) {
        const [r, g, b] = css.color;
        ansi += `\x1b[38;2;${r};${g};${b}m`;
      } else {
        ansi += "\x1b[39m";
      }
    }
    if (css.fontWeight != prevCss.fontWeight) {
      if (css.fontWeight == "bold") {
        ansi += `\x1b[1m`;
      } else {
        ansi += "\x1b[22m";
      }
    }
    if (css.fontStyle != prevCss.fontStyle) {
      if (css.fontStyle == "italic") {
        ansi += `\x1b[3m`;
      } else {
        ansi += "\x1b[23m";
      }
    }
    if (!colorEquals(css.textDecorationColor, prevCss.textDecorationColor)) {
      if (css.textDecorationColor != null) {
        const [r, g, b] = css.textDecorationColor;
        ansi += `\x1b[58;2;${r};${g};${b}m`;
      } else {
        ansi += "\x1b[59m";
      }
    }
    if (
      css.textDecorationLine.includes("line-through") !=
        prevCss.textDecorationLine.includes("line-through")
    ) {
      if (css.textDecorationLine.includes("line-through")) {
        ansi += "\x1b[9m";
      } else {
        ansi += "\x1b[29m";
      }
    }
    if (
      css.textDecorationLine.includes("overline") !=
        prevCss.textDecorationLine.includes("overline")
    ) {
      if (css.textDecorationLine.includes("overline")) {
        ansi += "\x1b[53m";
      } else {
        ansi += "\x1b[55m";
      }
    }
    if (
      css.textDecorationLine.includes("underline") !=
        prevCss.textDecorationLine.includes("underline")
    ) {
      if (css.textDecorationLine.includes("underline")) {
        ansi += "\x1b[4m";
      } else {
        ansi += "\x1b[24m";
      }
    }
    return ansi;
  }

  function inspectArgs(args, inspectOptions = {}) {
    const noColor = globalThis.Deno?.noColor ?? true;
    const rInspectOptions = { ...DEFAULT_INSPECT_OPTIONS, ...inspectOptions };
    const first = args[0];
    let a = 0;
    let string = "";

    if (typeof first == "string" && args.length > 1) {
      a++;
      // Index of the first not-yet-appended character. Use this so we only
      // have to append to `string` when a substitution occurs / at the end.
      let appendedChars = 0;
      let usedStyle = false;
      let prevCss = null;
      for (let i = 0; i < first.length - 1; i++) {
        if (first[i] == "%") {
          const char = first[++i];
          if (a < args.length) {
            let formattedArg = null;
            if (char == "s") {
              // Format as a string.
              formattedArg = String(args[a++]);
            } else if (["d", "i"].includes(char)) {
              // Format as an integer.
              const value = args[a++];
              if (typeof value == "bigint") {
                formattedArg = `${value}n`;
              } else if (typeof value == "number") {
                formattedArg = `${parseInt(String(value))}`;
              } else {
                formattedArg = "NaN";
              }
            } else if (char == "f") {
              // Format as a floating point value.
              const value = args[a++];
              if (typeof value == "number") {
                formattedArg = `${value}`;
              } else {
                formattedArg = "NaN";
              }
            } else if (["O", "o"].includes(char)) {
              // Format as an object.
              formattedArg = inspectValue(
                args[a++],
                new Set(),
                0,
                rInspectOptions,
              );
            } else if (char == "c") {
              const value = args[a++];
              if (!noColor) {
                const css = parseCss(value);
                formattedArg = cssToAnsi(css, prevCss);
                if (formattedArg != "") {
                  usedStyle = true;
                  prevCss = css;
                }
              } else {
                formattedArg = "";
              }
            }

            if (formattedArg != null) {
              string += first.slice(appendedChars, i - 1) + formattedArg;
              appendedChars = i + 1;
            }
          }
          if (char == "%") {
            string += first.slice(appendedChars, i - 1) + "%";
            appendedChars = i + 1;
          }
        }
      }
      string += first.slice(appendedChars);
      if (usedStyle) {
        string += "\x1b[0m";
      }
    }

    for (; a < args.length; a++) {
      if (a > 0) {
        string += " ";
      }
      if (typeof args[a] == "string") {
        string += args[a];
      } else {
        // Use default maximum depth for null or undefined arguments.
        string += inspectValue(args[a], new Set(), 0, rInspectOptions);
      }
    }

    if (rInspectOptions.indentLevel > 0) {
      const groupIndent = DEFAULT_INDENT.repeat(rInspectOptions.indentLevel);
      string = groupIndent + string.replaceAll("\n", `\n${groupIndent}`);
    }

    return string;
  }

  const countMap = new Map();
  const timerMap = new Map();
  const isConsoleInstance = Symbol("isConsoleInstance");

  const CONSOLE_INSPECT_OPTIONS = {
    ...DEFAULT_INSPECT_OPTIONS,
    colors: true,
  };

  class Console {
    #printFunc = null;
    [isConsoleInstance] = false;

    constructor(printFunc) {
      this.#printFunc = printFunc;
      this.indentLevel = 0;
      this[isConsoleInstance] = true;

      // ref https://console.spec.whatwg.org/#console-namespace
      // For historical web-compatibility reasons, the namespace object for
      // console must have as its [[Prototype]] an empty object, created as if
      // by ObjectCreate(%ObjectPrototype%), instead of %ObjectPrototype%.
      const console = Object.create({});
      Object.assign(console, this);
      return console;
    }

    log = (...args) => {
      this.#printFunc(
        inspectArgs(args, {
          ...CONSOLE_INSPECT_OPTIONS,
          indentLevel: this.indentLevel,
        }) + "\n",
        false,
      );
    };

    debug = this.log;
    info = this.log;

    dir = (obj, options = {}) => {
      this.#printFunc(
        inspectArgs([obj], { ...CONSOLE_INSPECT_OPTIONS, ...options }) + "\n",
        false,
      );
    };

    dirxml = this.dir;

    warn = (...args) => {
      this.#printFunc(
        inspectArgs(args, {
          ...CONSOLE_INSPECT_OPTIONS,
          indentLevel: this.indentLevel,
        }) + "\n",
        true,
      );
    };

    error = this.warn;

    assert = (condition = false, ...args) => {
      if (condition) {
        return;
      }

      if (args.length === 0) {
        this.error("Assertion failed");
        return;
      }

      const [first, ...rest] = args;

      if (typeof first === "string") {
        this.error(`Assertion failed: ${first}`, ...rest);
        return;
      }

      this.error(`Assertion failed:`, ...args);
    };

    count = (label = "default") => {
      label = String(label);

      if (countMap.has(label)) {
        const current = countMap.get(label) || 0;
        countMap.set(label, current + 1);
      } else {
        countMap.set(label, 1);
      }

      this.info(`${label}: ${countMap.get(label)}`);
    };

    countReset = (label = "default") => {
      label = String(label);

      if (countMap.has(label)) {
        countMap.set(label, 0);
      } else {
        this.warn(`Count for '${label}' does not exist`);
      }
    };

    table = (data, properties) => {
      if (properties !== undefined && !Array.isArray(properties)) {
        throw new Error(
          "The 'properties' argument must be of type Array. " +
            "Received type string",
        );
      }

      if (data === null || typeof data !== "object") {
        return this.log(data);
      }

      const objectValues = {};
      const indexKeys = [];
      const values = [];

      const stringifyValue = (value) =>
        inspectValueWithQuotes(value, new Set(), 0, {
          ...DEFAULT_INSPECT_OPTIONS,
          depth: 1,
        });
      const toTable = (header, body) => this.log(cliTable(header, body));
      const createColumn = (value, shift) => [
        ...(shift ? [...new Array(shift)].map(() => "") : []),
        stringifyValue(value),
      ];

      let resultData;
      const isSet = data instanceof Set;
      const isMap = data instanceof Map;
      const valuesKey = "Values";
      const indexKey = isSet || isMap ? "(iter idx)" : "(idx)";

      if (data instanceof Set) {
        resultData = [...data];
      } else if (data instanceof Map) {
        let idx = 0;
        resultData = {};

        data.forEach((v, k) => {
          resultData[idx] = { Key: k, Values: v };
          idx++;
        });
      } else {
        resultData = data;
      }

      let hasPrimitives = false;
      Object.keys(resultData).forEach((k, idx) => {
        const value = resultData[k];
        const primitive = value === null ||
          (typeof value !== "function" && typeof value !== "object");
        if (properties === undefined && primitive) {
          hasPrimitives = true;
          values.push(stringifyValue(value));
        } else {
          const valueObj = value || {};
          const keys = properties || Object.keys(valueObj);
          for (const k of keys) {
            if (primitive || !valueObj.hasOwnProperty(k)) {
              if (objectValues[k]) {
                // fill with blanks for idx to avoid misplacing from later values
                objectValues[k].push("");
              }
            } else {
              if (objectValues[k]) {
                objectValues[k].push(stringifyValue(valueObj[k]));
              } else {
                objectValues[k] = createColumn(valueObj[k], idx);
              }
            }
          }
          values.push("");
        }

        indexKeys.push(k);
      });

      const headerKeys = Object.keys(objectValues);
      const bodyValues = Object.values(objectValues);
      const header = [
        indexKey,
        ...(properties ||
          [...headerKeys, !isMap && hasPrimitives && valuesKey]),
      ].filter(Boolean);
      const body = [indexKeys, ...bodyValues, values];

      toTable(header, body);
    };

    time = (label = "default") => {
      label = String(label);

      if (timerMap.has(label)) {
        this.warn(`Timer '${label}' already exists`);
        return;
      }

      timerMap.set(label, Date.now());
    };

    timeLog = (label = "default", ...args) => {
      label = String(label);

      if (!timerMap.has(label)) {
        this.warn(`Timer '${label}' does not exists`);
        return;
      }

      const startTime = timerMap.get(label);
      const duration = Date.now() - startTime;

      this.info(`${label}: ${duration}ms`, ...args);
    };

    timeEnd = (label = "default") => {
      label = String(label);

      if (!timerMap.has(label)) {
        this.warn(`Timer '${label}' does not exists`);
        return;
      }

      const startTime = timerMap.get(label);
      timerMap.delete(label);
      const duration = Date.now() - startTime;

      this.info(`${label}: ${duration}ms`);
    };

    group = (...label) => {
      if (label.length > 0) {
        this.log(...label);
      }
      this.indentLevel += 2;
    };

    groupCollapsed = this.group;

    groupEnd = () => {
      if (this.indentLevel > 0) {
        this.indentLevel -= 2;
      }
    };

    clear = () => {
      this.indentLevel = 0;
      this.#printFunc(CSI.kClear, false);
      this.#printFunc(CSI.kClearScreenDown, false);
    };

    trace = (...args) => {
      const message = inspectArgs(
        args,
        { ...CONSOLE_INSPECT_OPTIONS, indentLevel: 0 },
      );
      const err = {
        name: "Trace",
        message,
      };
      Error.captureStackTrace(err, this.trace);
      this.error(err.stack);
    };

    static [Symbol.hasInstance](instance) {
      return instance[isConsoleInstance];
    }
  }

  const customInspect = Symbol("Deno.customInspect");

  function inspect(
    value,
    inspectOptions = {},
  ) {
    return inspectValue(value, new Set(), 0, {
      ...DEFAULT_INSPECT_OPTIONS,
      ...inspectOptions,
      // TODO(nayeemrmn): Indent level is not supported.
      indentLevel: 0,
    });
  }

  // Expose these fields to internalObject for tests.
  exposeForTest("Console", Console);
  exposeForTest("cssToAnsi", cssToAnsi);
  exposeForTest("inspectArgs", inspectArgs);
  exposeForTest("parseCss", parseCss);
  exposeForTest("parseCssColor", parseCssColor);

  window.__bootstrap.console = {
    CSI,
    inspectArgs,
    Console,
    customInspect,
    inspect,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const { requiredArguments } = window.__bootstrap.fetchUtil;
  // const { exposeForTest } = window.__bootstrap.internals;

  function DomIterableMixin(
    Base,
    dataSymbol,
  ) {
    // we have to cast `this` as `any` because there is no way to describe the
    // Base class in a way where the Symbol `dataSymbol` is defined.  So the
    // runtime code works, but we do lose a little bit of type safety.

    // Additionally, we have to not use .keys() nor .values() since the internal
    // slot differs in type - some have a Map, which yields [K, V] in
    // Symbol.iterator, and some have an Array, which yields V, in this case
    // [K, V] too as they are arrays of tuples.

    const DomIterable = class extends Base {
      *entries() {
        for (const entry of this[dataSymbol]) {
          yield entry;
        }
      }

      *keys() {
        for (const [key] of this[dataSymbol]) {
          yield key;
        }
      }

      *values() {
        for (const [, value] of this[dataSymbol]) {
          yield value;
        }
      }

      forEach(
        callbackfn,
        thisArg,
      ) {
        requiredArguments(
          `${this.constructor.name}.forEach`,
          arguments.length,
          1,
        );
        callbackfn = callbackfn.bind(
          thisArg == null ? globalThis : Object(thisArg),
        );
        for (const [key, value] of this[dataSymbol]) {
          callbackfn(value, key, this);
        }
      }

      *[Symbol.iterator]() {
        for (const entry of this[dataSymbol]) {
          yield entry;
        }
      }
    };

    // we want the Base class name to be the name of the class.
    Object.defineProperty(DomIterable, "name", {
      value: Base.name,
      configurable: true,
    });

    return DomIterable;
  }

  // exposeForTest("DomIterableMixin", DomIterableMixin);

  window.__bootstrap.domIterable = {
    DomIterableMixin,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const { build } = window.__bootstrap.build;
  const internals = window.__bootstrap.internals;
  let logDebug = false;
  let logSource = "JS";

  function setLogDebug(debug, source) {
    logDebug = debug;
    if (source) {
      logSource = source;
    }
  }

  function log(...args) {
    if (logDebug) {
      // if we destructure `console` off `globalThis` too early, we don't bind to
      // the right console, therefore we don't log anything out.
      globalThis.console.log(`DEBUG ${logSource} -`, ...args);
    }
  }

  class AssertionError extends Error {
    constructor(msg) {
      super(msg);
      this.name = "AssertionError";
    }
  }

  function assert(cond, msg = "Assertion failed.") {
    if (!cond) {
      throw new AssertionError(msg);
    }
  }

  function createResolvable() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
  }

  function immutableDefine(
    o,
    p,
    value,
  ) {
    Object.defineProperty(o, p, {
      value,
      configurable: false,
      writable: false,
    });
  }

  // Keep in sync with `fromFileUrl()` in `std/path/win32.ts`.
  function pathFromURLWin32(url) {
    let path = decodeURIComponent(
      url.pathname
        .replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/")
        .replace(/\//g, "\\")
        .replace(/%(?![0-9A-Fa-f]{2})/g, "%25"),
    );
    if (url.hostname != "") {
      // Note: The `URL` implementation guarantees that the drive letter and
      // hostname are mutually exclusive. Otherwise it would not have been valid
      // to append the hostname and path like this.
      path = `\\\\${url.hostname}${path}`;
    }
    return path;
  }

  // Keep in sync with `fromFileUrl()` in `std/path/posix.ts`.
  function pathFromURLPosix(url) {
    if (url.hostname !== "") {
      throw new TypeError(`Host must be empty.`);
    }

    return decodeURIComponent(
      url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"),
    );
  }

  function pathFromURL(pathOrUrl) {
    if (pathOrUrl instanceof URL) {
      if (pathOrUrl.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
      }

      return build.os == "windows"
        ? pathFromURLWin32(pathOrUrl)
        : pathFromURLPosix(pathOrUrl);
    }
    return pathOrUrl;
  }

  internals.exposeForTest("pathFromURL", pathFromURL);

  function writable(value) {
    return {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    };
  }

  function nonEnumerable(value) {
    return {
      value,
      writable: true,
      configurable: true,
    };
  }

  function readOnly(value) {
    return {
      value,
      enumerable: true,
    };
  }

  function getterOnly(getter) {
    return {
      get: getter,
      enumerable: true,
    };
  }

  window.__bootstrap.util = {
    log,
    setLogDebug,
    createResolvable,
    assert,
    AssertionError,
    immutableDefine,
    pathFromURL,
    writable,
    nonEnumerable,
    readOnly,
    getterOnly,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// The following code is based off of text-encoding at:
// https://github.com/inexorabletash/text-encoding
//
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
//
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

((window) => {
  const core = Deno.core;

  const CONTINUE = null;
  const END_OF_STREAM = -1;
  const FINISHED = -1;

  function decoderError(fatal) {
    if (fatal) {
      throw new TypeError("Decoder error.");
    }
    return 0xfffd; // default code point
  }

  function inRange(a, min, max) {
    return min <= a && a <= max;
  }

  function isASCIIByte(a) {
    return inRange(a, 0x00, 0x7f);
  }

  function stringToCodePoints(input) {
    const u = [];
    for (const c of input) {
      u.push(c.codePointAt(0));
    }
    return u;
  }

  class UTF8Encoder {
    handler(codePoint) {
      if (codePoint === END_OF_STREAM) {
        return "finished";
      }

      if (inRange(codePoint, 0x00, 0x7f)) {
        return [codePoint];
      }

      let count;
      let offset;
      if (inRange(codePoint, 0x0080, 0x07ff)) {
        count = 1;
        offset = 0xc0;
      } else if (inRange(codePoint, 0x0800, 0xffff)) {
        count = 2;
        offset = 0xe0;
      } else if (inRange(codePoint, 0x10000, 0x10ffff)) {
        count = 3;
        offset = 0xf0;
      } else {
        throw TypeError(
          `Code point out of range: \\x${codePoint.toString(16)}`,
        );
      }

      const bytes = [(codePoint >> (6 * count)) + offset];

      while (count > 0) {
        const temp = codePoint >> (6 * (count - 1));
        bytes.push(0x80 | (temp & 0x3f));
        count--;
      }

      return bytes;
    }
  }

  function atob(s) {
    s = String(s);
    s = s.replace(/[\t\n\f\r ]/g, "");

    if (s.length % 4 === 0) {
      s = s.replace(/==?$/, "");
    }

    const rem = s.length % 4;
    if (rem === 1 || /[^+/0-9A-Za-z]/.test(s)) {
      throw new DOMException(
        "The string to be decoded is not correctly encoded",
        "DataDecodeError",
      );
    }

    // base64-js requires length exactly times of 4
    if (rem > 0) {
      s = s.padEnd(s.length + (4 - rem), "=");
    }

    const byteArray = base64.toByteArray(s);
    let result = "";
    for (let i = 0; i < byteArray.length; i++) {
      result += String.fromCharCode(byteArray[i]);
    }
    return result;
  }

  function btoa(s) {
    const byteArray = [];
    for (let i = 0; i < s.length; i++) {
      const charCode = s[i].charCodeAt(0);
      if (charCode > 0xff) {
        throw new TypeError(
          "The string to be encoded contains characters " +
            "outside of the Latin1 range.",
        );
      }
      byteArray.push(charCode);
    }
    const result = base64.fromByteArray(Uint8Array.from(byteArray));
    return result;
  }

  class SingleByteDecoder {
    #index = [];
    #fatal = false;

    constructor(index, { ignoreBOM = false, fatal = false } = {}) {
      if (ignoreBOM) {
        throw new TypeError("Ignoring the BOM is available only with utf-8.");
      }
      this.#fatal = fatal;
      this.#index = index;
    }
    handler(_stream, byte) {
      if (byte === END_OF_STREAM) {
        return FINISHED;
      }
      if (isASCIIByte(byte)) {
        return byte;
      }
      const codePoint = this.#index[byte - 0x80];

      if (codePoint == null) {
        return decoderError(this.#fatal);
      }

      return codePoint;
    }
  }

  // The encodingMap is a hash of labels that are indexed by the conical
  // encoding.
  const encodingMap = {
    "windows-1252": [
      "ansi_x3.4-1968",
      "ascii",
      "cp1252",
      "cp819",
      "csisolatin1",
      "ibm819",
      "iso-8859-1",
      "iso-ir-100",
      "iso8859-1",
      "iso88591",
      "iso_8859-1",
      "iso_8859-1:1987",
      "l1",
      "latin1",
      "us-ascii",
      "windows-1252",
      "x-cp1252",
    ],
    "utf-8": ["unicode-1-1-utf-8", "utf-8", "utf8"],
    ibm866: ["866", "cp866", "csibm866", "ibm866"],
    "iso-8859-2": [
      "csisolatin2",
      "iso-8859-2",
      "iso-ir-101",
      "iso8859-2",
      "iso88592",
      "iso_8859-2",
      "iso_8859-2:1987",
      "l2",
      "latin2",
    ],
    "iso-8859-3": [
      "csisolatin3",
      "iso-8859-3",
      "iso-ir-109",
      "iso8859-3",
      "iso88593",
      "iso_8859-3",
      "iso_8859-3:1988",
      "l3",
      "latin3",
    ],
    "iso-8859-4": [
      "csisolatin4",
      "iso-8859-4",
      "iso-ir-110",
      "iso8859-4",
      "iso88594",
      "iso_8859-4",
      "iso_8859-4:1988",
      "l4",
      "latin4",
    ],
    "iso-8859-5": [
      "csisolatincyrillic",
      "cyrillic",
      "iso-8859-5",
      "iso-ir-144",
      "iso8859-5",
      "iso88595",
      "iso_8859-5",
      "iso_8859-5:1988",
    ],
    "iso-8859-6": [
      "arabic",
      "asmo-708",
      "csiso88596e",
      "csiso88596i",
      "csisolatinarabic",
      "ecma-114",
      "iso-8859-6",
      "iso-8859-6-e",
      "iso-8859-6-i",
      "iso-ir-127",
      "iso8859-6",
      "iso88596",
      "iso_8859-6",
      "iso_8859-6:1987",
    ],
    "iso-8859-7": [
      "csisolatingreek",
      "ecma-118",
      "elot_928",
      "greek",
      "greek8",
      "iso-8859-7",
      "iso-ir-126",
      "iso8859-7",
      "iso88597",
      "iso_8859-7",
      "iso_8859-7:1987",
      "sun_eu_greek",
    ],
    "iso-8859-8": [
      "csiso88598e",
      "csisolatinhebrew",
      "hebrew",
      "iso-8859-8",
      "iso-8859-8-e",
      "iso-ir-138",
      "iso8859-8",
      "iso88598",
      "iso_8859-8",
      "iso_8859-8:1988",
      "visual",
    ],
    "iso-8859-10": [
      "csisolatin6",
      "iso-8859-10",
      "iso-ir-157",
      "iso8859-10",
      "iso885910",
      "l6",
      "latin6",
    ],
    "iso-8859-13": ["iso-8859-13", "iso8859-13", "iso885913"],
    "iso-8859-14": ["iso-8859-14", "iso8859-14", "iso885914"],
    "iso-8859-15": [
      "csisolatin9",
      "iso-8859-15",
      "iso8859-15",
      "iso885915",
      "iso_8859-15",
      "l9",
    ],
    "iso-8859-16": ["iso-8859-16"],
    "koi8-r": ["cskoi8r", "koi", "koi8", "koi8-r", "koi8_r"],
    "koi8-u": ["koi8-ru", "koi8-u"],
    macintosh: ["csmacintosh", "mac", "macintosh", "x-mac-roman"],
    "windows-874": [
      "dos-874",
      "iso-8859-11",
      "iso8859-11",
      "iso885911",
      "tis-620",
      "windows-874",
    ],
    "windows-1250": ["cp1250", "windows-1250", "x-cp1250"],
    "windows-1251": ["cp1251", "windows-1251", "x-cp1251"],
    "windows-1253": ["cp1253", "windows-1253", "x-cp1253"],
    "windows-1254": [
      "cp1254",
      "csisolatin5",
      "iso-8859-9",
      "iso-ir-148",
      "iso8859-9",
      "iso88599",
      "iso_8859-9",
      "iso_8859-9:1989",
      "l5",
      "latin5",
      "windows-1254",
      "x-cp1254",
    ],
    "windows-1255": ["cp1255", "windows-1255", "x-cp1255"],
    "windows-1256": ["cp1256", "windows-1256", "x-cp1256"],
    "windows-1257": ["cp1257", "windows-1257", "x-cp1257"],
    "windows-1258": ["cp1258", "windows-1258", "x-cp1258"],
    "x-mac-cyrillic": ["x-mac-cyrillic", "x-mac-ukrainian"],
  };
  // We convert these into a Map where every label resolves to its canonical
  // encoding type.
  const encodings = new Map();
  for (const key of Object.keys(encodingMap)) {
    const labels = encodingMap[key];
    for (const label of labels) {
      encodings.set(label, key);
    }
  }

  // A map of functions that return new instances of a decoder indexed by the
  // encoding type.
  const decoders = new Map();

  // Single byte decoders are an array of code point lookups
  const encodingIndexes = new Map();
  // deno-fmt-ignore
  encodingIndexes.set("windows-1252", [
    8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 
    8240, 352, 8249, 338, 141, 381, 143, 144, 
    8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 
    8482, 353, 8250, 339, 157, 382, 376, 160, 
    161, 162, 163, 164, 165, 166, 167, 168, 
    169, 170, 171, 172, 173, 174, 175, 176, 
    177, 178, 179, 180, 181, 182, 183, 184, 
    185, 186, 187, 188, 189, 190, 191, 192,
    193, 194, 195, 196, 197, 198, 199, 200, 
    201, 202, 203, 204, 205, 206, 207, 208, 
    209, 210, 211, 212, 213, 214, 215, 216, 
    217, 218, 219, 220, 221, 222, 223, 224, 
    225, 226, 227, 228, 229, 230, 231, 232, 
    233, 234, 235, 236, 237, 238, 239, 240, 
    241, 242, 243, 244, 245, 246, 247, 248, 
    249, 250, 251, 252, 253, 254, 255,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("ibm866", [
    1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047,
    1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055,
    1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063,
    1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071,
    1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079,
    1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087,
    9617, 9618, 9619, 9474, 9508, 9569, 9570, 9558,
    9557, 9571, 9553, 9559, 9565, 9564, 9563, 9488,
    9492, 9524, 9516, 9500, 9472, 9532, 9566, 9567,
    9562, 9556, 9577, 9574, 9568, 9552, 9580, 9575,
    9576, 9572, 9573, 9561, 9560, 9554, 9555, 9579,
    9578, 9496, 9484, 9608, 9604, 9612, 9616, 9600,
    1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095,
    1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103,
    1025, 1105, 1028, 1108, 1031, 1111, 1038, 1118,
    176, 8729, 183, 8730, 8470, 164, 9632, 160,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-2", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 260, 728, 321, 164, 317, 346, 167,
    168, 352, 350, 356, 377, 173, 381, 379,
    176, 261, 731, 322, 180, 318, 347, 711,
    184, 353, 351, 357, 378, 733, 382, 380,
    340, 193, 194, 258, 196, 313, 262, 199,
    268, 201, 280, 203, 282, 205, 206, 270,
    272, 323, 327, 211, 212, 336, 214, 215,
    344, 366, 218, 368, 220, 221, 354, 223,
    341, 225, 226, 259, 228, 314, 263, 231,
    269, 233, 281, 235, 283, 237, 238, 271,
    273, 324, 328, 243, 244, 337, 246, 247,
    345, 367, 250, 369, 252, 253, 355, 729,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-3", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 294, 728, 163, 164, null, 292, 167,
    168, 304, 350, 286, 308, 173, null, 379,
    176, 295, 178, 179, 180, 181, 293, 183,
    184, 305, 351, 287, 309, 189, null, 380,
    192, 193, 194, null, 196, 266, 264, 199,
    200, 201, 202, 203, 204, 205, 206, 207,
    null, 209, 210, 211, 212, 288, 214, 215,
    284, 217, 218, 219, 220, 364, 348, 223,
    224, 225, 226, null, 228, 267, 265, 231,
    232, 233, 234, 235, 236, 237, 238, 239,
    null, 241, 242, 243, 244, 289, 246, 247,
    285, 249, 250, 251, 252, 365, 349, 729,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-4", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 260, 312, 342, 164, 296, 315, 167,
    168, 352, 274, 290, 358, 173, 381, 175,
    176, 261, 731, 343, 180, 297, 316, 711,
    184, 353, 275, 291, 359, 330, 382, 331,
    256, 193, 194, 195, 196, 197, 198, 302,
    268, 201, 280, 203, 278, 205, 206, 298,
    272, 325, 332, 310, 212, 213, 214, 215,
    216, 370, 218, 219, 220, 360, 362, 223,
    257, 225, 226, 227, 228, 229, 230, 303,
    269, 233, 281, 235, 279, 237, 238, 299,
    273, 326, 333, 311, 244, 245, 246, 247,
    248, 371, 250, 251, 252, 361, 363, 729,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-5", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 1025, 1026, 1027, 1028, 1029, 1030, 1031,
    1032, 1033, 1034, 1035, 1036, 173, 1038, 1039,
    1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047,
    1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055,
    1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063,
    1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071,
    1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079,
    1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087,
    1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095,
    1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103,
    8470, 1105, 1106, 1107, 1108, 1109, 1110, 1111,
    1112, 1113, 1114, 1115, 1116, 167, 1118, 1119,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-6", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, null, null, null, 164, null, null, null,
    null, null, null, null, 1548, 173, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, 1563, null, null, null, 1567,
    null, 1569, 1570, 1571, 1572, 1573, 1574, 1575,
    1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583,
    1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591,
    1592, 1593, 1594, null, null, null, null, null,
    1600, 1601, 1602, 1603, 1604, 1605, 1606, 1607,
    1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615,
    1616, 1617, 1618, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-7", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 8216, 8217, 163, 8364, 8367, 166, 167,
    168, 169, 890, 171, 172, 173, null, 8213,
    176, 177, 178, 179, 900, 901, 902, 183,
    904, 905, 906, 187, 908, 189, 910, 911,
    912, 913, 914, 915, 916, 917, 918, 919,
    920, 921, 922, 923, 924, 925, 926, 927,
    928, 929, null, 931, 932, 933, 934, 935,
    936, 937, 938, 939, 940, 941, 942, 943,
    944, 945, 946, 947, 948, 949, 950, 951,
    952, 953, 954, 955, 956, 957, 958, 959,
    960, 961, 962, 963, 964, 965, 966, 967,
    968, 969, 970, 971, 972, 973, 974, null,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-8", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, null, 162, 163, 164, 165, 166, 167,
    168, 169, 215, 171, 172, 173, 174, 175,
    176, 177, 178, 179, 180, 181, 182, 183,
    184, 185, 247, 187, 188, 189, 190, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, 8215,
    1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495,
    1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503,
    1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511,
    1512, 1513, 1514, null, null, 8206, 8207, null,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-10", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 260, 274, 290, 298, 296, 310, 167,
    315, 272, 352, 358, 381, 173, 362, 330,
    176, 261, 275, 291, 299, 297, 311, 183,
    316, 273, 353, 359, 382, 8213, 363, 331,
    256, 193, 194, 195, 196, 197, 198, 302,
    268, 201, 280, 203, 278, 205, 206, 207,
    208, 325, 332, 211, 212, 213, 214, 360,
    216, 370, 218, 219, 220, 221, 222, 223,
    257, 225, 226, 227, 228, 229, 230, 303,
    269, 233, 281, 235, 279, 237, 238, 239,
    240, 326, 333, 243, 244, 245, 246, 361,
    248, 371, 250, 251, 252, 253, 254, 312,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-13", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 8221, 162, 163, 164, 8222, 166, 167,
    216, 169, 342, 171, 172, 173, 174, 198,
    176, 177, 178, 179, 8220, 181, 182, 183,
    248, 185, 343, 187, 188, 189, 190, 230,
    260, 302, 256, 262, 196, 197, 280, 274,
    268, 201, 377, 278, 290, 310, 298, 315,
    352, 323, 325, 211, 332, 213, 214, 215,
    370, 321, 346, 362, 220, 379, 381, 223,
    261, 303, 257, 263, 228, 229, 281, 275,
    269, 233, 378, 279, 291, 311, 299, 316,
    353, 324, 326, 243, 333, 245, 246, 247,
    371, 322, 347, 363, 252, 380, 382, 8217,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-14", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 7682, 7683, 163, 266, 267, 7690, 167,
    7808, 169, 7810, 7691, 7922, 173, 174, 376,
    7710, 7711, 288, 289, 7744, 7745, 182, 7766,
    7809, 7767, 7811, 7776, 7923, 7812, 7813, 7777,
    192, 193, 194, 195, 196, 197, 198, 199,
    200, 201, 202, 203, 204, 205, 206, 207,
    372, 209, 210, 211, 212, 213, 214, 7786,
    216, 217, 218, 219, 220, 221, 374, 223,
    224, 225, 226, 227, 228, 229, 230, 231,
    232, 233, 234, 235, 236, 237, 238, 239,
    373, 241, 242, 243, 244, 245, 246, 7787,
    248, 249, 250, 251, 252, 253, 375, 255,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-15", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 161, 162, 163, 8364, 165, 352, 167,
    353, 169, 170, 171, 172, 173, 174, 175,
    176, 177, 178, 179, 381, 181, 182, 183,
    382, 185, 186, 187, 338, 339, 376, 191,
    192, 193, 194, 195, 196, 197, 198, 199,
    200, 201, 202, 203, 204, 205, 206, 207,
    208, 209, 210, 211, 212, 213, 214, 215,
    216, 217, 218, 219, 220, 221, 222, 223,
    224, 225, 226, 227, 228, 229, 230, 231,
    232, 233, 234, 235, 236, 237, 238, 239,
    240, 241, 242, 243, 244, 245, 246, 247,
    248, 249, 250, 251, 252, 253, 254, 255,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("iso-8859-16", [
    128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 260, 261, 321, 8364, 8222, 352, 167,
    353, 169, 536, 171, 377, 173, 378, 379,
    176, 177, 268, 322, 381, 8221, 182, 183,
    382, 269, 537, 187, 338, 339, 376, 380,
    192, 193, 194, 258, 196, 262, 198, 199,
    200, 201, 202, 203, 204, 205, 206, 207,
    272, 323, 210, 211, 212, 336, 214, 346,
    368, 217, 218, 219, 220, 280, 538, 223,
    224, 225, 226, 259, 228, 263, 230, 231,
    232, 233, 234, 235, 236, 237, 238, 239,
    273, 324, 242, 243, 244, 337, 246, 347,
    369, 249, 250, 251, 252, 281, 539, 255,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("koi8-r", [
    9472, 9474, 9484, 9488, 9492, 9496, 9500, 9508,
    9516, 9524, 9532, 9600, 9604, 9608, 9612, 9616,
    9617, 9618, 9619, 8992, 9632, 8729, 8730, 8776,
    8804, 8805, 160, 8993, 176, 178, 183, 247,
    9552, 9553, 9554, 1105, 9555, 9556, 9557, 9558,
    9559, 9560, 9561, 9562, 9563, 9564, 9565, 9566,
    9567, 9568, 9569, 1025, 9570, 9571, 9572, 9573,
    9574, 9575, 9576, 9577, 9578, 9579, 9580, 169,
    1102, 1072, 1073, 1094, 1076, 1077, 1092, 1075,
    1093, 1080, 1081, 1082, 1083, 1084, 1085, 1086,
    1087, 1103, 1088, 1089, 1090, 1091, 1078, 1074,
    1100, 1099, 1079, 1096, 1101, 1097, 1095, 1098,
    1070, 1040, 1041, 1062, 1044, 1045, 1060, 1043,
    1061, 1048, 1049, 1050, 1051, 1052, 1053, 1054,
    1055, 1071, 1056, 1057, 1058, 1059, 1046, 1042,
    1068, 1067, 1047, 1064, 1069, 1065, 1063, 1066,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("koi8-u", [
    9472, 9474, 9484, 9488, 9492, 9496, 9500, 9508,
    9516, 9524, 9532, 9600, 9604, 9608, 9612, 9616,
    9617, 9618, 9619, 8992, 9632, 8729, 8730, 8776,
    8804, 8805, 160, 8993, 176, 178, 183, 247,
    9552, 9553, 9554, 1105, 1108, 9556, 1110, 1111,
    9559, 9560, 9561, 9562, 9563, 1169, 1118, 9566,
    9567, 9568, 9569, 1025, 1028, 9571, 1030, 1031,
    9574, 9575, 9576, 9577, 9578, 1168, 1038, 169,
    1102, 1072, 1073, 1094, 1076, 1077, 1092, 1075,
    1093, 1080, 1081, 1082, 1083, 1084, 1085, 1086,
    1087, 1103, 1088, 1089, 1090, 1091, 1078, 1074,
    1100, 1099, 1079, 1096, 1101, 1097, 1095, 1098,
    1070, 1040, 1041, 1062, 1044, 1045, 1060, 1043,
    1061, 1048, 1049, 1050, 1051, 1052, 1053, 1054,
    1055, 1071, 1056, 1057, 1058, 1059, 1046, 1042,
    1068, 1067, 1047, 1064, 1069, 1065, 1063, 1066,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("macintosh", [
    196, 197, 199, 201, 209, 214, 220, 225,
    224, 226, 228, 227, 229, 231, 233, 232,
    234, 235, 237, 236, 238, 239, 241, 243,
    242, 244, 246, 245, 250, 249, 251, 252,
    8224, 176, 162, 163, 167, 8226, 182, 223,
    174, 169, 8482, 180, 168, 8800, 198, 216,
    8734, 177, 8804, 8805, 165, 181, 8706, 8721,
    8719, 960, 8747, 170, 186, 937, 230, 248,
    191, 161, 172, 8730, 402, 8776, 8710, 171,
    187, 8230, 160, 192, 195, 213, 338, 339,
    8211, 8212, 8220, 8221, 8216, 8217, 247, 9674,
    255, 376, 8260, 8364, 8249, 8250, 64257, 64258,
    8225, 183, 8218, 8222, 8240, 194, 202, 193,
    203, 200, 205, 206, 207, 204, 211, 212,
    63743, 210, 218, 219, 217, 305, 710, 732,
    175, 728, 729, 730, 184, 733, 731, 711,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-874", [
    8364, 129, 130, 131, 132, 8230, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143,
    144, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    152, 153, 154, 155, 156, 157, 158, 159,
    160, 3585, 3586, 3587, 3588, 3589, 3590, 3591,
    3592, 3593, 3594, 3595, 3596, 3597, 3598, 3599,
    3600, 3601, 3602, 3603, 3604, 3605, 3606, 3607,
    3608, 3609, 3610, 3611, 3612, 3613, 3614, 3615,
    3616, 3617, 3618, 3619, 3620, 3621, 3622, 3623,
    3624, 3625, 3626, 3627, 3628, 3629, 3630, 3631,
    3632, 3633, 3634, 3635, 3636, 3637, 3638, 3639,
    3640, 3641, 3642, null, null, null, null, 3647,
    3648, 3649, 3650, 3651, 3652, 3653, 3654, 3655,
    3656, 3657, 3658, 3659, 3660, 3661, 3662, 3663,
    3664, 3665, 3666, 3667, 3668, 3669, 3670, 3671,
    3672, 3673, 3674, 3675, null, null, null, null,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-1250", [
    8364, 129, 8218, 131, 8222, 8230, 8224, 8225,
    136, 8240, 352, 8249, 346, 356, 381, 377,
    144, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    152, 8482, 353, 8250, 347, 357, 382, 378,
    160, 711, 728, 321, 164, 260, 166, 167,
    168, 169, 350, 171, 172, 173, 174, 379,
    176, 177, 731, 322, 180, 181, 182, 183,
    184, 261, 351, 187, 317, 733, 318, 380,
    340, 193, 194, 258, 196, 313, 262, 199,
    268, 201, 280, 203, 282, 205, 206, 270,
    272, 323, 327, 211, 212, 336, 214, 215,
    344, 366, 218, 368, 220, 221, 354, 223,
    341, 225, 226, 259, 228, 314, 263, 231,
    269, 233, 281, 235, 283, 237, 238, 271,
    273, 324, 328, 243, 244, 337, 246, 247,
    345, 367, 250, 369, 252, 253, 355, 729,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-1251", [
    1026, 1027, 8218, 1107, 8222, 8230, 8224, 8225,
    8364, 8240, 1033, 8249, 1034, 1036, 1035, 1039,
    1106, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    152, 8482, 1113, 8250, 1114, 1116, 1115, 1119,
    160, 1038, 1118, 1032, 164, 1168, 166, 167,
    1025, 169, 1028, 171, 172, 173, 174, 1031,
    176, 177, 1030, 1110, 1169, 181, 182, 183,
    1105, 8470, 1108, 187, 1112, 1029, 1109, 1111,
    1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047,
    1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055,
    1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063,
    1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071,
    1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079,
    1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087,
    1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095,
    1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-1253", [
    8364, 129, 8218, 402, 8222, 8230, 8224, 8225,
    136, 8240, 138, 8249, 140, 141, 142, 143,
    144, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    152, 8482, 154, 8250, 156, 157, 158, 159,
    160, 901, 902, 163, 164, 165, 166, 167,
    168, 169, null, 171, 172, 173, 174, 8213,
    176, 177, 178, 179, 900, 181, 182, 183,
    904, 905, 906, 187, 908, 189, 910, 911,
    912, 913, 914, 915, 916, 917, 918, 919,
    920, 921, 922, 923, 924, 925, 926, 927,
    928, 929, null, 931, 932, 933, 934, 935,
    936, 937, 938, 939, 940, 941, 942, 943,
    944, 945, 946, 947, 948, 949, 950, 951,
    952, 953, 954, 955, 956, 957, 958, 959,
    960, 961, 962, 963, 964, 965, 966, 967,
    968, 969, 970, 971, 972, 973, 974, null,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-1254", [
    8364, 129, 8218, 402, 8222, 8230, 8224, 8225,
    710, 8240, 352, 8249, 338, 141, 142, 143,
    144, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    732, 8482, 353, 8250, 339, 157, 158, 376,
    160, 161, 162, 163, 164, 165, 166, 167,
    168, 169, 170, 171, 172, 173, 174, 175,
    176, 177, 178, 179, 180, 181, 182, 183,
    184, 185, 186, 187, 188, 189, 190, 191,
    192, 193, 194, 195, 196, 197, 198, 199,
    200, 201, 202, 203, 204, 205, 206, 207,
    286, 209, 210, 211, 212, 213, 214, 215,
    216, 217, 218, 219, 220, 304, 350, 223,
    224, 225, 226, 227, 228, 229, 230, 231,
    232, 233, 234, 235, 236, 237, 238, 239,
    287, 241, 242, 243, 244, 245, 246, 247,
    248, 249, 250, 251, 252, 305, 351, 255,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-1255", [
    8364, 129, 8218, 402, 8222, 8230, 8224, 8225,
    710, 8240, 138, 8249, 140, 141, 142, 143,
    144, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    732, 8482, 154, 8250, 156, 157, 158, 159,
    160, 161, 162, 163, 8362, 165, 166, 167,
    168, 169, 215, 171, 172, 173, 174, 175,
    176, 177, 178, 179, 180, 181, 182, 183,
    184, 185, 247, 187, 188, 189, 190, 191,
    1456, 1457, 1458, 1459, 1460, 1461, 1462, 1463,
    1464, 1465, 1466, 1467, 1468, 1469, 1470, 1471,
    1472, 1473, 1474, 1475, 1520, 1521, 1522, 1523,
    1524, null, null, null, null, null, null, null,
    1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495,
    1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503,
    1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511,
    1512, 1513, 1514, null, null, 8206, 8207, null,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-1256", [
    8364, 1662, 8218, 402, 8222, 8230, 8224, 8225,
    710, 8240, 1657, 8249, 338, 1670, 1688, 1672,
    1711, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    1705, 8482, 1681, 8250, 339, 8204, 8205, 1722,
    160, 1548, 162, 163, 164, 165, 166, 167,
    168, 169, 1726, 171, 172, 173, 174, 175,
    176, 177, 178, 179, 180, 181, 182, 183,
    184, 185, 1563, 187, 188, 189, 190, 1567,
    1729, 1569, 1570, 1571, 1572, 1573, 1574, 1575,
    1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583,
    1584, 1585, 1586, 1587, 1588, 1589, 1590, 215,
    1591, 1592, 1593, 1594, 1600, 1601, 1602, 1603,
    224, 1604, 226, 1605, 1606, 1607, 1608, 231,
    232, 233, 234, 235, 1609, 1610, 238, 239,
    1611, 1612, 1613, 1614, 244, 1615, 1616, 247,
    1617, 249, 1618, 251, 252, 8206, 8207, 1746,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-1257", [
    8364, 129, 8218, 131, 8222, 8230, 8224, 8225,
    136, 8240, 138, 8249, 140, 168, 711, 184,
    144, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    152, 8482, 154, 8250, 156, 175, 731, 159,
    160, null, 162, 163, 164, null, 166, 167,
    216, 169, 342, 171, 172, 173, 174, 198,
    176, 177, 178, 179, 180, 181, 182, 183,
    248, 185, 343, 187, 188, 189, 190, 230,
    260, 302, 256, 262, 196, 197, 280, 274,
    268, 201, 377, 278, 290, 310, 298, 315,
    352, 323, 325, 211, 332, 213, 214, 215,
    370, 321, 346, 362, 220, 379, 381, 223,
    261, 303, 257, 263, 228, 229, 281, 275,
    269, 233, 378, 279, 291, 311, 299, 316,
    353, 324, 326, 243, 333, 245, 246, 247,
    371, 322, 347, 363, 252, 380, 382, 729,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("windows-1258", [
    8364, 129, 8218, 402, 8222, 8230, 8224, 8225,
    710, 8240, 138, 8249, 338, 141, 142, 143,
    144, 8216, 8217, 8220, 8221, 8226, 8211, 8212,
    732, 8482, 154, 8250, 339, 157, 158, 376,
    160, 161, 162, 163, 164, 165, 166, 167,
    168, 169, 170, 171, 172, 173, 174, 175,
    176, 177, 178, 179, 180, 181, 182, 183,
    184, 185, 186, 187, 188, 189, 190, 191,
    192, 193, 194, 258, 196, 197, 198, 199,
    200, 201, 202, 203, 768, 205, 206, 207,
    272, 209, 777, 211, 212, 416, 214, 215,
    216, 217, 218, 219, 220, 431, 771, 223,
    224, 225, 226, 259, 228, 229, 230, 231,
    232, 233, 234, 235, 769, 237, 238, 239,
    273, 241, 803, 243, 244, 417, 246, 247,
    248, 249, 250, 251, 252, 432, 8363, 255,
  ]);

  // deno-fmt-ignore
  encodingIndexes.set("x-mac-cyrillic", [
    1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047,
    1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055,
    1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063,
    1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071,
    8224, 176, 1168, 163, 167, 8226, 182, 1030,
    174, 169, 8482, 1026, 1106, 8800, 1027, 1107,
    8734, 177, 8804, 8805, 1110, 181, 1169, 1032,
    1028, 1108, 1031, 1111, 1033, 1113, 1034, 1114,
    1112, 1029, 172, 8730, 402, 8776, 8710, 171,
    187, 8230, 160, 1035, 1115, 1036, 1116, 1109,
    8211, 8212, 8220, 8221, 8216, 8217, 247, 8222,
    1038, 1118, 1039, 1119, 8470, 1025, 1105, 1103,
    1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079,
    1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087,
    1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095,
    1096, 1097, 1098, 1099, 1100, 1101, 1102, 8364,
  ]);

  for (const [key, index] of encodingIndexes) {
    decoders.set(key, (options) => {
      return new SingleByteDecoder(index, options);
    });
  }

  function codePointsToString(codePoints) {
    let s = "";
    for (const cp of codePoints) {
      s += String.fromCodePoint(cp);
    }
    return s;
  }

  class Stream {
    #tokens = [];
    constructor(tokens) {
      this.#tokens = [...tokens];
      this.#tokens.reverse();
    }

    endOfStream() {
      return !this.#tokens.length;
    }

    read() {
      return !this.#tokens.length ? END_OF_STREAM : this.#tokens.pop();
    }

    prepend(token) {
      if (Array.isArray(token)) {
        while (token.length) {
          this.#tokens.push(token.pop());
        }
      } else {
        this.#tokens.push(token);
      }
    }

    push(token) {
      if (Array.isArray(token)) {
        while (token.length) {
          this.#tokens.unshift(token.shift());
        }
      } else {
        this.#tokens.unshift(token);
      }
    }
  }

  function isEitherArrayBuffer(x) {
    return (
      x instanceof SharedArrayBuffer ||
      x instanceof ArrayBuffer ||
      typeof x === "undefined"
    );
  }

  class TextDecoder {
    #encoding = "";

    get encoding() {
      return this.#encoding;
    }
    fatal = false;
    ignoreBOM = false;

    constructor(label = "utf-8", options = { fatal: false }) {
      if (options.ignoreBOM) {
        this.ignoreBOM = true;
      }
      if (options.fatal) {
        this.fatal = true;
      }
      label = String(label).trim().toLowerCase();
      const encoding = encodings.get(label);
      if (!encoding) {
        throw new RangeError(
          `The encoding label provided ('${label}') is invalid.`,
        );
      }
      if (!decoders.has(encoding) && encoding !== "utf-8") {
        throw new TypeError(`Internal decoder ('${encoding}') not found.`);
      }
      this.#encoding = encoding;
    }

    decode(input, options = { stream: false }) {
      if (options.stream) {
        throw new TypeError("Stream not supported.");
      }

      let bytes;
      if (input instanceof Uint8Array) {
        bytes = input;
      } else if (isEitherArrayBuffer(input)) {
        bytes = new Uint8Array(input);
      } else if (
        typeof input === "object" &&
        input !== null &&
        "buffer" in input &&
        isEitherArrayBuffer(input.buffer)
      ) {
        bytes = new Uint8Array(
          input.buffer,
          input.byteOffset,
          input.byteLength,
        );
      } else {
        throw new TypeError(
          "Provided input is not of type ArrayBuffer or ArrayBufferView",
        );
      }

      // For simple utf-8 decoding "Deno.core.decode" can be used for performance
      if (
        this.#encoding === "utf-8" &&
        this.fatal === false &&
        this.ignoreBOM === false
      ) {
        return core.decode(bytes);
      }

      // For performance reasons we utilise a highly optimised decoder instead of
      // the general decoder.
      if (this.#encoding === "utf-8") {
        return decodeUtf8(bytes, this.fatal, this.ignoreBOM);
      }

      const decoder = decoders.get(this.#encoding)({
        fatal: this.fatal,
        ignoreBOM: this.ignoreBOM,
      });
      const inputStream = new Stream(bytes);
      const output = [];

      while (true) {
        const result = decoder.handler(inputStream, inputStream.read());
        if (result === FINISHED) {
          break;
        }

        if (result !== CONTINUE) {
          output.push(result);
        }
      }

      if (output.length > 0 && output[0] === 0xfeff) {
        output.shift();
      }

      return codePointsToString(output);
    }

    get [Symbol.toStringTag]() {
      return "TextDecoder";
    }
  }

  class TextEncoder {
    encoding = "utf-8";
    encode(input = "") {
      // Deno.core.encode() provides very efficient utf-8 encoding
      if (this.encoding === "utf-8") {
        return core.encode(input);
      }

      const encoder = new UTF8Encoder();
      const inputStream = new Stream(stringToCodePoints(input));
      const output = [];

      while (true) {
        const result = encoder.handler(inputStream.read());
        if (result === "finished") {
          break;
        }
        output.push(...result);
      }

      return new Uint8Array(output);
    }
    encodeInto(input, dest) {
      const encoder = new UTF8Encoder();
      const inputStream = new Stream(stringToCodePoints(input));

      let written = 0;
      let read = 0;
      while (true) {
        const result = encoder.handler(inputStream.read());
        if (result === "finished") {
          break;
        }
        if (dest.length - written >= result.length) {
          read++;
          dest.set(result, written);
          written += result.length;
          if (result.length > 3) {
            // increment read a second time if greater than U+FFFF
            read++;
          }
        } else {
          break;
        }
      }

      return {
        read,
        written,
      };
    }
    get [Symbol.toStringTag]() {
      return "TextEncoder";
    }
  }

  // This function is based on Bjoern Hoehrmann's DFA UTF-8 decoder.
  // See http://bjoern.hoehrmann.de/utf-8/decoder/dfa/ for details.
  //
  // Copyright (c) 2008-2009 Bjoern Hoehrmann <bjoern@hoehrmann.de>
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the "Software"), to deal
  // in the Software without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  //
  // The above copyright notice and this permission notice shall be included in
  // all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  // SOFTWARE.
  function decodeUtf8(input, fatal, ignoreBOM) {
    let outString = "";

    // Prepare a buffer so that we don't have to do a lot of string concats, which
    // are very slow.
    const outBufferLength = Math.min(1024, input.length);
    const outBuffer = new Uint16Array(outBufferLength);
    let outIndex = 0;

    let state = 0;
    let codepoint = 0;
    let type;

    let i =
      ignoreBOM && input[0] === 0xef && input[1] === 0xbb && input[2] === 0xbf
        ? 3
        : 0;

    for (; i < input.length; ++i) {
      // Encoding error handling
      if (state === 12 || (state !== 0 && (input[i] & 0xc0) !== 0x80)) {
        if (fatal) {
          throw new TypeError(
            `Decoder error. Invalid byte in sequence at position ${i} in data.`,
          );
        }
        outBuffer[outIndex++] = 0xfffd; // Replacement character
        if (outIndex === outBufferLength) {
          outString += String.fromCharCode.apply(null, outBuffer);
          outIndex = 0;
        }
        state = 0;
      }

      // deno-fmt-ignore
      // deno-fmt-ignore
      type = [
         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
         1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,  9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,
         7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
         8,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2,  2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
        10,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3, 11,6,6,6,5,8,8,8,8,8,8,8,8,8,8,8
      ][input[i]];
      codepoint = state !== 0
        ? (input[i] & 0x3f) | (codepoint << 6)
        : (0xff >> type) & input[i];
      // deno-fmt-ignore
      // deno-fmt-ignore
      state = [
         0,12,24,36,60,96,84,12,12,12,48,72, 12,12,12,12,12,12,12,12,12,12,12,12,
        12, 0,12,12,12,12,12, 0,12, 0,12,12, 12,24,12,12,12,12,12,24,12,24,12,12,
        12,12,12,12,12,12,12,24,12,12,12,12, 12,24,12,12,12,12,12,12,12,24,12,12,
        12,12,12,12,12,12,12,36,12,36,12,12, 12,36,12,12,12,12,12,36,12,36,12,12,
        12,36,12,12,12,12,12,12,12,12,12,12
      ][state + type];

      if (state !== 0) continue;

      // Add codepoint to buffer (as charcodes for utf-16), and flush buffer to
      // string if needed.
      if (codepoint > 0xffff) {
        outBuffer[outIndex++] = 0xd7c0 + (codepoint >> 10);
        if (outIndex === outBufferLength) {
          outString += String.fromCharCode.apply(null, outBuffer);
          outIndex = 0;
        }
        outBuffer[outIndex++] = 0xdc00 | (codepoint & 0x3ff);
        if (outIndex === outBufferLength) {
          outString += String.fromCharCode.apply(null, outBuffer);
          outIndex = 0;
        }
      } else {
        outBuffer[outIndex++] = codepoint;
        if (outIndex === outBufferLength) {
          outString += String.fromCharCode.apply(null, outBuffer);
          outIndex = 0;
        }
      }
    }

    // Add a replacement character if we ended in the middle of a sequence or
    // encountered an invalid code at the end.
    if (state !== 0) {
      if (fatal) throw new TypeError(`Decoder error. Unexpected end of data.`);
      outBuffer[outIndex++] = 0xfffd; // Replacement character
    }

    // Final flush of buffer
    outString += String.fromCharCode.apply(
      null,
      outBuffer.subarray(0, outIndex),
    );

    return outString;
  }

  // Following code is forked from https://github.com/beatgammit/base64-js
  // Copyright (c) 2014 Jameson Little. MIT License.
  const lookup = [];
  const revLookup = [];

  const code =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (let i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;

  function getLens(b64) {
    const len = b64.length;

    if (len % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }

    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    let validLen = b64.indexOf("=");
    if (validLen === -1) validLen = len;

    const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);

    return [validLen, placeHoldersLen];
  }

  // base64 is 4/3 + up to two characters of the original data
  function byteLength(b64) {
    const lens = getLens(b64);
    const validLen = lens[0];
    const placeHoldersLen = lens[1];
    return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
  }

  function _byteLength(b64, validLen, placeHoldersLen) {
    return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
  }

  function toByteArray(b64) {
    let tmp;
    const lens = getLens(b64);
    const validLen = lens[0];
    const placeHoldersLen = lens[1];

    const arr = new Uint8Array(_byteLength(b64, validLen, placeHoldersLen));

    let curByte = 0;

    // if there are placeholders, only get up to the last complete 4 chars
    const len = placeHoldersLen > 0 ? validLen - 4 : validLen;

    let i;
    for (i = 0; i < len; i += 4) {
      tmp = (revLookup[b64.charCodeAt(i)] << 18) |
        (revLookup[b64.charCodeAt(i + 1)] << 12) |
        (revLookup[b64.charCodeAt(i + 2)] << 6) |
        revLookup[b64.charCodeAt(i + 3)];
      arr[curByte++] = (tmp >> 16) & 0xff;
      arr[curByte++] = (tmp >> 8) & 0xff;
      arr[curByte++] = tmp & 0xff;
    }

    if (placeHoldersLen === 2) {
      tmp = (revLookup[b64.charCodeAt(i)] << 2) |
        (revLookup[b64.charCodeAt(i + 1)] >> 4);
      arr[curByte++] = tmp & 0xff;
    }

    if (placeHoldersLen === 1) {
      tmp = (revLookup[b64.charCodeAt(i)] << 10) |
        (revLookup[b64.charCodeAt(i + 1)] << 4) |
        (revLookup[b64.charCodeAt(i + 2)] >> 2);
      arr[curByte++] = (tmp >> 8) & 0xff;
      arr[curByte++] = tmp & 0xff;
    }

    return arr;
  }

  function tripletToBase64(num) {
    return (
      lookup[(num >> 18) & 0x3f] +
      lookup[(num >> 12) & 0x3f] +
      lookup[(num >> 6) & 0x3f] +
      lookup[num & 0x3f]
    );
  }

  function encodeChunk(uint8, start, end) {
    let tmp;
    const output = [];
    for (let i = start; i < end; i += 3) {
      tmp = ((uint8[i] << 16) & 0xff0000) +
        ((uint8[i + 1] << 8) & 0xff00) +
        (uint8[i + 2] & 0xff);
      output.push(tripletToBase64(tmp));
    }
    return output.join("");
  }

  function fromByteArray(uint8) {
    let tmp;
    const len = uint8.length;
    const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
    const parts = [];
    const maxChunkLength = 16383; // must be multiple of 3

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(
        encodeChunk(
          uint8,
          i,
          i + maxChunkLength > len2 ? len2 : i + maxChunkLength,
        ),
      );
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + "==");
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1];
      parts.push(
        lookup[tmp >> 10] +
          lookup[(tmp >> 4) & 0x3f] +
          lookup[(tmp << 2) & 0x3f] +
          "=",
      );
    }

    return parts.join("");
  }

  const base64 = {
    byteLength,
    toByteArray,
    fromByteArray,
  };

  window.TextEncoder = TextEncoder;
  window.TextDecoder = TextDecoder;
  window.atob = atob;
  window.btoa = btoa;
  window.__bootstrap = window.__bootstrap || {};
  window.__bootstrap.base64 = base64;
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const util = window.__bootstrap.util;

  // Using an object without a prototype because `Map` was causing GC problems.
  const promiseTableMin = Object.create(null);

  const decoder = new TextDecoder();

  // Note it's important that promiseId starts at 1 instead of 0, because sync
  // messages are indicated with promiseId 0. If we ever add wrap around logic for
  // overflows, this should be taken into account.
  let _nextPromiseId = 1;

  function nextPromiseId() {
    return _nextPromiseId++;
  }

  function recordFromBufMinimal(ui8) {
    const headerLen = 12;
    const header = ui8.subarray(0, headerLen);
    const buf32 = new Int32Array(
      header.buffer,
      header.byteOffset,
      header.byteLength / 4,
    );
    const promiseId = buf32[0];
    const arg = buf32[1];
    const result = buf32[2];
    let err;

    if (arg < 0) {
      err = {
        className: decoder.decode(ui8.subarray(headerLen, headerLen + result)),
        message: decoder.decode(ui8.subarray(headerLen + result)),
      };
    } else if (ui8.length != 12) {
      throw new TypeError("Malformed response message");
    }

    return {
      promiseId,
      arg,
      result,
      err,
    };
  }

  function unwrapResponse(res) {
    if (res.err != null) {
      const ErrorClass = core.getErrorClass(res.err.className);
      if (!ErrorClass) {
        throw new Error(
          `Unregistered error class: "${res.err.className}"\n  ${res.err.message}\n  Classes of errors returned from ops should be registered via Deno.core.registerErrorClass().`,
        );
      }
      throw new ErrorClass(res.err.message);
    }
    return res.result;
  }

  const scratch32 = new Int32Array(3);
  const scratchBytes = new Uint8Array(
    scratch32.buffer,
    scratch32.byteOffset,
    scratch32.byteLength,
  );
  util.assert(scratchBytes.byteLength === scratch32.length * 4);

  function asyncMsgFromRust(ui8) {
    const record = recordFromBufMinimal(ui8);
    const { promiseId } = record;
    const promise = promiseTableMin[promiseId];
    delete promiseTableMin[promiseId];
    util.assert(promise);
    promise.resolve(record);
  }

  async function sendAsync(opName, arg, zeroCopy) {
    const promiseId = nextPromiseId(); // AKA cmdId
    scratch32[0] = promiseId;
    scratch32[1] = arg;
    scratch32[2] = 0; // result
    const promise = util.createResolvable();
    const buf = core.dispatchByName(opName, scratchBytes, zeroCopy);
    if (buf != null) {
      const record = recordFromBufMinimal(buf);
      // Sync result.
      promise.resolve(record);
    } else {
      // Async result.
      promiseTableMin[promiseId] = promise;
    }

    const res = await promise;
    return unwrapResponse(res);
  }

  function sendSync(opName, arg, zeroCopy) {
    scratch32[0] = 0; // promiseId 0 indicates sync
    scratch32[1] = arg;
    const res = core.dispatchByName(opName, scratchBytes, zeroCopy);
    const resRecord = recordFromBufMinimal(res);
    return unwrapResponse(resRecord);
  }

  window.__bootstrap.dispatchMinimal = {
    asyncMsgFromRust,
    sendSync,
    sendAsync,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { assert } = window.__bootstrap.util;

  function getRandomValues(typedArray) {
    assert(typedArray !== null, "Input must not be null");
    assert(typedArray.length <= 65536, "Input must not be longer than 65536");
    const ui8 = new Uint8Array(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    core.jsonOpSync("op_get_random_values", {}, ui8);
    return typedArray;
  }

  window.__bootstrap.crypto = {
    getRandomValues,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This code closely follows the WHATWG Stream Specification
// See: https://streams.spec.whatwg.org/
//
// There are some parts that are not fully implemented, and there are some
// comments which point to steps of the specification that are not implemented.

((window) => {
  /* eslint-disable @typescript-eslint/no-explicit-any,require-await */

  const customInspect = Symbol.for("Deno.customInspect");

  /** Clone a value in a similar way to structured cloning.  It is similar to a
 * StructureDeserialize(StructuredSerialize(...)). */
  function cloneValue(value) {
    switch (typeof value) {
      case "number":
      case "string":
      case "boolean":
      case "undefined":
      case "bigint":
        return value;
      case "object": {
        if (objectCloneMemo.has(value)) {
          return objectCloneMemo.get(value);
        }
        if (value === null) {
          return value;
        }
        if (value instanceof Date) {
          return new Date(value.valueOf());
        }
        if (value instanceof RegExp) {
          return new RegExp(value);
        }
        if (value instanceof SharedArrayBuffer) {
          return value;
        }
        if (value instanceof ArrayBuffer) {
          const cloned = cloneArrayBuffer(
            value,
            0,
            value.byteLength,
            ArrayBuffer,
          );
          objectCloneMemo.set(value, cloned);
          return cloned;
        }
        if (ArrayBuffer.isView(value)) {
          const clonedBuffer = cloneValue(value.buffer);
          // Use DataViewConstructor type purely for type-checking, can be a
          // DataView or TypedArray.  They use the same constructor signature,
          // only DataView has a length in bytes and TypedArrays use a length in
          // terms of elements, so we adjust for that.
          let length;
          if (value instanceof DataView) {
            length = value.byteLength;
          } else {
            length = value.length;
          }
          return new (value.constructor)(
            clonedBuffer,
            value.byteOffset,
            length,
          );
        }
        if (value instanceof Map) {
          const clonedMap = new Map();
          objectCloneMemo.set(value, clonedMap);
          value.forEach((v, k) => clonedMap.set(k, cloneValue(v)));
          return clonedMap;
        }
        if (value instanceof Set) {
          const clonedSet = new Map();
          objectCloneMemo.set(value, clonedSet);
          value.forEach((v, k) => clonedSet.set(k, cloneValue(v)));
          return clonedSet;
        }

        const clonedObj = {};
        objectCloneMemo.set(value, clonedObj);
        const sourceKeys = Object.getOwnPropertyNames(value);
        for (const key of sourceKeys) {
          clonedObj[key] = cloneValue(value[key]);
        }
        return clonedObj;
      }
      case "symbol":
      case "function":
      default:
        throw new DOMException("Uncloneable value in stream", "DataCloneError");
    }
  }

  function setFunctionName(fn, value) {
    Object.defineProperty(fn, "name", { value, configurable: true });
  }

  class AssertionError extends Error {
    constructor(msg) {
      super(msg);
      this.name = "AssertionError";
    }
  }

  function assert(cond, msg = "Assertion failed.") {
    if (!cond) {
      throw new AssertionError(msg);
    }
  }

  const sym = {
    abortAlgorithm: Symbol("abortAlgorithm"),
    abortSteps: Symbol("abortSteps"),
    asyncIteratorReader: Symbol("asyncIteratorReader"),
    autoAllocateChunkSize: Symbol("autoAllocateChunkSize"),
    backpressure: Symbol("backpressure"),
    backpressureChangePromise: Symbol("backpressureChangePromise"),
    byobRequest: Symbol("byobRequest"),
    cancelAlgorithm: Symbol("cancelAlgorithm"),
    cancelSteps: Symbol("cancelSteps"),
    closeAlgorithm: Symbol("closeAlgorithm"),
    closedPromise: Symbol("closedPromise"),
    closeRequest: Symbol("closeRequest"),
    closeRequested: Symbol("closeRequested"),
    controlledReadableByteStream: Symbol(
      "controlledReadableByteStream",
    ),
    controlledReadableStream: Symbol("controlledReadableStream"),
    controlledTransformStream: Symbol("controlledTransformStream"),
    controlledWritableStream: Symbol("controlledWritableStream"),
    disturbed: Symbol("disturbed"),
    errorSteps: Symbol("errorSteps"),
    flushAlgorithm: Symbol("flushAlgorithm"),
    forAuthorCode: Symbol("forAuthorCode"),
    inFlightWriteRequest: Symbol("inFlightWriteRequest"),
    inFlightCloseRequest: Symbol("inFlightCloseRequest"),
    isFakeDetached: Symbol("isFakeDetached"),
    ownerReadableStream: Symbol("ownerReadableStream"),
    ownerWritableStream: Symbol("ownerWritableStream"),
    pendingAbortRequest: Symbol("pendingAbortRequest"),
    preventCancel: Symbol("preventCancel"),
    pullAgain: Symbol("pullAgain"),
    pullAlgorithm: Symbol("pullAlgorithm"),
    pulling: Symbol("pulling"),
    pullSteps: Symbol("pullSteps"),
    queue: Symbol("queue"),
    queueTotalSize: Symbol("queueTotalSize"),
    readable: Symbol("readable"),
    readableStreamController: Symbol("readableStreamController"),
    reader: Symbol("reader"),
    readRequests: Symbol("readRequests"),
    readyPromise: Symbol("readyPromise"),
    started: Symbol("started"),
    state: Symbol("state"),
    storedError: Symbol("storedError"),
    strategyHWM: Symbol("strategyHWM"),
    strategySizeAlgorithm: Symbol("strategySizeAlgorithm"),
    transformAlgorithm: Symbol("transformAlgorithm"),
    transformStreamController: Symbol("transformStreamController"),
    writableStreamController: Symbol("writableStreamController"),
    writeAlgorithm: Symbol("writeAlgorithm"),
    writable: Symbol("writable"),
    writer: Symbol("writer"),
    writeRequests: Symbol("writeRequests"),
  };
  class ReadableByteStreamController {
    constructor() {
      throw new TypeError(
        "ReadableByteStreamController's constructor cannot be called.",
      );
    }

    get byobRequest() {
      return undefined;
    }

    get desiredSize() {
      if (!isReadableByteStreamController(this)) {
        throw new TypeError("Invalid ReadableByteStreamController.");
      }
      return readableByteStreamControllerGetDesiredSize(this);
    }

    close() {
      if (!isReadableByteStreamController(this)) {
        throw new TypeError("Invalid ReadableByteStreamController.");
      }
      if (this[sym.closeRequested]) {
        throw new TypeError("Closed already requested.");
      }
      if (this[sym.controlledReadableByteStream][sym.state] !== "readable") {
        throw new TypeError(
          "ReadableByteStreamController's stream is not in a readable state.",
        );
      }
      readableByteStreamControllerClose(this);
    }

    enqueue(chunk) {
      if (!isReadableByteStreamController(this)) {
        throw new TypeError("Invalid ReadableByteStreamController.");
      }
      if (this[sym.closeRequested]) {
        throw new TypeError("Closed already requested.");
      }
      if (this[sym.controlledReadableByteStream][sym.state] !== "readable") {
        throw new TypeError(
          "ReadableByteStreamController's stream is not in a readable state.",
        );
      }
      if (!ArrayBuffer.isView(chunk)) {
        throw new TypeError(
          "You can only enqueue array buffer views when using a ReadableByteStreamController",
        );
      }
      if (isDetachedBuffer(chunk.buffer)) {
        throw new TypeError(
          "Cannot enqueue a view onto a detached ArrayBuffer",
        );
      }
      readableByteStreamControllerEnqueue(this, chunk);
    }

    error(error) {
      if (!isReadableByteStreamController(this)) {
        throw new TypeError("Invalid ReadableByteStreamController.");
      }
      readableByteStreamControllerError(this, error);
    }

    [sym.cancelSteps](reason) {
      // 3.11.5.1.1 If this.[[pendingPullIntos]] is not empty,
      resetQueue(this);
      const result = this[sym.cancelAlgorithm](reason);
      readableByteStreamControllerClearAlgorithms(this);
      return result;
    }

    [sym.pullSteps]() {
      const stream = this[sym.controlledReadableByteStream];
      assert(readableStreamHasDefaultReader(stream));
      if (this[sym.queueTotalSize] > 0) {
        assert(readableStreamGetNumReadRequests(stream) === 0);
        const entry = this[sym.queue].shift();
        assert(entry);
        this[sym.queueTotalSize] -= entry.size;
        readableByteStreamControllerHandleQueueDrain(this);
        const view = new Uint8Array(entry.value, entry.offset, entry.size);
        return Promise.resolve(
          readableStreamCreateReadResult(
            view,
            false,
            stream[sym.reader][sym.forAuthorCode],
          ),
        );
      }
      // 3.11.5.2.5 If autoAllocateChunkSize is not undefined,
      const promise = readableStreamAddReadRequest(stream);
      readableByteStreamControllerCallPullIfNeeded(this);
      return promise;
    }

    [customInspect]() {
      return `${this.constructor.name} { byobRequest: ${
        String(this.byobRequest)
      }, desiredSize: ${String(this.desiredSize)} }`;
    }
  }

  class ReadableStreamDefaultController {
    constructor() {
      throw new TypeError(
        "ReadableStreamDefaultController's constructor cannot be called.",
      );
    }

    get desiredSize() {
      if (!isReadableStreamDefaultController(this)) {
        throw new TypeError("Invalid ReadableStreamDefaultController.");
      }
      return readableStreamDefaultControllerGetDesiredSize(this);
    }

    close() {
      if (!isReadableStreamDefaultController(this)) {
        throw new TypeError("Invalid ReadableStreamDefaultController.");
      }
      if (!readableStreamDefaultControllerCanCloseOrEnqueue(this)) {
        throw new TypeError(
          "ReadableStreamDefaultController cannot close or enqueue.",
        );
      }
      readableStreamDefaultControllerClose(this);
    }

    enqueue(chunk) {
      if (!isReadableStreamDefaultController(this)) {
        throw new TypeError("Invalid ReadableStreamDefaultController.");
      }
      if (!readableStreamDefaultControllerCanCloseOrEnqueue(this)) {
        throw new TypeError("ReadableSteamController cannot enqueue.");
      }
      return readableStreamDefaultControllerEnqueue(this, chunk);
    }

    error(error) {
      if (!isReadableStreamDefaultController(this)) {
        throw new TypeError("Invalid ReadableStreamDefaultController.");
      }
      readableStreamDefaultControllerError(this, error);
    }

    [sym.cancelSteps](reason) {
      resetQueue(this);
      const result = this[sym.cancelAlgorithm](reason);
      readableStreamDefaultControllerClearAlgorithms(this);
      return result;
    }

    [sym.pullSteps]() {
      const stream = this[sym.controlledReadableStream];
      if (this[sym.queue].length) {
        const chunk = dequeueValue(this);
        if (this[sym.closeRequested] && this[sym.queue].length === 0) {
          readableStreamDefaultControllerClearAlgorithms(this);
          readableStreamClose(stream);
        } else {
          readableStreamDefaultControllerCallPullIfNeeded(this);
        }
        return Promise.resolve(
          readableStreamCreateReadResult(
            chunk,
            false,
            stream[sym.reader][sym.forAuthorCode],
          ),
        );
      }
      const pendingPromise = readableStreamAddReadRequest(stream);
      readableStreamDefaultControllerCallPullIfNeeded(this);
      return pendingPromise;
    }

    [customInspect]() {
      return `${this.constructor.name} { desiredSize: ${
        String(this.desiredSize)
      } }`;
    }
  }

  class ReadableStreamDefaultReader {
    constructor(stream) {
      if (!isReadableStream(stream)) {
        throw new TypeError("stream is not a ReadableStream.");
      }
      if (isReadableStreamLocked(stream)) {
        throw new TypeError("stream is locked.");
      }
      readableStreamReaderGenericInitialize(this, stream);
      this[sym.readRequests] = [];
    }

    get closed() {
      if (!isReadableStreamDefaultReader(this)) {
        return Promise.reject(
          new TypeError("Invalid ReadableStreamDefaultReader."),
        );
      }
      return (
        this[sym.closedPromise].promise ??
          Promise.reject(new TypeError("Invalid reader."))
      );
    }

    cancel(reason) {
      if (!isReadableStreamDefaultReader(this)) {
        return Promise.reject(
          new TypeError("Invalid ReadableStreamDefaultReader."),
        );
      }
      if (!this[sym.ownerReadableStream]) {
        return Promise.reject(new TypeError("Invalid reader."));
      }
      return readableStreamReaderGenericCancel(this, reason);
    }

    read() {
      if (!isReadableStreamDefaultReader(this)) {
        return Promise.reject(
          new TypeError("Invalid ReadableStreamDefaultReader."),
        );
      }
      if (!this[sym.ownerReadableStream]) {
        return Promise.reject(new TypeError("Invalid reader."));
      }
      return readableStreamDefaultReaderRead(this);
    }

    releaseLock() {
      if (!isReadableStreamDefaultReader(this)) {
        throw new TypeError("Invalid ReadableStreamDefaultReader.");
      }
      if (this[sym.ownerReadableStream] === undefined) {
        return;
      }
      if (this[sym.readRequests].length) {
        throw new TypeError("Cannot release lock with pending read requests.");
      }
      readableStreamReaderGenericRelease(this);
    }

    [customInspect]() {
      return `${this.constructor.name} { closed: Promise }`;
    }
  }

  const AsyncIteratorPrototype = Object
    .getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype);

  const ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf({
    next() {
      if (!isReadableStreamAsyncIterator(this)) {
        return Promise.reject(
          new TypeError("invalid ReadableStreamAsyncIterator."),
        );
      }
      const reader = this[sym.asyncIteratorReader];
      if (!reader[sym.ownerReadableStream]) {
        return Promise.reject(
          new TypeError("reader owner ReadableStream is undefined."),
        );
      }
      return readableStreamDefaultReaderRead(reader).then((result) => {
        assert(typeof result === "object");
        const { done } = result;
        assert(typeof done === "boolean");
        if (done) {
          readableStreamReaderGenericRelease(reader);
        }
        const { value } = result;
        return readableStreamCreateReadResult(value, done, true);
      });
    },
    return(
      value,
    ) {
      if (!isReadableStreamAsyncIterator(this)) {
        return Promise.reject(
          new TypeError("invalid ReadableStreamAsyncIterator."),
        );
      }
      const reader = this[sym.asyncIteratorReader];
      if (!reader[sym.ownerReadableStream]) {
        return Promise.reject(
          new TypeError("reader owner ReadableStream is undefined."),
        );
      }
      if (reader[sym.readRequests].length) {
        return Promise.reject(
          new TypeError("reader has outstanding read requests."),
        );
      }
      if (!this[sym.preventCancel]) {
        const result = readableStreamReaderGenericCancel(reader, value);
        readableStreamReaderGenericRelease(reader);
        return result.then(() =>
          readableStreamCreateReadResult(value, true, true)
        );
      }
      readableStreamReaderGenericRelease(reader);
      return Promise.resolve(
        readableStreamCreateReadResult(value, true, true),
      );
    },
  }, AsyncIteratorPrototype);

  class ReadableStream {
    constructor(
      underlyingSource = {},
      strategy = {},
    ) {
      initializeReadableStream(this);
      const { size } = strategy;
      let { highWaterMark } = strategy;
      const { type } = underlyingSource;

      if (underlyingSource.type == "bytes") {
        if (size !== undefined) {
          throw new RangeError(
            `When underlying source is "bytes", strategy.size must be undefined.`,
          );
        }
        highWaterMark = validateAndNormalizeHighWaterMark(highWaterMark ?? 0);
        setUpReadableByteStreamControllerFromUnderlyingSource(
          this,
          underlyingSource,
          highWaterMark,
        );
      } else if (type === undefined) {
        const sizeAlgorithm = makeSizeAlgorithmFromSizeFunction(size);
        highWaterMark = validateAndNormalizeHighWaterMark(highWaterMark ?? 1);
        setUpReadableStreamDefaultControllerFromUnderlyingSource(
          this,
          underlyingSource,
          highWaterMark,
          sizeAlgorithm,
        );
      } else {
        throw new RangeError(
          `Valid values for underlyingSource are "bytes" or undefined.  Received: "${type}".`,
        );
      }
    }

    get locked() {
      if (!isReadableStream(this)) {
        throw new TypeError("Invalid ReadableStream.");
      }
      return isReadableStreamLocked(this);
    }

    cancel(reason) {
      if (!isReadableStream(this)) {
        return Promise.reject(new TypeError("Invalid ReadableStream."));
      }
      if (isReadableStreamLocked(this)) {
        return Promise.reject(
          new TypeError("Cannot cancel a locked ReadableStream."),
        );
      }
      return readableStreamCancel(this, reason);
    }

    getIterator({
      preventCancel,
    } = {}) {
      if (!isReadableStream(this)) {
        throw new TypeError("Invalid ReadableStream.");
      }
      const reader = acquireReadableStreamDefaultReader(this);
      const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
      iterator[sym.asyncIteratorReader] = reader;
      iterator[sym.preventCancel] = Boolean(preventCancel);
      return iterator;
    }

    getReader({ mode } = {}) {
      if (!isReadableStream(this)) {
        throw new TypeError("Invalid ReadableStream.");
      }
      if (mode === undefined) {
        return acquireReadableStreamDefaultReader(this, true);
      }
      mode = String(mode);
      // 3.2.5.4.4 If mode is "byob", return ? AcquireReadableStreamBYOBReader(this, true).
      throw new RangeError(`Unsupported mode "${mode}"`);
    }

    pipeThrough(
      {
        writable,
        readable,
      },
      { preventClose, preventAbort, preventCancel, signal } = {},
    ) {
      if (!isReadableStream(this)) {
        throw new TypeError("Invalid ReadableStream.");
      }
      if (!isWritableStream(writable)) {
        throw new TypeError("writable is not a valid WritableStream.");
      }
      if (!isReadableStream(readable)) {
        throw new TypeError("readable is not a valid ReadableStream.");
      }
      preventClose = Boolean(preventClose);
      preventAbort = Boolean(preventAbort);
      preventCancel = Boolean(preventCancel);
      if (signal && !(signal instanceof AbortSignal)) {
        throw new TypeError("Invalid signal.");
      }
      if (isReadableStreamLocked(this)) {
        throw new TypeError("ReadableStream is locked.");
      }
      if (isWritableStreamLocked(writable)) {
        throw new TypeError("writable is locked.");
      }
      const promise = readableStreamPipeTo(
        this,
        writable,
        preventClose,
        preventAbort,
        preventCancel,
        signal,
      );
      setPromiseIsHandledToTrue(promise);
      return readable;
    }

    pipeTo(
      dest,
      { preventClose, preventAbort, preventCancel, signal } = {},
    ) {
      if (!isReadableStream(this)) {
        return Promise.reject(new TypeError("Invalid ReadableStream."));
      }
      if (!isWritableStream(dest)) {
        return Promise.reject(
          new TypeError("dest is not a valid WritableStream."),
        );
      }
      preventClose = Boolean(preventClose);
      preventAbort = Boolean(preventAbort);
      preventCancel = Boolean(preventCancel);
      if (signal && !(signal instanceof AbortSignal)) {
        return Promise.reject(new TypeError("Invalid signal."));
      }
      if (isReadableStreamLocked(this)) {
        return Promise.reject(new TypeError("ReadableStream is locked."));
      }
      if (isWritableStreamLocked(dest)) {
        return Promise.reject(new TypeError("dest is locked."));
      }
      return readableStreamPipeTo(
        this,
        dest,
        preventClose,
        preventAbort,
        preventCancel,
        signal,
      );
    }

    tee() {
      if (!isReadableStream(this)) {
        throw new TypeError("Invalid ReadableStream.");
      }
      return readableStreamTee(this, false);
    }

    [customInspect]() {
      return `${this.constructor.name} { locked: ${String(this.locked)} }`;
    }

    [Symbol.asyncIterator](
      options = {},
    ) {
      return this.getIterator(options);
    }
  }

  class TransformStream {
    constructor(
      transformer = {},
      writableStrategy = {},
      readableStrategy = {},
    ) {
      const writableSizeFunction = writableStrategy.size;
      let writableHighWaterMark = writableStrategy.highWaterMark;
      const readableSizeFunction = readableStrategy.size;
      let readableHighWaterMark = readableStrategy.highWaterMark;
      const writableType = transformer.writableType;
      if (writableType !== undefined) {
        throw new RangeError(
          `Expected transformer writableType to be undefined, received "${
            String(writableType)
          }"`,
        );
      }
      const writableSizeAlgorithm = makeSizeAlgorithmFromSizeFunction(
        writableSizeFunction,
      );
      if (writableHighWaterMark === undefined) {
        writableHighWaterMark = 1;
      }
      writableHighWaterMark = validateAndNormalizeHighWaterMark(
        writableHighWaterMark,
      );
      const readableType = transformer.readableType;
      if (readableType !== undefined) {
        throw new RangeError(
          `Expected transformer readableType to be undefined, received "${
            String(readableType)
          }"`,
        );
      }
      const readableSizeAlgorithm = makeSizeAlgorithmFromSizeFunction(
        readableSizeFunction,
      );
      if (readableHighWaterMark === undefined) {
        readableHighWaterMark = 1;
      }
      readableHighWaterMark = validateAndNormalizeHighWaterMark(
        readableHighWaterMark,
      );
      const startPromise = getDeferred();
      initializeTransformStream(
        this,
        startPromise.promise,
        writableHighWaterMark,
        writableSizeAlgorithm,
        readableHighWaterMark,
        readableSizeAlgorithm,
      );
      // the brand check expects this, and the brand check occurs in the following
      // but the property hasn't been defined.
      Object.defineProperty(this, sym.transformStreamController, {
        value: undefined,
        writable: true,
        configurable: true,
      });
      setUpTransformStreamDefaultControllerFromTransformer(this, transformer);
      const startResult = invokeOrNoop(
        transformer,
        "start",
        this[sym.transformStreamController],
      );
      startPromise.resolve(startResult);
    }

    get readable() {
      if (!isTransformStream(this)) {
        throw new TypeError("Invalid TransformStream.");
      }
      return this[sym.readable];
    }

    get writable() {
      if (!isTransformStream(this)) {
        throw new TypeError("Invalid TransformStream.");
      }
      return this[sym.writable];
    }

    [customInspect]() {
      return this.constructor.name;
    }
  }

  class TransformStreamDefaultController {
    constructor() {
      throw new TypeError(
        "TransformStreamDefaultController's constructor cannot be called.",
      );
    }

    get desiredSize() {
      if (!isTransformStreamDefaultController(this)) {
        throw new TypeError("Invalid TransformStreamDefaultController.");
      }
      const readableController = this[sym.controlledTransformStream][
        sym.readable
      ][sym.readableStreamController];
      return readableStreamDefaultControllerGetDesiredSize(
        readableController,
      );
    }

    enqueue(chunk) {
      if (!isTransformStreamDefaultController(this)) {
        throw new TypeError("Invalid TransformStreamDefaultController.");
      }
      transformStreamDefaultControllerEnqueue(this, chunk);
    }

    error(reason) {
      if (!isTransformStreamDefaultController(this)) {
        throw new TypeError("Invalid TransformStreamDefaultController.");
      }
      transformStreamDefaultControllerError(this, reason);
    }

    terminate() {
      if (!isTransformStreamDefaultController(this)) {
        throw new TypeError("Invalid TransformStreamDefaultController.");
      }
      transformStreamDefaultControllerTerminate(this);
    }

    [customInspect]() {
      return `${this.constructor.name} { desiredSize: ${
        String(this.desiredSize)
      } }`;
    }
  }

  class WritableStreamDefaultController {
    constructor() {
      throw new TypeError(
        "WritableStreamDefaultController's constructor cannot be called.",
      );
    }

    error(e) {
      if (!isWritableStreamDefaultController(this)) {
        throw new TypeError("Invalid WritableStreamDefaultController.");
      }
      const state = this[sym.controlledWritableStream][sym.state];
      if (state !== "writable") {
        return;
      }
      writableStreamDefaultControllerError(this, e);
    }

    [sym.abortSteps](reason) {
      const result = this[sym.abortAlgorithm](reason);
      writableStreamDefaultControllerClearAlgorithms(this);
      return result;
    }

    [sym.errorSteps]() {
      resetQueue(this);
    }

    [customInspect]() {
      return `${this.constructor.name} { }`;
    }
  }

  class WritableStreamDefaultWriter {
    constructor(stream) {
      if (!isWritableStream(stream)) {
        throw new TypeError("Invalid stream.");
      }
      if (isWritableStreamLocked(stream)) {
        throw new TypeError("Cannot create a writer for a locked stream.");
      }
      this[sym.ownerWritableStream] = stream;
      stream[sym.writer] = this;
      const state = stream[sym.state];
      if (state === "writable") {
        if (
          !writableStreamCloseQueuedOrInFlight(stream) &&
          stream[sym.backpressure]
        ) {
          this[sym.readyPromise] = getDeferred();
        } else {
          this[sym.readyPromise] = { promise: Promise.resolve() };
        }
        this[sym.closedPromise] = getDeferred();
      } else if (state === "erroring") {
        this[sym.readyPromise] = {
          promise: Promise.reject(stream[sym.storedError]),
        };
        setPromiseIsHandledToTrue(this[sym.readyPromise].promise);
        this[sym.closedPromise] = getDeferred();
      } else if (state === "closed") {
        this[sym.readyPromise] = { promise: Promise.resolve() };
        this[sym.closedPromise] = { promise: Promise.resolve() };
      } else {
        assert(state === "errored");
        const storedError = stream[sym.storedError];
        this[sym.readyPromise] = { promise: Promise.reject(storedError) };
        setPromiseIsHandledToTrue(this[sym.readyPromise].promise);
        this[sym.closedPromise] = { promise: Promise.reject(storedError) };
        setPromiseIsHandledToTrue(this[sym.closedPromise].promise);
      }
    }

    get closed() {
      if (!isWritableStreamDefaultWriter(this)) {
        return Promise.reject(
          new TypeError("Invalid WritableStreamDefaultWriter."),
        );
      }
      return this[sym.closedPromise].promise;
    }

    get desiredSize() {
      if (!isWritableStreamDefaultWriter(this)) {
        throw new TypeError("Invalid WritableStreamDefaultWriter.");
      }
      if (!this[sym.ownerWritableStream]) {
        throw new TypeError("WritableStreamDefaultWriter has no owner.");
      }
      return writableStreamDefaultWriterGetDesiredSize(this);
    }

    get ready() {
      if (!isWritableStreamDefaultWriter(this)) {
        return Promise.reject(
          new TypeError("Invalid WritableStreamDefaultWriter."),
        );
      }
      return this[sym.readyPromise].promise;
    }

    abort(reason) {
      if (!isWritableStreamDefaultWriter(this)) {
        return Promise.reject(
          new TypeError("Invalid WritableStreamDefaultWriter."),
        );
      }
      if (!this[sym.ownerWritableStream]) {
        Promise.reject(
          new TypeError("WritableStreamDefaultWriter has no owner."),
        );
      }
      return writableStreamDefaultWriterAbort(this, reason);
    }

    close() {
      if (!isWritableStreamDefaultWriter(this)) {
        return Promise.reject(
          new TypeError("Invalid WritableStreamDefaultWriter."),
        );
      }
      const stream = this[sym.ownerWritableStream];
      if (!stream) {
        Promise.reject(
          new TypeError("WritableStreamDefaultWriter has no owner."),
        );
      }
      if (writableStreamCloseQueuedOrInFlight(stream)) {
        Promise.reject(
          new TypeError("Stream is in an invalid state to be closed."),
        );
      }
      return writableStreamDefaultWriterClose(this);
    }

    releaseLock() {
      if (!isWritableStreamDefaultWriter(this)) {
        throw new TypeError("Invalid WritableStreamDefaultWriter.");
      }
      const stream = this[sym.ownerWritableStream];
      if (!stream) {
        return;
      }
      assert(stream[sym.writer]);
      writableStreamDefaultWriterRelease(this);
    }

    write(chunk) {
      if (!isWritableStreamDefaultWriter(this)) {
        return Promise.reject(
          new TypeError("Invalid WritableStreamDefaultWriter."),
        );
      }
      if (!this[sym.ownerWritableStream]) {
        Promise.reject(
          new TypeError("WritableStreamDefaultWriter has no owner."),
        );
      }
      return writableStreamDefaultWriterWrite(this, chunk);
    }

    [customInspect]() {
      return `${this.constructor.name} { closed: Promise, desiredSize: ${
        String(this.desiredSize)
      }, ready: Promise }`;
    }
  }

  class WritableStream {
    constructor(
      underlyingSink = {},
      strategy = {},
    ) {
      initializeWritableStream(this);
      const size = strategy.size;
      let highWaterMark = strategy.highWaterMark ?? 1;
      const { type } = underlyingSink;
      if (type !== undefined) {
        throw new RangeError(`Sink type of "${String(type)}" not supported.`);
      }
      const sizeAlgorithm = makeSizeAlgorithmFromSizeFunction(size);
      highWaterMark = validateAndNormalizeHighWaterMark(highWaterMark);
      setUpWritableStreamDefaultControllerFromUnderlyingSink(
        this,
        underlyingSink,
        highWaterMark,
        sizeAlgorithm,
      );
    }

    get locked() {
      if (!isWritableStream(this)) {
        throw new TypeError("Invalid WritableStream.");
      }
      return isWritableStreamLocked(this);
    }

    abort(reason) {
      if (!isWritableStream(this)) {
        return Promise.reject(new TypeError("Invalid WritableStream."));
      }
      if (isWritableStreamLocked(this)) {
        return Promise.reject(
          new TypeError("Cannot abort a locked WritableStream."),
        );
      }
      return writableStreamAbort(this, reason);
    }

    close() {
      if (!isWritableStream(this)) {
        return Promise.reject(new TypeError("Invalid WritableStream."));
      }
      if (isWritableStreamLocked(this)) {
        return Promise.reject(
          new TypeError("Cannot abort a locked WritableStream."),
        );
      }
      if (writableStreamCloseQueuedOrInFlight(this)) {
        return Promise.reject(
          new TypeError("Cannot close an already closing WritableStream."),
        );
      }
      return writableStreamClose(this);
    }

    getWriter() {
      if (!isWritableStream(this)) {
        throw new TypeError("Invalid WritableStream.");
      }
      return acquireWritableStreamDefaultWriter(this);
    }

    [customInspect]() {
      return `${this.constructor.name} { locked: ${String(this.locked)} }`;
    }
  }

  function acquireReadableStreamDefaultReader(
    stream,
    forAuthorCode = false,
  ) {
    const reader = new ReadableStreamDefaultReader(stream);
    reader[sym.forAuthorCode] = forAuthorCode;
    return reader;
  }

  function acquireWritableStreamDefaultWriter(
    stream,
  ) {
    return new WritableStreamDefaultWriter(stream);
  }

  function call(
    fn,
    v,
    args,
  ) {
    return Function.prototype.apply.call(fn, v, args);
  }

  function createAlgorithmFromUnderlyingMethod(
    underlyingObject,
    methodName,
    algoArgCount,
    ...extraArgs
  ) {
    const method = underlyingObject[methodName];
    if (method) {
      if (!isCallable(method)) {
        throw new TypeError("method is not callable");
      }
      if (algoArgCount === 0) {
        return async () => call(method, underlyingObject, extraArgs);
      } else {
        return async (arg) => {
          const fullArgs = [arg, ...extraArgs];
          return call(method, underlyingObject, fullArgs);
        };
      }
    }
    return async () => undefined;
  }

  function createReadableStream(
    startAlgorithm,
    pullAlgorithm,
    cancelAlgorithm,
    highWaterMark = 1,
    sizeAlgorithm = () => 1,
  ) {
    highWaterMark = validateAndNormalizeHighWaterMark(highWaterMark);
    const stream = Object.create(
      ReadableStream.prototype,
    );
    initializeReadableStream(stream);
    const controller = Object.create(
      ReadableStreamDefaultController.prototype,
    );
    setUpReadableStreamDefaultController(
      stream,
      controller,
      startAlgorithm,
      pullAlgorithm,
      cancelAlgorithm,
      highWaterMark,
      sizeAlgorithm,
    );
    return stream;
  }

  function createWritableStream(
    startAlgorithm,
    writeAlgorithm,
    closeAlgorithm,
    abortAlgorithm,
    highWaterMark = 1,
    sizeAlgorithm = () => 1,
  ) {
    highWaterMark = validateAndNormalizeHighWaterMark(highWaterMark);
    const stream = Object.create(WritableStream.prototype);
    initializeWritableStream(stream);
    const controller = Object.create(
      WritableStreamDefaultController.prototype,
    );
    setUpWritableStreamDefaultController(
      stream,
      controller,
      startAlgorithm,
      writeAlgorithm,
      closeAlgorithm,
      abortAlgorithm,
      highWaterMark,
      sizeAlgorithm,
    );
    return stream;
  }

  function dequeueValue(container) {
    assert(sym.queue in container && sym.queueTotalSize in container);
    assert(container[sym.queue].length);
    const pair = container[sym.queue].shift();
    container[sym.queueTotalSize] -= pair.size;
    if (container[sym.queueTotalSize] <= 0) {
      container[sym.queueTotalSize] = 0;
    }
    return pair.value;
  }

  function enqueueValueWithSize(
    container,
    value,
    size,
  ) {
    assert(sym.queue in container && sym.queueTotalSize in container);
    size = Number(size);
    if (!isFiniteNonNegativeNumber(size)) {
      throw new RangeError("size must be a finite non-negative number.");
    }
    container[sym.queue].push({ value, size });
    container[sym.queueTotalSize] += size;
  }

  /** Non-spec mechanism to "unwrap" a promise and store it to be resolved
   * later. */
  function getDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve: resolve, reject: reject };
  }

  function initializeReadableStream(
    stream,
  ) {
    stream[sym.state] = "readable";
    stream[sym.reader] = stream[sym.storedError] = undefined;
    stream[sym.disturbed] = false;
  }

  function initializeTransformStream(
    stream,
    startPromise,
    writableHighWaterMark,
    writableSizeAlgorithm,
    readableHighWaterMark,
    readableSizeAlgorithm,
  ) {
    const startAlgorithm = () => startPromise;
    const writeAlgorithm = (chunk) =>
      transformStreamDefaultSinkWriteAlgorithm(stream, chunk);
    const abortAlgorithm = (reason) =>
      transformStreamDefaultSinkAbortAlgorithm(stream, reason);
    const closeAlgorithm = () =>
      transformStreamDefaultSinkCloseAlgorithm(stream);
    stream[sym.writable] = createWritableStream(
      startAlgorithm,
      writeAlgorithm,
      closeAlgorithm,
      abortAlgorithm,
      writableHighWaterMark,
      writableSizeAlgorithm,
    );
    const pullAlgorithm = () =>
      transformStreamDefaultSourcePullAlgorithm(stream);
    const cancelAlgorithm = (reason) => {
      transformStreamErrorWritableAndUnblockWrite(stream, reason);
      return Promise.resolve(undefined);
    };
    stream[sym.readable] = createReadableStream(
      startAlgorithm,
      pullAlgorithm,
      cancelAlgorithm,
      readableHighWaterMark,
      readableSizeAlgorithm,
    );
    stream[sym.backpressure] = stream[sym.backpressureChangePromise] =
      undefined;
    transformStreamSetBackpressure(stream, true);
    Object.defineProperty(stream, sym.transformStreamController, {
      value: undefined,
      configurable: true,
    });
  }

  function initializeWritableStream(
    stream,
  ) {
    stream[sym.state] = "writable";
    stream[sym.storedError] = stream[sym.writer] = stream[
      sym.writableStreamController
    ] = stream[sym.inFlightWriteRequest] = stream[sym.closeRequest] = stream[
      sym.inFlightCloseRequest
    ] = stream[sym.pendingAbortRequest] = undefined;
    stream[sym.writeRequests] = [];
    stream[sym.backpressure] = false;
  }

  function invokeOrNoop(
    o,
    p,
    ...args
  ) {
    assert(o);
    const method = o[p];
    if (!method) {
      return undefined;
    }
    return call(method, o, args);
  }

  function isCallable(value) {
    return typeof value === "function";
  }

  function isDetachedBuffer(value) {
    return sym.isFakeDetached in value;
  }

  function isFiniteNonNegativeNumber(v) {
    return Number.isFinite(v) && (v) >= 0;
  }

  function isReadableByteStreamController(
    x,
  ) {
    return !(
      typeof x !== "object" ||
      x === null ||
      !(sym.controlledReadableByteStream in x)
    );
  }

  function isReadableStream(x) {
    return !(
      typeof x !== "object" ||
      x === null ||
      !(sym.readableStreamController in x)
    );
  }

  function isReadableStreamAsyncIterator(
    x,
  ) {
    if (typeof x !== "object" || x === null) {
      return false;
    }
    return sym.asyncIteratorReader in x;
  }

  function isReadableStreamDefaultController(
    x,
  ) {
    return !(
      typeof x !== "object" ||
      x === null ||
      !(sym.controlledReadableStream in x)
    );
  }

  function isReadableStreamDefaultReader(
    x,
  ) {
    return !(typeof x !== "object" || x === null || !(sym.readRequests in x));
  }

  function isReadableStreamLocked(stream) {
    assert(isReadableStream(stream));
    return !!stream[sym.reader];
  }

  function isReadableStreamDisturbed(stream) {
    assert(isReadableStream(stream));
    return !!stream[sym.disturbed];
  }

  function isTransformStream(x) {
    return !(
      typeof x !== "object" ||
      x === null ||
      !(sym.transformStreamController in x)
    );
  }

  function isTransformStreamDefaultController(
    x,
  ) {
    return !(
      typeof x !== "object" ||
      x === null ||
      !(sym.controlledTransformStream in x)
    );
  }

  function isWritableStream(x) {
    return !(
      typeof x !== "object" ||
      x === null ||
      !(sym.writableStreamController in x)
    );
  }

  function isWritableStreamDefaultController(
    x,
  ) {
    return !(
      typeof x !== "object" ||
      x === null ||
      !(sym.controlledWritableStream in x)
    );
  }

  function isWritableStreamDefaultWriter(
    x,
  ) {
    return !(
      typeof x !== "object" ||
      x === null ||
      !(sym.ownerWritableStream in x)
    );
  }

  function isWritableStreamLocked(stream) {
    assert(isWritableStream(stream));
    return stream[sym.writer] !== undefined;
  }

  function makeSizeAlgorithmFromSizeFunction(
    size,
  ) {
    if (size === undefined) {
      return () => 1;
    }
    if (typeof size !== "function") {
      throw new TypeError("size must be callable.");
    }
    return (chunk) => {
      return size.call(undefined, chunk);
    };
  }

  function peekQueueValue(container) {
    assert(sym.queue in container && sym.queueTotalSize in container);
    assert(container[sym.queue].length);
    const [pair] = container[sym.queue];
    return pair.value;
  }

  function readableByteStreamControllerShouldCallPull(
    controller,
  ) {
    const stream = controller[sym.controlledReadableByteStream];
    if (
      stream[sym.state] !== "readable" ||
      controller[sym.closeRequested] ||
      !controller[sym.started]
    ) {
      return false;
    }
    if (
      readableStreamHasDefaultReader(stream) &&
      readableStreamGetNumReadRequests(stream) > 0
    ) {
      return true;
    }
    // 3.13.25.6 If ! ReadableStreamHasBYOBReader(stream) is true and !
    //            ReadableStreamGetNumReadIntoRequests(stream) > 0, return true.
    const desiredSize = readableByteStreamControllerGetDesiredSize(controller);
    assert(desiredSize !== null);
    return desiredSize > 0;
  }

  function readableByteStreamControllerCallPullIfNeeded(
    controller,
  ) {
    const shouldPull = readableByteStreamControllerShouldCallPull(controller);
    if (!shouldPull) {
      return;
    }
    if (controller[sym.pulling]) {
      controller[sym.pullAgain] = true;
      return;
    }
    assert(controller[sym.pullAgain] === false);
    controller[sym.pulling] = true;
    const pullPromise = controller[sym.pullAlgorithm]();
    setPromiseIsHandledToTrue(
      pullPromise.then(
        () => {
          controller[sym.pulling] = false;
          if (controller[sym.pullAgain]) {
            controller[sym.pullAgain] = false;
            readableByteStreamControllerCallPullIfNeeded(controller);
          }
        },
        (e) => {
          readableByteStreamControllerError(controller, e);
        },
      ),
    );
  }

  function readableByteStreamControllerClearAlgorithms(
    controller,
  ) {
    controller[sym.pullAlgorithm] = undefined;
    controller[sym.cancelAlgorithm] = undefined;
  }

  function readableByteStreamControllerClose(
    controller,
  ) {
    const stream = controller[sym.controlledReadableByteStream];
    if (controller[sym.closeRequested] || stream[sym.state] !== "readable") {
      return;
    }
    if (controller[sym.queueTotalSize] > 0) {
      controller[sym.closeRequested] = true;
      return;
    }
    // 3.13.6.4 If controller.[[pendingPullIntos]] is not empty, (BYOB Support)
    readableByteStreamControllerClearAlgorithms(controller);
    readableStreamClose(stream);
  }

  function readableByteStreamControllerEnqueue(
    controller,
    chunk,
  ) {
    const stream = controller[sym.controlledReadableByteStream];
    if (controller[sym.closeRequested] || stream[sym.state] !== "readable") {
      return;
    }
    const { buffer, byteOffset, byteLength } = chunk;
    const transferredBuffer = transferArrayBuffer(buffer);
    if (readableStreamHasDefaultReader(stream)) {
      if (readableStreamGetNumReadRequests(stream) === 0) {
        readableByteStreamControllerEnqueueChunkToQueue(
          controller,
          transferredBuffer,
          byteOffset,
          byteLength,
        );
      } else {
        assert(controller[sym.queue].length === 0);
        const transferredView = new Uint8Array(
          transferredBuffer,
          byteOffset,
          byteLength,
        );
        readableStreamFulfillReadRequest(stream, transferredView, false);
      }
      // 3.13.9.8 Otherwise, if ! ReadableStreamHasBYOBReader(stream) is true
    } else {
      assert(!isReadableStreamLocked(stream));
      readableByteStreamControllerEnqueueChunkToQueue(
        controller,
        transferredBuffer,
        byteOffset,
        byteLength,
      );
    }
    readableByteStreamControllerCallPullIfNeeded(controller);
  }

  function readableByteStreamControllerEnqueueChunkToQueue(
    controller,
    buffer,
    byteOffset,
    byteLength,
  ) {
    controller[sym.queue].push({
      value: buffer,
      offset: byteOffset,
      size: byteLength,
    });
    controller[sym.queueTotalSize] += byteLength;
  }

  function readableByteStreamControllerError(
    controller,
    e,
  ) {
    const stream = controller[sym.controlledReadableByteStream];
    if (stream[sym.state] !== "readable") {
      return;
    }
    // 3.13.11.3 Perform ! ReadableByteStreamControllerClearPendingPullIntos(controller).
    resetQueue(controller);
    readableByteStreamControllerClearAlgorithms(controller);
    readableStreamError(stream, e);
  }

  function readableByteStreamControllerGetDesiredSize(
    controller,
  ) {
    const stream = controller[sym.controlledReadableByteStream];
    const state = stream[sym.state];
    if (state === "errored") {
      return null;
    }
    if (state === "closed") {
      return 0;
    }
    return controller[sym.strategyHWM] - controller[sym.queueTotalSize];
  }

  function readableByteStreamControllerHandleQueueDrain(
    controller,
  ) {
    assert(
      controller[sym.controlledReadableByteStream][sym.state] === "readable",
    );
    if (
      controller[sym.queueTotalSize] === 0 && controller[sym.closeRequested]
    ) {
      readableByteStreamControllerClearAlgorithms(controller);
      readableStreamClose(controller[sym.controlledReadableByteStream]);
    } else {
      readableByteStreamControllerCallPullIfNeeded(controller);
    }
  }

  function readableStreamAddReadRequest(
    stream,
  ) {
    assert(isReadableStreamDefaultReader(stream[sym.reader]));
    assert(stream[sym.state] === "readable");
    const promise = getDeferred();
    stream[sym.reader][sym.readRequests].push(promise);
    return promise.promise;
  }

  function readableStreamCancel(
    stream,
    reason,
  ) {
    stream[sym.disturbed] = true;
    if (stream[sym.state] === "closed") {
      return Promise.resolve();
    }
    if (stream[sym.state] === "errored") {
      return Promise.reject(stream[sym.storedError]);
    }
    readableStreamClose(stream);
    return stream[sym.readableStreamController][sym.cancelSteps](reason).then(
      () => undefined,
    );
  }

  function readableStreamClose(stream) {
    assert(stream[sym.state] === "readable");
    stream[sym.state] = "closed";
    const reader = stream[sym.reader];
    if (!reader) {
      return;
    }
    if (isReadableStreamDefaultReader(reader)) {
      for (const readRequest of reader[sym.readRequests]) {
        assert(readRequest.resolve);
        readRequest.resolve(
          readableStreamCreateReadResult(
            undefined,
            true,
            reader[sym.forAuthorCode],
          ),
        );
      }
      reader[sym.readRequests] = [];
    }
    const resolve = reader[sym.closedPromise].resolve;
    assert(resolve);
    resolve();
  }

  function readableStreamCreateReadResult(
    value,
    done,
    forAuthorCode,
  ) {
    const prototype = forAuthorCode ? Object.prototype : null;
    assert(typeof done === "boolean");
    const obj = Object.create(prototype);
    Object.defineProperties(obj, {
      value: { value, writable: true, enumerable: true, configurable: true },
      done: {
        value: done,
        writable: true,
        enumerable: true,
        configurable: true,
      },
    });
    return obj;
  }

  function readableStreamDefaultControllerCallPullIfNeeded(
    controller,
  ) {
    const shouldPull = readableStreamDefaultControllerShouldCallPull(
      controller,
    );
    if (!shouldPull) {
      return;
    }
    if (controller[sym.pulling]) {
      controller[sym.pullAgain] = true;
      return;
    }
    assert(controller[sym.pullAgain] === false);
    controller[sym.pulling] = true;
    const pullPromise = controller[sym.pullAlgorithm]();
    pullPromise.then(
      () => {
        controller[sym.pulling] = false;
        if (controller[sym.pullAgain]) {
          controller[sym.pullAgain] = false;
          readableStreamDefaultControllerCallPullIfNeeded(controller);
        }
      },
      (e) => {
        readableStreamDefaultControllerError(controller, e);
      },
    );
  }

  function readableStreamDefaultControllerCanCloseOrEnqueue(
    controller,
  ) {
    const state = controller[sym.controlledReadableStream][sym.state];
    return !controller[sym.closeRequested] && state === "readable";
  }

  function readableStreamDefaultControllerClearAlgorithms(
    controller,
  ) {
    controller[sym.pullAlgorithm] = undefined;
    controller[sym.cancelAlgorithm] = undefined;
    controller[sym.strategySizeAlgorithm] = undefined;
  }

  function readableStreamDefaultControllerClose(
    controller,
  ) {
    if (!readableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
      return;
    }
    const stream = controller[sym.controlledReadableStream];
    controller[sym.closeRequested] = true;
    if (controller[sym.queue].length === 0) {
      readableStreamDefaultControllerClearAlgorithms(controller);
      readableStreamClose(stream);
    }
  }

  function readableStreamDefaultControllerEnqueue(
    controller,
    chunk,
  ) {
    if (!readableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
      return;
    }
    const stream = controller[sym.controlledReadableStream];
    if (
      isReadableStreamLocked(stream) &&
      readableStreamGetNumReadRequests(stream) > 0
    ) {
      readableStreamFulfillReadRequest(stream, chunk, false);
    } else {
      try {
        const chunkSize = controller[sym.strategySizeAlgorithm](chunk);
        enqueueValueWithSize(controller, chunk, chunkSize);
      } catch (err) {
        readableStreamDefaultControllerError(controller, err);
        throw err;
      }
    }
    readableStreamDefaultControllerCallPullIfNeeded(controller);
  }

  function readableStreamDefaultControllerGetDesiredSize(
    controller,
  ) {
    const stream = controller[sym.controlledReadableStream];
    const state = stream[sym.state];
    if (state === "errored") {
      return null;
    }
    if (state === "closed") {
      return 0;
    }
    return controller[sym.strategyHWM] - controller[sym.queueTotalSize];
  }

  function readableStreamDefaultControllerError(
    controller,
    e,
  ) {
    const stream = controller[sym.controlledReadableStream];
    if (stream[sym.state] !== "readable") {
      return;
    }
    resetQueue(controller);
    readableStreamDefaultControllerClearAlgorithms(controller);
    readableStreamError(stream, e);
  }

  function readableStreamDefaultControllerHasBackpressure(
    controller,
  ) {
    return readableStreamDefaultControllerShouldCallPull(controller);
  }

  function readableStreamDefaultControllerShouldCallPull(
    controller,
  ) {
    const stream = controller[sym.controlledReadableStream];
    if (
      !readableStreamDefaultControllerCanCloseOrEnqueue(controller) ||
      controller[sym.started] === false
    ) {
      return false;
    }
    if (
      isReadableStreamLocked(stream) &&
      readableStreamGetNumReadRequests(stream) > 0
    ) {
      return true;
    }
    const desiredSize = readableStreamDefaultControllerGetDesiredSize(
      controller,
    );
    assert(desiredSize !== null);
    return desiredSize > 0;
  }

  function readableStreamDefaultReaderRead(
    reader,
  ) {
    const stream = reader[sym.ownerReadableStream];
    assert(stream);
    stream[sym.disturbed] = true;
    if (stream[sym.state] === "closed") {
      return Promise.resolve(
        readableStreamCreateReadResult(
          undefined,
          true,
          reader[sym.forAuthorCode],
        ),
      );
    }
    if (stream[sym.state] === "errored") {
      return Promise.reject(stream[sym.storedError]);
    }
    assert(stream[sym.state] === "readable");
    return (stream[
      sym.readableStreamController
    ])[sym.pullSteps]();
  }

  function readableStreamError(stream, e) {
    assert(isReadableStream(stream));
    assert(stream[sym.state] === "readable");
    stream[sym.state] = "errored";
    stream[sym.storedError] = e;
    const reader = stream[sym.reader];
    if (reader === undefined) {
      return;
    }
    if (isReadableStreamDefaultReader(reader)) {
      for (const readRequest of reader[sym.readRequests]) {
        assert(readRequest.reject);
        readRequest.reject(e);
        readRequest.reject = undefined;
        readRequest.resolve = undefined;
      }
      reader[sym.readRequests] = [];
    }
    // 3.5.6.8 Otherwise, support BYOB Reader
    reader[sym.closedPromise].reject(e);
    reader[sym.closedPromise].reject = undefined;
    reader[sym.closedPromise].resolve = undefined;
    setPromiseIsHandledToTrue(reader[sym.closedPromise].promise);
  }

  function readableStreamFulfillReadRequest(
    stream,
    chunk,
    done,
  ) {
    const reader = stream[sym.reader];
    const readRequest = reader[sym.readRequests].shift();
    assert(readRequest.resolve);
    readRequest.resolve(
      readableStreamCreateReadResult(chunk, done, reader[sym.forAuthorCode]),
    );
  }

  function readableStreamGetNumReadRequests(
    stream,
  ) {
    return stream[sym.reader]?.[sym.readRequests].length ?? 0;
  }

  function readableStreamHasDefaultReader(
    stream,
  ) {
    const reader = stream[sym.reader];
    return !(reader === undefined || !isReadableStreamDefaultReader(reader));
  }

  function readableStreamPipeTo(
    source,
    dest,
    preventClose,
    preventAbort,
    preventCancel,
    signal,
  ) {
    assert(isReadableStream(source));
    assert(isWritableStream(dest));
    assert(
      typeof preventClose === "boolean" &&
        typeof preventAbort === "boolean" &&
        typeof preventCancel === "boolean",
    );
    assert(signal === undefined || signal instanceof AbortSignal);
    assert(!isReadableStreamLocked(source));
    assert(!isWritableStreamLocked(dest));
    const reader = acquireReadableStreamDefaultReader(source);
    const writer = acquireWritableStreamDefaultWriter(dest);
    source[sym.disturbed] = true;
    let shuttingDown = false;
    const promise = getDeferred();
    let abortAlgorithm;
    if (signal) {
      abortAlgorithm = () => {
        const error = new DOMException("Abort signal received.", "AbortSignal");
        const actions = [];
        if (!preventAbort) {
          actions.push(() => {
            if (dest[sym.state] === "writable") {
              return writableStreamAbort(dest, error);
            } else {
              return Promise.resolve(undefined);
            }
          });
        }
        if (!preventCancel) {
          actions.push(() => {
            if (source[sym.state] === "readable") {
              return readableStreamCancel(source, error);
            } else {
              return Promise.resolve(undefined);
            }
          });
        }
        shutdownWithAction(
          () => Promise.all(actions.map((action) => action())),
          true,
          error,
        );
      };
      if (signal.aborted) {
        abortAlgorithm();
        return promise.promise;
      }
      signal.addEventListener("abort", abortAlgorithm);
    }

    let currentWrite = Promise.resolve();

    // At this point, the spec becomes non-specific and vague.  Most of the rest
    // of this code is based on the reference implementation that is part of the
    // specification.  This is why the functions are only scoped to this function
    // to ensure they don't leak into the spec compliant parts.

    function isOrBecomesClosed(
      stream,
      promise,
      action,
    ) {
      if (stream[sym.state] === "closed") {
        action();
      } else {
        setPromiseIsHandledToTrue(promise.then(action));
      }
    }

    function isOrBecomesErrored(
      stream,
      promise,
      action,
    ) {
      if (stream[sym.state] === "errored") {
        action(stream[sym.storedError]);
      } else {
        setPromiseIsHandledToTrue(promise.catch((error) => action(error)));
      }
    }

    function finalize(isError, error) {
      writableStreamDefaultWriterRelease(writer);
      readableStreamReaderGenericRelease(reader);

      if (signal) {
        signal.removeEventListener("abort", abortAlgorithm);
      }
      if (isError) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    }

    function waitForWritesToFinish() {
      const oldCurrentWrite = currentWrite;
      return currentWrite.then(() =>
        oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : undefined
      );
    }

    function shutdownWithAction(
      action,
      originalIsError,
      originalError,
    ) {
      function doTheRest() {
        setPromiseIsHandledToTrue(
          action().then(
            () => finalize(originalIsError, originalError),
            (newError) => finalize(true, newError),
          ),
        );
      }

      if (shuttingDown) {
        return;
      }
      shuttingDown = true;

      if (
        dest[sym.state] === "writable" &&
        writableStreamCloseQueuedOrInFlight(dest) === false
      ) {
        setPromiseIsHandledToTrue(waitForWritesToFinish().then(doTheRest));
      } else {
        doTheRest();
      }
    }

    function shutdown(isError, error) {
      if (shuttingDown) {
        return;
      }
      shuttingDown = true;

      if (
        dest[sym.state] === "writable" &&
        !writableStreamCloseQueuedOrInFlight(dest)
      ) {
        setPromiseIsHandledToTrue(
          waitForWritesToFinish().then(() => finalize(isError, error)),
        );
      }
      finalize(isError, error);
    }

    function pipeStep() {
      if (shuttingDown) {
        return Promise.resolve(true);
      }
      return writer[sym.readyPromise].promise.then(() => {
        return readableStreamDefaultReaderRead(reader).then(
          ({ value, done }) => {
            if (done === true) {
              return true;
            }
            currentWrite = writableStreamDefaultWriterWrite(
              writer,
              value,
            ).then(undefined, () => {});
            return false;
          },
        );
      });
    }

    function pipeLoop() {
      return new Promise((resolveLoop, rejectLoop) => {
        function next(done) {
          if (done) {
            resolveLoop(undefined);
          } else {
            setPromiseIsHandledToTrue(pipeStep().then(next, rejectLoop));
          }
        }
        next(false);
      });
    }

    isOrBecomesErrored(
      source,
      reader[sym.closedPromise].promise,
      (storedError) => {
        if (!preventAbort) {
          shutdownWithAction(
            () => writableStreamAbort(dest, storedError),
            true,
            storedError,
          );
        } else {
          shutdown(true, storedError);
        }
      },
    );

    isOrBecomesErrored(
      dest,
      writer[sym.closedPromise].promise,
      (storedError) => {
        if (!preventCancel) {
          shutdownWithAction(
            () => readableStreamCancel(source, storedError),
            true,
            storedError,
          );
        } else {
          shutdown(true, storedError);
        }
      },
    );

    isOrBecomesClosed(source, reader[sym.closedPromise].promise, () => {
      if (!preventClose) {
        shutdownWithAction(() =>
          writableStreamDefaultWriterCloseWithErrorPropagation(writer)
        );
      }
    });

    if (
      writableStreamCloseQueuedOrInFlight(dest) ||
      dest[sym.state] === "closed"
    ) {
      const destClosed = new TypeError(
        "The destination writable stream closed before all data could be piped to it.",
      );
      if (!preventCancel) {
        shutdownWithAction(
          () => readableStreamCancel(source, destClosed),
          true,
          destClosed,
        );
      } else {
        shutdown(true, destClosed);
      }
    }

    setPromiseIsHandledToTrue(pipeLoop());
    return promise.promise;
  }

  function readableStreamReaderGenericCancel(
    reader,
    reason,
  ) {
    const stream = reader[sym.ownerReadableStream];
    assert(stream);
    return readableStreamCancel(stream, reason);
  }

  function readableStreamReaderGenericInitialize(
    reader,
    stream,
  ) {
    reader[sym.forAuthorCode] = true;
    reader[sym.ownerReadableStream] = stream;
    stream[sym.reader] = reader;
    if (stream[sym.state] === "readable") {
      reader[sym.closedPromise] = getDeferred();
    } else if (stream[sym.state] === "closed") {
      reader[sym.closedPromise] = { promise: Promise.resolve() };
    } else {
      assert(stream[sym.state] === "errored");
      reader[sym.closedPromise] = {
        promise: Promise.reject(stream[sym.storedError]),
      };
      setPromiseIsHandledToTrue(reader[sym.closedPromise].promise);
    }
  }

  function readableStreamReaderGenericRelease(
    reader,
  ) {
    assert(reader[sym.ownerReadableStream]);
    assert(reader[sym.ownerReadableStream][sym.reader] === reader);
    const closedPromise = reader[sym.closedPromise];
    if (reader[sym.ownerReadableStream][sym.state] === "readable") {
      assert(closedPromise.reject);
      closedPromise.reject(new TypeError("ReadableStream state is readable."));
    } else {
      closedPromise.promise = Promise.reject(
        new TypeError("Reading is closed."),
      );
      delete closedPromise.reject;
      delete closedPromise.resolve;
    }
    setPromiseIsHandledToTrue(closedPromise.promise);
    reader[sym.ownerReadableStream][sym.reader] = undefined;
    reader[sym.ownerReadableStream] = undefined;
  }

  function readableStreamTee(
    stream,
    cloneForBranch2,
  ) {
    assert(isReadableStream(stream));
    assert(typeof cloneForBranch2 === "boolean");
    const reader = acquireReadableStreamDefaultReader(stream);
    let reading = false;
    let canceled1 = false;
    let canceled2 = false;
    let reason1 = undefined;
    let reason2 = undefined;
    /* eslint-disable prefer-const */
    let branch1;
    let branch2;
    /* eslint-enable prefer-const */
    const cancelPromise = getDeferred();
    const pullAlgorithm = () => {
      if (reading) {
        return Promise.resolve();
      }
      reading = true;
      const readPromise = readableStreamDefaultReaderRead(reader).then(
        (result) => {
          reading = false;
          assert(typeof result === "object");
          const { done } = result;
          assert(typeof done === "boolean");
          if (done) {
            if (!canceled1) {
              readableStreamDefaultControllerClose(
                branch1[
                  sym.readableStreamController
                ],
              );
            }
            if (!canceled2) {
              readableStreamDefaultControllerClose(
                branch2[
                  sym.readableStreamController
                ],
              );
            }
            return;
          }
          const { value } = result;
          const value1 = value;
          let value2 = value;
          if (!canceled2 && cloneForBranch2) {
            value2 = cloneValue(value2);
          }
          if (!canceled1) {
            readableStreamDefaultControllerEnqueue(
              branch1[
                sym.readableStreamController
              ],
              value1,
            );
          }
          if (!canceled2) {
            readableStreamDefaultControllerEnqueue(
              branch2[
                sym.readableStreamController
              ],
              value2,
            );
          }
        },
      );
      setPromiseIsHandledToTrue(readPromise);
      return Promise.resolve();
    };
    const cancel1Algorithm = (reason) => {
      canceled1 = true;
      reason1 = reason;
      if (canceled2) {
        const compositeReason = [reason1, reason2];
        const cancelResult = readableStreamCancel(stream, compositeReason);
        cancelPromise.resolve(cancelResult);
      }
      return cancelPromise.promise;
    };
    const cancel2Algorithm = (reason) => {
      canceled2 = true;
      reason2 = reason;
      if (canceled1) {
        const compositeReason = [reason1, reason2];
        const cancelResult = readableStreamCancel(stream, compositeReason);
        cancelPromise.resolve(cancelResult);
      }
      return cancelPromise.promise;
    };
    const startAlgorithm = () => undefined;
    branch1 = createReadableStream(
      startAlgorithm,
      pullAlgorithm,
      cancel1Algorithm,
    );
    branch2 = createReadableStream(
      startAlgorithm,
      pullAlgorithm,
      cancel2Algorithm,
    );
    setPromiseIsHandledToTrue(
      reader[sym.closedPromise].promise.catch((r) => {
        readableStreamDefaultControllerError(
          branch1[
            sym.readableStreamController
          ],
          r,
        );
        readableStreamDefaultControllerError(
          branch2[
            sym.readableStreamController
          ],
          r,
        );
      }),
    );
    return [branch1, branch2];
  }

  function resetQueue(container) {
    assert(sym.queue in container && sym.queueTotalSize in container);
    container[sym.queue] = [];
    container[sym.queueTotalSize] = 0;
  }

  /** An internal function which mimics the behavior of setting the promise to
   * handled in JavaScript.  In this situation, an assertion failure, which
   * shouldn't happen will get thrown, instead of swallowed. */
  function setPromiseIsHandledToTrue(promise) {
    promise.then(undefined, (e) => {
      if (e && e instanceof AssertionError) {
        queueMicrotask(() => {
          throw e;
        });
      }
    });
  }

  function setUpReadableByteStreamController(
    stream,
    controller,
    startAlgorithm,
    pullAlgorithm,
    cancelAlgorithm,
    highWaterMark,
    autoAllocateChunkSize,
  ) {
    assert(stream[sym.readableStreamController] === undefined);
    if (autoAllocateChunkSize !== undefined) {
      assert(Number.isInteger(autoAllocateChunkSize));
      assert(autoAllocateChunkSize >= 0);
    }
    controller[sym.controlledReadableByteStream] = stream;
    controller[sym.pulling] = controller[sym.pullAgain] = false;
    controller[sym.byobRequest] = undefined;
    controller[sym.queue] = [];
    controller[sym.queueTotalSize] = 0;
    controller[sym.closeRequested] = controller[sym.started] = false;
    controller[sym.strategyHWM] = validateAndNormalizeHighWaterMark(
      highWaterMark,
    );
    controller[sym.pullAlgorithm] = pullAlgorithm;
    controller[sym.cancelAlgorithm] = cancelAlgorithm;
    controller[sym.autoAllocateChunkSize] = autoAllocateChunkSize;
    // 3.13.26.12 Set controller.[[pendingPullIntos]] to a new empty List.
    stream[sym.readableStreamController] = controller;
    const startResult = startAlgorithm();
    const startPromise = Promise.resolve(startResult);
    setPromiseIsHandledToTrue(
      startPromise.then(
        () => {
          controller[sym.started] = true;
          assert(!controller[sym.pulling]);
          assert(!controller[sym.pullAgain]);
          readableByteStreamControllerCallPullIfNeeded(controller);
        },
        (r) => {
          readableByteStreamControllerError(controller, r);
        },
      ),
    );
  }

  function setUpReadableByteStreamControllerFromUnderlyingSource(
    stream,
    underlyingByteSource,
    highWaterMark,
  ) {
    assert(underlyingByteSource);
    const controller = Object.create(
      ReadableByteStreamController.prototype,
    );
    const startAlgorithm = () => {
      return invokeOrNoop(underlyingByteSource, "start", controller);
    };
    const pullAlgorithm = createAlgorithmFromUnderlyingMethod(
      underlyingByteSource,
      "pull",
      0,
      controller,
    );
    setFunctionName(pullAlgorithm, "[[pullAlgorithm]]");
    const cancelAlgorithm = createAlgorithmFromUnderlyingMethod(
      underlyingByteSource,
      "cancel",
      1,
    );
    setFunctionName(cancelAlgorithm, "[[cancelAlgorithm]]");
    // 3.13.27.6 Let autoAllocateChunkSize be ? GetV(underlyingByteSource, "autoAllocateChunkSize").
    const autoAllocateChunkSize = undefined;
    setUpReadableByteStreamController(
      stream,
      controller,
      startAlgorithm,
      pullAlgorithm,
      cancelAlgorithm,
      highWaterMark,
      autoAllocateChunkSize,
    );
  }

  function setUpReadableStreamDefaultController(
    stream,
    controller,
    startAlgorithm,
    pullAlgorithm,
    cancelAlgorithm,
    highWaterMark,
    sizeAlgorithm,
  ) {
    assert(stream[sym.readableStreamController] === undefined);
    controller[sym.controlledReadableStream] = stream;
    controller[sym.queue] = [];
    controller[sym.queueTotalSize] = 0;
    controller[sym.started] = controller[sym.closeRequested] = controller[
      sym.pullAgain
    ] = controller[sym.pulling] = false;
    controller[sym.strategySizeAlgorithm] = sizeAlgorithm;
    controller[sym.strategyHWM] = highWaterMark;
    controller[sym.pullAlgorithm] = pullAlgorithm;
    controller[sym.cancelAlgorithm] = cancelAlgorithm;
    stream[sym.readableStreamController] = controller;
    const startResult = startAlgorithm();
    const startPromise = Promise.resolve(startResult);
    setPromiseIsHandledToTrue(
      startPromise.then(
        () => {
          controller[sym.started] = true;
          assert(controller[sym.pulling] === false);
          assert(controller[sym.pullAgain] === false);
          readableStreamDefaultControllerCallPullIfNeeded(controller);
        },
        (r) => {
          readableStreamDefaultControllerError(controller, r);
        },
      ),
    );
  }

  function setUpReadableStreamDefaultControllerFromUnderlyingSource(
    stream,
    underlyingSource,
    highWaterMark,
    sizeAlgorithm,
  ) {
    assert(underlyingSource);
    const controller = Object.create(
      ReadableStreamDefaultController.prototype,
    );
    const startAlgorithm = () =>
      invokeOrNoop(underlyingSource, "start", controller);
    const pullAlgorithm = createAlgorithmFromUnderlyingMethod(
      underlyingSource,
      "pull",
      0,
      controller,
    );
    setFunctionName(pullAlgorithm, "[[pullAlgorithm]]");
    const cancelAlgorithm = createAlgorithmFromUnderlyingMethod(
      underlyingSource,
      "cancel",
      1,
    );
    setFunctionName(cancelAlgorithm, "[[cancelAlgorithm]]");
    setUpReadableStreamDefaultController(
      stream,
      controller,
      startAlgorithm,
      pullAlgorithm,
      cancelAlgorithm,
      highWaterMark,
      sizeAlgorithm,
    );
  }

  function setUpTransformStreamDefaultController(
    stream,
    controller,
    transformAlgorithm,
    flushAlgorithm,
  ) {
    assert(isTransformStream(stream));
    assert(stream[sym.transformStreamController] === undefined);
    controller[sym.controlledTransformStream] = stream;
    stream[sym.transformStreamController] = controller;
    controller[sym.transformAlgorithm] = transformAlgorithm;
    controller[sym.flushAlgorithm] = flushAlgorithm;
  }

  function setUpTransformStreamDefaultControllerFromTransformer(
    stream,
    transformer,
  ) {
    assert(transformer);
    const controller = Object.create(
      TransformStreamDefaultController.prototype,
    );
    let transformAlgorithm = (chunk) => {
      try {
        transformStreamDefaultControllerEnqueue(
          controller,
          // it defaults to no tranformation, so I is assumed to be O
          chunk,
        );
      } catch (e) {
        return Promise.reject(e);
      }
      return Promise.resolve();
    };
    const transformMethod = transformer.transform;
    if (transformMethod) {
      if (typeof transformMethod !== "function") {
        throw new TypeError("tranformer.transform must be callable.");
      }
      transformAlgorithm = async (chunk) =>
        call(transformMethod, transformer, [chunk, controller]);
    }
    const flushAlgorithm = createAlgorithmFromUnderlyingMethod(
      transformer,
      "flush",
      0,
      controller,
    );
    setUpTransformStreamDefaultController(
      stream,
      controller,
      transformAlgorithm,
      flushAlgorithm,
    );
  }

  function setUpWritableStreamDefaultController(
    stream,
    controller,
    startAlgorithm,
    writeAlgorithm,
    closeAlgorithm,
    abortAlgorithm,
    highWaterMark,
    sizeAlgorithm,
  ) {
    assert(isWritableStream(stream));
    assert(stream[sym.writableStreamController] === undefined);
    controller[sym.controlledWritableStream] = stream;
    stream[sym.writableStreamController] = controller;
    controller[sym.queue] = [];
    controller[sym.queueTotalSize] = 0;
    controller[sym.started] = false;
    controller[sym.strategySizeAlgorithm] = sizeAlgorithm;
    controller[sym.strategyHWM] = highWaterMark;
    controller[sym.writeAlgorithm] = writeAlgorithm;
    controller[sym.closeAlgorithm] = closeAlgorithm;
    controller[sym.abortAlgorithm] = abortAlgorithm;
    const backpressure = writableStreamDefaultControllerGetBackpressure(
      controller,
    );
    writableStreamUpdateBackpressure(stream, backpressure);
    const startResult = startAlgorithm();
    const startPromise = Promise.resolve(startResult);
    setPromiseIsHandledToTrue(
      startPromise.then(
        () => {
          assert(
            stream[sym.state] === "writable" ||
              stream[sym.state] === "erroring",
          );
          controller[sym.started] = true;
          writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        },
        (r) => {
          assert(
            stream[sym.state] === "writable" ||
              stream[sym.state] === "erroring",
          );
          controller[sym.started] = true;
          writableStreamDealWithRejection(stream, r);
        },
      ),
    );
  }

  function setUpWritableStreamDefaultControllerFromUnderlyingSink(
    stream,
    underlyingSink,
    highWaterMark,
    sizeAlgorithm,
  ) {
    assert(underlyingSink);
    const controller = Object.create(
      WritableStreamDefaultController.prototype,
    );
    const startAlgorithm = () => {
      return invokeOrNoop(underlyingSink, "start", controller);
    };
    const writeAlgorithm = createAlgorithmFromUnderlyingMethod(
      underlyingSink,
      "write",
      1,
      controller,
    );
    setFunctionName(writeAlgorithm, "[[writeAlgorithm]]");
    const closeAlgorithm = createAlgorithmFromUnderlyingMethod(
      underlyingSink,
      "close",
      0,
    );
    setFunctionName(closeAlgorithm, "[[closeAlgorithm]]");
    const abortAlgorithm = createAlgorithmFromUnderlyingMethod(
      underlyingSink,
      "abort",
      1,
    );
    setFunctionName(abortAlgorithm, "[[abortAlgorithm]]");
    setUpWritableStreamDefaultController(
      stream,
      controller,
      startAlgorithm,
      writeAlgorithm,
      closeAlgorithm,
      abortAlgorithm,
      highWaterMark,
      sizeAlgorithm,
    );
  }

  function transformStreamDefaultControllerClearAlgorithms(
    controller,
  ) {
    controller[sym.transformAlgorithm] = undefined;
    controller[sym.flushAlgorithm] = undefined;
  }

  function transformStreamDefaultControllerEnqueue(
    controller,
    chunk,
  ) {
    const stream = controller[sym.controlledTransformStream];
    const readableController = stream[sym.readable][
      sym.readableStreamController
    ];
    if (!readableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
      throw new TypeError(
        "TransformStream's readable controller cannot be closed or enqueued.",
      );
    }
    try {
      readableStreamDefaultControllerEnqueue(readableController, chunk);
    } catch (e) {
      transformStreamErrorWritableAndUnblockWrite(stream, e);
      throw stream[sym.readable][sym.storedError];
    }
    const backpressure = readableStreamDefaultControllerHasBackpressure(
      readableController,
    );
    if (backpressure) {
      transformStreamSetBackpressure(stream, true);
    }
  }

  function transformStreamDefaultControllerError(
    controller,
    e,
  ) {
    transformStreamError(controller[sym.controlledTransformStream], e);
  }

  function transformStreamDefaultControllerPerformTransform(
    controller,
    chunk,
  ) {
    const transformPromise = controller[sym.transformAlgorithm](chunk);
    return transformPromise.then(undefined, (r) => {
      transformStreamError(controller[sym.controlledTransformStream], r);
      throw r;
    });
  }

  function transformStreamDefaultSinkAbortAlgorithm(
    stream,
    reason,
  ) {
    transformStreamError(stream, reason);
    return Promise.resolve(undefined);
  }

  function transformStreamDefaultSinkCloseAlgorithm(
    stream,
  ) {
    const readable = stream[sym.readable];
    const controller = stream[sym.transformStreamController];
    const flushPromise = controller[sym.flushAlgorithm]();
    transformStreamDefaultControllerClearAlgorithms(controller);
    return flushPromise.then(
      () => {
        if (readable[sym.state] === "errored") {
          throw readable[sym.storedError];
        }
        const readableController = readable[
          sym.readableStreamController
        ];
        if (
          readableStreamDefaultControllerCanCloseOrEnqueue(readableController)
        ) {
          readableStreamDefaultControllerClose(readableController);
        }
      },
      (r) => {
        transformStreamError(stream, r);
        throw readable[sym.storedError];
      },
    );
  }

  function transformStreamDefaultSinkWriteAlgorithm(
    stream,
    chunk,
  ) {
    assert(stream[sym.writable][sym.state] === "writable");
    const controller = stream[sym.transformStreamController];
    if (stream[sym.backpressure]) {
      const backpressureChangePromise = stream[sym.backpressureChangePromise];
      assert(backpressureChangePromise);
      return backpressureChangePromise.promise.then(() => {
        const writable = stream[sym.writable];
        const state = writable[sym.state];
        if (state === "erroring") {
          throw writable[sym.storedError];
        }
        assert(state === "writable");
        return transformStreamDefaultControllerPerformTransform(
          controller,
          chunk,
        );
      });
    }
    return transformStreamDefaultControllerPerformTransform(controller, chunk);
  }

  function transformStreamDefaultSourcePullAlgorithm(
    stream,
  ) {
    assert(stream[sym.backpressure] === true);
    assert(stream[sym.backpressureChangePromise] !== undefined);
    transformStreamSetBackpressure(stream, false);
    return stream[sym.backpressureChangePromise].promise;
  }

  function transformStreamError(
    stream,
    e,
  ) {
    readableStreamDefaultControllerError(
      stream[sym.readable][
        sym.readableStreamController
      ],
      e,
    );
    transformStreamErrorWritableAndUnblockWrite(stream, e);
  }

  function transformStreamDefaultControllerTerminate(
    controller,
  ) {
    const stream = controller[sym.controlledTransformStream];
    const readableController = stream[sym.readable][
      sym.readableStreamController
    ];
    readableStreamDefaultControllerClose(readableController);
    const error = new TypeError("TransformStream is closed.");
    transformStreamErrorWritableAndUnblockWrite(stream, error);
  }

  function transformStreamErrorWritableAndUnblockWrite(
    stream,
    e,
  ) {
    transformStreamDefaultControllerClearAlgorithms(
      stream[sym.transformStreamController],
    );
    writableStreamDefaultControllerErrorIfNeeded(
      stream[sym.writable][sym.writableStreamController],
      e,
    );
    if (stream[sym.backpressure]) {
      transformStreamSetBackpressure(stream, false);
    }
  }

  function transformStreamSetBackpressure(
    stream,
    backpressure,
  ) {
    assert(stream[sym.backpressure] !== backpressure);
    if (stream[sym.backpressureChangePromise] !== undefined) {
      stream[sym.backpressureChangePromise].resolve(undefined);
    }
    stream[sym.backpressureChangePromise] = getDeferred();
    stream[sym.backpressure] = backpressure;
  }

  function transferArrayBuffer(buffer) {
    assert(!isDetachedBuffer(buffer));
    const transferredIshVersion = buffer.slice(0);

    Object.defineProperty(buffer, "byteLength", {
      get() {
        return 0;
      },
    });
    buffer[sym.isFakeDetached] = true;

    return transferredIshVersion;
  }

  function validateAndNormalizeHighWaterMark(
    highWaterMark,
  ) {
    highWaterMark = Number(highWaterMark);
    if (Number.isNaN(highWaterMark) || highWaterMark < 0) {
      throw new RangeError(
        `highWaterMark must be a positive number or Infinity.  Received: ${highWaterMark}.`,
      );
    }
    return highWaterMark;
  }

  function writableStreamAbort(
    stream,
    reason,
  ) {
    const state = stream[sym.state];
    if (state === "closed" || state === "errored") {
      return Promise.resolve(undefined);
    }
    if (stream[sym.pendingAbortRequest]) {
      return stream[sym.pendingAbortRequest].promise.promise;
    }
    assert(state === "writable" || state === "erroring");
    let wasAlreadyErroring = false;
    if (state === "erroring") {
      wasAlreadyErroring = true;
      reason = undefined;
    }
    const promise = getDeferred();
    stream[sym.pendingAbortRequest] = { promise, reason, wasAlreadyErroring };

    if (wasAlreadyErroring === false) {
      writableStreamStartErroring(stream, reason);
    }
    return promise.promise;
  }

  function writableStreamAddWriteRequest(
    stream,
  ) {
    assert(isWritableStream(stream));
    assert(stream[sym.state] === "writable");
    const promise = getDeferred();
    stream[sym.writeRequests].push(promise);
    return promise.promise;
  }

  function writableStreamClose(
    stream,
  ) {
    const state = stream[sym.state];
    if (state === "closed" || state === "errored") {
      return Promise.reject(
        new TypeError(
          "Cannot close an already closed or errored WritableStream.",
        ),
      );
    }
    assert(!writableStreamCloseQueuedOrInFlight(stream));
    const promise = getDeferred();
    stream[sym.closeRequest] = promise;
    const writer = stream[sym.writer];
    if (writer && stream[sym.backpressure] && state === "writable") {
      writer[sym.readyPromise].resolve();
      writer[sym.readyPromise].resolve = undefined;
      writer[sym.readyPromise].reject = undefined;
    }
    writableStreamDefaultControllerClose(stream[sym.writableStreamController]);
    return promise.promise;
  }

  function writableStreamCloseQueuedOrInFlight(
    stream,
  ) {
    return !(
      stream[sym.closeRequest] === undefined &&
      stream[sym.inFlightCloseRequest] === undefined
    );
  }

  function writableStreamDealWithRejection(
    stream,
    error,
  ) {
    const state = stream[sym.state];
    if (state === "writable") {
      writableStreamStartErroring(stream, error);
      return;
    }
    assert(state === "erroring");
    writableStreamFinishErroring(stream);
  }

  function writableStreamDefaultControllerAdvanceQueueIfNeeded(
    controller,
  ) {
    const stream = controller[sym.controlledWritableStream];
    if (!controller[sym.started]) {
      return;
    }
    if (stream[sym.inFlightWriteRequest]) {
      return;
    }
    const state = stream[sym.state];
    assert(state !== "closed" && state !== "errored");
    if (state === "erroring") {
      writableStreamFinishErroring(stream);
      return;
    }
    if (!controller[sym.queue].length) {
      return;
    }
    const writeRecord = peekQueueValue(controller);
    if (writeRecord === "close") {
      writableStreamDefaultControllerProcessClose(controller);
    } else {
      writableStreamDefaultControllerProcessWrite(
        controller,
        writeRecord.chunk,
      );
    }
  }

  function writableStreamDefaultControllerClearAlgorithms(
    controller,
  ) {
    controller[sym.writeAlgorithm] = undefined;
    controller[sym.closeAlgorithm] = undefined;
    controller[sym.abortAlgorithm] = undefined;
    controller[sym.strategySizeAlgorithm] = undefined;
  }

  function writableStreamDefaultControllerClose(
    controller,
  ) {
    enqueueValueWithSize(controller, "close", 0);
    writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }

  function writableStreamDefaultControllerError(
    controller,
    error,
  ) {
    const stream = controller[sym.controlledWritableStream];
    assert(stream[sym.state] === "writable");
    writableStreamDefaultControllerClearAlgorithms(controller);
    writableStreamStartErroring(stream, error);
  }

  function writableStreamDefaultControllerErrorIfNeeded(
    controller,
    error,
  ) {
    if (controller[sym.controlledWritableStream][sym.state] === "writable") {
      writableStreamDefaultControllerError(controller, error);
    }
  }

  function writableStreamDefaultControllerGetBackpressure(
    controller,
  ) {
    const desiredSize = writableStreamDefaultControllerGetDesiredSize(
      controller,
    );
    return desiredSize <= 0;
  }

  function writableStreamDefaultControllerGetChunkSize(
    controller,
    chunk,
  ) {
    let returnValue;
    try {
      returnValue = controller[sym.strategySizeAlgorithm](chunk);
    } catch (e) {
      writableStreamDefaultControllerErrorIfNeeded(controller, e);
      return 1;
    }
    return returnValue;
  }

  function writableStreamDefaultControllerGetDesiredSize(
    controller,
  ) {
    return controller[sym.strategyHWM] - controller[sym.queueTotalSize];
  }

  function writableStreamDefaultControllerProcessClose(
    controller,
  ) {
    const stream = controller[sym.controlledWritableStream];
    writableStreamMarkCloseRequestInFlight(stream);
    dequeueValue(controller);
    assert(controller[sym.queue].length === 0);
    const sinkClosePromise = controller[sym.closeAlgorithm]();
    writableStreamDefaultControllerClearAlgorithms(controller);
    setPromiseIsHandledToTrue(
      sinkClosePromise.then(
        () => {
          writableStreamFinishInFlightClose(stream);
        },
        (reason) => {
          writableStreamFinishInFlightCloseWithError(stream, reason);
        },
      ),
    );
  }

  function writableStreamDefaultControllerProcessWrite(
    controller,
    chunk,
  ) {
    const stream = controller[sym.controlledWritableStream];
    writableStreamMarkFirstWriteRequestInFlight(stream);
    const sinkWritePromise = controller[sym.writeAlgorithm](chunk);
    setPromiseIsHandledToTrue(
      sinkWritePromise.then(
        () => {
          writableStreamFinishInFlightWrite(stream);
          const state = stream[sym.state];
          assert(state === "writable" || state === "erroring");
          dequeueValue(controller);
          if (
            !writableStreamCloseQueuedOrInFlight(stream) &&
            state === "writable"
          ) {
            const backpressure = writableStreamDefaultControllerGetBackpressure(
              controller,
            );
            writableStreamUpdateBackpressure(stream, backpressure);
          }
          writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        },
        (reason) => {
          if (stream[sym.state] === "writable") {
            writableStreamDefaultControllerClearAlgorithms(controller);
          }
          writableStreamFinishInFlightWriteWithError(stream, reason);
        },
      ),
    );
  }

  function writableStreamDefaultControllerWrite(
    controller,
    chunk,
    chunkSize,
  ) {
    const writeRecord = { chunk };
    try {
      enqueueValueWithSize(controller, writeRecord, chunkSize);
    } catch (e) {
      writableStreamDefaultControllerErrorIfNeeded(controller, e);
      return;
    }
    const stream = controller[sym.controlledWritableStream];
    if (
      !writableStreamCloseQueuedOrInFlight(stream) &&
      stream[sym.state] === "writable"
    ) {
      const backpressure = writableStreamDefaultControllerGetBackpressure(
        controller,
      );
      writableStreamUpdateBackpressure(stream, backpressure);
    }
    writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }

  function writableStreamDefaultWriterAbort(
    writer,
    reason,
  ) {
    const stream = writer[sym.ownerWritableStream];
    assert(stream);
    return writableStreamAbort(stream, reason);
  }

  function writableStreamDefaultWriterClose(
    writer,
  ) {
    const stream = writer[sym.ownerWritableStream];
    assert(stream);
    return writableStreamClose(stream);
  }

  function writableStreamDefaultWriterCloseWithErrorPropagation(
    writer,
  ) {
    const stream = writer[sym.ownerWritableStream];
    assert(stream);
    const state = stream[sym.state];
    if (writableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
      return Promise.resolve();
    }
    if (state === "errored") {
      return Promise.reject(stream[sym.storedError]);
    }
    assert(state === "writable" || state === "erroring");
    return writableStreamDefaultWriterClose(writer);
  }

  function writableStreamDefaultWriterEnsureClosePromiseRejected(
    writer,
    error,
  ) {
    if (writer[sym.closedPromise].reject) {
      writer[sym.closedPromise].reject(error);
    } else {
      writer[sym.closedPromise] = {
        promise: Promise.reject(error),
      };
    }
    setPromiseIsHandledToTrue(writer[sym.closedPromise].promise);
  }

  function writableStreamDefaultWriterEnsureReadyPromiseRejected(
    writer,
    error,
  ) {
    if (writer[sym.readyPromise].reject) {
      writer[sym.readyPromise].reject(error);
      writer[sym.readyPromise].reject = undefined;
      writer[sym.readyPromise].resolve = undefined;
    } else {
      writer[sym.readyPromise] = {
        promise: Promise.reject(error),
      };
    }
    setPromiseIsHandledToTrue(writer[sym.readyPromise].promise);
  }

  function writableStreamDefaultWriterWrite(
    writer,
    chunk,
  ) {
    const stream = writer[sym.ownerWritableStream];
    assert(stream);
    const controller = stream[sym.writableStreamController];
    assert(controller);
    const chunkSize = writableStreamDefaultControllerGetChunkSize(
      controller,
      chunk,
    );
    if (stream !== writer[sym.ownerWritableStream]) {
      return Promise.reject("Writer has incorrect WritableStream.");
    }
    const state = stream[sym.state];
    if (state === "errored") {
      return Promise.reject(stream[sym.storedError]);
    }
    if (writableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
      return Promise.reject(new TypeError("The stream is closed or closing."));
    }
    if (state === "erroring") {
      return Promise.reject(stream[sym.storedError]);
    }
    assert(state === "writable");
    const promise = writableStreamAddWriteRequest(stream);
    writableStreamDefaultControllerWrite(controller, chunk, chunkSize);
    return promise;
  }

  function writableStreamDefaultWriterGetDesiredSize(
    writer,
  ) {
    const stream = writer[sym.ownerWritableStream];
    const state = stream[sym.state];
    if (state === "errored" || state === "erroring") {
      return null;
    }
    if (state === "closed") {
      return 0;
    }
    return writableStreamDefaultControllerGetDesiredSize(
      stream[sym.writableStreamController],
    );
  }

  function writableStreamDefaultWriterRelease(
    writer,
  ) {
    const stream = writer[sym.ownerWritableStream];
    assert(stream);
    assert(stream[sym.writer] === writer);
    const releasedError = new TypeError(
      "Writer was released and can no longer be used to monitor the stream's closedness.",
    );
    writableStreamDefaultWriterEnsureReadyPromiseRejected(
      writer,
      releasedError,
    );
    writableStreamDefaultWriterEnsureClosePromiseRejected(
      writer,
      releasedError,
    );
    stream[sym.writer] = undefined;
    writer[sym.ownerWritableStream] = undefined;
  }

  function writableStreamFinishErroring(stream) {
    assert(stream[sym.state] === "erroring");
    assert(!writableStreamHasOperationMarkedInFlight(stream));
    stream[sym.state] = "errored";
    stream[sym.writableStreamController][sym.errorSteps]();
    const storedError = stream[sym.storedError];
    for (const writeRequest of stream[sym.writeRequests]) {
      assert(writeRequest.reject);
      writeRequest.reject(storedError);
    }
    stream[sym.writeRequests] = [];
    if (!stream[sym.pendingAbortRequest]) {
      writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
      return;
    }
    const abortRequest = stream[sym.pendingAbortRequest];
    assert(abortRequest);
    stream[sym.pendingAbortRequest] = undefined;
    if (abortRequest.wasAlreadyErroring) {
      assert(abortRequest.promise.reject);
      abortRequest.promise.reject(storedError);
      writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
      return;
    }
    const promise = stream[sym.writableStreamController][sym.abortSteps](
      abortRequest.reason,
    );
    setPromiseIsHandledToTrue(
      promise.then(
        () => {
          assert(abortRequest.promise.resolve);
          abortRequest.promise.resolve();
          writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
        },
        (reason) => {
          assert(abortRequest.promise.reject);
          abortRequest.promise.reject(reason);
          writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
        },
      ),
    );
  }

  function writableStreamFinishInFlightClose(
    stream,
  ) {
    assert(stream[sym.inFlightCloseRequest]);
    stream[sym.inFlightCloseRequest]?.resolve();
    stream[sym.inFlightCloseRequest] = undefined;
    const state = stream[sym.state];
    assert(state === "writable" || state === "erroring");
    if (state === "erroring") {
      stream[sym.storedError] = undefined;
      if (stream[sym.pendingAbortRequest]) {
        stream[sym.pendingAbortRequest].promise.resolve();
        stream[sym.pendingAbortRequest] = undefined;
      }
    }
    stream[sym.state] = "closed";
    const writer = stream[sym.writer];
    if (writer) {
      writer[sym.closedPromise].resolve();
    }
    assert(stream[sym.pendingAbortRequest] === undefined);
    assert(stream[sym.storedError] === undefined);
  }

  function writableStreamFinishInFlightCloseWithError(
    stream,
    error,
  ) {
    assert(stream[sym.inFlightCloseRequest]);
    stream[sym.inFlightCloseRequest]?.reject(error);
    stream[sym.inFlightCloseRequest] = undefined;
    assert(
      stream[sym.state] === "writable" || stream[sym.state] === "erroring",
    );
    if (stream[sym.pendingAbortRequest]) {
      stream[sym.pendingAbortRequest]?.promise.reject(error);
      stream[sym.pendingAbortRequest] = undefined;
    }
    writableStreamDealWithRejection(stream, error);
  }

  function writableStreamFinishInFlightWrite(
    stream,
  ) {
    assert(stream[sym.inFlightWriteRequest]);
    stream[sym.inFlightWriteRequest].resolve();
    stream[sym.inFlightWriteRequest] = undefined;
  }

  function writableStreamFinishInFlightWriteWithError(
    stream,
    error,
  ) {
    assert(stream[sym.inFlightWriteRequest]);
    stream[sym.inFlightWriteRequest].reject(error);
    stream[sym.inFlightWriteRequest] = undefined;
    assert(
      stream[sym.state] === "writable" || stream[sym.state] === "erroring",
    );
    writableStreamDealWithRejection(stream, error);
  }

  function writableStreamHasOperationMarkedInFlight(
    stream,
  ) {
    return !(
      stream[sym.inFlightWriteRequest] === undefined &&
      stream[sym.inFlightCloseRequest] === undefined
    );
  }

  function writableStreamMarkCloseRequestInFlight(
    stream,
  ) {
    assert(stream[sym.inFlightCloseRequest] === undefined);
    assert(stream[sym.closeRequest] !== undefined);
    stream[sym.inFlightCloseRequest] = stream[sym.closeRequest];
    stream[sym.closeRequest] = undefined;
  }

  function writableStreamMarkFirstWriteRequestInFlight(
    stream,
  ) {
    assert(stream[sym.inFlightWriteRequest] === undefined);
    assert(stream[sym.writeRequests].length);
    const writeRequest = stream[sym.writeRequests].shift();
    stream[sym.inFlightWriteRequest] = writeRequest;
  }

  function writableStreamRejectCloseAndClosedPromiseIfNeeded(
    stream,
  ) {
    assert(stream[sym.state] === "errored");
    if (stream[sym.closeRequest]) {
      assert(stream[sym.inFlightCloseRequest] === undefined);
      stream[sym.closeRequest].reject(stream[sym.storedError]);
      stream[sym.closeRequest] = undefined;
    }
    const writer = stream[sym.writer];
    if (writer) {
      writer[sym.closedPromise].reject(stream[sym.storedError]);
      setPromiseIsHandledToTrue(writer[sym.closedPromise].promise);
    }
  }

  function writableStreamStartErroring(
    stream,
    reason,
  ) {
    assert(stream[sym.storedError] === undefined);
    assert(stream[sym.state] === "writable");
    const controller = stream[sym.writableStreamController];
    assert(controller);
    stream[sym.state] = "erroring";
    stream[sym.storedError] = reason;
    const writer = stream[sym.writer];
    if (writer) {
      writableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
    }
    if (
      !writableStreamHasOperationMarkedInFlight(stream) &&
      controller[sym.started]
    ) {
      writableStreamFinishErroring(stream);
    }
  }

  function writableStreamUpdateBackpressure(
    stream,
    backpressure,
  ) {
    assert(stream[sym.state] === "writable");
    assert(!writableStreamCloseQueuedOrInFlight(stream));
    const writer = stream[sym.writer];
    if (writer && backpressure !== stream[sym.backpressure]) {
      if (backpressure) {
        writer[sym.readyPromise] = getDeferred();
      } else {
        assert(backpressure === false);
        writer[sym.readyPromise].resolve();
        writer[sym.readyPromise].resolve = undefined;
        writer[sym.readyPromise].reject = undefined;
      }
    }
    stream[sym.backpressure] = backpressure;
  }
  /* eslint-enable */

  class CountQueuingStrategy {
    constructor({ highWaterMark }) {
      this.highWaterMark = highWaterMark;
    }

    size() {
      return 1;
    }

    [customInspect]() {
      return `${this.constructor.name} { highWaterMark: ${
        String(this.highWaterMark)
      }, size: f }`;
    }
  }

  Object.defineProperty(CountQueuingStrategy.prototype, "size", {
    enumerable: true,
  });

  class ByteLengthQueuingStrategy {
    constructor({ highWaterMark }) {
      this.highWaterMark = highWaterMark;
    }

    size(chunk) {
      return chunk.byteLength;
    }

    [customInspect]() {
      return `${this.constructor.name} { highWaterMark: ${
        String(this.highWaterMark)
      }, size: f }`;
    }
  }

  Object.defineProperty(ByteLengthQueuingStrategy.prototype, "size", {
    enumerable: true,
  });

  window.__bootstrap.streams = {
    ReadableStream,
    TransformStream,
    WritableStream,
    isReadableStreamDisturbed,
    CountQueuingStrategy,
    ByteLengthQueuingStrategy,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const assert = window.__bootstrap.util.assert;
  const core = window.Deno.core;

  function opStopGlobalTimer() {
    core.jsonOpSync("op_global_timer_stop");
  }

  function opStartGlobalTimer(timeout) {
    return core.jsonOpSync("op_global_timer_start", { timeout });
  }

  async function opWaitGlobalTimer() {
    await core.jsonOpAsync("op_global_timer");
  }

  function opNow() {
    return core.jsonOpSync("op_now");
  }

  // Derived from https://github.com/vadimg/js_bintrees. MIT Licensed.

  class RBNode {
    constructor(data) {
      this.data = data;
      this.left = null;
      this.right = null;
      this.red = true;
    }

    getChild(dir) {
      return dir ? this.right : this.left;
    }

    setChild(dir, val) {
      if (dir) {
        this.right = val;
      } else {
        this.left = val;
      }
    }
  }

  class RBTree {
    #comparator = null;
    #root = null;

    constructor(comparator) {
      this.#comparator = comparator;
      this.#root = null;
    }

    /** Returns `null` if tree is empty. */
    min() {
      let res = this.#root;
      if (res === null) {
        return null;
      }
      while (res.left !== null) {
        res = res.left;
      }
      return res.data;
    }

    /** Returns node `data` if found, `null` otherwise. */
    find(data) {
      let res = this.#root;
      while (res !== null) {
        const c = this.#comparator(data, res.data);
        if (c === 0) {
          return res.data;
        } else {
          res = res.getChild(c > 0);
        }
      }
      return null;
    }

    /** returns `true` if inserted, `false` if duplicate. */
    insert(data) {
      let ret = false;

      if (this.#root === null) {
        // empty tree
        this.#root = new RBNode(data);
        ret = true;
      } else {
        const head = new RBNode(null); // fake tree root

        let dir = 0;
        let last = 0;

        // setup
        let gp = null; // grandparent
        let ggp = head; // grand-grand-parent
        let p = null; // parent
        let node = this.#root;
        ggp.right = this.#root;

        // search down
        while (true) {
          if (node === null) {
            // insert new node at the bottom
            node = new RBNode(data);
            p.setChild(dir, node);
            ret = true;
          } else if (isRed(node.left) && isRed(node.right)) {
            // color flip
            node.red = true;
            node.left.red = false;
            node.right.red = false;
          }

          // fix red violation
          if (isRed(node) && isRed(p)) {
            const dir2 = ggp.right === gp;

            assert(gp);
            if (node === p.getChild(last)) {
              ggp.setChild(dir2, singleRotate(gp, !last));
            } else {
              ggp.setChild(dir2, doubleRotate(gp, !last));
            }
          }

          const cmp = this.#comparator(node.data, data);

          // stop if found
          if (cmp === 0) {
            break;
          }

          last = dir;
          dir = Number(cmp < 0); // Fix type

          // update helpers
          if (gp !== null) {
            ggp = gp;
          }
          gp = p;
          p = node;
          node = node.getChild(dir);
        }

        // update root
        this.#root = head.right;
      }

      // make root black
      this.#root.red = false;

      return ret;
    }

    /** Returns `true` if removed, `false` if not found. */
    remove(data) {
      if (this.#root === null) {
        return false;
      }

      const head = new RBNode(null); // fake tree root
      let node = head;
      node.right = this.#root;
      let p = null; // parent
      let gp = null; // grand parent
      let found = null; // found item
      let dir = 1;

      while (node.getChild(dir) !== null) {
        const last = dir;

        // update helpers
        gp = p;
        p = node;
        node = node.getChild(dir);

        const cmp = this.#comparator(data, node.data);

        dir = cmp > 0;

        // save found node
        if (cmp === 0) {
          found = node;
        }

        // push the red node down
        if (!isRed(node) && !isRed(node.getChild(dir))) {
          if (isRed(node.getChild(!dir))) {
            const sr = singleRotate(node, dir);
            p.setChild(last, sr);
            p = sr;
          } else if (!isRed(node.getChild(!dir))) {
            const sibling = p.getChild(!last);
            if (sibling !== null) {
              if (
                !isRed(sibling.getChild(!last)) &&
                !isRed(sibling.getChild(last))
              ) {
                // color flip
                p.red = false;
                sibling.red = true;
                node.red = true;
              } else {
                assert(gp);
                const dir2 = gp.right === p;

                if (isRed(sibling.getChild(last))) {
                  gp.setChild(dir2, doubleRotate(p, last));
                } else if (isRed(sibling.getChild(!last))) {
                  gp.setChild(dir2, singleRotate(p, last));
                }

                // ensure correct coloring
                const gpc = gp.getChild(dir2);
                assert(gpc);
                gpc.red = true;
                node.red = true;
                assert(gpc.left);
                gpc.left.red = false;
                assert(gpc.right);
                gpc.right.red = false;
              }
            }
          }
        }
      }

      // replace and remove if found
      if (found !== null) {
        found.data = node.data;
        assert(p);
        p.setChild(p.right === node, node.getChild(node.left === null));
      }

      // update root and make it black
      this.#root = head.right;
      if (this.#root !== null) {
        this.#root.red = false;
      }

      return found !== null;
    }
  }

  function isRed(node) {
    return node !== null && node.red;
  }

  function singleRotate(root, dir) {
    const save = root.getChild(!dir);
    assert(save);

    root.setChild(!dir, save.getChild(dir));
    save.setChild(dir, root);

    root.red = true;
    save.red = false;

    return save;
  }

  function doubleRotate(root, dir) {
    root.setChild(!dir, singleRotate(root.getChild(!dir), !dir));
    return singleRotate(root, dir);
  }

  const { console } = globalThis;
  const OriginalDate = Date;

  // Timeout values > TIMEOUT_MAX are set to 1.
  const TIMEOUT_MAX = 2 ** 31 - 1;

  let globalTimeoutDue = null;

  let nextTimerId = 1;
  const idMap = new Map();
  const dueTree = new RBTree((a, b) => a.due - b.due);

  function clearGlobalTimeout() {
    globalTimeoutDue = null;
    opStopGlobalTimer();
  }

  let pendingEvents = 0;
  const pendingFireTimers = [];

  /** Process and run a single ready timer macrotask.
 * This function should be registered through Deno.core.setMacrotaskCallback.
 * Returns true when all ready macrotasks have been processed, false if more
 * ready ones are available. The Isolate future would rely on the return value
 * to repeatedly invoke this function until depletion. Multiple invocations
 * of this function one at a time ensures newly ready microtasks are processed
 * before next macrotask timer callback is invoked. */
  function handleTimerMacrotask() {
    if (pendingFireTimers.length > 0) {
      fire(pendingFireTimers.shift());
      return pendingFireTimers.length === 0;
    }
    return true;
  }

  async function setGlobalTimeout(due, now) {
    // Since JS and Rust don't use the same clock, pass the time to rust as a
    // relative time value. On the Rust side we'll turn that into an absolute
    // value again.
    const timeout = due - now;
    assert(timeout >= 0);
    // Send message to the backend.
    globalTimeoutDue = due;
    pendingEvents++;
    // FIXME(bartlomieju): this is problematic, because `clearGlobalTimeout`
    // is synchronous. That means that timer is cancelled, but this promise is still pending
    // until next turn of event loop. This leads to "leaking of async ops" in tests;
    // because `clearTimeout/clearInterval` might be the last statement in test function
    // `opSanitizer` will immediately complain that there is pending op going on, unless
    // some timeout/defer is put in place to allow promise resolution.
    // Ideally `clearGlobalTimeout` doesn't return until this op is resolved, but
    // I'm not if that's possible.
    opStartGlobalTimer(timeout);
    await opWaitGlobalTimer();
    pendingEvents--;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    prepareReadyTimers();
  }

  function prepareReadyTimers() {
    const now = OriginalDate.now();
    // Bail out if we're not expecting the global timer to fire.
    if (globalTimeoutDue === null || pendingEvents > 0) {
      return;
    }
    // After firing the timers that are due now, this will hold the first timer
    // list that hasn't fired yet.
    let nextDueNode;
    while ((nextDueNode = dueTree.min()) !== null && nextDueNode.due <= now) {
      dueTree.remove(nextDueNode);
      // Fire all the timers in the list.
      for (const timer of nextDueNode.timers) {
        // With the list dropped, the timer is no longer scheduled.
        timer.scheduled = false;
        // Place the callback to pending timers to fire.
        pendingFireTimers.push(timer);
      }
    }
    setOrClearGlobalTimeout(nextDueNode && nextDueNode.due, now);
  }

  function setOrClearGlobalTimeout(due, now) {
    if (due == null) {
      clearGlobalTimeout();
    } else {
      setGlobalTimeout(due, now);
    }
  }

  function schedule(timer, now) {
    assert(!timer.scheduled);
    assert(now <= timer.due);
    // Find or create the list of timers that will fire at point-in-time `due`.
    const maybeNewDueNode = { due: timer.due, timers: [] };
    let dueNode = dueTree.find(maybeNewDueNode);
    if (dueNode === null) {
      dueTree.insert(maybeNewDueNode);
      dueNode = maybeNewDueNode;
    }
    // Append the newly scheduled timer to the list and mark it as scheduled.
    dueNode.timers.push(timer);
    timer.scheduled = true;
    // If the new timer is scheduled to fire before any timer that existed before,
    // update the global timeout to reflect this.
    if (globalTimeoutDue === null || globalTimeoutDue > timer.due) {
      setOrClearGlobalTimeout(timer.due, now);
    }
  }

  function unschedule(timer) {
    // Check if our timer is pending scheduling or pending firing.
    // If either is true, they are not in tree, and their idMap entry
    // will be deleted soon. Remove it from queue.
    let index = -1;
    if ((index = pendingFireTimers.indexOf(timer)) >= 0) {
      pendingFireTimers.splice(index);
      return;
    }
    // If timer is not in the 2 pending queues and is unscheduled,
    // it is not in the tree.
    if (!timer.scheduled) {
      return;
    }
    const searchKey = { due: timer.due, timers: [] };
    // Find the list of timers that will fire at point-in-time `due`.
    const list = dueTree.find(searchKey).timers;
    if (list.length === 1) {
      // Time timer is the only one in the list. Remove the entire list.
      assert(list[0] === timer);
      dueTree.remove(searchKey);
      // If the unscheduled timer was 'next up', find when the next timer that
      // still exists is due, and update the global alarm accordingly.
      if (timer.due === globalTimeoutDue) {
        const nextDueNode = dueTree.min();
        setOrClearGlobalTimeout(
          nextDueNode && nextDueNode.due,
          OriginalDate.now(),
        );
      }
    } else {
      // Multiple timers that are due at the same point in time.
      // Remove this timer from the list.
      const index = list.indexOf(timer);
      assert(index > -1);
      list.splice(index, 1);
    }
  }

  function fire(timer) {
    // If the timer isn't found in the ID map, that means it has been cancelled
    // between the timer firing and the promise callback (this function).
    if (!idMap.has(timer.id)) {
      return;
    }
    // Reschedule the timer if it is a repeating one, otherwise drop it.
    if (!timer.repeat) {
      // One-shot timer: remove the timer from this id-to-timer map.
      idMap.delete(timer.id);
    } else {
      // Interval timer: compute when timer was supposed to fire next.
      // However make sure to never schedule the next interval in the past.
      const now = OriginalDate.now();
      timer.due = Math.max(now, timer.due + timer.delay);
      schedule(timer, now);
    }
    // Call the user callback. Intermediate assignment is to avoid leaking `this`
    // to it, while also keeping the stack trace neat when it shows up in there.
    const callback = timer.callback;
    callback();
  }

  function checkThis(thisArg) {
    if (thisArg !== null && thisArg !== undefined && thisArg !== globalThis) {
      throw new TypeError("Illegal invocation");
    }
  }

  function checkBigInt(n) {
    if (typeof n === "bigint") {
      throw new TypeError("Cannot convert a BigInt value to a number");
    }
  }

  function setTimer(
    cb,
    delay,
    args,
    repeat,
  ) {
    // Bind `args` to the callback and bind `this` to globalThis(global).
    const callback = cb.bind(globalThis, ...args);
    // In the browser, the delay value must be coercible to an integer between 0
    // and INT32_MAX. Any other value will cause the timer to fire immediately.
    // We emulate this behavior.
    const now = OriginalDate.now();
    if (delay > TIMEOUT_MAX) {
      console.warn(
        `${delay} does not fit into` +
          " a 32-bit signed integer." +
          "\nTimeout duration was set to 1.",
      );
      delay = 1;
    }
    delay = Math.max(0, delay | 0);

    // Create a new, unscheduled timer object.
    const timer = {
      id: nextTimerId++,
      callback,
      args,
      delay,
      due: now + delay,
      repeat,
      scheduled: false,
    };
    // Register the timer's existence in the id-to-timer map.
    idMap.set(timer.id, timer);
    // Schedule the timer in the due table.
    schedule(timer, now);
    return timer.id;
  }

  function setTimeout(
    cb,
    delay = 0,
    ...args
  ) {
    checkBigInt(delay);
    checkThis(this);
    return setTimer(cb, delay, args, false);
  }

  function setInterval(
    cb,
    delay = 0,
    ...args
  ) {
    checkBigInt(delay);
    checkThis(this);
    return setTimer(cb, delay, args, true);
  }

  function clearTimer(id) {
    id = Number(id);
    const timer = idMap.get(id);
    if (timer === undefined) {
      // Timer doesn't exist any more or never existed. This is not an error.
      return;
    }
    // Unschedule the timer if it is currently scheduled, and forget about it.
    unschedule(timer);
    idMap.delete(timer.id);
  }

  function clearTimeout(id = 0) {
    checkBigInt(id);
    if (id === 0) {
      return;
    }
    clearTimer(id);
  }

  function clearInterval(id = 0) {
    checkBigInt(id);
    if (id === 0) {
      return;
    }
    clearTimer(id);
  }

  window.__bootstrap.timers = {
    clearInterval,
    setInterval,
    clearTimeout,
    setTimeout,
    handleTimerMacrotask,
    opStopGlobalTimer,
    opStartGlobalTimer,
    opNow,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;

  function requiredArguments(
    name,
    length,
    required,
  ) {
    if (length < required) {
      const errMsg = `${name} requires at least ${required} argument${
        required === 1 ? "" : "s"
      }, but only ${length} present`;
      throw new TypeError(errMsg);
    }
  }

  function isIterable(
    o,
  ) {
    // checks for null and undefined
    if (o == null) {
      return false;
    }
    return (
      typeof (o)[Symbol.iterator] === "function"
    );
  }

  /** https://url.spec.whatwg.org/#idna */
  function domainToAscii(
    domain,
    { beStrict = false } = {},
  ) {
    return core.jsonOpSync("op_domain_to_ascii", { domain, beStrict });
  }

  function decodeSearchParam(p) {
    return decodeURIComponent(p.replace(/\+/g, " "));
  }

  const urls = new WeakMap();

  class URLSearchParams {
    #params = [];

    constructor(init = "") {
      if (typeof init === "string") {
        this.#handleStringInitialization(init);
        return;
      }

      if (Array.isArray(init) || isIterable(init)) {
        this.#handleArrayInitialization(init);
        return;
      }

      if (Object(init) !== init) {
        return;
      }

      if (init instanceof URLSearchParams) {
        this.#params = [...init.#params];
        return;
      }

      // Overload: record<USVString, USVString>
      for (const key of Object.keys(init)) {
        this.#append(key, init[key]);
      }

      urls.set(this, null);
    }

    #handleStringInitialization = (init) => {
      // Overload: USVString
      // If init is a string and starts with U+003F (?),
      // remove the first code point from init.
      if (init.charCodeAt(0) === 0x003f) {
        init = init.slice(1);
      }

      for (const pair of init.split("&")) {
        // Empty params are ignored
        if (pair.length === 0) {
          continue;
        }
        const position = pair.indexOf("=");
        const name = pair.slice(0, position === -1 ? pair.length : position);
        const value = pair.slice(name.length + 1);
        this.#append(decodeSearchParam(name), decodeSearchParam(value));
      }
    };

    #handleArrayInitialization = (
      init,
    ) => {
      // Overload: sequence<sequence<USVString>>
      for (const tuple of init) {
        // If pair does not contain exactly two items, then throw a TypeError.
        if (tuple.length !== 2) {
          throw new TypeError(
            "URLSearchParams.constructor tuple array argument must only contain pair elements",
          );
        }
        this.#append(tuple[0], tuple[1]);
      }
    };

    #updateSteps = () => {
      const url = urls.get(this);
      if (url == null) {
        return;
      }
      parts.get(url).query = this.toString();
    };

    #append = (name, value) => {
      this.#params.push([String(name), String(value)]);
    };

    append(name, value) {
      requiredArguments("URLSearchParams.append", arguments.length, 2);
      this.#append(name, value);
      this.#updateSteps();
    }

    delete(name) {
      requiredArguments("URLSearchParams.delete", arguments.length, 1);
      name = String(name);
      let i = 0;
      while (i < this.#params.length) {
        if (this.#params[i][0] === name) {
          this.#params.splice(i, 1);
        } else {
          i++;
        }
      }
      this.#updateSteps();
    }

    getAll(name) {
      requiredArguments("URLSearchParams.getAll", arguments.length, 1);
      name = String(name);
      const values = [];
      for (const entry of this.#params) {
        if (entry[0] === name) {
          values.push(entry[1]);
        }
      }

      return values;
    }

    get(name) {
      requiredArguments("URLSearchParams.get", arguments.length, 1);
      name = String(name);
      for (const entry of this.#params) {
        if (entry[0] === name) {
          return entry[1];
        }
      }

      return null;
    }

    has(name) {
      requiredArguments("URLSearchParams.has", arguments.length, 1);
      name = String(name);
      return this.#params.some((entry) => entry[0] === name);
    }

    set(name, value) {
      requiredArguments("URLSearchParams.set", arguments.length, 2);

      // If there are any name-value pairs whose name is name, in list,
      // set the value of the first such name-value pair to value
      // and remove the others.
      name = String(name);
      value = String(value);
      let found = false;
      let i = 0;
      while (i < this.#params.length) {
        if (this.#params[i][0] === name) {
          if (!found) {
            this.#params[i][1] = value;
            found = true;
            i++;
          } else {
            this.#params.splice(i, 1);
          }
        } else {
          i++;
        }
      }

      // Otherwise, append a new name-value pair whose name is name
      // and value is value, to list.
      if (!found) {
        this.#append(name, value);
      }

      this.#updateSteps();
    }

    sort() {
      this.#params.sort((a, b) => (a[0] === b[0] ? 0 : a[0] > b[0] ? 1 : -1));
      this.#updateSteps();
    }

    forEach(
      callbackfn,
      thisArg,
    ) {
      requiredArguments("URLSearchParams.forEach", arguments.length, 1);

      if (typeof thisArg !== "undefined") {
        callbackfn = callbackfn.bind(thisArg);
      }

      for (const [key, value] of this.#params) {
        callbackfn(value, key, this);
      }
    }

    *keys() {
      for (const [key] of this.#params) {
        yield key;
      }
    }

    *values() {
      for (const [, value] of this.#params) {
        yield value;
      }
    }

    *entries() {
      yield* this.#params;
    }

    *[Symbol.iterator]() {
      yield* this.#params;
    }

    toString() {
      return this.#params
        .map(
          (tuple) =>
            `${encodeSearchParam(tuple[0])}=${encodeSearchParam(tuple[1])}`,
        )
        .join("&");
    }
  }

  const searchParamsMethods = [
    "append",
    "delete",
    "set",
  ];

  const specialSchemes = ["ftp", "file", "http", "https", "ws", "wss"];

  // https://url.spec.whatwg.org/#special-scheme
  const schemePorts = {
    ftp: "21",
    file: "",
    http: "80",
    https: "443",
    ws: "80",
    wss: "443",
  };
  const MAX_PORT = 2 ** 16 - 1;

  // Remove the part of the string that matches the pattern and return the
  // remainder (RHS) as well as the first captured group of the matched substring
  // (LHS). e.g.
  //      takePattern("https://deno.land:80", /^([a-z]+):[/]{2}/)
  //        = ["http", "deno.land:80"]
  //      takePattern("deno.land:80", /^(\[[0-9a-fA-F.:]{2,}\]|[^:]+)/)
  //        = ["deno.land", "80"]
  function takePattern(string, pattern) {
    let capture = "";
    const rest = string.replace(pattern, (_, capture_) => {
      capture = capture_;
      return "";
    });
    return [capture, rest];
  }

  function parse(url, baseParts = null) {
    const parts = {};
    let restUrl;
    let usedNonBase = false;
    [parts.protocol, restUrl] = takePattern(
      url.trim(),
      /^([A-Za-z][+-.0-9A-Za-z]*):/,
    );
    parts.protocol = parts.protocol.toLowerCase();
    if (parts.protocol == "") {
      if (baseParts == null) {
        return null;
      }
      parts.protocol = baseParts.protocol;
    } else if (
      parts.protocol != baseParts?.protocol ||
      !specialSchemes.includes(parts.protocol)
    ) {
      usedNonBase = true;
    }
    const isSpecial = specialSchemes.includes(parts.protocol);
    if (parts.protocol == "file") {
      parts.slashes = "//";
      parts.username = "";
      parts.password = "";
      if (usedNonBase || restUrl.match(/^[/\\]{2}/)) {
        [parts.hostname, restUrl] = takePattern(
          restUrl,
          /^[/\\]{2}([^/\\?#]*)/,
        );
        usedNonBase = true;
      } else {
        parts.hostname = baseParts.hostname;
      }
      parts.port = "";
    } else {
      if (usedNonBase || restUrl.match(/^[/\\]{2}/)) {
        let restAuthority;
        if (isSpecial) {
          parts.slashes = "//";
          [restAuthority, restUrl] = takePattern(
            restUrl,
            /^[/\\]*([^/\\?#]*)/,
          );
        } else {
          parts.slashes = restUrl.match(/^[/\\]{2}/) ? "//" : "";
          [restAuthority, restUrl] = takePattern(
            restUrl,
            /^[/\\]{2}([^/\\?#]*)/,
          );
        }
        let restAuthentication;
        [restAuthentication, restAuthority] = takePattern(
          restAuthority,
          /^(.*)@/,
        );
        [parts.username, restAuthentication] = takePattern(
          restAuthentication,
          /^([^:]*)/,
        );
        parts.username = encodeUserinfo(parts.username);
        [parts.password] = takePattern(restAuthentication, /^:(.*)/);
        parts.password = encodeUserinfo(parts.password);
        [parts.hostname, restAuthority] = takePattern(
          restAuthority,
          /^(\[[0-9a-fA-F.:]{2,}\]|[^:]+)/,
        );
        [parts.port] = takePattern(restAuthority, /^:(.*)/);
        if (!isValidPort(parts.port)) {
          return null;
        }
        if (parts.hostname == "" && isSpecial) {
          return null;
        }
        usedNonBase = true;
      } else {
        parts.slashes = baseParts.slashes;
        parts.username = baseParts.username;
        parts.password = baseParts.password;
        parts.hostname = baseParts.hostname;
        parts.port = baseParts.port;
      }
    }
    try {
      parts.hostname = encodeHostname(parts.hostname, isSpecial);
    } catch {
      return null;
    }
    [parts.path, restUrl] = takePattern(restUrl, /^([^?#]*)/);
    parts.path = encodePathname(parts.path.replace(/\\/g, "/"));
    if (usedNonBase) {
      parts.path = normalizePath(parts.path, parts.protocol == "file");
    } else {
      if (parts.path != "") {
        usedNonBase = true;
      }
      parts.path = resolvePathFromBase(
        parts.path,
        baseParts.path || "/",
        baseParts.protocol == "file",
      );
    }
    // Drop the hostname if a drive letter is parsed.
    if (parts.protocol == "file" && parts.path.match(/^\/+[A-Za-z]:(\/|$)/)) {
      parts.hostname = "";
    }
    if (usedNonBase || restUrl.startsWith("?")) {
      [parts.query, restUrl] = takePattern(restUrl, /^(\?[^#]*)/);
      parts.query = encodeSearch(parts.query, isSpecial);
      usedNonBase = true;
    } else {
      parts.query = baseParts.query;
    }
    [parts.hash] = takePattern(restUrl, /^(#.*)/);
    parts.hash = encodeHash(parts.hash);
    return parts;
  }

  // Resolves `.`s and `..`s where possible.
  // Preserves repeating and trailing `/`s by design.
  // Assumes drive letter file paths will have a leading slash.
  function normalizePath(path, isFilePath) {
    const isAbsolute = path.startsWith("/");
    path = path.replace(/^\//, "");
    const pathSegments = path.split("/");

    let driveLetter = null;
    if (isFilePath && pathSegments[0].match(/^[A-Za-z]:$/)) {
      driveLetter = pathSegments.shift();
    }

    if (isFilePath && isAbsolute) {
      while (pathSegments.length > 1 && pathSegments[0] == "") {
        pathSegments.shift();
      }
    }

    let ensureTrailingSlash = false;
    const newPathSegments = [];
    for (let i = 0; i < pathSegments.length; i++) {
      const previous = newPathSegments[newPathSegments.length - 1];
      if (
        pathSegments[i] == ".." &&
        previous != ".." &&
        (previous != undefined || isAbsolute)
      ) {
        newPathSegments.pop();
        ensureTrailingSlash = true;
      } else if (pathSegments[i] == ".") {
        ensureTrailingSlash = true;
      } else {
        newPathSegments.push(pathSegments[i]);
        ensureTrailingSlash = false;
      }
    }
    if (driveLetter != null) {
      newPathSegments.unshift(driveLetter);
    }
    if (newPathSegments.length == 0 && !isAbsolute) {
      newPathSegments.push(".");
      ensureTrailingSlash = false;
    }

    let newPath = newPathSegments.join("/");
    if (isAbsolute) {
      newPath = `/${newPath}`;
    }
    if (ensureTrailingSlash) {
      newPath = newPath.replace(/\/*$/, "/");
    }
    return newPath;
  }

  // Standard URL basing logic, applied to paths.
  function resolvePathFromBase(path, basePath, isFilePath) {
    let basePrefix;
    let suffix;
    const baseDriveLetter = basePath.match(/^\/+[A-Za-z]:(?=\/|$)/)?.[0];
    if (isFilePath && path.match(/^\/+[A-Za-z]:(\/|$)/)) {
      basePrefix = "";
      suffix = path;
    } else if (path.startsWith("/")) {
      if (isFilePath && baseDriveLetter) {
        basePrefix = baseDriveLetter;
        suffix = path;
      } else {
        basePrefix = "";
        suffix = path;
      }
    } else if (path != "") {
      basePath = normalizePath(basePath, isFilePath);
      path = normalizePath(path, isFilePath);
      // Remove everything after the last `/` in `basePath`.
      if (baseDriveLetter && isFilePath) {
        basePrefix = `${baseDriveLetter}${
          basePath.slice(baseDriveLetter.length).replace(/[^\/]*$/, "")
        }`;
      } else {
        basePrefix = basePath.replace(/[^\/]*$/, "");
      }
      basePrefix = basePrefix.replace(/\/*$/, "/");
      // If `normalizedPath` ends with `.` or `..`, add a trailing slash.
      suffix = path.replace(/(?<=(^|\/)(\.|\.\.))$/, "/");
    } else {
      basePrefix = basePath;
      suffix = "";
    }
    return normalizePath(basePrefix + suffix, isFilePath);
  }

  function isValidPort(value) {
    // https://url.spec.whatwg.org/#port-state
    if (value === "") return true;

    const port = Number(value);
    return Number.isInteger(port) && port >= 0 && port <= MAX_PORT;
  }

  const parts = new WeakMap();

  class URL {
    #searchParams = null;

    [Symbol.for("Deno.customInspect")]() {
      const keys = [
        "href",
        "origin",
        "protocol",
        "username",
        "password",
        "host",
        "hostname",
        "port",
        "pathname",
        "hash",
        "search",
      ];
      const objectString = keys
        .map((key) => `${key}: "${this[key] || ""}"`)
        .join(", ");
      return `URL { ${objectString} }`;
    }

    #updateSearchParams = () => {
      const searchParams = new URLSearchParams(this.search);

      for (const methodName of searchParamsMethods) {
        const method = searchParams[methodName];
        searchParams[methodName] = (...args) => {
          method.apply(searchParams, args);
          this.search = searchParams.toString();
        };
      }
      this.#searchParams = searchParams;

      urls.set(searchParams, this);
    };

    get hash() {
      return parts.get(this).hash;
    }

    set hash(value) {
      value = unescape(String(value));
      if (!value) {
        parts.get(this).hash = "";
      } else {
        if (value.charAt(0) !== "#") {
          value = `#${value}`;
        }
        // hashes can contain % and # unescaped
        parts.get(this).hash = encodeHash(value);
      }
    }

    get host() {
      return `${this.hostname}${this.port ? `:${this.port}` : ""}`;
    }

    set host(value) {
      value = String(value);
      const url = new URL(`http://${value}`);
      parts.get(this).hostname = url.hostname;
      parts.get(this).port = url.port;
    }

    get hostname() {
      return parts.get(this).hostname;
    }

    set hostname(value) {
      value = String(value);
      try {
        const isSpecial = specialSchemes.includes(parts.get(this).protocol);
        parts.get(this).hostname = encodeHostname(value, isSpecial);
      } catch {}
    }

    get href() {
      const authentication = this.username || this.password
        ? `${this.username}${this.password ? ":" + this.password : ""}@`
        : "";
      const host = this.host;
      const slashes = host ? "//" : parts.get(this).slashes;
      let pathname = this.pathname;
      if (pathname.charAt(0) != "/" && pathname != "" && host != "") {
        pathname = `/${pathname}`;
      }
      return `${this.protocol}${slashes}${authentication}${host}${pathname}${this.search}${this.hash}`;
    }

    set href(value) {
      value = String(value);
      if (value !== this.href) {
        const url = new URL(value);
        parts.set(this, { ...parts.get(url) });
        this.#updateSearchParams();
      }
    }

    get origin() {
      if (this.host) {
        return `${this.protocol}//${this.host}`;
      }
      return "null";
    }

    get password() {
      return parts.get(this).password;
    }

    set password(value) {
      value = String(value);
      parts.get(this).password = encodeUserinfo(value);
    }

    get pathname() {
      let path = parts.get(this).path;
      if (specialSchemes.includes(parts.get(this).protocol)) {
        if (path.charAt(0) != "/") {
          path = `/${path}`;
        }
      }
      return path;
    }

    set pathname(value) {
      parts.get(this).path = encodePathname(String(value));
    }

    get port() {
      const port = parts.get(this).port;
      if (schemePorts[parts.get(this).protocol] === port) {
        return "";
      }

      return port;
    }

    set port(value) {
      if (!isValidPort(value)) {
        return;
      }
      parts.get(this).port = value.toString();
    }

    get protocol() {
      return `${parts.get(this).protocol}:`;
    }

    set protocol(value) {
      value = String(value);
      if (value) {
        if (value.charAt(value.length - 1) === ":") {
          value = value.slice(0, -1);
        }
        parts.get(this).protocol = encodeURIComponent(value);
      }
    }

    get search() {
      return parts.get(this).query;
    }

    set search(value) {
      value = String(value);
      const query = value == "" || value.charAt(0) == "?" ? value : `?${value}`;
      const isSpecial = specialSchemes.includes(parts.get(this).protocol);
      parts.get(this).query = encodeSearch(query, isSpecial);
      this.#updateSearchParams();
    }

    get username() {
      return parts.get(this).username;
    }

    set username(value) {
      value = String(value);
      parts.get(this).username = encodeUserinfo(value);
    }

    get searchParams() {
      return this.#searchParams;
    }

    constructor(url, base) {
      let baseParts = null;
      new.target;
      if (base) {
        baseParts = base instanceof URL ? parts.get(base) : parse(base);
        if (baseParts == null) {
          throw new TypeError("Invalid base URL.");
        }
      }

      const urlParts = url instanceof URL
        ? parts.get(url)
        : parse(url, baseParts);
      if (urlParts == null) {
        throw new TypeError("Invalid URL.");
      }
      parts.set(this, urlParts);

      this.#updateSearchParams();
    }

    toString() {
      return this.href;
    }

    toJSON() {
      return this.href;
    }

    static createObjectURL() {
      throw new Error("Not implemented");
    }

    static revokeObjectURL() {
      throw new Error("Not implemented");
    }
  }

  function parseIpv4Number(s) {
    if (s.match(/^(0[Xx])[0-9A-Za-z]+$/)) {
      return Number(s);
    }
    if (s.match(/^[0-9]+$/)) {
      return Number(s.startsWith("0") ? `0o${s}` : s);
    }
    return NaN;
  }

  function parseIpv4(s) {
    const parts = s.split(".");
    if (parts[parts.length - 1] == "" && parts.length > 1) {
      parts.pop();
    }
    if (parts.includes("") || parts.length > 4) {
      return s;
    }
    const numbers = parts.map(parseIpv4Number);
    if (numbers.includes(NaN)) {
      return s;
    }
    const last = numbers.pop();
    if (last >= 256 ** (4 - numbers.length) || numbers.find((n) => n >= 256)) {
      throw new TypeError("Invalid hostname.");
    }
    const ipv4 = numbers.reduce((sum, n, i) => sum + n * 256 ** (3 - i), last);
    const ipv4Hex = ipv4.toString(16).padStart(8, "0");
    const ipv4HexParts = ipv4Hex.match(/(..)(..)(..)(..)$/).slice(1);
    return ipv4HexParts.map((s) => String(Number(`0x${s}`))).join(".");
  }

  function charInC0ControlSet(c) {
    return (c >= "\u0000" && c <= "\u001F") || c > "\u007E";
  }

  function charInSearchSet(c, isSpecial) {
    // deno-fmt-ignore
    return charInC0ControlSet(c) || ["\u0020", "\u0022", "\u0023", "\u003C", "\u003E"].includes(c) || isSpecial && c == "\u0027" || c > "\u007E";
  }

  function charInFragmentSet(c) {
    // deno-fmt-ignore
    return charInC0ControlSet(c) || ["\u0020", "\u0022", "\u003C", "\u003E", "\u0060"].includes(c);
  }

  function charInPathSet(c) {
    // deno-fmt-ignore
    return charInFragmentSet(c) || ["\u0023", "\u003F", "\u007B", "\u007D"].includes(c);
  }

  function charInUserinfoSet(c) {
    // "\u0027" ("'") seemingly isn't in the spec, but matches Chrome and Firefox.
    // deno-fmt-ignore
    return charInPathSet(c) || ["\u0027", "\u002F", "\u003A", "\u003B", "\u003D", "\u0040", "\u005B", "\u005C", "\u005D", "\u005E", "\u007C"].includes(c);
  }

  function charIsForbiddenInHost(c) {
    // deno-fmt-ignore
    return ["\u0000", "\u0009", "\u000A", "\u000D", "\u0020", "\u0023", "\u0025", "\u002F", "\u003A", "\u003C", "\u003E", "\u003F", "\u0040", "\u005B", "\u005C", "\u005D", "\u005E"].includes(c);
  }

  function charInFormUrlencodedSet(c) {
    // deno-fmt-ignore
    return charInUserinfoSet(c) || ["\u0021", "\u0024", "\u0025", "\u0026", "\u0027", "\u0028", "\u0029", "\u002B", "\u002C", "\u007E"].includes(c);
  }

  const encoder = new TextEncoder();

  function encodeChar(c) {
    return [...encoder.encode(c)]
      .map((n) => `%${n.toString(16)}`)
      .join("")
      .toUpperCase();
  }

  function encodeUserinfo(s) {
    return [...s].map((c) => (charInUserinfoSet(c) ? encodeChar(c) : c)).join(
      "",
    );
  }

  function encodeHostname(s, isSpecial = true) {
    // IPv6 parsing.
    if (s.startsWith("[") && s.endsWith("]")) {
      if (!s.match(/^\[[0-9A-Fa-f.:]{2,}\]$/)) {
        throw new TypeError("Invalid hostname.");
      }
      // IPv6 address compress
      return s.toLowerCase().replace(/\b:?(?:0+:?){2,}/, "::");
    }

    let result = s;

    if (!isSpecial) {
      // Check against forbidden host code points except for "%".
      for (const c of result) {
        if (charIsForbiddenInHost(c) && c != "\u0025") {
          throw new TypeError("Invalid hostname.");
        }
      }

      // Percent-encode C0 control set.
      result = [...result]
        .map((c) => (charInC0ControlSet(c) ? encodeChar(c) : c))
        .join("");

      return result;
    }

    // Percent-decode.
    if (result.match(/%(?![0-9A-Fa-f]{2})/) != null) {
      throw new TypeError("Invalid hostname.");
    }
    result = result.replace(
      /%(.{2})/g,
      (_, hex) => String.fromCodePoint(Number(`0x${hex}`)),
    );

    // IDNA domain to ASCII.
    result = domainToAscii(result);

    // Check against forbidden host code points.
    for (const c of result) {
      if (charIsForbiddenInHost(c)) {
        throw new TypeError("Invalid hostname.");
      }
    }

    // IPv4 parsing.
    if (isSpecial) {
      result = parseIpv4(result);
    }

    return result;
  }

  function encodePathname(s) {
    return [...s].map((c) => (charInPathSet(c) ? encodeChar(c) : c)).join("");
  }

  function encodeSearch(s, isSpecial) {
    return [...s].map((
      c,
    ) => (charInSearchSet(c, isSpecial) ? encodeChar(c) : c)).join("");
  }

  function encodeHash(s) {
    return [...s].map((c) => (charInFragmentSet(c) ? encodeChar(c) : c)).join(
      "",
    );
  }

  function encodeSearchParam(s) {
    return [...s].map((c) => (charInFormUrlencodedSet(c) ? encodeChar(c) : c))
      .join("").replace(/%20/g, "+");
  }

  window.__bootstrap.url = {
    URL,
    URLSearchParams,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/* eslint-disable @typescript-eslint/no-explicit-any */

((window) => {
  const core = window.Deno.core;
  const { log } = window.__bootstrap.util;

  function createWorker(
    specifier,
    hasSourceCode,
    sourceCode,
    useDenoNamespace,
    name,
  ) {
    return core.jsonOpSync("op_create_worker", {
      specifier,
      hasSourceCode,
      sourceCode,
      name,
      useDenoNamespace,
    });
  }

  function hostTerminateWorker(id) {
    core.jsonOpSync("op_host_terminate_worker", { id });
  }

  function hostPostMessage(id, data) {
    core.jsonOpSync("op_host_post_message", { id }, data);
  }

  function hostGetMessage(id) {
    return core.jsonOpAsync("op_host_get_message", { id });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  function encodeMessage(data) {
    const dataJson = JSON.stringify(data);
    return encoder.encode(dataJson);
  }

  function decodeMessage(dataIntArray) {
    const dataJson = decoder.decode(dataIntArray);
    return JSON.parse(dataJson);
  }

  class Worker extends EventTarget {
    #id = 0;
    #name = "";
    #terminated = false;

    constructor(specifier, options) {
      super();
      const { type = "classic", name = "unknown" } = options ?? {};

      if (type !== "module") {
        throw new Error(
          'Not yet implemented: only "module" type workers are supported',
        );
      }

      this.#name = name;
      const hasSourceCode = false;
      const sourceCode = decoder.decode(new Uint8Array());

      const useDenoNamespace = options ? !!options.deno : false;

      const { id } = createWorker(
        specifier,
        hasSourceCode,
        sourceCode,
        useDenoNamespace,
        options?.name,
      );
      this.#id = id;
      this.#poll();
    }

    #handleMessage = (msgData) => {
      let data;
      try {
        data = decodeMessage(new Uint8Array(msgData));
      } catch (e) {
        const msgErrorEvent = new MessageEvent("messageerror", {
          cancelable: false,
          data,
        });
        if (this.onmessageerror) {
          this.onmessageerror(msgErrorEvent);
        }
        return;
      }

      const msgEvent = new MessageEvent("message", {
        cancelable: false,
        data,
      });

      if (this.onmessage) {
        this.onmessage(msgEvent);
      }

      this.dispatchEvent(msgEvent);
    };

    #handleError = (e) => {
      const event = new ErrorEvent("error", {
        cancelable: true,
        message: e.message,
        lineno: e.lineNumber ? e.lineNumber + 1 : undefined,
        colno: e.columnNumber ? e.columnNumber + 1 : undefined,
        filename: e.fileName,
        error: null,
      });

      let handled = false;
      if (this.onerror) {
        this.onerror(event);
      }

      this.dispatchEvent(event);
      if (event.defaultPrevented) {
        handled = true;
      }

      return handled;
    };

    #poll = async () => {
      while (!this.#terminated) {
        const event = await hostGetMessage(this.#id);

        // If terminate was called then we ignore all messages
        if (this.#terminated) {
          return;
        }

        const type = event.type;

        if (type === "terminalError") {
          this.#terminated = true;
          if (!this.#handleError(event.error)) {
            throw Error(event.error.message);
          }
          continue;
        }

        if (type === "msg") {
          this.#handleMessage(event.data);
          continue;
        }

        if (type === "error") {
          if (!this.#handleError(event.error)) {
            throw Error(event.error.message);
          }
          continue;
        }

        if (type === "close") {
          log(`Host got "close" message from worker: ${this.#name}`);
          this.#terminated = true;
          return;
        }

        throw new Error(`Unknown worker event: "${type}"`);
      }
    };

    postMessage(message, transferOrOptions) {
      if (transferOrOptions) {
        throw new Error(
          "Not yet implemented: `transfer` and `options` are not supported.",
        );
      }

      if (this.#terminated) {
        return;
      }

      hostPostMessage(this.#id, encodeMessage(message));
    }

    terminate() {
      if (!this.#terminated) {
        this.#terminated = true;
        hostTerminateWorker(this.#id);
      }
    }
  }

  window.__bootstrap.worker = {
    Worker,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// Interfaces 100% copied from Go.
// Documentation liberally lifted from them too.
// Thank you! We love Go! <3

((window) => {
  const DEFAULT_BUFFER_SIZE = 32 * 1024;
  const { sendSync, sendAsync } = window.__bootstrap.dispatchMinimal;
  // Seek whence values.
  // https://golang.org/pkg/io/#pkg-constants
  const SeekMode = {
    0: "Start",
    1: "Current",
    2: "End",

    Start: 0,
    Current: 1,
    End: 2,
  };

  async function copy(
    src,
    dst,
    options,
  ) {
    let n = 0;
    const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
    const b = new Uint8Array(bufSize);
    let gotEOF = false;
    while (gotEOF === false) {
      const result = await src.read(b);
      if (result === null) {
        gotEOF = true;
      } else {
        let nwritten = 0;
        while (nwritten < result) {
          nwritten += await dst.write(b.subarray(nwritten, result));
        }
        n += nwritten;
      }
    }
    return n;
  }

  async function* iter(
    r,
    options,
  ) {
    const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
    const b = new Uint8Array(bufSize);
    while (true) {
      const result = await r.read(b);
      if (result === null) {
        break;
      }

      yield b.subarray(0, result);
    }
  }

  function* iterSync(
    r,
    options,
  ) {
    const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
    const b = new Uint8Array(bufSize);
    while (true) {
      const result = r.readSync(b);
      if (result === null) {
        break;
      }

      yield b.subarray(0, result);
    }
  }

  function readSync(rid, buffer) {
    if (buffer.length === 0) {
      return 0;
    }

    const nread = sendSync("op_read", rid, buffer);
    if (nread < 0) {
      throw new Error("read error");
    }

    return nread === 0 ? null : nread;
  }

  async function read(
    rid,
    buffer,
  ) {
    if (buffer.length === 0) {
      return 0;
    }

    const nread = await sendAsync("op_read", rid, buffer);
    if (nread < 0) {
      throw new Error("read error");
    }

    return nread === 0 ? null : nread;
  }

  function writeSync(rid, data) {
    const result = sendSync("op_write", rid, data);
    if (result < 0) {
      throw new Error("write error");
    }

    return result;
  }

  async function write(rid, data) {
    const result = await sendAsync("op_write", rid, data);
    if (result < 0) {
      throw new Error("write error");
    }

    return result;
  }

  window.__bootstrap.io = {
    iterSync,
    iter,
    copy,
    SeekMode,
    read,
    readSync,
    write,
    writeSync,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This code has been ported almost directly from Go's src/bytes/buffer.go
// Copyright 2009 The Go Authors. All rights reserved. BSD license.
// https://github.com/golang/go/blob/master/LICENSE

((window) => {
  const { assert } = window.__bootstrap.util;

  // MIN_READ is the minimum ArrayBuffer size passed to a read call by
  // buffer.ReadFrom. As long as the Buffer has at least MIN_READ bytes beyond
  // what is required to hold the contents of r, readFrom() will not grow the
  // underlying buffer.
  const MIN_READ = 32 * 1024;
  const MAX_SIZE = 2 ** 32 - 2;

  // `off` is the offset into `dst` where it will at which to begin writing values
  // from `src`.
  // Returns the number of bytes copied.
  function copyBytes(src, dst, off = 0) {
    const r = dst.byteLength - off;
    if (src.byteLength > r) {
      src = src.subarray(0, r);
    }
    dst.set(src, off);
    return src.byteLength;
  }

  class Buffer {
    #buf = null; // contents are the bytes buf[off : len(buf)]
    #off = 0; // read at buf[off], write at buf[buf.byteLength]

    constructor(ab) {
      if (ab == null) {
        this.#buf = new Uint8Array(0);
        return;
      }

      this.#buf = new Uint8Array(ab);
    }

    bytes(options = { copy: true }) {
      if (options.copy === false) return this.#buf.subarray(this.#off);
      return this.#buf.slice(this.#off);
    }

    empty() {
      return this.#buf.byteLength <= this.#off;
    }

    get length() {
      return this.#buf.byteLength - this.#off;
    }

    get capacity() {
      return this.#buf.buffer.byteLength;
    }

    truncate(n) {
      if (n === 0) {
        this.reset();
        return;
      }
      if (n < 0 || n > this.length) {
        throw Error("bytes.Buffer: truncation out of range");
      }
      this.#reslice(this.#off + n);
    }

    reset() {
      this.#reslice(0);
      this.#off = 0;
    }

    #tryGrowByReslice = (n) => {
      const l = this.#buf.byteLength;
      if (n <= this.capacity - l) {
        this.#reslice(l + n);
        return l;
      }
      return -1;
    };

    #reslice = (len) => {
      assert(len <= this.#buf.buffer.byteLength);
      this.#buf = new Uint8Array(this.#buf.buffer, 0, len);
    };

    readSync(p) {
      if (this.empty()) {
        // Buffer is empty, reset to recover space.
        this.reset();
        if (p.byteLength === 0) {
          // this edge case is tested in 'bufferReadEmptyAtEOF' test
          return 0;
        }
        return null;
      }
      const nread = copyBytes(this.#buf.subarray(this.#off), p);
      this.#off += nread;
      return nread;
    }

    read(p) {
      const rr = this.readSync(p);
      return Promise.resolve(rr);
    }

    writeSync(p) {
      const m = this.#grow(p.byteLength);
      return copyBytes(p, this.#buf, m);
    }

    write(p) {
      const n = this.writeSync(p);
      return Promise.resolve(n);
    }

    #grow = (n) => {
      const m = this.length;
      // If buffer is empty, reset to recover space.
      if (m === 0 && this.#off !== 0) {
        this.reset();
      }
      // Fast: Try to grow by means of a reslice.
      const i = this.#tryGrowByReslice(n);
      if (i >= 0) {
        return i;
      }
      const c = this.capacity;
      if (n <= Math.floor(c / 2) - m) {
        // We can slide things down instead of allocating a new
        // ArrayBuffer. We only need m+n <= c to slide, but
        // we instead let capacity get twice as large so we
        // don't spend all our time copying.
        copyBytes(this.#buf.subarray(this.#off), this.#buf);
      } else if (c + n > MAX_SIZE) {
        throw new Error("The buffer cannot be grown beyond the maximum size.");
      } else {
        // Not enough space anywhere, we need to allocate.
        const buf = new Uint8Array(Math.min(2 * c + n, MAX_SIZE));
        copyBytes(this.#buf.subarray(this.#off), buf);
        this.#buf = buf;
      }
      // Restore this.#off and len(this.#buf).
      this.#off = 0;
      this.#reslice(Math.min(m + n, MAX_SIZE));
      return m;
    };

    grow(n) {
      if (n < 0) {
        throw Error("Buffer.grow: negative count");
      }
      const m = this.#grow(n);
      this.#reslice(m);
    }

    async readFrom(r) {
      let n = 0;
      const tmp = new Uint8Array(MIN_READ);
      while (true) {
        const shouldGrow = this.capacity - this.length < MIN_READ;
        // read into tmp buffer if there's not enough room
        // otherwise read directly into the internal buffer
        const buf = shouldGrow
          ? tmp
          : new Uint8Array(this.#buf.buffer, this.length);

        const nread = await r.read(buf);
        if (nread === null) {
          return n;
        }

        // write will grow if needed
        if (shouldGrow) this.writeSync(buf.subarray(0, nread));
        else this.#reslice(this.length + nread);

        n += nread;
      }
    }

    readFromSync(r) {
      let n = 0;
      const tmp = new Uint8Array(MIN_READ);
      while (true) {
        const shouldGrow = this.capacity - this.length < MIN_READ;
        // read into tmp buffer if there's not enough room
        // otherwise read directly into the internal buffer
        const buf = shouldGrow
          ? tmp
          : new Uint8Array(this.#buf.buffer, this.length);

        const nread = r.readSync(buf);
        if (nread === null) {
          return n;
        }

        // write will grow if needed
        if (shouldGrow) this.writeSync(buf.subarray(0, nread));
        else this.#reslice(this.length + nread);

        n += nread;
      }
    }
  }

  async function readAll(r) {
    const buf = new Buffer();
    await buf.readFrom(r);
    return buf.bytes();
  }

  function readAllSync(r) {
    const buf = new Buffer();
    buf.readFromSync(r);
    return buf.bytes();
  }

  async function writeAll(w, arr) {
    let nwritten = 0;
    while (nwritten < arr.length) {
      nwritten += await w.write(arr.subarray(nwritten));
    }
  }

  function writeAllSync(w, arr) {
    let nwritten = 0;
    while (nwritten < arr.length) {
      nwritten += w.writeSync(arr.subarray(nwritten));
    }
  }

  window.__bootstrap.buffer = {
    writeAll,
    writeAllSync,
    readAll,
    readAllSync,
    Buffer,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const { DomIterableMixin } = window.__bootstrap.domIterable;
  const { requiredArguments } = window.__bootstrap.fetchUtil;

  // From node-fetch
  // Copyright (c) 2016 David Frank. MIT License.
  const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
  const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

  function isHeaders(value) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return value instanceof Headers;
  }

  const headersData = Symbol("headers data");

  // TODO: headerGuard? Investigate if it is needed
  // node-fetch did not implement this but it is in the spec
  function normalizeParams(name, value) {
    name = String(name).toLowerCase();
    value = String(value).trim();
    return [name, value];
  }

  // The following name/value validations are copied from
  // https://github.com/bitinn/node-fetch/blob/master/src/headers.js
  // Copyright (c) 2016 David Frank. MIT License.
  function validateName(name) {
    if (invalidTokenRegex.test(name) || name === "") {
      throw new TypeError(`${name} is not a legal HTTP header name`);
    }
  }

  function validateValue(value) {
    if (invalidHeaderCharRegex.test(value)) {
      throw new TypeError(`${value} is not a legal HTTP header value`);
    }
  }

  /** Appends a key and value to the header list.
 *
 * The spec indicates that when a key already exists, the append adds the new
 * value onto the end of the existing value.  The behaviour of this though
 * varies when the key is `set-cookie`.  In this case, if the key of the cookie
 * already exists, the value is replaced, but if the key of the cookie does not
 * exist, and additional `set-cookie` header is added.
 *
 * The browser specification of `Headers` is written for clients, and not
 * servers, and Deno is a server, meaning that it needs to follow the patterns
 * expected for servers, of which a `set-cookie` header is expected for each
 * unique cookie key, but duplicate cookie keys should not exist. */
  function dataAppend(
    data,
    key,
    value,
  ) {
    for (let i = 0; i < data.length; i++) {
      const [dataKey] = data[i];
      if (key === "set-cookie" && dataKey === "set-cookie") {
        const [, dataValue] = data[i];
        const [dataCookieKey] = dataValue.split("=");
        const [cookieKey] = value.split("=");
        if (dataCookieKey === cookieKey) {
          data[i][1] = value;
          return;
        }
      } else {
        if (dataKey === key) {
          data[i][1] += `, ${value}`;
          return;
        }
      }
    }
    data.push([key, value]);
  }

  /** Gets a value of a key in the headers list.
 *
 * This varies slightly from spec behaviour in that when the key is `set-cookie`
 * the value returned will look like a concatenated value, when in fact, if the
 * headers were iterated over, each individual `set-cookie` value is a unique
 * entry in the headers list. */
  function dataGet(
    data,
    key,
  ) {
    const setCookieValues = [];
    for (const [dataKey, value] of data) {
      if (dataKey === key) {
        if (key === "set-cookie") {
          setCookieValues.push(value);
        } else {
          return value;
        }
      }
    }
    if (setCookieValues.length) {
      return setCookieValues.join(", ");
    }
    return undefined;
  }

  /** Sets a value of a key in the headers list.
 *
 * The spec indicates that the value should be replaced if the key already
 * exists.  The behaviour here varies, where if the key is `set-cookie` the key
 * of the cookie is inspected, and if the key of the cookie already exists,
 * then the value is replaced.  If the key of the cookie is not found, then
 * the value of the `set-cookie` is added to the list of headers.
 *
 * The browser specification of `Headers` is written for clients, and not
 * servers, and Deno is a server, meaning that it needs to follow the patterns
 * expected for servers, of which a `set-cookie` header is expected for each
 * unique cookie key, but duplicate cookie keys should not exist. */
  function dataSet(
    data,
    key,
    value,
  ) {
    for (let i = 0; i < data.length; i++) {
      const [dataKey] = data[i];
      if (dataKey === key) {
        // there could be multiple set-cookie headers, but all others are unique
        if (key === "set-cookie") {
          const [, dataValue] = data[i];
          const [dataCookieKey] = dataValue.split("=");
          const [cookieKey] = value.split("=");
          if (cookieKey === dataCookieKey) {
            data[i][1] = value;
            return;
          }
        } else {
          data[i][1] = value;
          return;
        }
      }
    }
    data.push([key, value]);
  }

  function dataDelete(data, key) {
    let i = 0;
    while (i < data.length) {
      const [dataKey] = data[i];
      if (dataKey === key) {
        data.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  function dataHas(data, key) {
    for (const [dataKey] of data) {
      if (dataKey === key) {
        return true;
      }
    }
    return false;
  }

  // ref: https://fetch.spec.whatwg.org/#dom-headers
  class HeadersBase {
    constructor(init) {
      if (init === null) {
        throw new TypeError(
          "Failed to construct 'Headers'; The provided value was not valid",
        );
      } else if (isHeaders(init)) {
        this[headersData] = [...init];
      } else {
        this[headersData] = [];
        if (Array.isArray(init)) {
          for (const tuple of init) {
            // If header does not contain exactly two items,
            // then throw a TypeError.
            // ref: https://fetch.spec.whatwg.org/#concept-headers-fill
            requiredArguments(
              "Headers.constructor tuple array argument",
              tuple.length,
              2,
            );

            this.append(tuple[0], tuple[1]);
          }
        } else if (init) {
          for (const [rawName, rawValue] of Object.entries(init)) {
            this.append(rawName, rawValue);
          }
        }
      }
    }

    [Symbol.for("Deno.customInspect")]() {
      let length = this[headersData].length;
      let output = "";
      for (const [key, value] of this[headersData]) {
        const prefix = length === this[headersData].length ? " " : "";
        const postfix = length === 1 ? " " : ", ";
        output = output + `${prefix}${key}: ${value}${postfix}`;
        length--;
      }
      return `Headers {${output}}`;
    }

    // ref: https://fetch.spec.whatwg.org/#concept-headers-append
    append(name, value) {
      requiredArguments("Headers.append", arguments.length, 2);
      const [newname, newvalue] = normalizeParams(name, value);
      validateName(newname);
      validateValue(newvalue);
      dataAppend(this[headersData], newname, newvalue);
    }

    delete(name) {
      requiredArguments("Headers.delete", arguments.length, 1);
      const [newname] = normalizeParams(name);
      validateName(newname);
      dataDelete(this[headersData], newname);
    }

    get(name) {
      requiredArguments("Headers.get", arguments.length, 1);
      const [newname] = normalizeParams(name);
      validateName(newname);
      return dataGet(this[headersData], newname) ?? null;
    }

    has(name) {
      requiredArguments("Headers.has", arguments.length, 1);
      const [newname] = normalizeParams(name);
      validateName(newname);
      return dataHas(this[headersData], newname);
    }

    set(name, value) {
      requiredArguments("Headers.set", arguments.length, 2);
      const [newname, newvalue] = normalizeParams(name, value);
      validateName(newname);
      validateValue(newvalue);
      dataSet(this[headersData], newname, newvalue);
    }

    get [Symbol.toStringTag]() {
      return "Headers";
    }
  }

  class Headers extends DomIterableMixin(HeadersBase, headersData) {}

  window.__bootstrap.headers = {
    Headers,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const base64 = window.__bootstrap.base64;

  async function readOperation(fr, blob, readtype) {
    // Implementation from https://w3c.github.io/FileAPI/ notes
    // And body of deno blob.ts readBytes

    fr.aborting = false;

    // 1. If fr’s state is "loading", throw an InvalidStateError DOMException.
    if (fr.readyState === FileReader.LOADING) {
      throw new DOMException(
        "Invalid FileReader state.",
        "InvalidStateError",
      );
    }
    // 2. Set fr’s state to "loading".
    fr.readyState = FileReader.LOADING;
    // 3. Set fr’s result to null.
    fr.result = null;
    // 4. Set fr’s error to null.
    fr.error = null;

    // 5. Let stream be the result of calling get stream on blob.
    const stream /*: ReadableStream<ArrayBufferView>*/ = blob.stream();

    // 6. Let reader be the result of getting a reader from stream.
    const reader = stream.getReader();

    // 7. Let bytes be an empty byte sequence.
    //let bytes = new Uint8Array();
    const chunks /*: Uint8Array[]*/ = [];

    // 8. Let chunkPromise be the result of reading a chunk from stream with reader.
    let chunkPromise = reader.read();

    // 9. Let isFirstChunk be true.
    let isFirstChunk = true;

    // 10 in parallel while true
    while (!fr.aborting) {
      // 1. Wait for chunkPromise to be fulfilled or rejected.
      try {
        const chunk = await chunkPromise;

        // 2. If chunkPromise is fulfilled, and isFirstChunk is true, queue a task to fire a progress event called loadstart at fr.
        if (isFirstChunk) {
          queueMicrotask(() => {
            // fire a progress event for loadstart
            const ev = new ProgressEvent("loadstart", {});
            fr.dispatchEvent(ev);
            if (fr.onloadstart !== null) {
              fr.onloadstart(ev);
            }
          });
        }
        // 3. Set isFirstChunk to false.
        isFirstChunk = false;

        // 4. If chunkPromise is fulfilled with an object whose done property is false
        // and whose value property is a Uint8Array object, run these steps:
        if (!chunk.done && chunk.value instanceof Uint8Array) {
          chunks.push(chunk.value);

          // TODO: (only) If roughly 50ms have passed since last progress
          {
            const size = chunks.reduce((p, i) => p + i.byteLength, 0);
            const ev = new ProgressEvent("progress", {
              loaded: size,
            });
            fr.dispatchEvent(ev);
            if (fr.onprogress !== null) {
              fr.onprogress(ev);
            }
          }

          chunkPromise = reader.read();
        } // 5 Otherwise, if chunkPromise is fulfilled with an object whose done property is true, queue a task to run the following steps and abort this algorithm:
        else if (chunk.done === true) {
          queueMicrotask(() => {
            if (fr.aborting) {
              return;
            }

            // 1. Set fr’s state to "done".
            fr.readyState = FileReader.DONE;
            // 2. Let result be the result of package data given bytes, type, blob’s type, and encodingName.
            const size = chunks.reduce((p, i) => p + i.byteLength, 0);
            const bytes = new Uint8Array(size);
            let offs = 0;
            for (const chunk of chunks) {
              bytes.set(chunk, offs);
              offs += chunk.byteLength;
            }
            switch (readtype.kind) {
              case "ArrayBuffer": {
                fr.result = bytes.buffer;
                break;
              }
              case "Text": {
                const decoder = new TextDecoder(readtype.encoding);
                fr.result = decoder.decode(bytes.buffer);
                break;
              }
              case "DataUrl": {
                fr.result = "data:application/octet-stream;base64," +
                  base64.fromByteArray(bytes);
                break;
              }
            }
            // 4.2 Fire a progress event called load at the fr.
            {
              const ev = new ProgressEvent("load", {
                lengthComputable: true,
                loaded: size,
                total: size,
              });
              fr.dispatchEvent(ev);
              if (fr.onload !== null) {
                fr.onload(ev);
              }
            }

            // 5. If fr’s state is not "loading", fire a progress event called loadend at the fr.
            //Note: Event handler for the load or error events could have started another load, if that happens the loadend event for this load is not fired.
            if (fr.readyState !== FileReader.LOADING) {
              const ev = new ProgressEvent("loadend", {
                lengthComputable: true,
                loaded: size,
                total: size,
              });
              fr.dispatchEvent(ev);
              if (fr.onloadend !== null) {
                fr.onloadend(ev);
              }
            }
          });

          break;
        }
      } catch (err) {
        if (fr.aborting) {
          break;
        }

        // chunkPromise rejected
        fr.readyState = FileReader.DONE;
        fr.error = err;

        {
          const ev = new ProgressEvent("error", {});
          fr.dispatchEvent(ev);
          if (fr.onerror !== null) {
            fr.onerror(ev);
          }
        }

        //If fr’s state is not "loading", fire a progress event called loadend at fr.
        //Note: Event handler for the error event could have started another load, if that happens the loadend event for this load is not fired.
        if (fr.readyState !== FileReader.LOADING) {
          const ev = new ProgressEvent("loadend", {});
          fr.dispatchEvent(ev);
          if (fr.onloadend !== null) {
            fr.onloadend(ev);
          }
        }

        break;
      }
    }
  }

  class FileReader extends EventTarget {
    error = null;
    onabort = null;
    onerror = null;
    onload = null;
    onloadend = null;
    onloadstart = null;
    onprogress = null;

    readyState = FileReader.EMPTY;
    result = null;
    aborting = false;

    constructor() {
      super();
    }

    abort() {
      // If context object's state is "empty" or if context object's state is "done" set context object's result to null and terminate this algorithm.
      if (
        this.readyState === FileReader.EMPTY ||
        this.readyState === FileReader.DONE
      ) {
        this.result = null;
        return;
      }
      // If context object's state is "loading" set context object's state to "done" and set context object's result to null.
      if (this.readyState === FileReader.LOADING) {
        this.readyState = FileReader.DONE;
        this.result = null;
      }
      // If there are any tasks from the context object on the file reading task source in an affiliated task queue, then remove those tasks from that task queue.
      // Terminate the algorithm for the read method being processed.
      this.aborting = true;

      // Fire a progress event called abort at the context object.
      const ev = new ProgressEvent("abort", {});
      this.dispatchEvent(ev);
      if (this.onabort !== null) {
        this.onabort(ev);
      }

      // If context object's state is not "loading", fire a progress event called loadend at the context object.
      if (this.readyState !== FileReader.LOADING) {
        const ev = new ProgressEvent("loadend", {});
        this.dispatchEvent(ev);
        if (this.onloadend !== null) {
          this.onloadend(ev);
        }
      }
    }
    readAsArrayBuffer(blob) {
      readOperation(this, blob, { kind: "ArrayBuffer" });
    }
    readAsBinaryString(blob) {
      // alias for readAsArrayBuffer
      readOperation(this, blob, { kind: "ArrayBuffer" });
    }
    readAsDataURL(blob) {
      readOperation(this, blob, { kind: "DataUrl" });
    }
    readAsText(blob, encoding) {
      readOperation(this, blob, { kind: "Text", encoding });
    }
  }

  FileReader.EMPTY = 0;
  FileReader.LOADING = 1;
  FileReader.DONE = 2;

  window.__bootstrap.fileReader = {
    FileReader,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;

  // provided by "deno_web"
  const { URLSearchParams } = window.__bootstrap.url;

  const { requiredArguments } = window.__bootstrap.fetchUtil;
  const { ReadableStream, isReadableStreamDisturbed } =
    window.__bootstrap.streams;
  const { DomIterableMixin } = window.__bootstrap.domIterable;
  const { Headers } = window.__bootstrap.headers;

  // FIXME(bartlomieju): stubbed out, needed in blob
  const build = {
    os: "",
  };

  const MAX_SIZE = 2 ** 32 - 2;

  // `off` is the offset into `dst` where it will at which to begin writing values
  // from `src`.
  // Returns the number of bytes copied.
  function copyBytes(src, dst, off = 0) {
    const r = dst.byteLength - off;
    if (src.byteLength > r) {
      src = src.subarray(0, r);
    }
    dst.set(src, off);
    return src.byteLength;
  }

  class Buffer {
    #buf = null; // contents are the bytes buf[off : len(buf)]
    #off = 0; // read at buf[off], write at buf[buf.byteLength]

    constructor(ab) {
      if (ab == null) {
        this.#buf = new Uint8Array(0);
        return;
      }

      this.#buf = new Uint8Array(ab);
    }

    bytes(options = { copy: true }) {
      if (options.copy === false) return this.#buf.subarray(this.#off);
      return this.#buf.slice(this.#off);
    }

    empty() {
      return this.#buf.byteLength <= this.#off;
    }

    get length() {
      return this.#buf.byteLength - this.#off;
    }

    get capacity() {
      return this.#buf.buffer.byteLength;
    }

    reset() {
      this.#reslice(0);
      this.#off = 0;
    }

    #tryGrowByReslice = (n) => {
      const l = this.#buf.byteLength;
      if (n <= this.capacity - l) {
        this.#reslice(l + n);
        return l;
      }
      return -1;
    };

    #reslice = (len) => {
      if (!(len <= this.#buf.buffer.byteLength)) {
        throw new Error("assert");
      }
      this.#buf = new Uint8Array(this.#buf.buffer, 0, len);
    };

    writeSync(p) {
      const m = this.#grow(p.byteLength);
      return copyBytes(p, this.#buf, m);
    }

    write(p) {
      const n = this.writeSync(p);
      return Promise.resolve(n);
    }

    #grow = (n) => {
      const m = this.length;
      // If buffer is empty, reset to recover space.
      if (m === 0 && this.#off !== 0) {
        this.reset();
      }
      // Fast: Try to grow by means of a reslice.
      const i = this.#tryGrowByReslice(n);
      if (i >= 0) {
        return i;
      }
      const c = this.capacity;
      if (n <= Math.floor(c / 2) - m) {
        // We can slide things down instead of allocating a new
        // ArrayBuffer. We only need m+n <= c to slide, but
        // we instead let capacity get twice as large so we
        // don't spend all our time copying.
        copyBytes(this.#buf.subarray(this.#off), this.#buf);
      } else if (c + n > MAX_SIZE) {
        throw new Error("The buffer cannot be grown beyond the maximum size.");
      } else {
        // Not enough space anywhere, we need to allocate.
        const buf = new Uint8Array(Math.min(2 * c + n, MAX_SIZE));
        copyBytes(this.#buf.subarray(this.#off), buf);
        this.#buf = buf;
      }
      // Restore this.#off and len(this.#buf).
      this.#off = 0;
      this.#reslice(Math.min(m + n, MAX_SIZE));
      return m;
    };

    grow(n) {
      if (n < 0) {
        throw Error("Buffer.grow: negative count");
      }
      const m = this.#grow(n);
      this.#reslice(m);
    }
  }

  function isTypedArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
  }

  function hasHeaderValueOf(s, value) {
    return new RegExp(`^${value}[\t\s]*;?`).test(s);
  }

  function getHeaderValueParams(value) {
    const params = new Map();
    // Forced to do so for some Map constructor param mismatch
    value
      .split(";")
      .slice(1)
      .map((s) => s.trim().split("="))
      .filter((arr) => arr.length > 1)
      .map(([k, v]) => [k, v.replace(/^"([^"]*)"$/, "$1")])
      .forEach(([k, v]) => params.set(k, v));
    return params;
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const CR = "\r".charCodeAt(0);
  const LF = "\n".charCodeAt(0);

  const dataSymbol = Symbol("data");
  const bytesSymbol = Symbol("bytes");

  function containsOnlyASCII(str) {
    if (typeof str !== "string") {
      return false;
    }
    return /^[\x00-\x7F]*$/.test(str);
  }

  function convertLineEndingsToNative(s) {
    const nativeLineEnd = build.os == "windows" ? "\r\n" : "\n";

    let position = 0;

    let collectionResult = collectSequenceNotCRLF(s, position);

    let token = collectionResult.collected;
    position = collectionResult.newPosition;

    let result = token;

    while (position < s.length) {
      const c = s.charAt(position);
      if (c == "\r") {
        result += nativeLineEnd;
        position++;
        if (position < s.length && s.charAt(position) == "\n") {
          position++;
        }
      } else if (c == "\n") {
        position++;
        result += nativeLineEnd;
      }

      collectionResult = collectSequenceNotCRLF(s, position);

      token = collectionResult.collected;
      position = collectionResult.newPosition;

      result += token;
    }

    return result;
  }

  function collectSequenceNotCRLF(
    s,
    position,
  ) {
    const start = position;
    for (
      let c = s.charAt(position);
      position < s.length && !(c == "\r" || c == "\n");
      c = s.charAt(++position)
    );
    return { collected: s.slice(start, position), newPosition: position };
  }

  function toUint8Arrays(
    blobParts,
    doNormalizeLineEndingsToNative,
  ) {
    const ret = [];
    const enc = new TextEncoder();
    for (const element of blobParts) {
      if (typeof element === "string") {
        let str = element;
        if (doNormalizeLineEndingsToNative) {
          str = convertLineEndingsToNative(element);
        }
        ret.push(enc.encode(str));
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
      } else if (element instanceof Blob) {
        ret.push(element[bytesSymbol]);
      } else if (element instanceof Uint8Array) {
        ret.push(element);
      } else if (element instanceof Uint16Array) {
        const uint8 = new Uint8Array(element.buffer);
        ret.push(uint8);
      } else if (element instanceof Uint32Array) {
        const uint8 = new Uint8Array(element.buffer);
        ret.push(uint8);
      } else if (ArrayBuffer.isView(element)) {
        // Convert view to Uint8Array.
        const uint8 = new Uint8Array(element.buffer);
        ret.push(uint8);
      } else if (element instanceof ArrayBuffer) {
        // Create a new Uint8Array view for the given ArrayBuffer.
        const uint8 = new Uint8Array(element);
        ret.push(uint8);
      } else {
        ret.push(enc.encode(String(element)));
      }
    }
    return ret;
  }

  function processBlobParts(
    blobParts,
    options,
  ) {
    const normalizeLineEndingsToNative = options.ending === "native";
    // ArrayBuffer.transfer is not yet implemented in V8, so we just have to
    // pre compute size of the array buffer and do some sort of static allocation
    // instead of dynamic allocation.
    const uint8Arrays = toUint8Arrays(blobParts, normalizeLineEndingsToNative);
    const byteLength = uint8Arrays
      .map((u8) => u8.byteLength)
      .reduce((a, b) => a + b, 0);
    const ab = new ArrayBuffer(byteLength);
    const bytes = new Uint8Array(ab);
    let courser = 0;
    for (const u8 of uint8Arrays) {
      bytes.set(u8, courser);
      courser += u8.byteLength;
    }

    return bytes;
  }

  function getStream(blobBytes) {
    // TODO: Align to spec https://fetch.spec.whatwg.org/#concept-construct-readablestream
    return new ReadableStream({
      type: "bytes",
      start: (controller) => {
        controller.enqueue(blobBytes);
        controller.close();
      },
    });
  }

  async function readBytes(
    reader,
  ) {
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (!done && value instanceof Uint8Array) {
        chunks.push(value);
      } else if (done) {
        const size = chunks.reduce((p, i) => p + i.byteLength, 0);
        const bytes = new Uint8Array(size);
        let offs = 0;
        for (const chunk of chunks) {
          bytes.set(chunk, offs);
          offs += chunk.byteLength;
        }
        return bytes.buffer;
      } else {
        throw new TypeError("Invalid reader result.");
      }
    }
  }

  // A WeakMap holding blob to byte array mapping.
  // Ensures it does not impact garbage collection.
  // const blobBytesWeakMap = new WeakMap();

  class Blob {
    constructor(blobParts, options) {
      if (arguments.length === 0) {
        this[bytesSymbol] = new Uint8Array();
        return;
      }

      const { ending = "transparent", type = "" } = options ?? {};
      // Normalize options.type.
      let normalizedType = type;
      if (!containsOnlyASCII(type)) {
        normalizedType = "";
      } else {
        if (type.length) {
          for (let i = 0; i < type.length; ++i) {
            const char = type[i];
            if (char < "\u0020" || char > "\u007E") {
              normalizedType = "";
              break;
            }
          }
          normalizedType = type.toLowerCase();
        }
      }
      const bytes = processBlobParts(blobParts, { ending, type });
      // Set Blob object's properties.
      this[bytesSymbol] = bytes;
      this.size = bytes.byteLength;
      this.type = normalizedType;
    }

    slice(start, end, contentType) {
      return new Blob([this[bytesSymbol].slice(start, end)], {
        type: contentType || this.type,
      });
    }

    stream() {
      return getStream(this[bytesSymbol]);
    }

    async text() {
      const reader = getStream(this[bytesSymbol]).getReader();
      const decoder = new TextDecoder();
      return decoder.decode(await readBytes(reader));
    }

    arrayBuffer() {
      return readBytes(getStream(this[bytesSymbol]).getReader());
    }
  }

  class DomFile extends Blob {
    constructor(
      fileBits,
      fileName,
      options,
    ) {
      const { lastModified = Date.now(), ...blobPropertyBag } = options ?? {};
      super(fileBits, blobPropertyBag);

      // 4.1.2.1 Replace any "/" character (U+002F SOLIDUS)
      // with a ":" (U + 003A COLON)
      this.name = String(fileName).replace(/\u002F/g, "\u003A");
      // 4.1.3.3 If lastModified is not provided, set lastModified to the current
      // date and time represented in number of milliseconds since the Unix Epoch.
      this.lastModified = lastModified;
    }
  }

  function parseFormDataValue(value, filename) {
    if (value instanceof DomFile) {
      return new DomFile([value], filename || value.name, {
        type: value.type,
        lastModified: value.lastModified,
      });
    } else if (value instanceof Blob) {
      return new DomFile([value], filename || "blob", {
        type: value.type,
      });
    } else {
      return String(value);
    }
  }

  class FormDataBase {
    [dataSymbol] = [];

    append(name, value, filename) {
      requiredArguments("FormData.append", arguments.length, 2);
      name = String(name);
      this[dataSymbol].push([name, parseFormDataValue(value, filename)]);
    }

    delete(name) {
      requiredArguments("FormData.delete", arguments.length, 1);
      name = String(name);
      let i = 0;
      while (i < this[dataSymbol].length) {
        if (this[dataSymbol][i][0] === name) {
          this[dataSymbol].splice(i, 1);
        } else {
          i++;
        }
      }
    }

    getAll(name) {
      requiredArguments("FormData.getAll", arguments.length, 1);
      name = String(name);
      const values = [];
      for (const entry of this[dataSymbol]) {
        if (entry[0] === name) {
          values.push(entry[1]);
        }
      }

      return values;
    }

    get(name) {
      requiredArguments("FormData.get", arguments.length, 1);
      name = String(name);
      for (const entry of this[dataSymbol]) {
        if (entry[0] === name) {
          return entry[1];
        }
      }

      return null;
    }

    has(name) {
      requiredArguments("FormData.has", arguments.length, 1);
      name = String(name);
      return this[dataSymbol].some((entry) => entry[0] === name);
    }

    set(name, value, filename) {
      requiredArguments("FormData.set", arguments.length, 2);
      name = String(name);

      // If there are any entries in the context object’s entry list whose name
      // is name, replace the first such entry with entry and remove the others
      let found = false;
      let i = 0;
      while (i < this[dataSymbol].length) {
        if (this[dataSymbol][i][0] === name) {
          if (!found) {
            this[dataSymbol][i][1] = parseFormDataValue(value, filename);
            found = true;
          } else {
            this[dataSymbol].splice(i, 1);
            continue;
          }
        }
        i++;
      }

      // Otherwise, append entry to the context object’s entry list.
      if (!found) {
        this[dataSymbol].push([name, parseFormDataValue(value, filename)]);
      }
    }

    get [Symbol.toStringTag]() {
      return "FormData";
    }
  }

  class FormData extends DomIterableMixin(FormDataBase, dataSymbol) {}

  class MultipartBuilder {
    constructor(formData, boundary) {
      this.formData = formData;
      this.boundary = boundary ?? this.#createBoundary();
      this.writer = new Buffer();
    }

    getContentType() {
      return `multipart/form-data; boundary=${this.boundary}`;
    }

    getBody() {
      for (const [fieldName, fieldValue] of this.formData.entries()) {
        if (fieldValue instanceof DomFile) {
          this.#writeFile(fieldName, fieldValue);
        } else this.#writeField(fieldName, fieldValue);
      }

      this.writer.writeSync(encoder.encode(`\r\n--${this.boundary}--`));

      return this.writer.bytes();
    }

    #createBoundary = () => {
      return (
        "----------" +
        Array.from(Array(32))
          .map(() => Math.random().toString(36)[2] || 0)
          .join("")
      );
    };

    #writeHeaders = (headers) => {
      let buf = this.writer.empty() ? "" : "\r\n";

      buf += `--${this.boundary}\r\n`;
      for (const [key, value] of headers) {
        buf += `${key}: ${value}\r\n`;
      }
      buf += `\r\n`;

      // FIXME(Bartlomieju): this should use `writeSync()`
      this.writer.write(encoder.encode(buf));
    };

    #writeFileHeaders = (
      field,
      filename,
      type,
    ) => {
      const headers = [
        [
          "Content-Disposition",
          `form-data; name="${field}"; filename="${filename}"`,
        ],
        ["Content-Type", type || "application/octet-stream"],
      ];
      return this.#writeHeaders(headers);
    };

    #writeFieldHeaders = (field) => {
      const headers = [["Content-Disposition", `form-data; name="${field}"`]];
      return this.#writeHeaders(headers);
    };

    #writeField = (field, value) => {
      this.#writeFieldHeaders(field);
      this.writer.writeSync(encoder.encode(value));
    };

    #writeFile = (field, value) => {
      this.#writeFileHeaders(field, value.name, value.type);
      this.writer.writeSync(value[bytesSymbol]);
    };
  }

  class MultipartParser {
    constructor(body, boundary) {
      if (!boundary) {
        throw new TypeError("multipart/form-data must provide a boundary");
      }

      this.boundary = `--${boundary}`;
      this.body = body;
      this.boundaryChars = encoder.encode(this.boundary);
    }

    #parseHeaders = (headersText) => {
      const headers = new Headers();
      const rawHeaders = headersText.split("\r\n");
      for (const rawHeader of rawHeaders) {
        const sepIndex = rawHeader.indexOf(":");
        if (sepIndex < 0) {
          continue; // Skip this header
        }
        const key = rawHeader.slice(0, sepIndex);
        const value = rawHeader.slice(sepIndex + 1);
        headers.set(key, value);
      }

      return {
        headers,
        disposition: getHeaderValueParams(
          headers.get("Content-Disposition") ?? "",
        ),
      };
    };

    parse() {
      const formData = new FormData();
      let headerText = "";
      let boundaryIndex = 0;
      let state = 0;
      let fileStart = 0;

      for (let i = 0; i < this.body.length; i++) {
        const byte = this.body[i];
        const prevByte = this.body[i - 1];
        const isNewLine = byte === LF && prevByte === CR;

        if (state === 1 || state === 2 || state == 3) {
          headerText += String.fromCharCode(byte);
        }
        if (state === 0 && isNewLine) {
          state = 1;
        } else if (state === 1 && isNewLine) {
          state = 2;
          const headersDone = this.body[i + 1] === CR &&
            this.body[i + 2] === LF;

          if (headersDone) {
            state = 3;
          }
        } else if (state === 2 && isNewLine) {
          state = 3;
        } else if (state === 3 && isNewLine) {
          state = 4;
          fileStart = i + 1;
        } else if (state === 4) {
          if (this.boundaryChars[boundaryIndex] !== byte) {
            boundaryIndex = 0;
          } else {
            boundaryIndex++;
          }

          if (boundaryIndex >= this.boundary.length) {
            const { headers, disposition } = this.#parseHeaders(headerText);
            const content = this.body.subarray(
              fileStart,
              i - boundaryIndex - 1,
            );
            // https://fetch.spec.whatwg.org/#ref-for-dom-body-formdata
            const filename = disposition.get("filename");
            const name = disposition.get("name");

            state = 5;
            // Reset
            boundaryIndex = 0;
            headerText = "";

            if (!name) {
              continue; // Skip, unknown name
            }

            if (filename) {
              const blob = new Blob([content], {
                type: headers.get("Content-Type") || "application/octet-stream",
              });
              formData.append(name, blob, filename);
            } else {
              formData.append(name, decoder.decode(content));
            }
          }
        } else if (state === 5 && isNewLine) {
          state = 1;
        }
      }

      return formData;
    }
  }

  function validateBodyType(owner, bodySource) {
    if (isTypedArray(bodySource)) {
      return true;
    } else if (bodySource instanceof ArrayBuffer) {
      return true;
    } else if (typeof bodySource === "string") {
      return true;
    } else if (bodySource instanceof ReadableStream) {
      return true;
    } else if (bodySource instanceof FormData) {
      return true;
    } else if (bodySource instanceof URLSearchParams) {
      return true;
    } else if (!bodySource) {
      return true; // null body is fine
    }
    throw new Error(
      `Bad ${owner.constructor.name} body type: ${bodySource.constructor.name}`,
    );
  }

  async function bufferFromStream(
    stream,
    size,
  ) {
    const encoder = new TextEncoder();
    const buffer = new Buffer();

    if (size) {
      // grow to avoid unnecessary allocations & copies
      buffer.grow(size);
    }

    while (true) {
      const { done, value } = await stream.read();

      if (done) break;

      if (typeof value === "string") {
        buffer.writeSync(encoder.encode(value));
      } else if (value instanceof ArrayBuffer) {
        buffer.writeSync(new Uint8Array(value));
      } else if (value instanceof Uint8Array) {
        buffer.writeSync(value);
      } else if (!value) {
        // noop for undefined
      } else {
        throw new Error("unhandled type on stream read");
      }
    }

    return buffer.bytes().buffer;
  }

  function bodyToArrayBuffer(bodySource) {
    if (isTypedArray(bodySource)) {
      return bodySource.buffer;
    } else if (bodySource instanceof ArrayBuffer) {
      return bodySource;
    } else if (typeof bodySource === "string") {
      const enc = new TextEncoder();
      return enc.encode(bodySource).buffer;
    } else if (bodySource instanceof ReadableStream) {
      throw new Error(
        `Can't convert stream to ArrayBuffer (try bufferFromStream)`,
      );
    } else if (
      bodySource instanceof FormData ||
      bodySource instanceof URLSearchParams
    ) {
      const enc = new TextEncoder();
      return enc.encode(bodySource.toString()).buffer;
    } else if (!bodySource) {
      return new ArrayBuffer(0);
    }
    throw new Error(
      `Body type not implemented: ${bodySource.constructor.name}`,
    );
  }

  const BodyUsedError =
    "Failed to execute 'clone' on 'Body': body is already used";

  class Body {
    #contentType = "";
    #size = undefined;

    constructor(_bodySource, meta) {
      validateBodyType(this, _bodySource);
      this._bodySource = _bodySource;
      this.#contentType = meta.contentType;
      this.#size = meta.size;
      this._stream = null;
    }

    get body() {
      if (this._stream) {
        return this._stream;
      }

      if (!this._bodySource) {
        return null;
      } else if (this._bodySource instanceof ReadableStream) {
        this._stream = this._bodySource;
      } else {
        const buf = bodyToArrayBuffer(this._bodySource);
        if (!(buf instanceof ArrayBuffer)) {
          throw new Error(
            `Expected ArrayBuffer from body`,
          );
        }

        this._stream = new ReadableStream({
          start(controller) {
            controller.enqueue(buf);
            controller.close();
          },
        });
      }

      return this._stream;
    }

    get bodyUsed() {
      if (this.body && isReadableStreamDisturbed(this.body)) {
        return true;
      }
      return false;
    }

    async blob() {
      return new Blob([await this.arrayBuffer()], {
        type: this.#contentType,
      });
    }

    // ref: https://fetch.spec.whatwg.org/#body-mixin
    async formData() {
      const formData = new FormData();
      if (hasHeaderValueOf(this.#contentType, "multipart/form-data")) {
        const params = getHeaderValueParams(this.#contentType);

        // ref: https://tools.ietf.org/html/rfc2046#section-5.1
        const boundary = params.get("boundary");
        const body = new Uint8Array(await this.arrayBuffer());
        const multipartParser = new MultipartParser(body, boundary);

        return multipartParser.parse();
      } else if (
        hasHeaderValueOf(this.#contentType, "application/x-www-form-urlencoded")
      ) {
        // From https://github.com/github/fetch/blob/master/fetch.js
        // Copyright (c) 2014-2016 GitHub, Inc. MIT License
        const body = await this.text();
        try {
          body
            .trim()
            .split("&")
            .forEach((bytes) => {
              if (bytes) {
                const split = bytes.split("=");
                const name = split.shift().replace(/\+/g, " ");
                const value = split.join("=").replace(/\+/g, " ");
                formData.append(
                  decodeURIComponent(name),
                  decodeURIComponent(value),
                );
              }
            });
        } catch (e) {
          throw new TypeError("Invalid form urlencoded format");
        }
        return formData;
      } else {
        throw new TypeError("Invalid form data");
      }
    }

    async text() {
      if (typeof this._bodySource === "string") {
        return this._bodySource;
      }

      const ab = await this.arrayBuffer();
      const decoder = new TextDecoder("utf-8");
      return decoder.decode(ab);
    }

    async json() {
      const raw = await this.text();
      return JSON.parse(raw);
    }

    arrayBuffer() {
      if (this._bodySource instanceof ReadableStream) {
        return bufferFromStream(this._bodySource.getReader(), this.#size);
      }
      return Promise.resolve(bodyToArrayBuffer(this._bodySource));
    }
  }

  function createHttpClient(options) {
    return new HttpClient(opCreateHttpClient(options));
  }

  function opCreateHttpClient(args) {
    return core.jsonOpSync("op_create_http_client", args);
  }

  class HttpClient {
    constructor(rid) {
      this.rid = rid;
    }
    close() {
      core.close(this.rid);
    }
  }

  function opFetch(args, body) {
    let zeroCopy;
    if (body != null) {
      zeroCopy = new Uint8Array(body.buffer, body.byteOffset, body.byteLength);
    }

    return core.jsonOpAsync("op_fetch", args, ...(zeroCopy ? [zeroCopy] : []));
  }

  const NULL_BODY_STATUS = [101, 204, 205, 304];
  const REDIRECT_STATUS = [301, 302, 303, 307, 308];

  function byteUpperCase(s) {
    return String(s).replace(/[a-z]/g, function byteUpperCaseReplace(c) {
      return c.toUpperCase();
    });
  }

  function normalizeMethod(m) {
    const u = byteUpperCase(m);
    if (
      u === "DELETE" ||
      u === "GET" ||
      u === "HEAD" ||
      u === "OPTIONS" ||
      u === "POST" ||
      u === "PUT"
    ) {
      return u;
    }
    return m;
  }

  class Request extends Body {
    constructor(input, init) {
      if (arguments.length < 1) {
        throw TypeError("Not enough arguments");
      }

      if (!init) {
        init = {};
      }

      let b;

      // prefer body from init
      if (init.body) {
        b = init.body;
      } else if (input instanceof Request && input._bodySource) {
        if (input.bodyUsed) {
          throw TypeError(BodyUsedError);
        }
        b = input._bodySource;
      } else if (typeof input === "object" && "body" in input && input.body) {
        if (input.bodyUsed) {
          throw TypeError(BodyUsedError);
        }
        b = input.body;
      } else {
        b = "";
      }

      let headers;

      // prefer headers from init
      if (init.headers) {
        headers = new Headers(init.headers);
      } else if (input instanceof Request) {
        headers = input.headers;
      } else {
        headers = new Headers();
      }

      const contentType = headers.get("content-type") || "";
      super(b, { contentType });
      this.headers = headers;

      // readonly attribute ByteString method;
      this.method = "GET";

      // readonly attribute USVString url;
      this.url = "";

      // readonly attribute RequestCredentials credentials;
      this.credentials = "omit";

      if (input instanceof Request) {
        if (input.bodyUsed) {
          throw TypeError(BodyUsedError);
        }
        this.method = input.method;
        this.url = input.url;
        this.headers = new Headers(input.headers);
        this.credentials = input.credentials;
        this._stream = input._stream;
      } else {
        // TODO(nayeemrmn): Base from `--location` when implemented and set.
        this.url = new URL(String(input)).href;
      }

      if (init && "method" in init) {
        this.method = normalizeMethod(init.method);
      }

      if (
        init &&
        "credentials" in init &&
        init.credentials &&
        ["omit", "same-origin", "include"].indexOf(init.credentials) !== -1
      ) {
        this.credentials = init.credentials;
      }
    }

    clone() {
      if (this.bodyUsed) {
        throw TypeError(BodyUsedError);
      }

      const iterators = this.headers.entries();
      const headersList = [];
      for (const header of iterators) {
        headersList.push(header);
      }

      let body2 = this._bodySource;

      if (this._bodySource instanceof ReadableStream) {
        const tees = this._bodySource.tee();
        this._stream = this._bodySource = tees[0];
        body2 = tees[1];
      }

      return new Request(this.url, {
        body: body2,
        method: this.method,
        headers: new Headers(headersList),
        credentials: this.credentials,
      });
    }
  }

  const responseData = new WeakMap();
  class Response extends Body {
    constructor(body = null, init) {
      init = init ?? {};

      if (typeof init !== "object") {
        throw new TypeError(`'init' is not an object`);
      }

      const extraInit = responseData.get(init) || {};
      let { type = "default", url = "" } = extraInit;

      let status = init.status === undefined ? 200 : Number(init.status || 0);
      let statusText = init.statusText ?? "";
      let headers = init.headers instanceof Headers
        ? init.headers
        : new Headers(init.headers);

      if (init.status !== undefined && (status < 200 || status > 599)) {
        throw new RangeError(
          `The status provided (${init.status}) is outside the range [200, 599]`,
        );
      }

      // null body status
      if (body && NULL_BODY_STATUS.includes(status)) {
        throw new TypeError("Response with null body status cannot have body");
      }

      if (!type) {
        type = "default";
      } else {
        if (type == "error") {
          // spec: https://fetch.spec.whatwg.org/#concept-network-error
          status = 0;
          statusText = "";
          headers = new Headers();
          body = null;
          /* spec for other Response types:
           https://fetch.spec.whatwg.org/#concept-filtered-response-basic
           Please note that type "basic" is not the same thing as "default".*/
        } else if (type == "basic") {
          for (const h of headers) {
            /* Forbidden Response-Header Names:
             https://fetch.spec.whatwg.org/#forbidden-response-header-name */
            if (["set-cookie", "set-cookie2"].includes(h[0].toLowerCase())) {
              headers.delete(h[0]);
            }
          }
        } else if (type == "cors") {
          /* CORS-safelisted Response-Header Names:
             https://fetch.spec.whatwg.org/#cors-safelisted-response-header-name */
          const allowedHeaders = [
            "Cache-Control",
            "Content-Language",
            "Content-Length",
            "Content-Type",
            "Expires",
            "Last-Modified",
            "Pragma",
          ].map((c) => c.toLowerCase());
          for (const h of headers) {
            /* Technically this is still not standards compliant because we are
             supposed to allow headers allowed in the
             'Access-Control-Expose-Headers' header in the 'internal response'
             However, this implementation of response doesn't seem to have an
             easy way to access the internal response, so we ignore that
             header.
             TODO(serverhiccups): change how internal responses are handled
             so we can do this properly. */
            if (!allowedHeaders.includes(h[0].toLowerCase())) {
              headers.delete(h[0]);
            }
          }
          /* TODO(serverhiccups): Once I fix the 'internal response' thing,
           these actually need to treat the internal response differently */
        } else if (type == "opaque" || type == "opaqueredirect") {
          url = "";
          status = 0;
          statusText = "";
          headers = new Headers();
          body = null;
        }
      }

      const contentType = headers.get("content-type") || "";
      const size = Number(headers.get("content-length")) || undefined;

      super(body, { contentType, size });

      this.url = url;
      this.statusText = statusText;
      this.status = extraInit.status || status;
      this.headers = headers;
      this.redirected = extraInit.redirected || false;
      this.type = type;
    }

    get ok() {
      return 200 <= this.status && this.status < 300;
    }

    clone() {
      if (this.bodyUsed) {
        throw TypeError(BodyUsedError);
      }

      const iterators = this.headers.entries();
      const headersList = [];
      for (const header of iterators) {
        headersList.push(header);
      }

      let resBody = this._bodySource;

      if (this._bodySource instanceof ReadableStream) {
        const tees = this._bodySource.tee();
        this._stream = this._bodySource = tees[0];
        resBody = tees[1];
      }

      return new Response(resBody, {
        status: this.status,
        statusText: this.statusText,
        headers: new Headers(headersList),
      });
    }

    static redirect(url, status) {
      if (![301, 302, 303, 307, 308].includes(status)) {
        throw new RangeError(
          "The redirection status must be one of 301, 302, 303, 307 and 308.",
        );
      }
      return new Response(null, {
        status,
        statusText: "",
        headers: [["Location", typeof url === "string" ? url : url.toString()]],
      });
    }
  }

  function sendFetchReq(url, method, headers, body, clientRid) {
    let headerArray = [];
    if (headers) {
      headerArray = Array.from(headers.entries());
    }

    const args = {
      method,
      url,
      headers: headerArray,
      clientRid,
    };

    return opFetch(args, body);
  }

  async function fetch(input, init) {
    let url;
    let method = null;
    let headers = null;
    let body;
    let clientRid = null;
    let redirected = false;
    let remRedirectCount = 20; // TODO: use a better way to handle

    if (typeof input === "string" || input instanceof URL) {
      url = typeof input === "string" ? input : input.href;
      if (init != null) {
        method = init.method || null;
        if (init.headers) {
          headers = init.headers instanceof Headers
            ? init.headers
            : new Headers(init.headers);
        } else {
          headers = null;
        }

        // ref: https://fetch.spec.whatwg.org/#body-mixin
        // Body should have been a mixin
        // but we are treating it as a separate class
        if (init.body) {
          if (!headers) {
            headers = new Headers();
          }
          let contentType = "";
          if (typeof init.body === "string") {
            body = new TextEncoder().encode(init.body);
            contentType = "text/plain;charset=UTF-8";
          } else if (isTypedArray(init.body)) {
            body = init.body;
          } else if (init.body instanceof ArrayBuffer) {
            body = new Uint8Array(init.body);
          } else if (init.body instanceof URLSearchParams) {
            body = new TextEncoder().encode(init.body.toString());
            contentType = "application/x-www-form-urlencoded;charset=UTF-8";
          } else if (init.body instanceof Blob) {
            body = init.body[bytesSymbol];
            contentType = init.body.type;
          } else if (init.body instanceof FormData) {
            let boundary;
            if (headers.has("content-type")) {
              const params = getHeaderValueParams("content-type");
              boundary = params.get("boundary");
            }
            const multipartBuilder = new MultipartBuilder(
              init.body,
              boundary,
            );
            body = multipartBuilder.getBody();
            contentType = multipartBuilder.getContentType();
          } else {
            // TODO: ReadableStream
            throw new Error("Not implemented");
          }
          if (contentType && !headers.has("content-type")) {
            headers.set("content-type", contentType);
          }
        }

        if (init.client instanceof HttpClient) {
          clientRid = init.client.rid;
        }
      }
    } else {
      url = input.url;
      method = input.method;
      headers = input.headers;

      if (input._bodySource) {
        body = new DataView(await input.arrayBuffer());
      }
    }

    let responseBody;
    let responseInit = {};
    while (remRedirectCount) {
      const fetchResponse = await sendFetchReq(
        url,
        method,
        headers,
        body,
        clientRid,
      );
      const rid = fetchResponse.bodyRid;

      if (
        NULL_BODY_STATUS.includes(fetchResponse.status) ||
        REDIRECT_STATUS.includes(fetchResponse.status)
      ) {
        // We won't use body of received response, so close it now
        // otherwise it will be kept in resource table.
        core.close(fetchResponse.bodyRid);
        responseBody = null;
      } else {
        responseBody = new ReadableStream({
          type: "bytes",
          async pull(controller) {
            try {
              const result = await core.jsonOpAsync("op_fetch_read", { rid });
              if (!result || !result.chunk) {
                controller.close();
                core.close(rid);
              } else {
                // TODO(ry) This is terribly inefficient. Make this zero-copy.
                const chunk = new Uint8Array(result.chunk);
                controller.enqueue(chunk);
              }
            } catch (e) {
              controller.error(e);
              controller.close();
              core.close(rid);
            }
          },
          cancel() {
            // When reader.cancel() is called
            core.close(rid);
          },
        });
      }

      responseInit = {
        status: 200,
        statusText: fetchResponse.statusText,
        headers: fetchResponse.headers,
      };

      responseData.set(responseInit, {
        redirected,
        rid: fetchResponse.bodyRid,
        status: fetchResponse.status,
        url,
      });

      const response = new Response(responseBody, responseInit);

      if (REDIRECT_STATUS.includes(fetchResponse.status)) {
        // We're in a redirect status
        switch ((init && init.redirect) || "follow") {
          case "error":
            responseInit = {};
            responseData.set(responseInit, {
              type: "error",
              redirected: false,
              url: "",
            });
            return new Response(null, responseInit);
          case "manual":
            responseInit = {};
            responseData.set(responseInit, {
              type: "opaqueredirect",
              redirected: false,
              url: "",
            });
            return new Response(null, responseInit);
          case "follow":
          default:
            let redirectUrl = response.headers.get("Location");
            if (redirectUrl == null) {
              return response; // Unspecified
            }
            if (
              !redirectUrl.startsWith("http://") &&
              !redirectUrl.startsWith("https://")
            ) {
              redirectUrl = new URL(redirectUrl, url).href;
            }
            url = redirectUrl;
            redirected = true;
            remRedirectCount--;
        }
      } else {
        return response;
      }
    }

    responseData.set(responseInit, {
      type: "error",
      redirected: false,
      url: "",
    });

    return new Response(null, responseInit);
  }

  window.__bootstrap.fetch = {
    Blob,
    DomFile,
    FormData,
    fetch,
    Request,
    Response,
    HttpClient,
    createHttpClient,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { requiredArguments } = window.__bootstrap.webUtil;
  const CONNECTING = 0;
  const OPEN = 1;
  const CLOSING = 2;
  const CLOSED = 3;

  class WebSocket extends EventTarget {
    #readyState = CONNECTING;

    constructor(url, protocols = []) {
      super();
      requiredArguments("WebSocket", arguments.length, 1);

      const wsURL = new URL(url);

      if (wsURL.protocol !== "ws:" && wsURL.protocol !== "wss:") {
        throw new DOMException(
          "Only ws & wss schemes are allowed in a WebSocket URL.",
          "SyntaxError",
        );
      }

      if (wsURL.hash !== "" || wsURL.href.endsWith("#")) {
        throw new DOMException(
          "Fragments are not allowed in a WebSocket URL.",
          "SyntaxError",
        );
      }

      this.#url = wsURL.href;

      if (protocols && typeof protocols === "string") {
        protocols = [protocols];
      }

      if (
        protocols.some((x) => protocols.indexOf(x) !== protocols.lastIndexOf(x))
      ) {
        throw new DOMException(
          "Can't supply multiple times the same protocol.",
          "SyntaxError",
        );
      }

      core.jsonOpAsync("op_ws_create", {
        url: wsURL.href,
        protocols: protocols.join("; "),
      }).then((create) => {
        if (create.success) {
          this.#rid = create.rid;
          this.#extensions = create.extensions;
          this.#protocol = create.protocol;

          if (this.#readyState === CLOSING) {
            core.jsonOpAsync("op_ws_close", {
              rid: this.#rid,
            }).then(() => {
              this.#readyState = CLOSED;

              const errEvent = new Event("error");
              errEvent.target = this;
              this.onerror?.(errEvent);
              this.dispatchEvent(errEvent);

              const event = new CloseEvent("close");
              event.target = this;
              this.onclose?.(event);
              this.dispatchEvent(event);
              core.close(this.#rid);
            });
          } else {
            this.#readyState = OPEN;
            const event = new Event("open");
            event.target = this;
            this.onopen?.(event);
            this.dispatchEvent(event);

            this.#eventLoop();
          }
        } else {
          this.#readyState = CLOSED;

          const errEvent = new Event("error");
          errEvent.target = this;
          this.onerror?.(errEvent);
          this.dispatchEvent(errEvent);

          const closeEvent = new CloseEvent("close");
          closeEvent.target = this;
          this.onclose?.(closeEvent);
          this.dispatchEvent(closeEvent);
        }
      }).catch((err) => {
        this.#readyState = CLOSED;

        const errorEv = new ErrorEvent(
          "error",
          { error: err, message: err.toString() },
        );
        errorEv.target = this;
        this.onerror?.(errorEv);
        this.dispatchEvent(errorEv);

        const closeEv = new CloseEvent("close");
        closeEv.target = this;
        this.onclose?.(closeEv);
        this.dispatchEvent(closeEv);
      });
    }

    get CONNECTING() {
      return CONNECTING;
    }
    get OPEN() {
      return OPEN;
    }
    get CLOSING() {
      return CLOSING;
    }
    get CLOSED() {
      return CLOSED;
    }

    get readyState() {
      return this.#readyState;
    }

    #extensions = "";
    #protocol = "";
    #url = "";
    #rid;

    get extensions() {
      return this.#extensions;
    }
    get protocol() {
      return this.#protocol;
    }

    #binaryType = "blob";
    get binaryType() {
      return this.#binaryType;
    }
    set binaryType(value) {
      if (value === "blob" || value === "arraybuffer") {
        this.#binaryType = value;
      }
    }
    #bufferedAmount = 0;
    get bufferedAmount() {
      return this.#bufferedAmount;
    }

    get url() {
      return this.#url;
    }

    onopen = () => {};
    onerror = () => {};
    onclose = () => {};
    onmessage = () => {};

    send(data) {
      requiredArguments("WebSocket.send", arguments.length, 1);

      if (this.#readyState != OPEN) {
        throw Error("readyState not OPEN");
      }

      const sendTypedArray = (ta) => {
        this.#bufferedAmount += ta.size;
        core.jsonOpAsync("op_ws_send", {
          rid: this.#rid,
        }, ta).then(() => {
          this.#bufferedAmount -= ta.size;
        });
      };

      if (data instanceof Blob) {
        data.slice().arrayBuffer().then((ab) =>
          sendTypedArray(new DataView(ab))
        );
      } else if (
        data instanceof Int8Array || data instanceof Int16Array ||
        data instanceof Int32Array || data instanceof Uint8Array ||
        data instanceof Uint16Array || data instanceof Uint32Array ||
        data instanceof Uint8ClampedArray || data instanceof Float32Array ||
        data instanceof Float64Array || data instanceof DataView
      ) {
        sendTypedArray(data);
      } else if (data instanceof ArrayBuffer) {
        sendTypedArray(new DataView(data));
      } else {
        const string = String(data);
        const encoder = new TextEncoder();
        const d = encoder.encode(string);
        this.#bufferedAmount += d.size;
        core.jsonOpAsync("op_ws_send", {
          rid: this.#rid,
          text: string,
        }).then(() => {
          this.#bufferedAmount -= d.size;
        });
      }
    }

    close(code, reason) {
      if (code && (code !== 1000 && !(3000 <= code > 5000))) {
        throw new DOMException(
          "The close code must be either 1000 or in the range of 3000 to 4999.",
          "NotSupportedError",
        );
      }

      const encoder = new TextEncoder();
      if (reason && encoder.encode(reason).byteLength > 123) {
        throw new DOMException(
          "The close reason may not be longer than 123 bytes.",
          "SyntaxError",
        );
      }

      if (this.#readyState === CONNECTING) {
        this.#readyState = CLOSING;
      } else if (this.#readyState === OPEN) {
        this.#readyState = CLOSING;

        core.jsonOpAsync("op_ws_close", {
          rid: this.#rid,
          code,
          reason,
        }).then(() => {
          this.#readyState = CLOSED;
          const event = new CloseEvent("close", {
            wasClean: true,
            code,
            reason,
          });
          event.target = this;
          this.onclose?.(event);
          this.dispatchEvent(event);
          core.close(this.#rid);
        });
      }
    }

    async #eventLoop() {
      if (this.#readyState === OPEN) {
        const message = await core.jsonOpAsync(
          "op_ws_next_event",
          { rid: this.#rid },
        );
        if (message.type === "string" || message.type === "binary") {
          let data;

          if (message.type === "string") {
            data = message.data;
          } else {
            if (this.binaryType === "blob") {
              data = new Blob([new Uint8Array(message.data)]);
            } else {
              data = new Uint8Array(message.data).buffer;
            }
          }

          const event = new MessageEvent("message", {
            data,
            origin: this.#url,
          });
          event.target = this;
          this.onmessage?.(event);
          this.dispatchEvent(event);

          this.#eventLoop();
        } else if (message.type === "close") {
          this.#readyState = CLOSED;
          const event = new CloseEvent("close", {
            wasClean: true,
            code: message.code,
            reason: message.reason,
          });
          event.target = this;
          this.onclose?.(event);
          this.dispatchEvent(event);
        } else if (message.type === "error") {
          this.#readyState = CLOSED;

          const errorEv = new Event("error");
          errorEv.target = this;
          this.onerror?.(errorEv);
          this.dispatchEvent(errorEv);

          this.#readyState = CLOSED;
          const closeEv = new CloseEvent("close");
          closeEv.target = this;
          this.onclose?.(closeEv);
          this.dispatchEvent(closeEv);
        }
      }
    }
  }

  Object.defineProperties(WebSocket, {
    CONNECTING: {
      value: 0,
    },
    OPEN: {
      value: 1,
    },
    CLOSING: {
      value: 2,
    },
    CLOSED: {
      value: 3,
    },
  });

  window.__bootstrap.webSocket = {
    WebSocket,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { read, readSync, write, writeSync } = window.__bootstrap.io;
  const { pathFromURL } = window.__bootstrap.util;

  function seekSync(
    rid,
    offset,
    whence,
  ) {
    return core.jsonOpSync("op_seek_sync", { rid, offset, whence });
  }

  function seek(
    rid,
    offset,
    whence,
  ) {
    return core.jsonOpAsync("op_seek_async", { rid, offset, whence });
  }

  function openSync(
    path,
    options = { read: true },
  ) {
    checkOpenOptions(options);
    const mode = options?.mode;
    const rid = core.jsonOpSync(
      "op_open_sync",
      { path: pathFromURL(path), options, mode },
    );

    return new File(rid);
  }

  async function open(
    path,
    options = { read: true },
  ) {
    checkOpenOptions(options);
    const mode = options?.mode;
    const rid = await core.jsonOpAsync(
      "op_open_async",
      { path: pathFromURL(path), options, mode },
    );

    return new File(rid);
  }

  function createSync(path) {
    return openSync(path, {
      read: true,
      write: true,
      truncate: true,
      create: true,
    });
  }

  function create(path) {
    return open(path, {
      read: true,
      write: true,
      truncate: true,
      create: true,
    });
  }

  class File {
    #rid = 0;

    constructor(rid) {
      this.#rid = rid;
    }

    get rid() {
      return this.#rid;
    }

    write(p) {
      return write(this.rid, p);
    }

    writeSync(p) {
      return writeSync(this.rid, p);
    }

    read(p) {
      return read(this.rid, p);
    }

    readSync(p) {
      return readSync(this.rid, p);
    }

    seek(offset, whence) {
      return seek(this.rid, offset, whence);
    }

    seekSync(offset, whence) {
      return seekSync(this.rid, offset, whence);
    }

    close() {
      core.close(this.rid);
    }
  }

  class Stdin {
    constructor() {
      this.rid = 0;
    }

    read(p) {
      return read(this.rid, p);
    }

    readSync(p) {
      return readSync(this.rid, p);
    }

    close() {
      core.close(this.rid);
    }
  }

  class Stdout {
    constructor() {
      this.rid = 1;
    }

    write(p) {
      return write(this.rid, p);
    }

    writeSync(p) {
      return writeSync(this.rid, p);
    }

    close() {
      core.close(this.rid);
    }
  }

  class Stderr {
    constructor() {
      this.rid = 2;
    }

    write(p) {
      return write(this.rid, p);
    }

    writeSync(p) {
      return writeSync(this.rid, p);
    }

    close() {
      core.close(this.rid);
    }
  }

  const stdin = new Stdin();
  const stdout = new Stdout();
  const stderr = new Stderr();

  function checkOpenOptions(options) {
    if (Object.values(options).filter((val) => val === true).length === 0) {
      throw new Error("OpenOptions requires at least one option to be true");
    }

    if (options.truncate && !options.write) {
      throw new Error("'truncate' option requires 'write' option");
    }

    const createOrCreateNewWithoutWriteOrAppend =
      (options.create || options.createNew) &&
      !(options.write || options.append);

    if (createOrCreateNewWithoutWriteOrAppend) {
      throw new Error(
        "'create' or 'createNew' options require 'write' or 'append' option",
      );
    }
  }

  window.__bootstrap.files = {
    stdin,
    stdout,
    stderr,
    File,
    create,
    createSync,
    open,
    openSync,
    seek,
    seekSync,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { pathFromURL } = window.__bootstrap.util;
  const build = window.__bootstrap.build.build;

  function chmodSync(path, mode) {
    core.jsonOpSync("op_chmod_sync", { path: pathFromURL(path), mode });
  }

  async function chmod(path, mode) {
    await core.jsonOpAsync("op_chmod_async", { path: pathFromURL(path), mode });
  }

  function chownSync(
    path,
    uid,
    gid,
  ) {
    core.jsonOpSync("op_chown_sync", { path: pathFromURL(path), uid, gid });
  }

  async function chown(
    path,
    uid,
    gid,
  ) {
    await core.jsonOpAsync(
      "op_chown_async",
      { path: pathFromURL(path), uid, gid },
    );
  }

  function copyFileSync(
    fromPath,
    toPath,
  ) {
    core.jsonOpSync("op_copy_file_sync", {
      from: pathFromURL(fromPath),
      to: pathFromURL(toPath),
    });
  }

  async function copyFile(
    fromPath,
    toPath,
  ) {
    await core.jsonOpAsync("op_copy_file_async", {
      from: pathFromURL(fromPath),
      to: pathFromURL(toPath),
    });
  }

  function cwd() {
    return core.jsonOpSync("op_cwd");
  }

  function chdir(directory) {
    core.jsonOpSync("op_chdir", { directory });
  }

  function makeTempDirSync(options = {}) {
    return core.jsonOpSync("op_make_temp_dir_sync", options);
  }

  function makeTempDir(options = {}) {
    return core.jsonOpAsync("op_make_temp_dir_async", options);
  }

  function makeTempFileSync(options = {}) {
    return core.jsonOpSync("op_make_temp_file_sync", options);
  }

  function makeTempFile(options = {}) {
    return core.jsonOpAsync("op_make_temp_file_async", options);
  }

  function mkdirArgs(path, options) {
    const args = { path, recursive: false };
    if (options != null) {
      if (typeof options.recursive == "boolean") {
        args.recursive = options.recursive;
      }
      if (options.mode) {
        args.mode = options.mode;
      }
    }
    return args;
  }

  function mkdirSync(path, options) {
    core.jsonOpSync("op_mkdir_sync", mkdirArgs(path, options));
  }

  async function mkdir(
    path,
    options,
  ) {
    await core.jsonOpAsync("op_mkdir_async", mkdirArgs(path, options));
  }

  function res(response) {
    return response.entries;
  }

  function readDirSync(path) {
    return res(
      core.jsonOpSync("op_read_dir_sync", { path: pathFromURL(path) }),
    )[
      Symbol.iterator
    ]();
  }

  function readDir(path) {
    const array = core.jsonOpAsync(
      "op_read_dir_async",
      { path: pathFromURL(path) },
    )
      .then(
        res,
      );
    return {
      async *[Symbol.asyncIterator]() {
        yield* await array;
      },
    };
  }

  function readLinkSync(path) {
    return core.jsonOpSync("op_read_link_sync", { path });
  }

  function readLink(path) {
    return core.jsonOpAsync("op_read_link_async", { path });
  }

  function realPathSync(path) {
    return core.jsonOpSync("op_realpath_sync", { path });
  }

  function realPath(path) {
    return core.jsonOpAsync("op_realpath_async", { path });
  }

  function removeSync(
    path,
    options = {},
  ) {
    core.jsonOpSync("op_remove_sync", {
      path: pathFromURL(path),
      recursive: !!options.recursive,
    });
  }

  async function remove(
    path,
    options = {},
  ) {
    await core.jsonOpAsync("op_remove_async", {
      path: pathFromURL(path),
      recursive: !!options.recursive,
    });
  }

  function renameSync(oldpath, newpath) {
    core.jsonOpSync("op_rename_sync", { oldpath, newpath });
  }

  async function rename(oldpath, newpath) {
    await core.jsonOpAsync("op_rename_async", { oldpath, newpath });
  }

  function parseFileInfo(response) {
    const unix = build.os === "darwin" || build.os === "linux";
    return {
      isFile: response.isFile,
      isDirectory: response.isDirectory,
      isSymlink: response.isSymlink,
      size: response.size,
      mtime: response.mtime != null ? new Date(response.mtime) : null,
      atime: response.atime != null ? new Date(response.atime) : null,
      birthtime: response.birthtime != null
        ? new Date(response.birthtime)
        : null,
      // Only non-null if on Unix
      dev: unix ? response.dev : null,
      ino: unix ? response.ino : null,
      mode: unix ? response.mode : null,
      nlink: unix ? response.nlink : null,
      uid: unix ? response.uid : null,
      gid: unix ? response.gid : null,
      rdev: unix ? response.rdev : null,
      blksize: unix ? response.blksize : null,
      blocks: unix ? response.blocks : null,
    };
  }

  function fstatSync(rid) {
    return parseFileInfo(core.jsonOpSync("op_fstat_sync", { rid }));
  }

  async function fstat(rid) {
    return parseFileInfo(await core.jsonOpAsync("op_fstat_async", { rid }));
  }

  async function lstat(path) {
    const res = await core.jsonOpAsync("op_stat_async", {
      path: pathFromURL(path),
      lstat: true,
    });
    return parseFileInfo(res);
  }

  function lstatSync(path) {
    const res = core.jsonOpSync("op_stat_sync", {
      path: pathFromURL(path),
      lstat: true,
    });
    return parseFileInfo(res);
  }

  async function stat(path) {
    const res = await core.jsonOpAsync("op_stat_async", {
      path: pathFromURL(path),
      lstat: false,
    });
    return parseFileInfo(res);
  }

  function statSync(path) {
    const res = core.jsonOpSync("op_stat_sync", {
      path: pathFromURL(path),
      lstat: false,
    });
    return parseFileInfo(res);
  }

  function coerceLen(len) {
    if (len == null || len < 0) {
      return 0;
    }

    return len;
  }

  function ftruncateSync(rid, len) {
    core.jsonOpSync("op_ftruncate_sync", { rid, len: coerceLen(len) });
  }

  async function ftruncate(rid, len) {
    await core.jsonOpAsync("op_ftruncate_async", { rid, len: coerceLen(len) });
  }

  function truncateSync(path, len) {
    core.jsonOpSync("op_truncate_sync", { path, len: coerceLen(len) });
  }

  async function truncate(path, len) {
    await core.jsonOpAsync("op_truncate_async", { path, len: coerceLen(len) });
  }

  function umask(mask) {
    return core.jsonOpSync("op_umask", { mask });
  }

  function linkSync(oldpath, newpath) {
    core.jsonOpSync("op_link_sync", { oldpath, newpath });
  }

  async function link(oldpath, newpath) {
    await core.jsonOpAsync("op_link_async", { oldpath, newpath });
  }

  function toUnixTimeFromEpoch(value) {
    if (value instanceof Date) {
      const time = value.valueOf();
      const seconds = Math.trunc(time / 1e3);
      const nanoseconds = Math.trunc(time - (seconds * 1e3)) * 1e6;

      return [
        seconds,
        nanoseconds,
      ];
    }

    const seconds = value;
    const nanoseconds = 0;

    return [
      seconds,
      nanoseconds,
    ];
  }

  function futimeSync(
    rid,
    atime,
    mtime,
  ) {
    core.jsonOpSync("op_futime_sync", {
      rid,
      atime: toUnixTimeFromEpoch(atime),
      mtime: toUnixTimeFromEpoch(mtime),
    });
  }

  async function futime(
    rid,
    atime,
    mtime,
  ) {
    await core.jsonOpAsync("op_futime_async", {
      rid,
      atime: toUnixTimeFromEpoch(atime),
      mtime: toUnixTimeFromEpoch(mtime),
    });
  }

  function utimeSync(
    path,
    atime,
    mtime,
  ) {
    core.jsonOpSync("op_utime_sync", {
      path,
      atime: toUnixTimeFromEpoch(atime),
      mtime: toUnixTimeFromEpoch(mtime),
    });
  }

  async function utime(
    path,
    atime,
    mtime,
  ) {
    await core.jsonOpAsync("op_utime_async", {
      path,
      atime: toUnixTimeFromEpoch(atime),
      mtime: toUnixTimeFromEpoch(mtime),
    });
  }

  function symlinkSync(
    oldpath,
    newpath,
    options,
  ) {
    core.jsonOpSync("op_symlink_sync", { oldpath, newpath, options });
  }

  async function symlink(
    oldpath,
    newpath,
    options,
  ) {
    await core.jsonOpAsync("op_symlink_async", { oldpath, newpath, options });
  }

  function fdatasyncSync(rid) {
    core.jsonOpSync("op_fdatasync_sync", { rid });
  }

  async function fdatasync(rid) {
    await core.jsonOpAsync("op_fdatasync_async", { rid });
  }

  function fsyncSync(rid) {
    core.jsonOpSync("op_fsync_sync", { rid });
  }

  async function fsync(rid) {
    await core.jsonOpAsync("op_fsync_async", { rid });
  }

  window.__bootstrap.fs = {
    cwd,
    chdir,
    chmodSync,
    chmod,
    chown,
    chownSync,
    copyFile,
    copyFileSync,
    makeTempFile,
    makeTempDir,
    makeTempFileSync,
    makeTempDirSync,
    mkdir,
    mkdirSync,
    readDir,
    readDirSync,
    readLinkSync,
    readLink,
    realPathSync,
    realPath,
    remove,
    removeSync,
    renameSync,
    rename,
    fstatSync,
    fstat,
    lstat,
    lstatSync,
    stat,
    statSync,
    ftruncate,
    ftruncateSync,
    truncate,
    truncateSync,
    umask,
    link,
    linkSync,
    futime,
    futimeSync,
    utime,
    utimeSync,
    symlink,
    symlinkSync,
    fdatasync,
    fdatasyncSync,
    fsync,
    fsyncSync,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;

  function metrics() {
    return core.jsonOpSync("op_metrics");
  }

  window.__bootstrap.metrics = {
    metrics,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { errors } = window.__bootstrap.errors;
  const { read, write } = window.__bootstrap.io;

  const ShutdownMode = {
    // See http://man7.org/linux/man-pages/man2/shutdown.2.html
    // Corresponding to SHUT_RD, SHUT_WR, SHUT_RDWR
    0: "Read",
    1: "Write",
    2: "ReadWrite",
    Read: 0,
    Write: 1,
    ReadWrite: 2, // unused
  };

  function shutdown(rid, how) {
    core.jsonOpSync("op_shutdown", { rid, how });
    return Promise.resolve();
  }

  function opAccept(
    rid,
    transport,
  ) {
    return core.jsonOpAsync("op_accept", { rid, transport });
  }

  function opListen(args) {
    return core.jsonOpSync("op_listen", args);
  }

  function opConnect(args) {
    return core.jsonOpAsync("op_connect", args);
  }

  function opReceive(
    rid,
    transport,
    zeroCopy,
  ) {
    return core.jsonOpAsync(
      "op_datagram_receive",
      { rid, transport },
      zeroCopy,
    );
  }

  function opSend(args, zeroCopy) {
    return core.jsonOpAsync("op_datagram_send", args, zeroCopy);
  }

  class Conn {
    #rid = 0;
    #remoteAddr = null;
    #localAddr = null;
    constructor(
      rid,
      remoteAddr,
      localAddr,
    ) {
      this.#rid = rid;
      this.#remoteAddr = remoteAddr;
      this.#localAddr = localAddr;
    }

    get rid() {
      return this.#rid;
    }

    get remoteAddr() {
      return this.#remoteAddr;
    }

    get localAddr() {
      return this.#localAddr;
    }

    write(p) {
      return write(this.rid, p);
    }

    read(p) {
      return read(this.rid, p);
    }

    close() {
      core.close(this.rid);
    }

    // TODO(lucacasonato): make this unavailable in stable
    closeWrite() {
      shutdown(this.rid, ShutdownMode.Write);
    }
  }

  class Listener {
    #rid = 0;
    #addr = null;

    constructor(rid, addr) {
      this.#rid = rid;
      this.#addr = addr;
    }

    get rid() {
      return this.#rid;
    }

    get addr() {
      return this.#addr;
    }

    async accept() {
      const res = await opAccept(this.rid, this.addr.transport);
      return new Conn(res.rid, res.remoteAddr, res.localAddr);
    }

    async next() {
      let conn;
      try {
        conn = await this.accept();
      } catch (error) {
        if (error instanceof errors.BadResource) {
          return { value: undefined, done: true };
        }
        throw error;
      }
      return { value: conn, done: false };
    }

    return(value) {
      this.close();
      return Promise.resolve({ value, done: true });
    }

    close() {
      core.close(this.rid);
    }

    [Symbol.asyncIterator]() {
      return this;
    }
  }

  class Datagram {
    #rid = 0;
    #addr = null;

    constructor(
      rid,
      addr,
      bufSize = 1024,
    ) {
      this.#rid = rid;
      this.#addr = addr;
      this.bufSize = bufSize;
    }

    get rid() {
      return this.#rid;
    }

    get addr() {
      return this.#addr;
    }

    async receive(p) {
      const buf = p || new Uint8Array(this.bufSize);
      const { size, remoteAddr } = await opReceive(
        this.rid,
        this.addr.transport,
        buf,
      );
      const sub = buf.subarray(0, size);
      return [sub, remoteAddr];
    }

    send(p, addr) {
      const remote = { hostname: "127.0.0.1", ...addr };

      const args = { ...remote, rid: this.rid };
      return opSend(args, p);
    }

    close() {
      core.close(this.rid);
    }

    async *[Symbol.asyncIterator]() {
      while (true) {
        try {
          yield await this.receive();
        } catch (err) {
          if (err instanceof errors.BadResource) {
            break;
          }
          throw err;
        }
      }
    }
  }

  function listen({ hostname, ...options }) {
    const res = opListen({
      transport: "tcp",
      hostname: typeof hostname === "undefined" ? "0.0.0.0" : hostname,
      ...options,
    });

    return new Listener(res.rid, res.localAddr);
  }

  async function connect(
    options,
  ) {
    let res;

    if (options.transport === "unix") {
      res = await opConnect(options);
    } else {
      res = await opConnect({
        transport: "tcp",
        hostname: "127.0.0.1",
        ...options,
      });
    }

    return new Conn(res.rid, res.remoteAddr, res.localAddr);
  }

  window.__bootstrap.net = {
    connect,
    Conn,
    opConnect,
    listen,
    opListen,
    Listener,
    shutdown,
    ShutdownMode,
    Datagram,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;

  function loadavg() {
    return core.jsonOpSync("op_loadavg");
  }

  function hostname() {
    return core.jsonOpSync("op_hostname");
  }

  function osRelease() {
    return core.jsonOpSync("op_os_release");
  }

  function systemMemoryInfo() {
    return core.jsonOpSync("op_system_memory_info");
  }

  function exit(code = 0) {
    core.jsonOpSync("op_exit", { code });
    throw new Error("Code not reachable");
  }

  function setEnv(key, value) {
    core.jsonOpSync("op_set_env", { key, value });
  }

  function getEnv(key) {
    return core.jsonOpSync("op_get_env", { key })[0];
  }

  function deleteEnv(key) {
    core.jsonOpSync("op_delete_env", { key });
  }

  const env = {
    get: getEnv,
    toObject() {
      return core.jsonOpSync("op_env");
    },
    set: setEnv,
    delete: deleteEnv,
  };

  function execPath() {
    return core.jsonOpSync("op_exec_path");
  }

  window.__bootstrap.os = {
    env,
    execPath,
    exit,
    osRelease,
    systemMemoryInfo,
    hostname,
    loadavg,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This file contains the runtime APIs which will dispatch work to the internal
// compiler within Deno.
((window) => {
  const core = window.Deno.core;
  const util = window.__bootstrap.util;

  function opCompile(request) {
    return core.jsonOpAsync("op_compile", request);
  }

  function opTranspile(
    request,
  ) {
    return core.jsonOpAsync("op_transpile", request);
  }

  function checkRelative(specifier) {
    return specifier.match(/^([\.\/\\]|https?:\/{2}|file:\/{2})/)
      ? specifier
      : `./${specifier}`;
  }

  // TODO(bartlomieju): change return type to interface?
  function transpileOnly(
    sources,
    options = {},
  ) {
    util.log("Deno.transpileOnly", { sources: Object.keys(sources), options });
    const payload = {
      sources,
      options: JSON.stringify(options),
    };
    return opTranspile(payload);
  }

  // TODO(bartlomieju): change return type to interface?
  async function compile(
    rootName,
    sources,
    options = {},
  ) {
    const payload = {
      rootName: sources ? rootName : checkRelative(rootName),
      sources,
      options: JSON.stringify(options),
      bundle: false,
    };
    util.log("Deno.compile", {
      rootName: payload.rootName,
      sources: !!sources,
      options,
    });
    const result = await opCompile(payload);
    util.assert(result.emitMap);
    const maybeDiagnostics = result.diagnostics.length === 0
      ? undefined
      : result.diagnostics;

    const emitMap = {};

    for (const [key, emittedSource] of Object.entries(result.emitMap)) {
      emitMap[key] = emittedSource.contents;
    }

    return [maybeDiagnostics, emitMap];
  }

  // TODO(bartlomieju): change return type to interface?
  async function bundle(
    rootName,
    sources,
    options = {},
  ) {
    const payload = {
      rootName: sources ? rootName : checkRelative(rootName),
      sources,
      options: JSON.stringify(options),
      bundle: true,
    };
    util.log("Deno.bundle", {
      rootName: payload.rootName,
      sources: !!sources,
      options,
    });
    const result = await opCompile(payload);
    util.assert(result.output);
    const maybeDiagnostics = result.diagnostics.length === 0
      ? undefined
      : result.diagnostics;
    return [maybeDiagnostics, result.output];
  }

  window.__bootstrap.compilerApi = {
    bundle,
    compile,
    transpileOnly,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// Diagnostic provides an abstraction for advice/errors received from a
// compiler, which is strongly influenced by the format of TypeScript
// diagnostics.

((window) => {
  const DiagnosticCategory = {
    0: "Warning",
    1: "Error",
    2: "Suggestion",
    3: "Message",

    Warning: 0,
    Error: 1,
    Suggestion: 2,
    Message: 3,
  };

  window.__bootstrap.diagnostics = {
    DiagnosticCategory,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  // Some of the code here is adapted directly from V8 and licensed under a BSD
  // style license available here: https://github.com/v8/v8/blob/24886f2d1c565287d33d71e4109a53bf0b54b75c/LICENSE.v8
  const core = window.Deno.core;
  const assert = window.__bootstrap.util.assert;
  const internals = window.__bootstrap.internals;

  function opFormatDiagnostics(diagnostics) {
    return core.jsonOpSync("op_format_diagnostic", diagnostics);
  }

  function opApplySourceMap(location) {
    const res = core.jsonOpSync("op_apply_source_map", location);
    return {
      fileName: res.fileName,
      lineNumber: res.lineNumber,
      columnNumber: res.columnNumber,
    };
  }

  function patchCallSite(callSite, location) {
    return {
      getThis() {
        return callSite.getThis();
      },
      getTypeName() {
        return callSite.getTypeName();
      },
      getFunction() {
        return callSite.getFunction();
      },
      getFunctionName() {
        return callSite.getFunctionName();
      },
      getMethodName() {
        return callSite.getMethodName();
      },
      getFileName() {
        return location.fileName;
      },
      getLineNumber() {
        return location.lineNumber;
      },
      getColumnNumber() {
        return location.columnNumber;
      },
      getEvalOrigin() {
        return callSite.getEvalOrigin();
      },
      isToplevel() {
        return callSite.isToplevel();
      },
      isEval() {
        return callSite.isEval();
      },
      isNative() {
        return callSite.isNative();
      },
      isConstructor() {
        return callSite.isConstructor();
      },
      isAsync() {
        return callSite.isAsync();
      },
      isPromiseAll() {
        return callSite.isPromiseAll();
      },
      getPromiseIndex() {
        return callSite.getPromiseIndex();
      },
    };
  }

  // Keep in sync with `cli/fmt_errors.rs`.
  function formatLocation(callSite) {
    if (callSite.isNative()) {
      return "native";
    }

    let result = "";

    const fileName = callSite.getFileName();

    if (fileName) {
      result += fileName;
    } else {
      if (callSite.isEval()) {
        const evalOrigin = callSite.getEvalOrigin();
        assert(evalOrigin != null);
        result += `${evalOrigin}, `;
      }
      result += "<anonymous>";
    }

    const lineNumber = callSite.getLineNumber();
    if (lineNumber != null) {
      result += `:${lineNumber}`;

      const columnNumber = callSite.getColumnNumber();
      if (columnNumber != null) {
        result += `:${columnNumber}`;
      }
    }

    return result;
  }

  // Keep in sync with `cli/fmt_errors.rs`.
  function formatCallSite(callSite) {
    let result = "";
    const functionName = callSite.getFunctionName();

    const isTopLevel = callSite.isToplevel();
    const isAsync = callSite.isAsync();
    const isPromiseAll = callSite.isPromiseAll();
    const isConstructor = callSite.isConstructor();
    const isMethodCall = !(isTopLevel || isConstructor);

    if (isAsync) {
      result += "async ";
    }
    if (isPromiseAll) {
      result += `Promise.all (index ${callSite.getPromiseIndex()})`;
      return result;
    }
    if (isMethodCall) {
      const typeName = callSite.getTypeName();
      const methodName = callSite.getMethodName();

      if (functionName) {
        if (typeName) {
          if (!functionName.startsWith(typeName)) {
            result += `${typeName}.`;
          }
        }
        result += functionName;
        if (methodName) {
          if (!functionName.endsWith(methodName)) {
            result += ` [as ${methodName}]`;
          }
        }
      } else {
        if (typeName) {
          result += `${typeName}.`;
        }
        if (methodName) {
          result += methodName;
        } else {
          result += "<anonymous>";
        }
      }
    } else if (isConstructor) {
      result += "new ";
      if (functionName) {
        result += functionName;
      } else {
        result += "<anonymous>";
      }
    } else if (functionName) {
      result += functionName;
    } else {
      result += formatLocation(callSite);
      return result;
    }

    result += ` (${formatLocation(callSite)})`;
    return result;
  }

  function evaluateCallSite(callSite) {
    return {
      this: callSite.getThis(),
      typeName: callSite.getTypeName(),
      function: callSite.getFunction(),
      functionName: callSite.getFunctionName(),
      methodName: callSite.getMethodName(),
      fileName: callSite.getFileName(),
      lineNumber: callSite.getLineNumber(),
      columnNumber: callSite.getColumnNumber(),
      evalOrigin: callSite.getEvalOrigin(),
      isToplevel: callSite.isToplevel(),
      isEval: callSite.isEval(),
      isNative: callSite.isNative(),
      isConstructor: callSite.isConstructor(),
      isAsync: callSite.isAsync(),
      isPromiseAll: callSite.isPromiseAll(),
      promiseIndex: callSite.getPromiseIndex(),
    };
  }

  function prepareStackTrace(
    error,
    callSites,
  ) {
    const mappedCallSites = callSites.map(
      (callSite) => {
        const fileName = callSite.getFileName();
        const lineNumber = callSite.getLineNumber();
        const columnNumber = callSite.getColumnNumber();
        if (fileName && lineNumber != null && columnNumber != null) {
          return patchCallSite(
            callSite,
            opApplySourceMap({
              fileName,
              lineNumber,
              columnNumber,
            }),
          );
        }
        return callSite;
      },
    );
    Object.defineProperties(error, {
      __callSiteEvals: { value: [], configurable: true },
    });
    const formattedCallSites = [];
    for (const callSite of mappedCallSites) {
      error.__callSiteEvals.push(Object.freeze(evaluateCallSite(callSite)));
      formattedCallSites.push(formatCallSite(callSite));
    }
    Object.freeze(error.__callSiteEvals);
    const message = error.message !== undefined ? error.message : "";
    const name = error.name !== undefined ? error.name : "Error";
    let messageLine;
    if (name != "" && message != "") {
      messageLine = `${name}: ${message}`;
    } else if ((name || message) != "") {
      messageLine = name || message;
    } else {
      messageLine = "";
    }
    return messageLine +
      formattedCallSites.map((s) => `\n    at ${s}`).join("");
  }

  function setPrepareStackTrace(ErrorConstructor) {
    ErrorConstructor.prepareStackTrace = prepareStackTrace;
  }

  internals.exposeForTest("setPrepareStackTrace", setPrepareStackTrace);

  window.__bootstrap.errorStack = {
    setPrepareStackTrace,
    opApplySourceMap,
    opFormatDiagnostics,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { errors } = window.__bootstrap.errors;

  class FsWatcher {
    #rid = 0;

    constructor(paths, options) {
      const { recursive } = options;
      this.#rid = core.jsonOpSync("op_fs_events_open", { recursive, paths });
    }

    get rid() {
      return this.#rid;
    }

    async next() {
      try {
        return await core.jsonOpAsync("op_fs_events_poll", {
          rid: this.rid,
        });
      } catch (error) {
        if (error instanceof errors.BadResource) {
          return { value: undefined, done: true };
        }
        throw error;
      }
    }

    return(value) {
      core.close(this.rid);
      return Promise.resolve({ value, done: true });
    }

    [Symbol.asyncIterator]() {
      return this;
    }
  }

  function watchFs(
    paths,
    options = { recursive: true },
  ) {
    return new FsWatcher(Array.isArray(paths) ? paths : [paths], options);
  }

  window.__bootstrap.fsEvents = {
    watchFs,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const net = window.__bootstrap.net;

  function listen(options) {
    if (options.transport === "unix") {
      const res = net.opListen(options);
      return new net.Listener(res.rid, res.localAddr);
    } else {
      return net.listen(options);
    }
  }

  function listenDatagram(
    options,
  ) {
    let res;
    if (options.transport === "unixpacket") {
      res = net.opListen(options);
    } else {
      res = net.opListen({
        transport: "udp",
        hostname: "127.0.0.1",
        ...options,
      });
    }

    return new net.Datagram(res.rid, res.localAddr);
  }

  async function connect(
    options,
  ) {
    if (options.transport === "unix") {
      const res = await net.opConnect(options);
      return new net.Conn(res.rid, res.remoteAddr, res.localAddr);
    } else {
      return net.connect(options);
    }
  }

  window.__bootstrap.netUnstable = {
    connect,
    listenDatagram,
    listen,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const { opNow } = window.__bootstrap.timers;
  const { cloneValue, illegalConstructorKey } = window.__bootstrap.webUtil;

  const customInspect = Symbol.for("Deno.customInspect");
  let performanceEntries = [];

  function findMostRecent(
    name,
    type,
  ) {
    return performanceEntries
      .slice()
      .reverse()
      .find((entry) => entry.name === name && entry.entryType === type);
  }

  function convertMarkToTimestamp(mark) {
    if (typeof mark === "string") {
      const entry = findMostRecent(mark, "mark");
      if (!entry) {
        throw new SyntaxError(`Cannot find mark: "${mark}".`);
      }
      return entry.startTime;
    }
    if (mark < 0) {
      throw new TypeError("Mark cannot be negative.");
    }
    return mark;
  }

  function filterByNameType(
    name,
    type,
  ) {
    return performanceEntries.filter(
      (entry) =>
        (name ? entry.name === name : true) &&
        (type ? entry.entryType === type : true),
    );
  }

  function now() {
    const res = opNow();
    return res.seconds * 1e3 + res.subsecNanos / 1e6;
  }

  class PerformanceEntry {
    #name = "";
    #entryType = "";
    #startTime = 0;
    #duration = 0;

    get name() {
      return this.#name;
    }

    get entryType() {
      return this.#entryType;
    }

    get startTime() {
      return this.#startTime;
    }

    get duration() {
      return this.#duration;
    }

    constructor(
      name,
      entryType,
      startTime,
      duration,
      key,
    ) {
      if (key != illegalConstructorKey) {
        throw new TypeError("Illegal constructor.");
      }
      this.#name = name;
      this.#entryType = entryType;
      this.#startTime = startTime;
      this.#duration = duration;
    }

    toJSON() {
      return {
        name: this.#name,
        entryType: this.#entryType,
        startTime: this.#startTime,
        duration: this.#duration,
      };
    }

    [customInspect]() {
      return `${this.constructor.name} { name: "${this.name}", entryType: "${this.entryType}", startTime: ${this.startTime}, duration: ${this.duration} }`;
    }
  }

  class PerformanceMark extends PerformanceEntry {
    #detail = null;

    get detail() {
      return this.#detail;
    }

    get entryType() {
      return "mark";
    }

    constructor(
      name,
      { detail = null, startTime = now() } = {},
    ) {
      super(name, "mark", startTime, 0, illegalConstructorKey);
      if (startTime < 0) {
        throw new TypeError("startTime cannot be negative");
      }
      this.#detail = cloneValue(detail);
    }

    toJSON() {
      return {
        name: this.name,
        entryType: this.entryType,
        startTime: this.startTime,
        duration: this.duration,
        detail: this.detail,
      };
    }

    [customInspect]() {
      return this.detail
        ? `${this.constructor.name} {\n  detail: ${
          JSON.stringify(this.detail, null, 2)
        },\n  name: "${this.name}",\n  entryType: "${this.entryType}",\n  startTime: ${this.startTime},\n  duration: ${this.duration}\n}`
        : `${this.constructor.name} { detail: ${this.detail}, name: "${this.name}", entryType: "${this.entryType}", startTime: ${this.startTime}, duration: ${this.duration} }`;
    }
  }

  class PerformanceMeasure extends PerformanceEntry {
    #detail = null;

    get detail() {
      return this.#detail;
    }

    get entryType() {
      return "measure";
    }

    constructor(
      name,
      startTime,
      duration,
      detail = null,
      key,
    ) {
      if (key != illegalConstructorKey) {
        throw new TypeError("Illegal constructor.");
      }
      super(name, "measure", startTime, duration, illegalConstructorKey);
      this.#detail = cloneValue(detail);
    }

    toJSON() {
      return {
        name: this.name,
        entryType: this.entryType,
        startTime: this.startTime,
        duration: this.duration,
        detail: this.detail,
      };
    }

    [customInspect]() {
      return this.detail
        ? `${this.constructor.name} {\n  detail: ${
          JSON.stringify(this.detail, null, 2)
        },\n  name: "${this.name}",\n  entryType: "${this.entryType}",\n  startTime: ${this.startTime},\n  duration: ${this.duration}\n}`
        : `${this.constructor.name} { detail: ${this.detail}, name: "${this.name}", entryType: "${this.entryType}", startTime: ${this.startTime}, duration: ${this.duration} }`;
    }
  }

  class Performance {
    constructor(key) {
      if (key != illegalConstructorKey) {
        throw new TypeError("Illegal constructor.");
      }
    }

    clearMarks(markName) {
      if (markName == null) {
        performanceEntries = performanceEntries.filter(
          (entry) => entry.entryType !== "mark",
        );
      } else {
        performanceEntries = performanceEntries.filter(
          (entry) => !(entry.name === markName && entry.entryType === "mark"),
        );
      }
    }

    clearMeasures(measureName) {
      if (measureName == null) {
        performanceEntries = performanceEntries.filter(
          (entry) => entry.entryType !== "measure",
        );
      } else {
        performanceEntries = performanceEntries.filter(
          (entry) =>
            !(entry.name === measureName && entry.entryType === "measure"),
        );
      }
    }

    getEntries() {
      return filterByNameType();
    }

    getEntriesByName(
      name,
      type,
    ) {
      return filterByNameType(name, type);
    }

    getEntriesByType(type) {
      return filterByNameType(undefined, type);
    }

    mark(
      markName,
      options = {},
    ) {
      // 3.1.1.1 If the global object is a Window object and markName uses the
      // same name as a read only attribute in the PerformanceTiming interface,
      // throw a SyntaxError. - not implemented
      const entry = new PerformanceMark(markName, options);
      // 3.1.1.7 Queue entry - not implemented
      performanceEntries.push(entry);
      return entry;
    }

    measure(
      measureName,
      startOrMeasureOptions = {},
      endMark,
    ) {
      if (startOrMeasureOptions && typeof startOrMeasureOptions === "object") {
        if (endMark) {
          throw new TypeError("Options cannot be passed with endMark.");
        }
        if (
          !("start" in startOrMeasureOptions) &&
          !("end" in startOrMeasureOptions)
        ) {
          throw new TypeError(
            "A start or end mark must be supplied in options.",
          );
        }
        if (
          "start" in startOrMeasureOptions &&
          "duration" in startOrMeasureOptions &&
          "end" in startOrMeasureOptions
        ) {
          throw new TypeError(
            "Cannot specify start, end, and duration together in options.",
          );
        }
      }
      let endTime;
      if (endMark) {
        endTime = convertMarkToTimestamp(endMark);
      } else if (
        typeof startOrMeasureOptions === "object" &&
        "end" in startOrMeasureOptions
      ) {
        endTime = convertMarkToTimestamp(startOrMeasureOptions.end);
      } else if (
        typeof startOrMeasureOptions === "object" &&
        "start" in startOrMeasureOptions &&
        "duration" in startOrMeasureOptions
      ) {
        const start = convertMarkToTimestamp(startOrMeasureOptions.start);
        const duration = convertMarkToTimestamp(startOrMeasureOptions.duration);
        endTime = start + duration;
      } else {
        endTime = now();
      }
      let startTime;
      if (
        typeof startOrMeasureOptions === "object" &&
        "start" in startOrMeasureOptions
      ) {
        startTime = convertMarkToTimestamp(startOrMeasureOptions.start);
      } else if (
        typeof startOrMeasureOptions === "object" &&
        "end" in startOrMeasureOptions &&
        "duration" in startOrMeasureOptions
      ) {
        const end = convertMarkToTimestamp(startOrMeasureOptions.end);
        const duration = convertMarkToTimestamp(startOrMeasureOptions.duration);
        startTime = end - duration;
      } else if (typeof startOrMeasureOptions === "string") {
        startTime = convertMarkToTimestamp(startOrMeasureOptions);
      } else {
        startTime = 0;
      }
      const entry = new PerformanceMeasure(
        measureName,
        startTime,
        endTime - startTime,
        typeof startOrMeasureOptions === "object"
          ? startOrMeasureOptions.detail ?? null
          : null,
        illegalConstructorKey,
      );
      performanceEntries.push(entry);
      return entry;
    }

    now() {
      return now();
    }
  }

  const performance = new Performance(illegalConstructorKey);

  window.__bootstrap.performance = {
    PerformanceEntry,
    PerformanceMark,
    PerformanceMeasure,
    Performance,
    performance,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { illegalConstructorKey } = window.__bootstrap.webUtil;

  function opQuery(desc) {
    return core.jsonOpSync("op_query_permission", desc).state;
  }

  function opRevoke(desc) {
    return core.jsonOpSync("op_revoke_permission", desc).state;
  }

  function opRequest(desc) {
    return core.jsonOpSync("op_request_permission", desc).state;
  }

  class PermissionStatus {
    constructor(state, key) {
      if (key != illegalConstructorKey) {
        throw new TypeError("Illegal constructor.");
      }
      this.state = state;
    }
    // TODO(kt3k): implement onchange handler
  }

  class Permissions {
    constructor(key) {
      if (key != illegalConstructorKey) {
        throw new TypeError("Illegal constructor.");
      }
    }

    query(desc) {
      const state = opQuery(desc);
      return Promise.resolve(
        new PermissionStatus(state, illegalConstructorKey),
      );
    }

    revoke(desc) {
      const state = opRevoke(desc);
      return Promise.resolve(
        new PermissionStatus(state, illegalConstructorKey),
      );
    }

    request(desc) {
      const state = opRequest(desc);
      return Promise.resolve(
        new PermissionStatus(state, illegalConstructorKey),
      );
    }
  }

  const permissions = new Permissions(illegalConstructorKey);

  window.__bootstrap.permissions = {
    permissions,
    Permissions,
    PermissionStatus,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;

  function openPlugin(filename) {
    return core.jsonOpSync("op_open_plugin", { filename });
  }

  window.__bootstrap.plugins = {
    openPlugin,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { File } = window.__bootstrap.files;
  const { readAll } = window.__bootstrap.buffer;
  const { assert, pathFromURL } = window.__bootstrap.util;

  function opKill(pid, signo) {
    core.jsonOpSync("op_kill", { pid, signo });
  }

  function opRunStatus(rid) {
    return core.jsonOpAsync("op_run_status", { rid });
  }

  function opRun(request) {
    assert(request.cmd.length > 0);
    return core.jsonOpSync("op_run", request);
  }

  async function runStatus(rid) {
    const res = await opRunStatus(rid);

    if (res.gotSignal) {
      const signal = res.exitSignal;
      return { success: false, code: 128 + signal, signal };
    } else if (res.exitCode != 0) {
      return { success: false, code: res.exitCode };
    } else {
      return { success: true, code: 0 };
    }
  }

  class Process {
    constructor(res) {
      this.rid = res.rid;
      this.pid = res.pid;

      if (res.stdinRid && res.stdinRid > 0) {
        this.stdin = new File(res.stdinRid);
      }

      if (res.stdoutRid && res.stdoutRid > 0) {
        this.stdout = new File(res.stdoutRid);
      }

      if (res.stderrRid && res.stderrRid > 0) {
        this.stderr = new File(res.stderrRid);
      }
    }

    status() {
      return runStatus(this.rid);
    }

    async output() {
      if (!this.stdout) {
        throw new TypeError("stdout was not piped");
      }
      try {
        return await readAll(this.stdout);
      } finally {
        this.stdout.close();
      }
    }

    async stderrOutput() {
      if (!this.stderr) {
        throw new TypeError("stderr was not piped");
      }
      try {
        return await readAll(this.stderr);
      } finally {
        this.stderr.close();
      }
    }

    close() {
      core.close(this.rid);
    }

    kill(signo) {
      opKill(this.pid, signo);
    }
  }

  function isRid(arg) {
    return !isNaN(arg);
  }

  function run({
    cmd,
    cwd = undefined,
    env = {},
    stdout = "inherit",
    stderr = "inherit",
    stdin = "inherit",
  }) {
    if (cmd[0] != null) {
      cmd[0] = pathFromURL(cmd[0]);
    }
    const res = opRun({
      cmd: cmd.map(String),
      cwd,
      env: Object.entries(env),
      stdin: isRid(stdin) ? "" : stdin,
      stdout: isRid(stdout) ? "" : stdout,
      stderr: isRid(stderr) ? "" : stderr,
      stdinRid: isRid(stdin) ? stdin : 0,
      stdoutRid: isRid(stdout) ? stdout : 0,
      stderrRid: isRid(stderr) ? stderr : 0,
    });
    return new Process(res);
  }

  window.__bootstrap.process = {
    run,
    Process,
    kill: opKill,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const { open, openSync } = window.__bootstrap.files;
  const { readAll, readAllSync } = window.__bootstrap.buffer;

  function readFileSync(path) {
    const file = openSync(path);
    const contents = readAllSync(file);
    file.close();
    return contents;
  }

  async function readFile(path) {
    const file = await open(path);
    const contents = await readAll(file);
    file.close();
    return contents;
  }

  function readTextFileSync(path) {
    const file = openSync(path);
    const contents = readAllSync(file);
    file.close();
    const decoder = new TextDecoder();
    return decoder.decode(contents);
  }

  async function readTextFile(path) {
    const file = await open(path);
    const contents = await readAll(file);
    file.close();
    const decoder = new TextDecoder();
    return decoder.decode(contents);
  }

  window.__bootstrap.readFile = {
    readFile,
    readFileSync,
    readTextFileSync,
    readTextFile,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { build } = window.__bootstrap.build;

  function bindSignal(signo) {
    return core.jsonOpSync("op_signal_bind", { signo });
  }

  function pollSignal(rid) {
    return core.jsonOpAsync("op_signal_poll", { rid });
  }

  function unbindSignal(rid) {
    core.jsonOpSync("op_signal_unbind", { rid });
  }

  // From `kill -l`
  const LinuxSignal = {
    1: "SIGHUP",
    2: "SIGINT",
    3: "SIGQUIT",
    4: "SIGILL",
    5: "SIGTRAP",
    6: "SIGABRT",
    7: "SIGBUS",
    8: "SIGFPE",
    9: "SIGKILL",
    10: "SIGUSR1",
    11: "SIGSEGV",
    12: "SIGUSR2",
    13: "SIGPIPE",
    14: "SIGALRM",
    15: "SIGTERM",
    16: "SIGSTKFLT",
    17: "SIGCHLD",
    18: "SIGCONT",
    19: "SIGSTOP",
    20: "SIGTSTP",
    21: "SIGTTIN",
    22: "SIGTTOU",
    23: "SIGURG",
    24: "SIGXCPU",
    25: "SIGXFSZ",
    26: "SIGVTALRM",
    27: "SIGPROF",
    28: "SIGWINCH",
    29: "SIGIO",
    30: "SIGPWR",
    31: "SIGSYS",
    SIGHUP: 1,
    SIGINT: 2,
    SIGQUIT: 3,
    SIGILL: 4,
    SIGTRAP: 5,
    SIGABRT: 6,
    SIGBUS: 7,
    SIGFPE: 8,
    SIGKILL: 9,
    SIGUSR1: 10,
    SIGSEGV: 11,
    SIGUSR2: 12,
    SIGPIPE: 13,
    SIGALRM: 14,
    SIGTERM: 15,
    SIGSTKFLT: 16,
    SIGCHLD: 17,
    SIGCONT: 18,
    SIGSTOP: 19,
    SIGTSTP: 20,
    SIGTTIN: 21,
    SIGTTOU: 22,
    SIGURG: 23,
    SIGXCPU: 24,
    SIGXFSZ: 25,
    SIGVTALRM: 26,
    SIGPROF: 27,
    SIGWINCH: 28,
    SIGIO: 29,
    SIGPWR: 30,
    SIGSYS: 31,
  };

  // From `kill -l`
  const MacOSSignal = {
    1: "SIGHUP",
    2: "SIGINT",
    3: "SIGQUIT",
    4: "SIGILL",
    5: "SIGTRAP",
    6: "SIGABRT",
    7: "SIGEMT",
    8: "SIGFPE",
    9: "SIGKILL",
    10: "SIGBUS",
    11: "SIGSEGV",
    12: "SIGSYS",
    13: "SIGPIPE",
    14: "SIGALRM",
    15: "SIGTERM",
    16: "SIGURG",
    17: "SIGSTOP",
    18: "SIGTSTP",
    19: "SIGCONT",
    20: "SIGCHLD",
    21: "SIGTTIN",
    22: "SIGTTOU",
    23: "SIGIO",
    24: "SIGXCPU",
    25: "SIGXFSZ",
    26: "SIGVTALRM",
    27: "SIGPROF",
    28: "SIGWINCH",
    29: "SIGINFO",
    30: "SIGUSR1",
    31: "SIGUSR2",
    SIGHUP: 1,
    SIGINT: 2,
    SIGQUIT: 3,
    SIGILL: 4,
    SIGTRAP: 5,
    SIGABRT: 6,
    SIGEMT: 7,
    SIGFPE: 8,
    SIGKILL: 9,
    SIGBUS: 10,
    SIGSEGV: 11,
    SIGSYS: 12,
    SIGPIPE: 13,
    SIGALRM: 14,
    SIGTERM: 15,
    SIGURG: 16,
    SIGSTOP: 17,
    SIGTSTP: 18,
    SIGCONT: 19,
    SIGCHLD: 20,
    SIGTTIN: 21,
    SIGTTOU: 22,
    SIGIO: 23,
    SIGXCPU: 24,
    SIGXFSZ: 25,
    SIGVTALRM: 26,
    SIGPROF: 27,
    SIGWINCH: 28,
    SIGINFO: 29,
    SIGUSR1: 30,
    SIGUSR2: 31,
  };

  const Signal = {};

  function setSignals() {
    if (build.os === "darwin") {
      Object.assign(Signal, MacOSSignal);
    } else {
      Object.assign(Signal, LinuxSignal);
    }
  }

  function signal(signo) {
    if (build.os === "windows") {
      throw new Error("not implemented!");
    }
    return new SignalStream(signo);
  }

  const signals = {
    alarm() {
      return signal(Signal.SIGALRM);
    },
    child() {
      return signal(Signal.SIGCHLD);
    },
    hungup() {
      return signal(Signal.SIGHUP);
    },
    interrupt() {
      return signal(Signal.SIGINT);
    },
    io() {
      return signal(Signal.SIGIO);
    },
    pipe() {
      return signal(Signal.SIGPIPE);
    },
    quit() {
      return signal(Signal.SIGQUIT);
    },
    terminate() {
      return signal(Signal.SIGTERM);
    },
    userDefined1() {
      return signal(Signal.SIGUSR1);
    },
    userDefined2() {
      return signal(Signal.SIGUSR2);
    },
    windowChange() {
      return signal(Signal.SIGWINCH);
    },
  };

  class SignalStream {
    #disposed = false;
    #pollingPromise = Promise.resolve(false);
    #rid = 0;

    constructor(signo) {
      this.#rid = bindSignal(signo).rid;
      this.#loop();
    }

    #pollSignal = async () => {
      const res = await pollSignal(this.#rid);
      return res.done;
    };

    #loop = async () => {
      do {
        this.#pollingPromise = this.#pollSignal();
      } while (!(await this.#pollingPromise) && !this.#disposed);
    };

    then(
      f,
      g,
    ) {
      return this.#pollingPromise.then(() => {}).then(f, g);
    }

    async next() {
      return { done: await this.#pollingPromise, value: undefined };
    }

    [Symbol.asyncIterator]() {
      return this;
    }

    dispose() {
      if (this.#disposed) {
        throw new Error("The stream has already been disposed.");
      }
      this.#disposed = true;
      unbindSignal(this.#rid);
    }
  }

  window.__bootstrap.signals = {
    signal,
    signals,
    Signal,
    SignalStream,
    setSignals,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { gray, green, italic, red, yellow } = window.__bootstrap.colors;
  const { exit } = window.__bootstrap.os;
  const { Console, inspectArgs } = window.__bootstrap.console;
  const { stdout } = window.__bootstrap.files;
  const { exposeForTest } = window.__bootstrap.internals;
  const { metrics } = window.__bootstrap.metrics;
  const { assert } = window.__bootstrap.util;

  const disabledConsole = new Console(() => {});

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function formatDuration(time = 0) {
    const timeStr = `(${time}ms)`;
    return gray(italic(timeStr));
  }

  // Wrap test function in additional assertion that makes sure
  // the test case does not leak async "ops" - ie. number of async
  // completed ops after the test is the same as number of dispatched
  // ops. Note that "unref" ops are ignored since in nature that are
  // optional.
  function assertOps(fn) {
    return async function asyncOpSanitizer() {
      const pre = metrics();
      await fn();
      // Defer until next event loop turn - that way timeouts and intervals
      // cleared can actually be removed from resource table, otherwise
      // false positives may occur (https://github.com/denoland/deno/issues/4591)
      await delay(0);
      const post = metrics();
      // We're checking diff because one might spawn HTTP server in the background
      // that will be a pending async op before test starts.
      const dispatchedDiff = post.opsDispatchedAsync - pre.opsDispatchedAsync;
      const completedDiff = post.opsCompletedAsync - pre.opsCompletedAsync;
      assert(
        dispatchedDiff === completedDiff,
        `Test case is leaking async ops.
Before:
  - dispatched: ${pre.opsDispatchedAsync}
  - completed: ${pre.opsCompletedAsync}
After:
  - dispatched: ${post.opsDispatchedAsync}
  - completed: ${post.opsCompletedAsync}

Make sure to await all promises returned from Deno APIs before
finishing test case.`,
      );
    };
  }

  // Wrap test function in additional assertion that makes sure
  // the test case does not "leak" resources - ie. resource table after
  // the test has exactly the same contents as before the test.
  function assertResources(
    fn,
  ) {
    return async function resourceSanitizer() {
      const pre = core.resources();
      await fn();
      const post = core.resources();

      const preStr = JSON.stringify(pre, null, 2);
      const postStr = JSON.stringify(post, null, 2);
      const msg = `Test case is leaking resources.
Before: ${preStr}
After: ${postStr}

Make sure to close all open resource handles returned from Deno APIs before
finishing test case.`;
      assert(preStr === postStr, msg);
    };
  }

  const TEST_REGISTRY = [];

  // Main test function provided by Deno, as you can see it merely
  // creates a new object with "name" and "fn" fields.
  function test(
    t,
    fn,
  ) {
    let testDef;
    const defaults = {
      ignore: false,
      only: false,
      sanitizeOps: true,
      sanitizeResources: true,
    };

    if (typeof t === "string") {
      if (!fn || typeof fn != "function") {
        throw new TypeError("Missing test function");
      }
      if (!t) {
        throw new TypeError("The test name can't be empty");
      }
      testDef = { fn: fn, name: t, ...defaults };
    } else {
      if (!t.fn) {
        throw new TypeError("Missing test function");
      }
      if (!t.name) {
        throw new TypeError("The test name can't be empty");
      }
      testDef = { ...defaults, ...t };
    }

    if (testDef.sanitizeOps) {
      //testDef.fn = assertOps(testDef.fn);
    }

    if (testDef.sanitizeResources) {
      //testDef.fn = assertResources(testDef.fn);
    }

    TEST_REGISTRY.push(testDef);
  }

  const encoder = new TextEncoder();

  function log(msg, noNewLine = false) {
    if (!noNewLine) {
      msg += "\n";
    }

    // Using `stdout` here because it doesn't force new lines
    // compared to `console.log`; `core.print` on the other hand
    // is line-buffered and doesn't output message without newline
    stdout.writeSync(encoder.encode(msg));
  }

  function reportToConsole(message) {
    const redFailed = red("FAILED");
    const greenOk = green("ok");
    const yellowIgnored = yellow("ignored");
    if (message.start != null) {
      log(`running ${message.start.tests.length} tests`);
    } else if (message.testStart != null) {
      const { name } = message.testStart;

      log(`test ${name} ... `, true);
      return;
    } else if (message.testEnd != null) {
      switch (message.testEnd.status) {
        case "passed":
          log(`${greenOk} ${formatDuration(message.testEnd.duration)}`);
          break;
        case "failed":
          log(`${redFailed} ${formatDuration(message.testEnd.duration)}`);
          break;
        case "ignored":
          log(`${yellowIgnored} ${formatDuration(message.testEnd.duration)}`);
          break;
      }
    } else if (message.end != null) {
      const failures = message.end.results.filter((m) => m.error != null);
      if (failures.length > 0) {
        log(`\nfailures:\n`);

        for (const { name, error } of failures) {
          log(name);
          log(inspectArgs([error]));
          log("");
        }

        log(`failures:\n`);

        for (const { name } of failures) {
          log(`\t${name}`);
        }
      }
      log(
        `\ntest result: ${message.end.failed ? redFailed : greenOk}. ` +
          `${message.end.passed} passed; ${message.end.failed} failed; ` +
          `${message.end.ignored} ignored; ${message.end.measured} measured; ` +
          `${message.end.filtered} filtered out ` +
          `${formatDuration(message.end.duration)}\n`,
      );

      if (message.end.usedOnly && message.end.failed == 0) {
        log(`${redFailed} because the "only" option was used\n`);
      }
    }
  }

  exposeForTest("reportToConsole", reportToConsole);

  // TODO: already implements AsyncGenerator<RunTestsMessage>, but add as "implements to class"
  // TODO: implements PromiseLike<RunTestsEndResult>
  class TestRunner {
    #usedOnly = false;

    constructor(
      tests,
      filterFn,
      failFast,
    ) {
      this.stats = {
        filtered: 0,
        ignored: 0,
        measured: 0,
        passed: 0,
        failed: 0,
      };
      this.filterFn = filterFn;
      this.failFast = failFast;
      const onlyTests = tests.filter(({ only }) => only);
      this.#usedOnly = onlyTests.length > 0;
      const unfilteredTests = this.#usedOnly ? onlyTests : tests;
      this.testsToRun = unfilteredTests.filter(filterFn);
      this.stats.filtered = unfilteredTests.length - this.testsToRun.length;
    }

    async *[Symbol.asyncIterator]() {
      yield { start: { tests: this.testsToRun } };

      const results = [];
      const suiteStart = +new Date();
      for (const test of this.testsToRun) {
        const endMessage = {
          name: test.name,
          duration: 0,
        };
        yield { testStart: { ...test } };
        if (test.ignore) {
          endMessage.status = "ignored";
          this.stats.ignored++;
        } else {
          const start = +new Date();
          try {
            await test.fn();
            endMessage.status = "passed";
            this.stats.passed++;
          } catch (err) {
            endMessage.status = "failed";
            endMessage.error = err;
            this.stats.failed++;
          }
          endMessage.duration = +new Date() - start;
        }
        results.push(endMessage);
        yield { testEnd: endMessage };
        if (this.failFast && endMessage.error != null) {
          break;
        }
      }

      const duration = +new Date() - suiteStart;

      yield {
        end: { ...this.stats, usedOnly: this.#usedOnly, duration, results },
      };
    }
  }

  function createFilterFn(
    filter,
    skip,
  ) {
    return (def) => {
      let passes = true;

      if (filter) {
        if (filter instanceof RegExp) {
          passes = passes && filter.test(def.name);
        } else if (filter.startsWith("/") && filter.endsWith("/")) {
          const filterAsRegex = new RegExp(filter.slice(1, filter.length - 1));
          passes = passes && filterAsRegex.test(def.name);
        } else {
          passes = passes && def.name.includes(filter);
        }
      }

      if (skip) {
        if (skip instanceof RegExp) {
          passes = passes && !skip.test(def.name);
        } else {
          passes = passes && !def.name.includes(skip);
        }
      }

      return passes;
    };
  }

  exposeForTest("createFilterFn", createFilterFn);

  async function runTests({
    exitOnFail = true,
    failFast = false,
    filter = undefined,
    skip = undefined,
    disableLog = false,
    reportToConsole: reportToConsole_ = true,
    onMessage = undefined,
  } = {}) {
    const filterFn = createFilterFn(filter, skip);
    const testRunner = new TestRunner(TEST_REGISTRY, filterFn, failFast);

    const originalConsole = globalThis.console;

    if (disableLog) {
      globalThis.console = disabledConsole;
    }

    let endMsg;

    for await (const message of testRunner) {
      if (onMessage != null) {
        await onMessage(message);
      }
      if (reportToConsole_) {
        reportToConsole(message);
      }
      if (message.end != null) {
        endMsg = message.end;
      }
    }

    if (disableLog) {
      globalThis.console = originalConsole;
    }

    if ((endMsg.failed > 0 || endMsg?.usedOnly) && exitOnFail) {
      exit(1);
    }

    return endMsg;
  }

  exposeForTest("runTests", runTests);
  window.Deno.runTests = runTests;

  window.__bootstrap.testing = {
    test,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;
  const { Listener, Conn } = window.__bootstrap.net;

  function opConnectTls(
    args,
  ) {
    return core.jsonOpAsync("op_connect_tls", args);
  }

  function opAcceptTLS(rid) {
    return core.jsonOpAsync("op_accept_tls", { rid });
  }

  function opListenTls(args) {
    return core.jsonOpSync("op_listen_tls", args);
  }

  function opStartTls(args) {
    return core.jsonOpAsync("op_start_tls", args);
  }

  async function connectTls({
    port,
    hostname = "127.0.0.1",
    transport = "tcp",
    certFile = undefined,
  }) {
    const res = await opConnectTls({
      port,
      hostname,
      transport,
      certFile,
    });
    return new Conn(res.rid, res.remoteAddr, res.localAddr);
  }

  class TLSListener extends Listener {
    async accept() {
      const res = await opAcceptTLS(this.rid);
      return new Conn(res.rid, res.remoteAddr, res.localAddr);
    }
  }

  function listenTls({
    port,
    certFile,
    keyFile,
    hostname = "0.0.0.0",
    transport = "tcp",
  }) {
    const res = opListenTls({
      port,
      certFile,
      keyFile,
      hostname,
      transport,
    });
    return new TLSListener(res.rid, res.localAddr);
  }

  async function startTls(
    conn,
    { hostname = "127.0.0.1", certFile } = {},
  ) {
    const res = await opStartTls({
      rid: conn.rid,
      hostname,
      certFile,
    });
    return new Conn(res.rid, res.remoteAddr, res.localAddr);
  }

  window.__bootstrap.tls = {
    startTls,
    listenTls,
    connectTls,
    TLSListener,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

((window) => {
  const core = window.Deno.core;

  function consoleSize(rid) {
    return core.jsonOpSync("op_console_size", { rid });
  }

  function isatty(rid) {
    return core.jsonOpSync("op_isatty", { rid });
  }

  function setRaw(rid, mode) {
    core.jsonOpSync("op_set_raw", { rid, mode });
  }

  window.__bootstrap.tty = {
    consoleSize,
    isatty,
    setRaw,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
((window) => {
  const { stat, statSync, chmod, chmodSync } = window.__bootstrap.fs;
  const { open, openSync } = window.__bootstrap.files;
  const { writeAll, writeAllSync } = window.__bootstrap.buffer;
  const { build } = window.__bootstrap.build;

  function writeFileSync(
    path,
    data,
    options = {},
  ) {
    if (options.create !== undefined) {
      const create = !!options.create;
      if (!create) {
        // verify that file exists
        statSync(path);
      }
    }

    const openOptions = !!options.append
      ? { write: true, create: true, append: true }
      : { write: true, create: true, truncate: true };
    const file = openSync(path, openOptions);

    if (
      options.mode !== undefined &&
      options.mode !== null &&
      build.os !== "windows"
    ) {
      chmodSync(path, options.mode);
    }

    writeAllSync(file, data);
    file.close();
  }

  async function writeFile(
    path,
    data,
    options = {},
  ) {
    if (options.create !== undefined) {
      const create = !!options.create;
      if (!create) {
        // verify that file exists
        await stat(path);
      }
    }

    const openOptions = !!options.append
      ? { write: true, create: true, append: true }
      : { write: true, create: true, truncate: true };
    const file = await open(path, openOptions);

    if (
      options.mode !== undefined &&
      options.mode !== null &&
      build.os !== "windows"
    ) {
      await chmod(path, options.mode);
    }

    await writeAll(file, data);
    file.close();
  }

  function writeTextFileSync(
    path,
    data,
    options = {},
  ) {
    const encoder = new TextEncoder();
    return writeFileSync(path, encoder.encode(data), options);
  }

  function writeTextFile(
    path,
    data,
    options = {},
  ) {
    const encoder = new TextEncoder();
    return writeFile(path, encoder.encode(data), options);
  }

  window.__bootstrap.writeFile = {
    writeTextFile,
    writeTextFileSync,
    writeFile,
    writeFileSync,
  };
})(globalThis);

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

__bootstrap.denoNs = {
  test: __bootstrap.testing.test,
  metrics: __bootstrap.metrics.metrics,
  Process: __bootstrap.process.Process,
  run: __bootstrap.process.run,
  isatty: __bootstrap.tty.isatty,
  writeFileSync: __bootstrap.writeFile.writeFileSync,
  writeFile: __bootstrap.writeFile.writeFile,
  writeTextFileSync: __bootstrap.writeFile.writeTextFileSync,
  writeTextFile: __bootstrap.writeFile.writeTextFile,
  readTextFile: __bootstrap.readFile.readTextFile,
  readTextFileSync: __bootstrap.readFile.readTextFileSync,
  readFile: __bootstrap.readFile.readFile,
  readFileSync: __bootstrap.readFile.readFileSync,
  watchFs: __bootstrap.fsEvents.watchFs,
  chmodSync: __bootstrap.fs.chmodSync,
  chmod: __bootstrap.fs.chmod,
  chown: __bootstrap.fs.chown,
  chownSync: __bootstrap.fs.chownSync,
  copyFileSync: __bootstrap.fs.copyFileSync,
  cwd: __bootstrap.fs.cwd,
  makeTempDirSync: __bootstrap.fs.makeTempDirSync,
  makeTempDir: __bootstrap.fs.makeTempDir,
  makeTempFileSync: __bootstrap.fs.makeTempFileSync,
  makeTempFile: __bootstrap.fs.makeTempFile,
  mkdirSync: __bootstrap.fs.mkdirSync,
  mkdir: __bootstrap.fs.mkdir,
  chdir: __bootstrap.fs.chdir,
  copyFile: __bootstrap.fs.copyFile,
  readDirSync: __bootstrap.fs.readDirSync,
  readDir: __bootstrap.fs.readDir,
  readLinkSync: __bootstrap.fs.readLinkSync,
  readLink: __bootstrap.fs.readLink,
  realPathSync: __bootstrap.fs.realPathSync,
  realPath: __bootstrap.fs.realPath,
  removeSync: __bootstrap.fs.removeSync,
  remove: __bootstrap.fs.remove,
  renameSync: __bootstrap.fs.renameSync,
  rename: __bootstrap.fs.rename,
  version: __bootstrap.version.version,
  build: __bootstrap.build.build,
  statSync: __bootstrap.fs.statSync,
  lstatSync: __bootstrap.fs.lstatSync,
  stat: __bootstrap.fs.stat,
  lstat: __bootstrap.fs.lstat,
  truncateSync: __bootstrap.fs.truncateSync,
  truncate: __bootstrap.fs.truncate,
  errors: __bootstrap.errors.errors,
  customInspect: __bootstrap.console.customInspect,
  inspect: __bootstrap.console.inspect,
  env: __bootstrap.os.env,
  exit: __bootstrap.os.exit,
  execPath: __bootstrap.os.execPath,
  Buffer: __bootstrap.buffer.Buffer,
  readAll: __bootstrap.buffer.readAll,
  readAllSync: __bootstrap.buffer.readAllSync,
  writeAll: __bootstrap.buffer.writeAll,
  writeAllSync: __bootstrap.buffer.writeAllSync,
  copy: __bootstrap.io.copy,
  iter: __bootstrap.io.iter,
  iterSync: __bootstrap.io.iterSync,
  SeekMode: __bootstrap.io.SeekMode,
  read: __bootstrap.io.read,
  readSync: __bootstrap.io.readSync,
  write: __bootstrap.io.write,
  writeSync: __bootstrap.io.writeSync,
  File: __bootstrap.files.File,
  open: __bootstrap.files.open,
  openSync: __bootstrap.files.openSync,
  create: __bootstrap.files.create,
  createSync: __bootstrap.files.createSync,
  stdin: __bootstrap.files.stdin,
  stdout: __bootstrap.files.stdout,
  stderr: __bootstrap.files.stderr,
  seek: __bootstrap.files.seek,
  seekSync: __bootstrap.files.seekSync,
  connect: __bootstrap.net.connect,
  listen: __bootstrap.net.listen,
  connectTls: __bootstrap.tls.connectTls,
  listenTls: __bootstrap.tls.listenTls,
};

__bootstrap.denoNsUnstable = {
  signal: __bootstrap.signals.signal,
  signals: __bootstrap.signals.signals,
  Signal: __bootstrap.signals.Signal,
  SignalStream: __bootstrap.signals.SignalStream,
  transpileOnly: __bootstrap.compilerApi.transpileOnly,
  compile: __bootstrap.compilerApi.compile,
  bundle: __bootstrap.compilerApi.bundle,
  permissions: __bootstrap.permissions.permissions,
  Permissions: __bootstrap.permissions.Permissions,
  PermissionStatus: __bootstrap.permissions.PermissionStatus,
  openPlugin: __bootstrap.plugins.openPlugin,
  kill: __bootstrap.process.kill,
  setRaw: __bootstrap.tty.setRaw,
  consoleSize: __bootstrap.tty.consoleSize,
  DiagnosticCategory: __bootstrap.diagnostics.DiagnosticCategory,
  loadavg: __bootstrap.os.loadavg,
  hostname: __bootstrap.os.hostname,
  osRelease: __bootstrap.os.osRelease,
  systemMemoryInfo: __bootstrap.os.systemMemoryInfo,
  applySourceMap: __bootstrap.errorStack.opApplySourceMap,
  formatDiagnostics: __bootstrap.errorStack.opFormatDiagnostics,
  shutdown: __bootstrap.net.shutdown,
  ShutdownMode: __bootstrap.net.ShutdownMode,
  listen: __bootstrap.netUnstable.listen,
  connect: __bootstrap.netUnstable.connect,
  listenDatagram: __bootstrap.netUnstable.listenDatagram,
  startTls: __bootstrap.tls.startTls,
  fstatSync: __bootstrap.fs.fstatSync,
  fstat: __bootstrap.fs.fstat,
  ftruncateSync: __bootstrap.fs.ftruncateSync,
  ftruncate: __bootstrap.fs.ftruncate,
  umask: __bootstrap.fs.umask,
  link: __bootstrap.fs.link,
  linkSync: __bootstrap.fs.linkSync,
  futime: __bootstrap.fs.futime,
  futimeSync: __bootstrap.fs.futimeSync,
  utime: __bootstrap.fs.utime,
  utimeSync: __bootstrap.fs.utimeSync,
  symlink: __bootstrap.fs.symlink,
  symlinkSync: __bootstrap.fs.symlinkSync,
  fdatasyncSync: __bootstrap.fs.fdatasyncSync,
  fdatasync: __bootstrap.fs.fdatasync,
  fsyncSync: __bootstrap.fs.fsyncSync,
  fsync: __bootstrap.fs.fsync,
  HttpClient: __bootstrap.fetch.HttpClient,
  createHttpClient: __bootstrap.fetch.createHttpClient,
};

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
// Removes the `__proto__` for security reasons.  This intentionally makes
// Deno non compliant with ECMA-262 Annex B.2.2.1
//
delete Object.prototype.__proto__;

((window) => {
  const core = Deno.core;
  const util = window.__bootstrap.util;
  const eventTarget = window.__bootstrap.eventTarget;
  const dispatchMinimal = window.__bootstrap.dispatchMinimal;
  const build = window.__bootstrap.build;
  const version = window.__bootstrap.version;
  const errorStack = window.__bootstrap.errorStack;
  const os = window.__bootstrap.os;
  const timers = window.__bootstrap.timers;
  const Console = window.__bootstrap.console.Console;
  const worker = window.__bootstrap.worker;
  const signals = window.__bootstrap.signals;
  const { internalSymbol, internalObject } = window.__bootstrap.internals;
  const performance = window.__bootstrap.performance;
  const crypto = window.__bootstrap.crypto;
  const url = window.__bootstrap.url;
  const headers = window.__bootstrap.headers;
  const streams = window.__bootstrap.streams;
  const fileReader = window.__bootstrap.fileReader;
  const webSocket = window.__bootstrap.webSocket;
  const fetch = window.__bootstrap.fetch;
  const denoNs = window.__bootstrap.denoNs;
  const denoNsUnstable = window.__bootstrap.denoNsUnstable;
  const errors = window.__bootstrap.errors.errors;

  let windowIsClosing = false;

  function windowClose() {
    if (!windowIsClosing) {
      windowIsClosing = true;
      // Push a macrotask to exit after a promise resolve.
      // This is not perfect, but should be fine for first pass.
      Promise.resolve().then(() =>
        timers.setTimeout.call(
          null,
          () => {
            // This should be fine, since only Window/MainWorker has .close()
            os.exit(0);
          },
          0,
        )
      );
    }
  }

  const encoder = new TextEncoder();

  function workerClose() {
    if (isClosing) {
      return;
    }

    isClosing = true;
    opCloseWorker();
  }

  // TODO(bartlomieju): remove these funtions
  // Stuff for workers
  const onmessage = () => {};
  const onerror = () => {};

  function postMessage(data) {
    const dataJson = JSON.stringify(data);
    const dataIntArray = encoder.encode(dataJson);
    opPostMessage(dataIntArray);
  }

  let isClosing = false;
  async function workerMessageRecvCallback(data) {
    const msgEvent = new MessageEvent("message", {
      cancelable: false,
      data,
    });

    try {
      if (globalThis["onmessage"]) {
        const result = globalThis.onmessage(msgEvent);
        if (result && "then" in result) {
          await result;
        }
      }
      globalThis.dispatchEvent(msgEvent);
    } catch (e) {
      let handled = false;

      const errorEvent = new ErrorEvent("error", {
        cancelable: true,
        message: e.message,
        lineno: e.lineNumber ? e.lineNumber + 1 : undefined,
        colno: e.columnNumber ? e.columnNumber + 1 : undefined,
        filename: e.fileName,
        error: null,
      });

      if (globalThis["onerror"]) {
        const ret = globalThis.onerror(
          e.message,
          e.fileName,
          e.lineNumber,
          e.columnNumber,
          e,
        );
        handled = ret === true;
      }

      globalThis.dispatchEvent(errorEvent);
      if (errorEvent.defaultPrevented) {
        handled = true;
      }

      if (!handled) {
        throw e;
      }
    }
  }

  function opPostMessage(data) {
    core.jsonOpSync("op_worker_post_message", {}, data);
  }

  function opCloseWorker() {
    core.jsonOpSync("op_worker_close");
  }

  function opStart() {
    return core.jsonOpSync("op_start");
  }

  function opMainModule() {
    return core.jsonOpSync("op_main_module");
  }

  // TODO(bartlomieju): temporary solution, must be fixed when moving
  // dispatches to separate crates
  function initOps() {
    const opsMap = core.ops();
    for (const [name, opId] of Object.entries(opsMap)) {
      if (name === "op_write" || name === "op_read") {
        core.setAsyncHandler(opId, dispatchMinimal.asyncMsgFromRust);
      }
    }
    core.setMacrotaskCallback(timers.handleTimerMacrotask);
  }

  function runtimeStart(source) {
    initOps();
    // First we send an empty `Start` message to let the privileged side know we
    // are ready. The response should be a `StartRes` message containing the CLI
    // args and other info.
    const s = opStart();
    version.setVersions(s.denoVersion, s.v8Version, s.tsVersion);
    build.setBuildInfo(s.target);
    util.setLogDebug(s.debugFlag, source);
    errorStack.setPrepareStackTrace(Error);
    return s;
  }

  function registerErrors() {
    core.registerErrorClass("NotFound", errors.NotFound);
    core.registerErrorClass("PermissionDenied", errors.PermissionDenied);
    core.registerErrorClass("ConnectionRefused", errors.ConnectionRefused);
    core.registerErrorClass("ConnectionReset", errors.ConnectionReset);
    core.registerErrorClass("ConnectionAborted", errors.ConnectionAborted);
    core.registerErrorClass("NotConnected", errors.NotConnected);
    core.registerErrorClass("AddrInUse", errors.AddrInUse);
    core.registerErrorClass("AddrNotAvailable", errors.AddrNotAvailable);
    core.registerErrorClass("BrokenPipe", errors.BrokenPipe);
    core.registerErrorClass("AlreadyExists", errors.AlreadyExists);
    core.registerErrorClass("InvalidData", errors.InvalidData);
    core.registerErrorClass("TimedOut", errors.TimedOut);
    core.registerErrorClass("Interrupted", errors.Interrupted);
    core.registerErrorClass("WriteZero", errors.WriteZero);
    core.registerErrorClass("UnexpectedEof", errors.UnexpectedEof);
    core.registerErrorClass("BadResource", errors.BadResource);
    core.registerErrorClass("Http", errors.Http);
    core.registerErrorClass("Busy", errors.Busy);
    core.registerErrorClass("NotSupported", errors.NotSupported);
    core.registerErrorClass("Error", Error);
    core.registerErrorClass("RangeError", RangeError);
    core.registerErrorClass("ReferenceError", ReferenceError);
    core.registerErrorClass("SyntaxError", SyntaxError);
    core.registerErrorClass("TypeError", TypeError);
    core.registerErrorClass("URIError", URIError);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope
  const windowOrWorkerGlobalScope = {
    Blob: util.nonEnumerable(fetch.Blob),
    ByteLengthQueuingStrategy: util.nonEnumerable(
      streams.ByteLengthQueuingStrategy,
    ),
    CloseEvent: util.nonEnumerable(CloseEvent),
    CountQueuingStrategy: util.nonEnumerable(
      streams.CountQueuingStrategy,
    ),
    CustomEvent: util.nonEnumerable(CustomEvent),
    DOMException: util.nonEnumerable(DOMException),
    ErrorEvent: util.nonEnumerable(ErrorEvent),
    Event: util.nonEnumerable(Event),
    EventTarget: util.nonEnumerable(EventTarget),
    File: util.nonEnumerable(fetch.DomFile),
    FileReader: util.nonEnumerable(fileReader.FileReader),
    FormData: util.nonEnumerable(fetch.FormData),
    Headers: util.nonEnumerable(headers.Headers),
    MessageEvent: util.nonEnumerable(MessageEvent),
    Performance: util.nonEnumerable(performance.Performance),
    PerformanceEntry: util.nonEnumerable(performance.PerformanceEntry),
    PerformanceMark: util.nonEnumerable(performance.PerformanceMark),
    PerformanceMeasure: util.nonEnumerable(performance.PerformanceMeasure),
    ProgressEvent: util.nonEnumerable(ProgressEvent),
    ReadableStream: util.nonEnumerable(streams.ReadableStream),
    Request: util.nonEnumerable(fetch.Request),
    Response: util.nonEnumerable(fetch.Response),
    TextDecoder: util.nonEnumerable(TextDecoder),
    TextEncoder: util.nonEnumerable(TextEncoder),
    TransformStream: util.nonEnumerable(streams.TransformStream),
    URL: util.nonEnumerable(url.URL),
    URLSearchParams: util.nonEnumerable(url.URLSearchParams),
    WebSocket: util.nonEnumerable(webSocket.WebSocket),
    Worker: util.nonEnumerable(worker.Worker),
    WritableStream: util.nonEnumerable(streams.WritableStream),
    addEventListener: util.readOnly(EventTarget.prototype.addEventListener),
    atob: util.writable(atob),
    btoa: util.writable(btoa),
    clearInterval: util.writable(timers.clearInterval),
    clearTimeout: util.writable(timers.clearTimeout),
    console: util.writable(new Console(core.print)),
    crypto: util.readOnly(crypto),
    dispatchEvent: util.readOnly(EventTarget.prototype.dispatchEvent),
    fetch: util.writable(fetch.fetch),
    performance: util.writable(performance.performance),
    removeEventListener: util.readOnly(
      EventTarget.prototype.removeEventListener,
    ),
    setInterval: util.writable(timers.setInterval),
    setTimeout: util.writable(timers.setTimeout),
  };

  const mainRuntimeGlobalProperties = {
    window: util.readOnly(globalThis),
    self: util.readOnly(globalThis),
    // TODO(bartlomieju): from MDN docs (https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope)
    // it seems those two properties should be available to workers as well
    onload: util.writable(null),
    onunload: util.writable(null),
    close: util.writable(windowClose),
    closed: util.getterOnly(() => windowIsClosing),
  };

  const workerRuntimeGlobalProperties = {
    self: util.readOnly(globalThis),
    onmessage: util.writable(onmessage),
    onerror: util.writable(onerror),
    // TODO: should be readonly?
    close: util.nonEnumerable(workerClose),
    postMessage: util.writable(postMessage),
    workerMessageRecvCallback: util.nonEnumerable(workerMessageRecvCallback),
  };

  let hasBootstrapped = false;

  function bootstrapMainRuntime() {
    if (hasBootstrapped) {
      throw new Error("Worker runtime already bootstrapped");
    }
    // Remove bootstrapping data from the global scope
    delete globalThis.__bootstrap;
    delete globalThis.bootstrap;
    util.log("bootstrapMainRuntime");
    hasBootstrapped = true;
    Object.defineProperties(globalThis, windowOrWorkerGlobalScope);
    Object.defineProperties(globalThis, mainRuntimeGlobalProperties);
    eventTarget.setEventTargetData(globalThis);
    // Registers the handler for window.onload function.
    globalThis.addEventListener("load", (e) => {
      const { onload } = globalThis;
      if (typeof onload === "function") {
        onload(e);
      }
    });
    // Registers the handler for window.onunload function.
    globalThis.addEventListener("unload", (e) => {
      const { onunload } = globalThis;
      if (typeof onunload === "function") {
        onunload(e);
      }
    });

    const { args, cwd, noColor, pid, ppid, unstableFlag } = runtimeStart();

    registerErrors();

    const finalDenoNs = {
      core,
      internal: internalSymbol,
      [internalSymbol]: internalObject,
      resources: core.resources,
      close: core.close,
      ...denoNs,
    };
    Object.defineProperties(finalDenoNs, {
      pid: util.readOnly(pid),
      ppid: util.readOnly(ppid),
      noColor: util.readOnly(noColor),
      args: util.readOnly(Object.freeze(args)),
      mainModule: util.getterOnly(opMainModule),
    });

    if (unstableFlag) {
      Object.assign(finalDenoNs, denoNsUnstable);
    }

    // Setup `Deno` global - we're actually overriding already
    // existing global `Deno` with `Deno` namespace from "./deno.ts".
    util.immutableDefine(globalThis, "Deno", finalDenoNs);
    Object.freeze(globalThis.Deno);
    Object.freeze(globalThis.Deno.core);
    Object.freeze(globalThis.Deno.core.sharedQueue);
    signals.setSignals();

    util.log("cwd", cwd);
    util.log("args", args);
  }

  function bootstrapWorkerRuntime(name, useDenoNamespace, internalName) {
    if (hasBootstrapped) {
      throw new Error("Worker runtime already bootstrapped");
    }
    // Remove bootstrapping data from the global scope
    delete globalThis.__bootstrap;
    delete globalThis.bootstrap;
    util.log("bootstrapWorkerRuntime");
    hasBootstrapped = true;
    Object.defineProperties(globalThis, windowOrWorkerGlobalScope);
    Object.defineProperties(globalThis, workerRuntimeGlobalProperties);
    Object.defineProperties(globalThis, { name: util.readOnly(name) });
    eventTarget.setEventTargetData(globalThis);
    const { unstableFlag, pid, noColor, args } = runtimeStart(
      internalName ?? name,
    );

    registerErrors();

    const finalDenoNs = {
      core,
      internal: internalSymbol,
      [internalSymbol]: internalObject,
      resources: core.resources,
      close: core.close,
      ...denoNs,
    };
    if (useDenoNamespace) {
      if (unstableFlag) {
        Object.assign(finalDenoNs, denoNsUnstable);
      }
      Object.defineProperties(finalDenoNs, {
        pid: util.readOnly(pid),
        noColor: util.readOnly(noColor),
        args: util.readOnly(Object.freeze(args)),
      });
      // Setup `Deno` global - we're actually overriding already
      // existing global `Deno` with `Deno` namespace from "./deno.ts".
      util.immutableDefine(globalThis, "Deno", finalDenoNs);
      Object.freeze(globalThis.Deno);
      Object.freeze(globalThis.Deno.core);
      Object.freeze(globalThis.Deno.core.sharedQueue);
      signals.setSignals();
    } else {
      delete globalThis.Deno;
      util.assert(globalThis.Deno === undefined);
    }
  }

  Object.defineProperties(globalThis, {
    bootstrap: {
      value: {
        mainRuntime: bootstrapMainRuntime,
        workerRuntime: bootstrapWorkerRuntime,
      },
      configurable: true,
    },
  });
})(globalThis);

globalThis.bootstrap.mainRuntime();
Deno[Deno.internal] = globalThis.runTests;
