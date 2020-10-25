const rawTypeSizes = {
  int8: 1,
  uint8: 1,
  int16: 2,
  uint16: 2,
  int32: 4,
  uint32: 4,
  int64: 8,
  uint64: 8,
  float32: 4,
  float64: 8
};
export function sizeof(dataType) {
  return rawTypeSizes[dataType];
}
export async function getNBytes(r, n) {
  const scratch = new Uint8Array(n);
  const nRead = await r.read(scratch);
  if (nRead === null || nRead < n)
    throw new Deno.errors.UnexpectedEof();
  return scratch;
}
export function varnum(b, o = {}) {
  o.dataType = o.dataType ?? "int32";
  const littleEndian = (o.endian ?? "big") === "little" ? true : false;
  if (b.length < sizeof(o.dataType))
    return null;
  const view = new DataView(b.buffer);
  switch (o.dataType) {
    case "int8":
      return view.getInt8(0);
    case "uint8":
      return view.getUint8(0);
    case "int16":
      return view.getInt16(0, littleEndian);
    case "uint16":
      return view.getUint16(0, littleEndian);
    case "int32":
      return view.getInt32(0, littleEndian);
    case "uint32":
      return view.getUint32(0, littleEndian);
    case "float32":
      return view.getFloat32(0, littleEndian);
    case "float64":
      return view.getFloat64(0, littleEndian);
  }
}
export function varbig(b, o = {}) {
  o.dataType = o.dataType ?? "int64";
  const littleEndian = (o.endian ?? "big") === "little" ? true : false;
  if (b.length < sizeof(o.dataType))
    return null;
  const view = new DataView(b.buffer);
  switch (o.dataType) {
    case "int8":
      return BigInt(view.getInt8(0));
    case "uint8":
      return BigInt(view.getUint8(0));
    case "int16":
      return BigInt(view.getInt16(0, littleEndian));
    case "uint16":
      return BigInt(view.getUint16(0, littleEndian));
    case "int32":
      return BigInt(view.getInt32(0, littleEndian));
    case "uint32":
      return BigInt(view.getUint32(0, littleEndian));
    case "int64":
      return view.getBigInt64(0, littleEndian);
    case "uint64":
      return view.getBigUint64(0, littleEndian);
  }
}
export function putVarnum(b, x, o = {}) {
  o.dataType = o.dataType ?? "int32";
  const littleEndian = (o.endian ?? "big") === "little" ? true : false;
  if (b.length < sizeof(o.dataType))
    return 0;
  const view = new DataView(b.buffer);
  switch (o.dataType) {
    case "int8":
      view.setInt8(0, x);
      break;
    case "uint8":
      view.setUint8(0, x);
      break;
    case "int16":
      view.setInt16(0, x, littleEndian);
      break;
    case "uint16":
      view.setUint16(0, x, littleEndian);
      break;
    case "int32":
      view.setInt32(0, x, littleEndian);
      break;
    case "uint32":
      view.setUint32(0, x, littleEndian);
      break;
    case "float32":
      view.setFloat32(0, x, littleEndian);
      break;
    case "float64":
      view.setFloat64(0, x, littleEndian);
      break;
  }
  return sizeof(o.dataType);
}
export function putVarbig(b, x, o = {}) {
  o.dataType = o.dataType ?? "int64";
  const littleEndian = (o.endian ?? "big") === "little" ? true : false;
  if (b.length < sizeof(o.dataType))
    return 0;
  const view = new DataView(b.buffer);
  switch (o.dataType) {
    case "int8":
      view.setInt8(0, Number(x));
      break;
    case "uint8":
      view.setUint8(0, Number(x));
      break;
    case "int16":
      view.setInt16(0, Number(x), littleEndian);
      break;
    case "uint16":
      view.setUint16(0, Number(x), littleEndian);
      break;
    case "int32":
      view.setInt32(0, Number(x), littleEndian);
      break;
    case "uint32":
      view.setUint32(0, Number(x), littleEndian);
      break;
    case "int64":
      view.setBigInt64(0, x, littleEndian);
      break;
    case "uint64":
      view.setBigUint64(0, x, littleEndian);
      break;
  }
  return sizeof(o.dataType);
}
export async function readVarnum(r, o = {}) {
  o.dataType = o.dataType ?? "int32";
  const scratch = await getNBytes(r, sizeof(o.dataType));
  return varnum(scratch, o);
}
export async function readVarbig(r, o = {}) {
  o.dataType = o.dataType ?? "int64";
  const scratch = await getNBytes(r, sizeof(o.dataType));
  return varbig(scratch, o);
}
export function writeVarnum(w, x, o = {}) {
  o.dataType = o.dataType ?? "int32";
  const scratch = new Uint8Array(sizeof(o.dataType));
  putVarnum(scratch, x, o);
  return w.write(scratch);
}
export function writeVarbig(w, x, o = {}) {
  o.dataType = o.dataType ?? "int64";
  const scratch = new Uint8Array(sizeof(o.dataType));
  putVarbig(scratch, x, o);
  return w.write(scratch);
}
export function varnumBytes(x, o = {}) {
  o.dataType = o.dataType ?? "int32";
  const b = new Uint8Array(sizeof(o.dataType));
  putVarnum(b, x, o);
  return b;
}
export function varbigBytes(x, o = {}) {
  o.dataType = o.dataType ?? "int64";
  const b = new Uint8Array(sizeof(o.dataType));
  putVarbig(b, x, o);
  return b;
}
