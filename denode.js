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

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// The only purpose of this file is to set up "globalThis.__bootstrap" namespace,
// that is used by scripts in this directory to reference exports between
// the files.

// This namespace is removed during runtime bootstrapping process.

globalThis.__bootstrap = globalThis.__bootstrap || {};

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
      testDef.fn = assertOps(testDef.fn);
    }

    if (testDef.sanitizeResources) {
      testDef.fn = assertResources(testDef.fn);
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

console.log(globalThis);
