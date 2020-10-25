/* eslint-disable no-unused-expressions */
import fs from "fs";
import os from "os";
import path from "path";

interface MakeTempDirOptions {
  dir?: string;
  prefix?: string;
  suffix?: string;
}

export const make_temp_dir_async = (options?: MakeTempDirOptions): Promise<string> => {
  if (!options) {
    return fs.promises.mkdtemp("");
  } else {
    const ret = tempDir(options);
    return new Promise<string>((resolve, reject) => {
      fs.mkdir(ret, { recursive: true }, (err) => {
        err ? reject(err) : resolve(ret);
      });
    });
  }
};

export const make_temp_file_async = (options?: MakeTempDirOptions): Promise<string> => {
  const ret = tempDir(options);
  return new Promise<string>((resolve, reject) => {
    fs.writeFile(ret, "", (err) => {
      err ? reject(err) : resolve(ret);
    });
  });
};

export const make_temp_dir_sync = (options: MakeTempDirOptions): string => {
  if (!options) {
    return fs.mkdtempSync("");
  } else {
    const ret = tempDir(options);
    if (!fs.existsSync(ret)) {
      fs.mkdirSync(ret);
    }
    return ret;
  }
};

export const make_temp_file_sync = (options: MakeTempDirOptions): string => {
  const ret = tempDir(options);
  if (!fs.existsSync(ret)) {
    fs.writeFileSync(ret, "");
  }
  return ret;
};

function tempDir(options: MakeTempDirOptions = {}) {
  const dir = options.dir || os.tmpdir();
  const prefix = options.prefix || "";
  const suffix = options.suffix || "";
  const rand = Math.random() * 100000;
  return path.join(dir, `${prefix}${rand}${suffix}`);
}

export interface RemoveOption {
  recursive?: boolean;
}

export function removeSync(path: string, recursive: boolean): void {
  // TODO: recursive
  const stats = fs.statSync(path);
  if (stats.isDirectory()) {
    fs.rmdirSync(path, { recursive });
  } else {
    // TODO: recursive
    fs.unlinkSync(path);
  }
}

export async function remove(path: string, recursive: boolean): Promise<void> {
  const stats = await fs.promises.stat(path);
  if (stats.isDirectory()) {
    await fs.promises.rmdir(path, { recursive });
  } else {
    // TODO: recursive
    await fs.promises.unlink(path);
  }
}

export function start() {
  return {
    args: process.argv,
    cwd: process.cwd(),
    debugFlag: false,
    denoVersion: "1.4.6",
    noColor: false,
    pid: process.pid,
    ppid: process.pid,
    target: os.arch() + "-vendor-" + os.platform() + "-env",
    tsVersion: process.version.slice(1),
    unstableFlag: true,
    v8Version: process.versions.v8,
    versionFlag: false,
  };
}

export interface FileInfo {
  //len: number;
  size: number;
  mtime: number | Date | null;
  atime: number | Date | null;
  birthtime: number | Date | null;
  mode: number | null;
  //name: string | null;
  isFile(): boolean;
  isDirectory(): boolean;
  isSymlink(): boolean;
  dev: null;
  ino: null;
  nlink: null;
  uid: null;
  gid: null;
  rdev: null;
  blksize: null;
  blocks: null;
}

function statToFileInfo(filename: string, stats: fs.Stats): FileInfo {
  /*   var a = {
    atime: stats.atimeMs,
    birthtime: stats.ctimeMs,
    len: stats.size,
    mode: stats.mode,
    mtime: stats.mtimeMs,
    name: filename, // basename?
    isDirectory(): boolean {
      return stats.isDirectory();
    },
    isFile(): boolean {
      return stats.isFile();
    },
    isSymlink(): boolean {
      return stats.isSymbolicLink();
    },
  }; */
  return {
    isFile: stats.isFile,
    isDirectory: stats.isDirectory,
    isSymlink: stats.isSymbolicLink,
    size: stats.size,
    mtime: stats.mtimeMs != null ? new Date(stats.mtimeMs) : null,
    atime: stats.atimeMs != null ? new Date(stats.atimeMs) : null,
    birthtime: stats.ctimeMs != null ? new Date(stats.ctimeMs) : null,
    // Only non-null if on Unix
    dev: null,
    ino: null,
    mode: null,
    nlink: null,
    uid: null,
    gid: null,
    rdev: null,
    blksize: null,
    blocks: null,
  };
}

export async function stat(filename: string): Promise<FileInfo> {
  const stats = await fs.promises.stat(filename);
  return statToFileInfo(filename, stats);
}

export function statSync(filename: string): FileInfo {
  const stats = fs.statSync(filename);
  const res = statToFileInfo(filename, stats);
  console.log(filename, "asdfasdfad", res);
  return res;
}

export function readDirSync(path: string): FileInfo[] {
  return fs.readdirSync(path).map(statSync);
}

export async function readDir(path: string): Promise<FileInfo[]> {
  const arr = await fs.promises.readdir(path);
  return Promise.all(arr.map(stat));
}

export function isTTY(): {
  stdin: boolean;
  stdout: boolean;
  stderr: boolean;
} {
  return {
    stdin: process.stdin.isTTY,
    stdout: process.stdout.isTTY,
    stderr: process.stderr.isTTY,
  };
}

export function metrics() {
  return {
    opsCompleted: 0,
    opsDispatched: 0,
    bytesReceived: 0,
    bytesSentControl: 0,
    bytesSentData: 0,
  };
}

export function getOpenOptions(flag: string | undefined): Deno.OpenOptions {
  if (!flag) {
    return { create: true, append: true };
  }

  let openOptions: Deno.OpenOptions;
  switch (flag) {
    case "a": {
      // 'a': Open file for appending. The file is created if it does not exist.
      openOptions = { create: true, append: true };
      break;
    }
    case "ax": {
      // 'ax': Like 'a' but fails if the path exists.
      openOptions = { createNew: true, write: true, append: true };
      break;
    }
    case "a+": {
      // 'a+': Open file for reading and appending. The file is created if it does not exist.
      openOptions = { read: true, create: true, append: true };
      break;
    }
    case "ax+": {
      // 'ax+': Like 'a+' but fails if the path exists.
      openOptions = { read: true, createNew: true, append: true };
      break;
    }
    case "r": {
      // 'r': Open file for reading. An exception occurs if the file does not exist.
      openOptions = { read: true };
      break;
    }
    case "r+": {
      // 'r+': Open file for reading and writing. An exception occurs if the file does not exist.
      openOptions = { read: true, write: true };
      break;
    }
    case "w": {
      // 'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
      openOptions = { create: true, write: true, truncate: true };
      break;
    }
    case "wx": {
      // 'wx': Like 'w' but fails if the path exists.
      openOptions = { createNew: true, write: true };
      break;
    }
    case "w+": {
      // 'w+': Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
      openOptions = { create: true, write: true, truncate: true, read: true };
      break;
    }
    case "wx+": {
      // 'wx+': Like 'w+' but fails if the path exists.
      openOptions = { createNew: true, write: true, read: true };
      break;
    }
    case "as": {
      // 'as': Open file for appending in synchronous mode. The file is created if it does not exist.
      openOptions = { create: true, append: true };
      break;
    }
    case "as+": {
      // 'as+': Open file for reading and appending in synchronous mode. The file is created if it does not exist.
      openOptions = { create: true, read: true, append: true };
      break;
    }
    case "rs+": {
      // 'rs+': Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.
      openOptions = { create: true, read: true, write: true };
      break;
    }
    default: {
      throw new Error(`Unrecognized file system flag: ${flag}`);
    }
  }

  return openOptions;
}

export interface OpenOptions {
  /** Sets the option for read access. This option, when `true`, means that the
   * file should be read-able if opened. */
  read?: boolean;
  /** Sets the option for write access. This option, when `true`, means that
   * the file should be write-able if opened. If the file already exists,
   * any write calls on it will overwrite its contents, by default without
   * truncating it. */
  write?: boolean;
  /**Sets the option for the append mode. This option, when `true`, means that
   * writes will append to a file instead of overwriting previous contents.
   * Note that setting `{ write: true, append: true }` has the same effect as
   * setting only `{ append: true }`. */
  append?: boolean;
  /** Sets the option for truncating a previous file. If a file is
   * successfully opened with this option set it will truncate the file to `0`
   * size if it already exists. The file must be opened with write access
   * for truncate to work. */
  truncate?: boolean;
  /** Sets the option to allow creating a new file, if one doesn't already
   * exist at the specified path. Requires write or append access to be
   * used. */
  create?: boolean;
  /** Defaults to `false`. If set to `true`, no file, directory, or symlink is
   * allowed to exist at the target location. Requires write or append
   * access to be used. When createNew is set to `true`, create and truncate
   * are ignored. */
  createNew?: boolean;
  /** Permissions to use if creating the file (defaults to `0o666`, before
   * the process's umask).
   * Ignored on Windows. */
  mode?: number;
}

export type OpenMode =
  | "r"
  /** Read-write. Start at beginning of file. */
  | "r+"
  /** Write-only. Opens and truncates existing file or creates new one for
   * writing only.
   */
  | "w"
  /** Read-write. Opens and truncates existing file or creates new one for
   * writing and reading.
   */
  | "w+"
  /** Write-only. Opens existing file or creates new one. Each write appends
   * content to the end of file.
   */
  | "a"
  /** Read-write. Behaves like "a" and allows to read from file. */
  | "a+"
  /** Write-only. Exclusive create - creates new file only if one doesn't exist
   * already.
   */
  | "ax"
  | "ax+"
  | "wx"
  | "wx+"
  | "x"
  | "as"
  | "as+"
  | "rs+"
  /** Read-write. Behaves like `x` and allows to read from file. */
  | "x+";

export function getOpenFlag(options: OpenOptions) {
  const flag: OpenMode | undefined =
    options.create && options.append
      ? "a"
      : options.create && options.append && options.createNew
      ? "ax"
      : options.create && options.append && options.read
      ? "a+"
      : options.createNew && options.append && options.read
      ? "ax+"
      : options.read
      ? "r"
      : options.read && options.write
      ? "r+"
      : options.create && options.write && options.truncate
      ? "w"
      : options.createNew && options.write
      ? "wx"
      : options.create && options.write && options.read
      ? "w+"
      : options.createNew && options.write && options.read
      ? "wx+"
      : options.create && options.append
      ? "as"
      : options.create && options.append && options.read
      ? "as+"
      : options.create && options.write && options.read
      ? "rs+"
      : undefined;
  if (!flag) throw new Error(`Unrecognized file system flag: ${options}`);
  return flag;
}
