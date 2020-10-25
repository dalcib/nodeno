export function convertFileInfoToStats(origin) {
  return {
    dev: origin.dev,
    ino: origin.ino,
    mode: origin.mode,
    nlink: origin.nlink,
    uid: origin.uid,
    gid: origin.gid,
    rdev: origin.rdev,
    size: origin.size,
    blksize: origin.blksize,
    blocks: origin.blocks,
    mtime: origin.mtime,
    atime: origin.atime,
    birthtime: origin.birthtime,
    mtimeMs: origin.mtime?.getTime() || null,
    atimeMs: origin.atime?.getTime() || null,
    birthtimeMs: origin.birthtime?.getTime() || null,
    isFile: () => origin.isFile,
    isDirectory: () => origin.isDirectory,
    isSymbolicLink: () => origin.isSymlink,
    isBlockDevice: () => false,
    isFIFO: () => false,
    isCharacterDevice: () => false,
    isSocket: () => false,
    ctime: origin.mtime,
    ctimeMs: origin.mtime?.getTime() || null
  };
}
export function convertFileInfoToBigIntStats(origin) {
  return {
    dev: BigInt(origin.dev),
    ino: BigInt(origin.ino),
    mode: BigInt(origin.mode),
    nlink: BigInt(origin.nlink),
    uid: BigInt(origin.uid),
    gid: BigInt(origin.gid),
    rdev: BigInt(origin.rdev),
    size: BigInt(origin.size),
    blksize: BigInt(origin.blksize),
    blocks: BigInt(origin.blocks),
    mtime: origin.mtime,
    atime: origin.atime,
    birthtime: origin.birthtime,
    mtimeMs: origin.mtime ? BigInt(origin.mtime.getTime()) : null,
    atimeMs: origin.atime ? BigInt(origin.atime.getTime()) : null,
    birthtimeMs: origin.birthtime ? BigInt(origin.birthtime.getTime()) : null,
    mtimeNs: origin.mtime ? BigInt(origin.mtime.getTime()) * 1000000n : null,
    atimeNs: origin.atime ? BigInt(origin.atime.getTime()) * 1000000n : null,
    birthtimeNs: origin.birthtime ? BigInt(origin.birthtime.getTime()) * 1000000n : null,
    isFile: () => origin.isFile,
    isDirectory: () => origin.isDirectory,
    isSymbolicLink: () => origin.isSymlink,
    isBlockDevice: () => false,
    isFIFO: () => false,
    isCharacterDevice: () => false,
    isSocket: () => false,
    ctime: origin.mtime,
    ctimeMs: origin.mtime ? BigInt(origin.mtime.getTime()) : null,
    ctimeNs: origin.mtime ? BigInt(origin.mtime.getTime()) * 1000000n : null
  };
}
export function CFISBIS(fileInfo, bigInt) {
  if (bigInt)
    return convertFileInfoToBigIntStats(fileInfo);
  return convertFileInfoToStats(fileInfo);
}
export function stat(path, optionsOrCallback, maybeCallback) {
  const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback;
  const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {bigint: false};
  if (!callback)
    throw new Error("No callback function supplied");
  Deno.stat(path).then((stat2) => callback(void 0, CFISBIS(stat2, options.bigint))).catch((err) => callback(err, err));
}
export function statSync(path, options = {bigint: false}) {
  const origin = Deno.statSync(path);
  return CFISBIS(origin, options.bigint);
}
