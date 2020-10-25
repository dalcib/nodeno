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
