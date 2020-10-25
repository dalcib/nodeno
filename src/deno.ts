import fs from "fs";
import os from "os";
import {
  remove,
  removeSync,
  make_temp_dir_async,
  make_temp_dir_sync,
  make_temp_file_sync,
  make_temp_file_async,
  readDirSync,
  readDir,
  start,
  stat,
  statSync,
  isTTY,
  metrics,
  getOpenFlag,
} from "./utils";
import { run, seek, seekSync, permissions } from "./denode/deno";
import { TextDecoder, TextEncoder } from "util";

//@ts-ignore
globalThis.__bootstrap = globalThis.__bootstrap || {};

const unsupported = () => {
  throw new Error("unsupported");
};

function convUint8ToNum(ui8: Uint8Array) {
  const header = ui8.subarray(0, 12);
  const buf32 = new Int32Array(header.buffer, header.byteOffset, header.byteLength / 4);
  return buf32[1];
}

function convNumUint8(ui8: Uint8Array, res: number) {
  // const scratch32 = new Int32Array(3);
  //const scratchBytes = new Uint8Array(scratch32.buffer, scratch32.byteOffset, scratch32.byteLength);

  const buf32 = new Int32Array(ui8.buffer, ui8.byteOffset, ui8.byteLength / 4);
  buf32[2] = res;
  return ui8;
}

export const opsCache = {
  //Sync
  op_apply_source_map: (location: string) => location,
  op_chdir: process.chdir,
  op_chmod_sync: fs.chmodSync,
  op_chown_sync: fs.chownSync,
  op_console_size: (/* rid */) => process.stdout.columns,
  op_copy_file_sync: fs.copyFileSync,
  op_create_worker: unsupported,
  op_cwd: process.cwd,
  op_domain_to_ascii: (domain: any, beStrict: any) => {}, //
  op_delete_env: (key: string) => delete process.env[key],
  op_env: () => process.env,
  op_exec_path: (): string => process.execPath,
  op_exit: process.exit,
  op_fdatasync_sync: fs.fdatasyncSync,
  op_format_diagnostic: unsupported,
  op_fs_events_open: unsupported,
  op_fs_events_poll: unsupported,
  op_fsync_sync: fs.fsyncSync,
  op_ftruncate_sync: fs.ftruncateSync,
  op_futime_sync: fs.futimesSync,
  op_get_env: (key: string) => process.env[key],
  //@ts-ignore
  op_get_random_values: (ui8: any) => crypto.randomFillSync(ui8), //"{}, ui8",
  op_global_timer_start: unsupported,
  op_global_timer_stop: unsupported,
  op_host_post_message: unsupported,
  op_host_terminate_worker: unsupported,
  op_hostname: os.hostname,
  op_isatty: isTTY, //(rid: number) => tty.isatty(rid),
  op_kill: process.kill,
  op_link_sync: fs.linkSync,
  op_listen: unsupported,
  op_listen_tl: unsupported,
  op_loadavg: os.loadavg,
  op_main_module: unsupported,
  op_make_temp_dir_sync: make_temp_dir_sync,
  op_make_temp_file_sync: make_temp_file_sync,
  op_metrics: metrics, //null,
  op_mkdir_sync: fs.mkdirSync,
  op_now: () => {
    const time = process.hrtime();
    return { seconds: time[0], subsecNanos: time[1] };
  },
  op_open_plugin: unsupported,
  op_open_sync: (path: string, options: object) => fs.openSync(path, getOpenFlag(options)),
  op_os_release: os.release,
  op_query_permission: permissions.query, // (desc)
  op_request_permission: permissions.query, //(desc)
  op_read: (fd: Uint8Array, buffer: Uint8Array) => {
    const res = fs.readSync(convUint8ToNum(fd), buffer);
    return convNumUint8(fd, res);
  },
  op_read_dir_sync: readDirSync,
  op_read_link_sync: fs.readlinkSync,
  op_realpath_sync: fs.realpathSync,
  op_remove_sync: removeSync,
  op_rename_sync: fs.renameSync,
  op_run: run,
  op_seek_sync: seekSync,
  op_set_env: (key: string, value: string | undefined) => {
    process.env[key] = value;
  },
  op_set_raw: (rid: number, mode: boolean) => process.stdin.setRawMode(mode),
  op_shutdown: unsupported,
  op_signal_bind: unsupported,
  op_signal_unbind: unsupported,
  op_sleep_sync: unsupported,
  op_start: start,
  op_stat_sync: statSync,
  op_symlink_sync: fs.symlinkSync,
  op_system_memory_info: unsupported,
  op_truncate_sync: fs.truncateSync,
  op_umask: process.umask,
  op_utime_sync: fs.utimesSync,
  op_worker_close: unsupported,
  op_worker_post_message: unsupported,
  //Async
  op_accept: unsupported,
  op_accept_tls: unsupported,
  op_chmod_async: fs.promises.chmod,
  op_chown_async: fs.promises.chown,
  op_close: fs.closeSync,
  op_compile: unsupported,
  op_connect: unsupported,
  op_connect_tls: unsupported,
  op_copy_file_async: fs.promises.copyFile,
  op_datagram_receive: (rid: any, transport: any) => {}, //, zeroCopy,
  op_datagram_send: unsupported,
  op_fdatasync_async: fs.promises.fdatasync,
  op_fstat_async: fs.fstat,
  op_fsync_async: fs.fsync,
  op_ftruncate_async: fs.ftruncate,
  op_futime_async: fs.futimes,
  op_global_timer: unsupported,
  op_host_get_message: unsupported,
  op_link_async: fs.promises.link,
  op_mkdir_async: fs.promises.mkdir,
  op_make_temp_dir_async: make_temp_dir_async,
  op_make_temp_file_async: make_temp_file_async,
  op_open_async: (path: string, options: object) => fs.promises.open(path, getOpenFlag(options)),
  op_read_dir_async: readDir,
  op_read_link_async: fs.promises.readlink,
  op_realpath_async: fs.promises.realpath,
  op_remove_async: remove,
  op_rename_async: fs.promises.rename,
  op_run_status: unsupported,
  op_seek_async: seek, //"{ rid, offset, whence }",
  op_signal_poll: unsupported,
  op_start_tls: unsupported,
  op_stat_async: stat,
  op_symlink_async: fs.promises.symlink,
  op_transpile: unsupported,
  op_truncate_async: fs.promises.truncate,
  op_utime_async: fs.promises.utimes,
  op_write: (fd: Uint8Array, buffer: Uint8Array) => {
    const res = fs.writeSync(convUint8ToNum(fd), buffer);
    return convNumUint8(fd, res);
  },
  op_ws_next_event: unsupported,
  op_ws_close: unsupported,
  op_ws_create: unsupported,
  op_ws_send: unsupported,
};

const Deno = {
  core: {
    encode: (text: string) => {
      const encoder = new TextEncoder();
      return encoder.encode(text);
    },
    decode: (bytes: Uint8Array) => {
      const decoder = new TextDecoder();
      return decoder.decode(bytes);
    },
    setMacrotaskCallback: () => {},
    print: (text: string) => {
      process.stdout.write(text);
    },
    getProxyDetails: () => null,
    send: (opName: any, args: object, ...zeroCopy: any) => {
      let objArgs: unknown;
      if (opName === 0) return opsCache;
      if (args) {
        if (Object.prototype.toString.call(args) !== "[object Object]") {
          objArgs = { key: args } as object;
        } else {
          objArgs = args as object;
        }
      }
      /* function testArgs() {
        if (arguments && arguments[0] && !arguments[0].lineNumber) {
          console.log("TestArgs", args, objArgs, "Arguments:", ...arguments);
        }
      } 
      //@ts-ignore
      testArgs(...Object.values(objArgs), ...zeroCopy);
      */
      let res;
      if (zeroCopy) {
        res = opName(...Object.values(objArgs), ...zeroCopy);
      } else {
        res = opName(...Object.values(objArgs));
      }
      return res;
    },
    recv: () => {},
  },
};

globalThis.Deno = Deno;
