export var DiffType;
(function(DiffType2) {
  DiffType2["removed"] = "removed";
  DiffType2["common"] = "common";
  DiffType2["added"] = "added";
})(DiffType || (DiffType = {}));
const REMOVED = 1;
const COMMON = 2;
const ADDED = 3;
function createCommon(A, B, reverse) {
  const common = [];
  if (A.length === 0 || B.length === 0)
    return [];
  for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
    if (A[reverse ? A.length - i - 1 : i] === B[reverse ? B.length - i - 1 : i]) {
      common.push(A[reverse ? A.length - i - 1 : i]);
    } else {
      return common;
    }
  }
  return common;
}
export function diff(A, B) {
  const prefixCommon = createCommon(A, B);
  const suffixCommon = createCommon(A.slice(prefixCommon.length), B.slice(prefixCommon.length), true).reverse();
  A = suffixCommon.length ? A.slice(prefixCommon.length, -suffixCommon.length) : A.slice(prefixCommon.length);
  B = suffixCommon.length ? B.slice(prefixCommon.length, -suffixCommon.length) : B.slice(prefixCommon.length);
  const swapped = B.length > A.length;
  [A, B] = swapped ? [B, A] : [A, B];
  const M = A.length;
  const N = B.length;
  if (!M && !N && !suffixCommon.length && !prefixCommon.length)
    return [];
  if (!N) {
    return [
      ...prefixCommon.map((c) => ({type: DiffType.common, value: c})),
      ...A.map((a) => ({
        type: swapped ? DiffType.added : DiffType.removed,
        value: a
      })),
      ...suffixCommon.map((c) => ({type: DiffType.common, value: c}))
    ];
  }
  const offset = N;
  const delta = M - N;
  const size = M + N + 1;
  const fp = new Array(size).fill({y: -1});
  const routes = new Uint32Array((M * N + size + 1) * 2);
  const diffTypesPtrOffset = routes.length / 2;
  let ptr = 0;
  let p = -1;
  function backTrace(A2, B2, current, swapped2) {
    const M2 = A2.length;
    const N2 = B2.length;
    const result = [];
    let a = M2 - 1;
    let b = N2 - 1;
    let j = routes[current.id];
    let type = routes[current.id + diffTypesPtrOffset];
    while (true) {
      if (!j && !type)
        break;
      const prev = j;
      if (type === REMOVED) {
        result.unshift({
          type: swapped2 ? DiffType.removed : DiffType.added,
          value: B2[b]
        });
        b -= 1;
      } else if (type === ADDED) {
        result.unshift({
          type: swapped2 ? DiffType.added : DiffType.removed,
          value: A2[a]
        });
        a -= 1;
      } else {
        result.unshift({type: DiffType.common, value: A2[a]});
        a -= 1;
        b -= 1;
      }
      j = routes[prev];
      type = routes[prev + diffTypesPtrOffset];
    }
    return result;
  }
  function createFP(slide, down, k, M2) {
    if (slide && slide.y === -1 && down && down.y === -1) {
      return {y: 0, id: 0};
    }
    if (down && down.y === -1 || k === M2 || (slide && slide.y) > (down && down.y) + 1) {
      const prev = slide.id;
      ptr++;
      routes[ptr] = prev;
      routes[ptr + diffTypesPtrOffset] = ADDED;
      return {y: slide.y, id: ptr};
    } else {
      const prev = down.id;
      ptr++;
      routes[ptr] = prev;
      routes[ptr + diffTypesPtrOffset] = REMOVED;
      return {y: down.y + 1, id: ptr};
    }
  }
  function snake(k, slide, down, _offset, A2, B2) {
    const M2 = A2.length;
    const N2 = B2.length;
    if (k < -N2 || M2 < k)
      return {y: -1, id: -1};
    const fp2 = createFP(slide, down, k, M2);
    while (fp2.y + k < M2 && fp2.y < N2 && A2[fp2.y + k] === B2[fp2.y]) {
      const prev = fp2.id;
      ptr++;
      fp2.id = ptr;
      fp2.y += 1;
      routes[ptr] = prev;
      routes[ptr + diffTypesPtrOffset] = COMMON;
    }
    return fp2;
  }
  while (fp[delta + offset].y < N) {
    p = p + 1;
    for (let k = -p; k < delta; ++k) {
      fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
    }
    for (let k = delta + p; k > delta; --k) {
      fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
    }
    fp[delta + offset] = snake(delta, fp[delta - 1 + offset], fp[delta + 1 + offset], offset, A, B);
  }
  return [
    ...prefixCommon.map((c) => ({type: DiffType.common, value: c})),
    ...backTrace(A, B, fp[delta + offset], swapped),
    ...suffixCommon.map((c) => ({type: DiffType.common, value: c}))
  ];
}
