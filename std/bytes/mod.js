export function findIndex(source, pat) {
  const s = pat[0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] !== s)
      continue;
    const pin = i;
    let matched = 1;
    let j = i;
    while (matched < pat.length) {
      j++;
      if (source[j] !== pat[j - pin]) {
        break;
      }
      matched++;
    }
    if (matched === pat.length) {
      return pin;
    }
  }
  return -1;
}
export function findLastIndex(source, pat) {
  const e = pat[pat.length - 1];
  for (let i = source.length - 1; i >= 0; i--) {
    if (source[i] !== e)
      continue;
    const pin = i;
    let matched = 1;
    let j = i;
    while (matched < pat.length) {
      j--;
      if (source[j] !== pat[pat.length - 1 - (pin - j)]) {
        break;
      }
      matched++;
    }
    if (matched === pat.length) {
      return pin - pat.length + 1;
    }
  }
  return -1;
}
export function equal(source, match) {
  if (source.length !== match.length)
    return false;
  for (let i = 0; i < match.length; i++) {
    if (source[i] !== match[i])
      return false;
  }
  return true;
}
export function hasPrefix(source, prefix) {
  for (let i = 0, max = prefix.length; i < max; i++) {
    if (source[i] !== prefix[i])
      return false;
  }
  return true;
}
export function hasSuffix(source, suffix) {
  for (let srci = source.length - 1, sfxi = suffix.length - 1; sfxi >= 0; srci--, sfxi--) {
    if (source[srci] !== suffix[sfxi])
      return false;
  }
  return true;
}
export function repeat(origin, count) {
  if (count === 0) {
    return new Uint8Array();
  }
  if (count < 0) {
    throw new Error("bytes: negative repeat count");
  } else if (origin.length * count / count !== origin.length) {
    throw new Error("bytes: repeat count causes overflow");
  }
  const int = Math.floor(count);
  if (int !== count) {
    throw new Error("bytes: repeat count must be an integer");
  }
  const nb = new Uint8Array(origin.length * count);
  let bp = copyBytes(origin, nb);
  for (; bp < nb.length; bp *= 2) {
    copyBytes(nb.slice(0, bp), nb, bp);
  }
  return nb;
}
export function concat(origin, b) {
  const output = new Uint8Array(origin.length + b.length);
  output.set(origin, 0);
  output.set(b, origin.length);
  return output;
}
export function contains(source, pat) {
  return findIndex(source, pat) != -1;
}
export function copyBytes(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}
