var event_target = require("internal/event_target");
const { Event, EventTarget } = event_target;

globalThis.Deno = {
  core: {
    getProxyDetails: () => null, //02_console
    getErrorClass: () => null, // 10_dispatch_minimal
    dispatchByName: () => null, //10_dispatch_minimal
    jsonOpSync: (name, args, res) =>
      console.log("jsonOpSync", opSync[name], name, args, res),
    jsonOpAsync: (name, args, res) =>
      console.log("jsonOpAsync", opAsync[name], name, args, res),
    close: () => null, //27_websocket
    resources: () => null, //40_testing
  },
};

globalThis.Event = Event;
globalThis.EventTarget = EventTarget;

const opSync = {
  op_apply_source_map: "location",
  op_chdir: "{directory }",
  op_chmod_sync: "{path: pathFromURL(path), mode }",
  op_chown_sync: "{path: pathFromURL(path), uid, gid }",
  op_console_size: "{rid }",
  op_cwd: null,
  op_delete_env: "{key }",
  op_env: null,
  op_exec_path: null,
  op_exit: "{code }",
  op_fdatasync_sync: "{rid }",
  op_format_diagnostic: "diagnostics",
  op_fs_events_open: "{recursive, paths }",
  op_fsync_sync: "{rid }",
  op_ftruncate_sync: "{rid, len: coerceLen(len) }",
  op_get_env: "{ key })[0'",
  op_get_random_values: "{}, ui8",
  op_global_timer_start: "{timeout }",
  op_global_timer_stop: null,
  op_host_post_message: "{id }, data",
  op_host_terminate_worker: "{id }",
  op_hostname: null,
  op_isatty: "{rid }",
  op_kill: "{pid, signo }",
  op_link_sync: "{oldpath, newpath }",
  op_listen: "args",
  op_listen_tl: "args",
  op_loadavg: null,
  op_main_module: null,
  op_make_temp_dir_sync: "options",
  op_make_temp_file_sync: "options",
  op_metrics: null,
  op_mkdir_sync: "mkdirArgs(path, options)",
  op_now: null,
  op_open_plugin: "{filename }",
  op_os_release: null,
  op_read_link_sync: "{path }",
  op_realpath_sync: "{path }",
  op_rename_sync: "{oldpath, newpath }",
  op_run: "request",
  op_seek_sync: "{rid, offset, whence }",
  op_set_env: "{key, value }",
  op_set_raw: "{rid, mode }",
  op_shutdown: "{rid, how }",
  op_signal_bind: "{signo }",
  op_signal_unbind: "{rid }",
  op_sleep_sync: "{millis }",
  op_start: null,
  op_symlink_sync: "{oldpath, newpath, options }",
  op_system_memory_info: null,
  op_truncate_sync: "{path, len: coerceLen(len) }",
  op_umask: "{mask }",
  op_worker_close: null,
  op_worker_post_message: "{}, data",
};

const opAsync = {
  op_accept: "{ rid, transport }",
  op_accept_tls: "{ rid }",
  op_chmod_async: "{ path: pathFromURL(path), mode }",
  op_compile: "request",
  op_connect: "args",
  op_connect_tls: "args",
  op_datagram_send: "args, zeroCopy",
  op_fdatasync_async: "{ rid }",
  op_fstat_async: "{ rid }",
  op_fsync_async: "{ rid }",
  op_ftruncate_async: "{ rid, len: coerceLen(len) }",
  op_global_timer: null,
  op_host_get_message: "{ id }",
  op_link_async: "{ oldpath, newpath }",
  op_make_temp_dir_async: " options",
  op_make_temp_file_async: " options",
  op_mkdir_async: " mkdirArgs(path, options)",
  op_read_link_async: "{ path }",
  op_realpath_async: "{ path }",
  op_rename_async: "{ oldpath, newpath }",
  op_run_status: "{ rid }",
  op_seek_async: "{ rid, offset, whence }",
  op_signal_poll: "{ rid }",
  op_start_tls: "{ args",
  op_symlink_async: "{ oldpath, newpath, options }",
  op_transpile: "request",
  op_truncate_async: "{ path, len: coerceLen(len) }",
};
