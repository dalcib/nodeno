import {resolve} from "../path/mod.mjs";
const CLOCKID_REALTIME = 0;
const CLOCKID_MONOTONIC = 1;
const CLOCKID_PROCESS_CPUTIME_ID = 2;
const CLOCKID_THREAD_CPUTIME_ID = 3;
const ERRNO_SUCCESS = 0;
const _ERRNO_2BIG = 1;
const ERRNO_ACCES = 2;
const ERRNO_ADDRINUSE = 3;
const ERRNO_ADDRNOTAVAIL = 4;
const _ERRNO_AFNOSUPPORT = 5;
const _ERRNO_AGAIN = 6;
const _ERRNO_ALREADY = 7;
const ERRNO_BADF = 8;
const _ERRNO_BADMSG = 9;
const ERRNO_BUSY = 10;
const _ERRNO_CANCELED = 11;
const _ERRNO_CHILD = 12;
const ERRNO_CONNABORTED = 13;
const ERRNO_CONNREFUSED = 14;
const ERRNO_CONNRESET = 15;
const _ERRNO_DEADLK = 16;
const _ERRNO_DESTADDRREQ = 17;
const _ERRNO_DOM = 18;
const _ERRNO_DQUOT = 19;
const _ERRNO_EXIST = 20;
const _ERRNO_FAULT = 21;
const _ERRNO_FBIG = 22;
const _ERRNO_HOSTUNREACH = 23;
const _ERRNO_IDRM = 24;
const _ERRNO_ILSEQ = 25;
const _ERRNO_INPROGRESS = 26;
const ERRNO_INTR = 27;
const ERRNO_INVAL = 28;
const _ERRNO_IO = 29;
const _ERRNO_ISCONN = 30;
const _ERRNO_ISDIR = 31;
const _ERRNO_LOOP = 32;
const _ERRNO_MFILE = 33;
const _ERRNO_MLINK = 34;
const _ERRNO_MSGSIZE = 35;
const _ERRNO_MULTIHOP = 36;
const _ERRNO_NAMETOOLONG = 37;
const _ERRNO_NETDOWN = 38;
const _ERRNO_NETRESET = 39;
const _ERRNO_NETUNREACH = 40;
const _ERRNO_NFILE = 41;
const _ERRNO_NOBUFS = 42;
const _ERRNO_NODEV = 43;
const ERRNO_NOENT = 44;
const _ERRNO_NOEXEC = 45;
const _ERRNO_NOLCK = 46;
const _ERRNO_NOLINK = 47;
const _ERRNO_NOMEM = 48;
const _ERRNO_NOMSG = 49;
const _ERRNO_NOPROTOOPT = 50;
const _ERRNO_NOSPC = 51;
const ERRNO_NOSYS = 52;
const ERRNO_NOTCONN = 53;
const ERRNO_NOTDIR = 54;
const _ERRNO_NOTEMPTY = 55;
const _ERRNO_NOTRECOVERABLE = 56;
const _ERRNO_NOTSOCK = 57;
const _ERRNO_NOTSUP = 58;
const _ERRNO_NOTTY = 59;
const _ERRNO_NXIO = 60;
const _ERRNO_OVERFLOW = 61;
const _ERRNO_OWNERDEAD = 62;
const _ERRNO_PERM = 63;
const ERRNO_PIPE = 64;
const _ERRNO_PROTO = 65;
const _ERRNO_PROTONOSUPPORT = 66;
const _ERRNO_PROTOTYPE = 67;
const _ERRNO_RANGE = 68;
const _ERRNO_ROFS = 69;
const _ERRNO_SPIPE = 70;
const _ERRNO_SRCH = 71;
const _ERRNO_STALE = 72;
const ERRNO_TIMEDOUT = 73;
const _ERRNO_TXTBSY = 74;
const _ERRNO_XDEV = 75;
const _ERRNO_NOTCAPABLE = 76;
const RIGHTS_FD_DATASYNC = 0x0000000000000001n;
const RIGHTS_FD_READ = 0x0000000000000002n;
const _RIGHTS_FD_SEEK = 0x0000000000000004n;
const _RIGHTS_FD_FDSTAT_SET_FLAGS = 0x0000000000000008n;
const _RIGHTS_FD_SYNC = 0x0000000000000010n;
const _RIGHTS_FD_TELL = 0x0000000000000020n;
const RIGHTS_FD_WRITE = 0x0000000000000040n;
const _RIGHTS_FD_ADVISE = 0x0000000000000080n;
const RIGHTS_FD_ALLOCATE = 0x0000000000000100n;
const _RIGHTS_PATH_CREATE_DIRECTORY = 0x0000000000000200n;
const _RIGHTS_PATH_CREATE_FILE = 0x0000000000000400n;
const _RIGHTS_PATH_LINK_SOURCE = 0x0000000000000800n;
const _RIGHTS_PATH_LINK_TARGET = 0x0000000000001000n;
const _RIGHTS_PATH_OPEN = 0x0000000000002000n;
const RIGHTS_FD_READDIR = 0x0000000000004000n;
const _RIGHTS_PATH_READLINK = 0x0000000000008000n;
const _RIGHTS_PATH_RENAME_SOURCE = 0x0000000000010000n;
const _RIGHTS_PATH_RENAME_TARGET = 0x0000000000020000n;
const _RIGHTS_PATH_FILESTAT_GET = 0x0000000000040000n;
const _RIGHTS_PATH_FILESTAT_SET_SIZE = 0x0000000000080000n;
const _RIGHTS_PATH_FILESTAT_SET_TIMES = 0x0000000000100000n;
const _RIGHTS_FD_FILESTAT_GET = 0x0000000000200000n;
const RIGHTS_FD_FILESTAT_SET_SIZE = 0x0000000000400000n;
const _RIGHTS_FD_FILESTAT_SET_TIMES = 0x0000000000800000n;
const _RIGHTS_PATH_SYMLINK = 0x0000000001000000n;
const _RIGHTS_PATH_REMOVE_DIRECTORY = 0x0000000002000000n;
const _RIGHTS_PATH_UNLINK_FILE = 0x0000000004000000n;
const _RIGHTS_POLL_FD_READWRITE = 0x0000000008000000n;
const _RIGHTS_SOCK_SHUTDOWN = 0x0000000010000000n;
const _WHENCE_SET = 0;
const _WHENCE_CUR = 1;
const _WHENCE_END = 2;
const FILETYPE_UNKNOWN = 0;
const _FILETYPE_BLOCK_DEVICE = 1;
const FILETYPE_CHARACTER_DEVICE = 2;
const FILETYPE_DIRECTORY = 3;
const FILETYPE_REGULAR_FILE = 4;
const _FILETYPE_SOCKET_DGRAM = 5;
const _FILETYPE_SOCKET_STREAM = 6;
const FILETYPE_SYMBOLIC_LINK = 7;
const _ADVICE_NORMAL = 0;
const _ADVICE_SEQUENTIAL = 1;
const _ADVICE_RANDOM = 2;
const _ADVICE_WILLNEED = 3;
const _ADVICE_DONTNEED = 4;
const _ADVICE_NOREUSE = 5;
const FDFLAGS_APPEND = 1;
const FDFLAGS_DSYNC = 2;
const FDFLAGS_NONBLOCK = 4;
const FDFLAGS_RSYNC = 8;
const FDFLAGS_SYNC = 16;
const _FSTFLAGS_ATIM = 1;
const FSTFLAGS_ATIM_NOW = 2;
const _FSTFLAGS_MTIM = 4;
const FSTFLAGS_MTIM_NOW = 8;
const LOOKUPFLAGS_SYMLINK_FOLLOW = 1;
const OFLAGS_CREAT = 1;
const OFLAGS_DIRECTORY = 2;
const OFLAGS_EXCL = 4;
const OFLAGS_TRUNC = 8;
const _EVENTTYPE_CLOCK = 0;
const _EVENTTYPE_FD_READ = 1;
const _EVENTTYPE_FD_WRITE = 2;
const _EVENTRWFLAGS_FD_READWRITE_HANGUP = 1;
const _SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME = 1;
const _SIGNAL_NONE = 0;
const _SIGNAL_HUP = 1;
const _SIGNAL_INT = 2;
const _SIGNAL_QUIT = 3;
const _SIGNAL_ILL = 4;
const _SIGNAL_TRAP = 5;
const _SIGNAL_ABRT = 6;
const _SIGNAL_BUS = 7;
const _SIGNAL_FPE = 8;
const _SIGNAL_KILL = 9;
const _SIGNAL_USR1 = 10;
const _SIGNAL_SEGV = 11;
const _SIGNAL_USR2 = 12;
const _SIGNAL_PIPE = 13;
const _SIGNAL_ALRM = 14;
const _SIGNAL_TERM = 15;
const _SIGNAL_CHLD = 16;
const _SIGNAL_CONT = 17;
const _SIGNAL_STOP = 18;
const _SIGNAL_TSTP = 19;
const _SIGNAL_TTIN = 20;
const _SIGNAL_TTOU = 21;
const _SIGNAL_URG = 22;
const _SIGNAL_XCPU = 23;
const _SIGNAL_XFSZ = 24;
const _SIGNAL_VTALRM = 25;
const _SIGNAL_PROF = 26;
const _SIGNAL_WINCH = 27;
const _SIGNAL_POLL = 28;
const _SIGNAL_PWR = 29;
const _SIGNAL_SYS = 30;
const _RIFLAGS_RECV_PEEK = 1;
const _RIFLAGS_RECV_WAITALL = 2;
const _ROFLAGS_RECV_DATA_TRUNCATED = 1;
const _SDFLAGS_RD = 1;
const _SDFLAGS_WR = 2;
const PREOPENTYPE_DIR = 0;
function syscall(target) {
  return function(...args) {
    try {
      return target(...args);
    } catch (err) {
      switch (err.name) {
        case "NotFound":
          return ERRNO_NOENT;
        case "PermissionDenied":
          return ERRNO_ACCES;
        case "ConnectionRefused":
          return ERRNO_CONNREFUSED;
        case "ConnectionReset":
          return ERRNO_CONNRESET;
        case "ConnectionAborted":
          return ERRNO_CONNABORTED;
        case "NotConnected":
          return ERRNO_NOTCONN;
        case "AddrInUse":
          return ERRNO_ADDRINUSE;
        case "AddrNotAvailable":
          return ERRNO_ADDRNOTAVAIL;
        case "BrokenPipe":
          return ERRNO_PIPE;
        case "InvalidData":
          return ERRNO_INVAL;
        case "TimedOut":
          return ERRNO_TIMEDOUT;
        case "Interrupted":
          return ERRNO_INTR;
        case "BadResource":
          return ERRNO_BADF;
        case "Busy":
          return ERRNO_BUSY;
        default:
          return ERRNO_INVAL;
      }
    }
  };
}
export default class Context {
  constructor(options) {
    this.args = options.args ? options.args : [];
    this.env = options.env ? options.env : {};
    this.memory = options.memory;
    this.fds = [
      {
        rid: Deno.stdin.rid,
        type: FILETYPE_CHARACTER_DEVICE,
        flags: FDFLAGS_APPEND
      },
      {
        rid: Deno.stdout.rid,
        type: FILETYPE_CHARACTER_DEVICE,
        flags: FDFLAGS_APPEND
      },
      {
        rid: Deno.stderr.rid,
        type: FILETYPE_CHARACTER_DEVICE,
        flags: FDFLAGS_APPEND
      }
    ];
    if (options.preopens) {
      for (const [vpath, path] of Object.entries(options.preopens)) {
        const type = FILETYPE_DIRECTORY;
        const entries = Array.from(Deno.readDirSync(path));
        const entry = {
          type,
          entries,
          path,
          vpath
        };
        this.fds.push(entry);
      }
    }
    this.exports = {
      args_get: syscall((argvOffset, argvBufferOffset) => {
        const args = this.args;
        const text = new TextEncoder();
        const memoryData = new Uint8Array(this.memory.buffer);
        const memoryView = new DataView(this.memory.buffer);
        for (const arg of args) {
          memoryView.setUint32(argvOffset, argvBufferOffset, true);
          argvOffset += 4;
          const data = text.encode(`${arg}\0`);
          memoryData.set(data, argvBufferOffset);
          argvBufferOffset += data.length;
        }
        return ERRNO_SUCCESS;
      }),
      args_sizes_get: syscall((argcOffset, argvBufferSizeOffset) => {
        const args = this.args;
        const text = new TextEncoder();
        const memoryView = new DataView(this.memory.buffer);
        memoryView.setUint32(argcOffset, args.length, true);
        memoryView.setUint32(argvBufferSizeOffset, args.reduce(function(acc, arg) {
          return acc + text.encode(`${arg}\0`).length;
        }, 0), true);
        return ERRNO_SUCCESS;
      }),
      environ_get: syscall((environOffset, environBufferOffset) => {
        const entries = Object.entries(this.env);
        const text = new TextEncoder();
        const memoryData = new Uint8Array(this.memory.buffer);
        const memoryView = new DataView(this.memory.buffer);
        for (const [key, value] of entries) {
          memoryView.setUint32(environOffset, environBufferOffset, true);
          environOffset += 4;
          const data = text.encode(`${key}=${value}\0`);
          memoryData.set(data, environBufferOffset);
          environBufferOffset += data.length;
        }
        return ERRNO_SUCCESS;
      }),
      environ_sizes_get: syscall((environcOffset, environBufferSizeOffset) => {
        const entries = Object.entries(this.env);
        const text = new TextEncoder();
        const memoryView = new DataView(this.memory.buffer);
        memoryView.setUint32(environcOffset, entries.length, true);
        memoryView.setUint32(environBufferSizeOffset, entries.reduce(function(acc, [key, value]) {
          return acc + text.encode(`${key}=${value}\0`).length;
        }, 0), true);
        return ERRNO_SUCCESS;
      }),
      clock_res_get: syscall((id, resolutionOffset) => {
        const memoryView = new DataView(this.memory.buffer);
        switch (id) {
          case CLOCKID_REALTIME: {
            const resolution = BigInt(1e6);
            memoryView.setBigUint64(resolutionOffset, resolution, true);
            break;
          }
          case CLOCKID_MONOTONIC:
          case CLOCKID_PROCESS_CPUTIME_ID:
          case CLOCKID_THREAD_CPUTIME_ID: {
            const resolution = BigInt(1e3);
            memoryView.setBigUint64(resolutionOffset, resolution, true);
            break;
          }
          default:
            return ERRNO_INVAL;
        }
        return ERRNO_SUCCESS;
      }),
      clock_time_get: syscall((id, precision, timeOffset) => {
        const memoryView = new DataView(this.memory.buffer);
        switch (id) {
          case CLOCKID_REALTIME: {
            const time = BigInt(Date.now()) * BigInt(1e6);
            memoryView.setBigUint64(timeOffset, time, true);
            break;
          }
          case CLOCKID_MONOTONIC:
          case CLOCKID_PROCESS_CPUTIME_ID:
          case CLOCKID_THREAD_CPUTIME_ID: {
            const t = performance.now();
            const s = Math.trunc(t);
            const ms = Math.floor((t - s) * 1e3);
            const time = BigInt(s) * BigInt(1e9) + BigInt(ms) * BigInt(1e6);
            memoryView.setBigUint64(timeOffset, time, true);
            break;
          }
          default:
            return ERRNO_INVAL;
        }
        return ERRNO_SUCCESS;
      }),
      fd_advise: syscall((_fd, _offset, _length, _advice) => {
        return ERRNO_NOSYS;
      }),
      fd_allocate: syscall((_fd, _offset, _length) => {
        return ERRNO_NOSYS;
      }),
      fd_close: syscall((fd) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (entry.rid) {
          Deno.close(entry.rid);
        }
        delete this.fds[fd];
        return ERRNO_SUCCESS;
      }),
      fd_datasync: syscall((fd) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        Deno.fdatasyncSync(entry.rid);
        return ERRNO_SUCCESS;
      }),
      fd_fdstat_get: syscall((fd, offset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        const memoryView = new DataView(this.memory.buffer);
        memoryView.setUint8(offset, entry.type);
        memoryView.setUint16(offset + 2, entry.flags, true);
        memoryView.setBigUint64(offset + 8, 0n, true);
        memoryView.setBigUint64(offset + 16, 0n, true);
        return ERRNO_SUCCESS;
      }),
      fd_fdstat_set_flags: syscall((_fd, _flags) => {
        return ERRNO_NOSYS;
      }),
      fd_fdstat_set_rights: syscall((_fd, _rightsBase, _rightsInheriting) => {
        return ERRNO_NOSYS;
      }),
      fd_filestat_get: syscall((fd, offset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        const memoryView = new DataView(this.memory.buffer);
        const info = Deno.fstatSync(entry.rid);
        if (entry.type === void 0) {
          switch (true) {
            case info.isFile:
              entry.type = FILETYPE_REGULAR_FILE;
              break;
            case info.isDirectory:
              entry.type = FILETYPE_DIRECTORY;
              break;
            case info.isSymlink:
              entry.type = FILETYPE_SYMBOLIC_LINK;
              break;
            default:
              entry.type = FILETYPE_UNKNOWN;
              break;
          }
        }
        memoryView.setBigUint64(offset, BigInt(info.dev ? info.dev : 0), true);
        offset += 8;
        memoryView.setBigUint64(offset, BigInt(info.ino ? info.ino : 0), true);
        offset += 8;
        memoryView.setUint8(offset, entry.type);
        offset += 8;
        memoryView.setUint32(offset, Number(info.nlink), true);
        offset += 8;
        memoryView.setBigUint64(offset, BigInt(info.size), true);
        offset += 8;
        memoryView.setBigUint64(offset, BigInt(info.atime ? info.atime.getTime() * 1e6 : 0), true);
        offset += 8;
        memoryView.setBigUint64(offset, BigInt(info.mtime ? info.mtime.getTime() * 1e6 : 0), true);
        offset += 8;
        memoryView.setBigUint64(offset, BigInt(info.birthtime ? info.birthtime.getTime() * 1e6 : 0), true);
        offset += 8;
        return ERRNO_SUCCESS;
      }),
      fd_filestat_set_size: syscall((fd, size) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        Deno.ftruncateSync(entry.rid, Number(size));
        return ERRNO_SUCCESS;
      }),
      fd_filestat_set_times: syscall((fd, atim, mtim, flags) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        if ((flags & FSTFLAGS_ATIM_NOW) == FSTFLAGS_ATIM_NOW) {
          atim = BigInt(Date.now() * 1e6);
        }
        if ((flags & FSTFLAGS_MTIM_NOW) == FSTFLAGS_MTIM_NOW) {
          mtim = BigInt(Date.now() * 1e6);
        }
        Deno.utimeSync(entry.path, Number(atim), Number(mtim));
        return ERRNO_SUCCESS;
      }),
      fd_pread: syscall((fd, iovsOffset, iovsLength, offset, nreadOffset) => {
        const entry = this.fds[fd];
        if (entry == null) {
          return ERRNO_BADF;
        }
        const seek = Deno.seekSync(entry.rid, 0, Deno.SeekMode.Current);
        const memoryView = new DataView(this.memory.buffer);
        let nread = 0;
        for (let i = 0; i < iovsLength; i++) {
          const dataOffset = memoryView.getUint32(iovsOffset, true);
          iovsOffset += 4;
          const dataLength = memoryView.getUint32(iovsOffset, true);
          iovsOffset += 4;
          const data = new Uint8Array(this.memory.buffer, dataOffset, dataLength);
          nread += Deno.readSync(entry.rid, data);
        }
        Deno.seekSync(entry.rid, seek, Deno.SeekMode.Start);
        memoryView.setUint32(nreadOffset, nread, true);
        return ERRNO_SUCCESS;
      }),
      fd_prestat_get: syscall((fd, prestatOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.vpath) {
          return ERRNO_BADF;
        }
        const memoryView = new DataView(this.memory.buffer);
        memoryView.setUint8(prestatOffset, PREOPENTYPE_DIR);
        memoryView.setUint32(prestatOffset + 4, new TextEncoder().encode(entry.vpath).byteLength, true);
        return ERRNO_SUCCESS;
      }),
      fd_prestat_dir_name: syscall((fd, pathOffset, pathLength) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.vpath) {
          return ERRNO_BADF;
        }
        const data = new Uint8Array(this.memory.buffer, pathOffset, pathLength);
        data.set(new TextEncoder().encode(entry.vpath));
        return ERRNO_SUCCESS;
      }),
      fd_pwrite: syscall((fd, iovsOffset, iovsLength, offset, nwrittenOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        const seek = Deno.seekSync(entry.rid, 0, Deno.SeekMode.Current);
        const memoryView = new DataView(this.memory.buffer);
        let nwritten = 0;
        for (let i = 0; i < iovsLength; i++) {
          const dataOffset = memoryView.getUint32(iovsOffset, true);
          iovsOffset += 4;
          const dataLength = memoryView.getUint32(iovsOffset, true);
          iovsOffset += 4;
          const data = new Uint8Array(this.memory.buffer, dataOffset, dataLength);
          nwritten += Deno.writeSync(entry.rid, data);
        }
        Deno.seekSync(entry.rid, seek, Deno.SeekMode.Start);
        memoryView.setUint32(nwrittenOffset, nwritten, true);
        return ERRNO_SUCCESS;
      }),
      fd_read: syscall((fd, iovsOffset, iovsLength, nreadOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        const memoryView = new DataView(this.memory.buffer);
        let nread = 0;
        for (let i = 0; i < iovsLength; i++) {
          const dataOffset = memoryView.getUint32(iovsOffset, true);
          iovsOffset += 4;
          const dataLength = memoryView.getUint32(iovsOffset, true);
          iovsOffset += 4;
          const data = new Uint8Array(this.memory.buffer, dataOffset, dataLength);
          nread += Deno.readSync(entry.rid, data);
        }
        memoryView.setUint32(nreadOffset, nread, true);
        return ERRNO_SUCCESS;
      }),
      fd_readdir: syscall((fd, bufferOffset, bufferLength, cookie, bufferUsedOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        const memoryData = new Uint8Array(this.memory.buffer);
        const memoryView = new DataView(this.memory.buffer);
        let bufferUsed = 0;
        const entries = Array.from(Deno.readDirSync(entry.path));
        for (let i = Number(cookie); i < entries.length; i++) {
          const nameData = new TextEncoder().encode(entries[i].name);
          const entryInfo = Deno.statSync(resolve(entry.path, entries[i].name));
          const entryData = new Uint8Array(24 + nameData.byteLength);
          const entryView = new DataView(entryData.buffer);
          entryView.setBigUint64(0, BigInt(i + 1), true);
          entryView.setBigUint64(8, BigInt(entryInfo.ino ? entryInfo.ino : 0), true);
          entryView.setUint32(16, nameData.byteLength, true);
          let type;
          switch (true) {
            case entries[i].isFile:
              type = FILETYPE_REGULAR_FILE;
              break;
            case entries[i].isDirectory:
              type = FILETYPE_REGULAR_FILE;
              break;
            case entries[i].isSymlink:
              type = FILETYPE_SYMBOLIC_LINK;
              break;
            default:
              type = FILETYPE_REGULAR_FILE;
              break;
          }
          entryView.setUint8(20, type);
          entryData.set(nameData, 24);
          const data = entryData.slice(0, Math.min(entryData.length, bufferLength - bufferUsed));
          memoryData.set(data, bufferOffset + bufferUsed);
          bufferUsed += data.byteLength;
        }
        memoryView.setUint32(bufferUsedOffset, bufferUsed, true);
        return ERRNO_SUCCESS;
      }),
      fd_renumber: syscall((fd, to) => {
        if (!this.fds[fd]) {
          return ERRNO_BADF;
        }
        if (!this.fds[to]) {
          return ERRNO_BADF;
        }
        if (this.fds[to].rid) {
          Deno.close(this.fds[to].rid);
        }
        this.fds[to] = this.fds[fd];
        delete this.fds[fd];
        return ERRNO_SUCCESS;
      }),
      fd_seek: syscall((fd, offset, whence, newOffsetOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        const memoryView = new DataView(this.memory.buffer);
        const newOffset = Deno.seekSync(entry.rid, Number(offset), whence);
        memoryView.setBigUint64(newOffsetOffset, BigInt(newOffset), true);
        return ERRNO_SUCCESS;
      }),
      fd_sync: syscall((fd) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        Deno.fsyncSync(entry.rid);
        return ERRNO_SUCCESS;
      }),
      fd_tell: syscall((fd, offsetOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        const memoryView = new DataView(this.memory.buffer);
        const offset = Deno.seekSync(entry.rid, 0, Deno.SeekMode.Current);
        memoryView.setBigUint64(offsetOffset, BigInt(offset), true);
        return ERRNO_SUCCESS;
      }),
      fd_write: syscall((fd, iovsOffset, iovsLength, nwrittenOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        const memoryView = new DataView(this.memory.buffer);
        let nwritten = 0;
        for (let i = 0; i < iovsLength; i++) {
          const dataOffset = memoryView.getUint32(iovsOffset, true);
          iovsOffset += 4;
          const dataLength = memoryView.getUint32(iovsOffset, true);
          iovsOffset += 4;
          const data = new Uint8Array(this.memory.buffer, dataOffset, dataLength);
          nwritten += Deno.writeSync(entry.rid, data);
        }
        memoryView.setUint32(nwrittenOffset, nwritten, true);
        return ERRNO_SUCCESS;
      }),
      path_create_directory: syscall((fd, pathOffset, pathLength) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const data = new Uint8Array(this.memory.buffer, pathOffset, pathLength);
        const path = resolve(entry.path, text.decode(data));
        Deno.mkdirSync(path);
        return ERRNO_SUCCESS;
      }),
      path_filestat_get: syscall((fd, flags, pathOffset, pathLength, bufferOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const data = new Uint8Array(this.memory.buffer, pathOffset, pathLength);
        const path = resolve(entry.path, text.decode(data));
        const memoryView = new DataView(this.memory.buffer);
        const info = (flags & LOOKUPFLAGS_SYMLINK_FOLLOW) != 0 ? Deno.statSync(path) : Deno.lstatSync(path);
        memoryView.setBigUint64(bufferOffset, BigInt(info.dev ? info.dev : 0), true);
        bufferOffset += 8;
        memoryView.setBigUint64(bufferOffset, BigInt(info.ino ? info.ino : 0), true);
        bufferOffset += 8;
        switch (true) {
          case info.isFile:
            memoryView.setUint8(bufferOffset, FILETYPE_REGULAR_FILE);
            bufferOffset += 8;
            break;
          case info.isDirectory:
            memoryView.setUint8(bufferOffset, FILETYPE_DIRECTORY);
            bufferOffset += 8;
            break;
          case info.isSymlink:
            memoryView.setUint8(bufferOffset, FILETYPE_SYMBOLIC_LINK);
            bufferOffset += 8;
            break;
          default:
            memoryView.setUint8(bufferOffset, FILETYPE_UNKNOWN);
            bufferOffset += 8;
            break;
        }
        memoryView.setUint32(bufferOffset, Number(info.nlink), true);
        bufferOffset += 8;
        memoryView.setBigUint64(bufferOffset, BigInt(info.size), true);
        bufferOffset += 8;
        memoryView.setBigUint64(bufferOffset, BigInt(info.atime ? info.atime.getTime() * 1e6 : 0), true);
        bufferOffset += 8;
        memoryView.setBigUint64(bufferOffset, BigInt(info.mtime ? info.mtime.getTime() * 1e6 : 0), true);
        bufferOffset += 8;
        memoryView.setBigUint64(bufferOffset, BigInt(info.birthtime ? info.birthtime.getTime() * 1e6 : 0), true);
        bufferOffset += 8;
        return ERRNO_SUCCESS;
      }),
      path_filestat_set_times: syscall((fd, flags, pathOffset, pathLength, atim, mtim, fstflags) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const data = new Uint8Array(this.memory.buffer, pathOffset, pathLength);
        const path = resolve(entry.path, text.decode(data));
        if ((fstflags & FSTFLAGS_ATIM_NOW) == FSTFLAGS_ATIM_NOW) {
          atim = BigInt(Date.now()) * BigInt(1e6);
        }
        if ((fstflags & FSTFLAGS_MTIM_NOW) == FSTFLAGS_MTIM_NOW) {
          mtim = BigInt(Date.now()) * BigInt(1e6);
        }
        Deno.utimeSync(path, Number(atim), Number(mtim));
        return ERRNO_SUCCESS;
      }),
      path_link: syscall((oldFd, oldFlags, oldPathOffset, oldPathLength, newFd, newPathOffset, newPathLength) => {
        const oldEntry = this.fds[oldFd];
        const newEntry = this.fds[newFd];
        if (!oldEntry || !newEntry) {
          return ERRNO_BADF;
        }
        if (!oldEntry.path || !newEntry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const oldData = new Uint8Array(this.memory.buffer, oldPathOffset, oldPathLength);
        const oldPath = resolve(oldEntry.path, text.decode(oldData));
        const newData = new Uint8Array(this.memory.buffer, newPathOffset, newPathLength);
        const newPath = resolve(newEntry.path, text.decode(newData));
        Deno.linkSync(oldPath, newPath);
        return ERRNO_SUCCESS;
      }),
      path_open: syscall((fd, dirflags, pathOffset, pathLength, oflags, rightsBase, rightsInheriting, fdflags, openedFdOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const data = new Uint8Array(this.memory.buffer, pathOffset, pathLength);
        const path = resolve(entry.path, text.decode(data));
        if ((oflags & OFLAGS_DIRECTORY) !== 0) {
          const entries = Array.from(Deno.readDirSync(path));
          const openedFd2 = this.fds.push({
            flags: fdflags,
            path,
            entries
          }) - 1;
          const memoryView2 = new DataView(this.memory.buffer);
          memoryView2.setUint32(openedFdOffset, openedFd2, true);
          return ERRNO_SUCCESS;
        }
        const options2 = {
          read: false,
          write: false,
          append: false,
          truncate: false,
          create: false,
          createNew: false
        };
        if ((oflags & OFLAGS_CREAT) !== 0) {
          options2.create = true;
          options2.write = true;
        }
        if ((oflags & OFLAGS_EXCL) !== 0) {
          options2.createNew = true;
        }
        if ((oflags & OFLAGS_TRUNC) !== 0) {
          options2.truncate = true;
          options2.write = true;
        }
        const read = RIGHTS_FD_READ | RIGHTS_FD_READDIR;
        if ((rightsBase & read) != 0n) {
          options2.read = true;
        }
        const write = RIGHTS_FD_DATASYNC | RIGHTS_FD_WRITE | RIGHTS_FD_ALLOCATE | RIGHTS_FD_FILESTAT_SET_SIZE;
        if ((rightsBase & write) != 0n) {
          options2.write = true;
        }
        if ((fdflags & FDFLAGS_APPEND) != 0) {
          options2.append = true;
        }
        if ((fdflags & FDFLAGS_DSYNC) != 0) {
        }
        if ((fdflags & FDFLAGS_NONBLOCK) != 0) {
        }
        if ((fdflags & FDFLAGS_RSYNC) != 0) {
        }
        if ((fdflags & FDFLAGS_SYNC) != 0) {
        }
        if (!options2.read && !options2.write && !options2.truncate) {
          options2.read = true;
        }
        const {rid} = Deno.openSync(path, options2);
        const openedFd = this.fds.push({
          rid,
          flags: fdflags,
          path
        }) - 1;
        const memoryView = new DataView(this.memory.buffer);
        memoryView.setUint32(openedFdOffset, openedFd, true);
        return ERRNO_SUCCESS;
      }),
      path_readlink: syscall((fd, pathOffset, pathLength, bufferOffset, bufferLength, bufferUsedOffset) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        const memoryData = new Uint8Array(this.memory.buffer);
        const memoryView = new DataView(this.memory.buffer);
        const pathData = new Uint8Array(this.memory.buffer, pathOffset, pathLength);
        const path = resolve(entry.path, new TextDecoder().decode(pathData));
        const link = Deno.readLinkSync(path);
        const linkData = new TextEncoder().encode(link);
        memoryData.set(new Uint8Array(linkData, 0, bufferLength), bufferOffset);
        const bufferUsed = Math.min(linkData.byteLength, bufferLength);
        memoryView.setUint32(bufferUsedOffset, bufferUsed, true);
        return ERRNO_SUCCESS;
      }),
      path_remove_directory: syscall((fd, pathOffset, pathLength) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const data = new Uint8Array(this.memory.buffer, pathOffset, pathLength);
        const path = resolve(entry.path, text.decode(data));
        if (!Deno.statSync(path).isDirectory) {
          return ERRNO_NOTDIR;
        }
        Deno.removeSync(path);
        return ERRNO_SUCCESS;
      }),
      path_rename: syscall((fd, oldPathOffset, oldPathLength, newFd, newPathOffset, newPathLength) => {
        const oldEntry = this.fds[fd];
        const newEntry = this.fds[newFd];
        if (!oldEntry || !newEntry) {
          return ERRNO_BADF;
        }
        if (!oldEntry.path || !newEntry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const oldData = new Uint8Array(this.memory.buffer, oldPathOffset, oldPathLength);
        const oldPath = resolve(oldEntry.path, text.decode(oldData));
        const newData = new Uint8Array(this.memory.buffer, newPathOffset, newPathLength);
        const newPath = resolve(newEntry.path, text.decode(newData));
        Deno.renameSync(oldPath, newPath);
        return ERRNO_SUCCESS;
      }),
      path_symlink: syscall((oldPathOffset, oldPathLength, fd, newPathOffset, newPathLength) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const oldData = new Uint8Array(this.memory.buffer, oldPathOffset, oldPathLength);
        const oldPath = text.decode(oldData);
        const newData = new Uint8Array(this.memory.buffer, newPathOffset, newPathLength);
        const newPath = resolve(entry.path, text.decode(newData));
        Deno.symlinkSync(oldPath, newPath);
        return ERRNO_SUCCESS;
      }),
      path_unlink_file: syscall((fd, pathOffset, pathLength) => {
        const entry = this.fds[fd];
        if (!entry) {
          return ERRNO_BADF;
        }
        if (!entry.path) {
          return ERRNO_INVAL;
        }
        const text = new TextDecoder();
        const data = new Uint8Array(this.memory.buffer, pathOffset, pathLength);
        const path = resolve(entry.path, text.decode(data));
        Deno.removeSync(path);
        return ERRNO_SUCCESS;
      }),
      poll_oneoff: syscall((_inOffset, _outOffset, _nsubscriptions, _neventsOffset) => {
        return ERRNO_NOSYS;
      }),
      proc_exit: syscall((rval) => {
        Deno.exit(rval);
      }),
      proc_raise: syscall((_sig) => {
        return ERRNO_NOSYS;
      }),
      sched_yield: syscall(() => {
        return ERRNO_SUCCESS;
      }),
      random_get: syscall((bufferOffset, bufferLength) => {
        const buffer = new Uint8Array(this.memory.buffer, bufferOffset, bufferLength);
        crypto.getRandomValues(buffer);
        return ERRNO_SUCCESS;
      }),
      sock_recv: syscall((_fd, _riDataOffset, _riDataLength, _riFlags, _roDataLengthOffset, _roFlagsOffset) => {
        return ERRNO_NOSYS;
      }),
      sock_send: syscall((_fd, _siDataOffset, _siDataLength, _siFlags, _soDataLengthOffset) => {
        return ERRNO_NOSYS;
      }),
      sock_shutdown: syscall((_fd, _how) => {
        return ERRNO_NOSYS;
      })
    };
  }
}
