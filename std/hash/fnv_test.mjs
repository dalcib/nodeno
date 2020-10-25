import {assertEquals} from "../testing/asserts.mjs";
import {Fnv32, Fnv32a, Fnv64, Fnv64a} from "./fnv.mjs";
const golden32 = [
  ["", [129, 28, 157, 197]],
  ["a", [5, 12, 93, 126]],
  ["ab", [112, 119, 45, 56]],
  ["abc", [67, 156, 47, 75]],
  ["deno", [110, 213, 167, 169]]
];
const golden32a = [
  ["", [129, 28, 157, 197]],
  ["a", [228, 12, 41, 44]],
  ["ab", [77, 37, 5, 202]],
  ["abc", [26, 71, 233, 11]],
  ["deno", [142, 246, 71, 17]]
];
const golden64 = [
  ["", [203, 242, 156, 228, 132, 34, 35, 37]],
  ["a", [175, 99, 189, 76, 134, 1, 183, 190]],
  ["ab", [8, 50, 103, 7, 180, 235, 55, 184]],
  ["abc", [216, 220, 202, 24, 107, 175, 173, 203]],
  ["deno", [20, 237, 178, 126, 236, 218, 173, 201]]
];
const golden64a = [
  ["", [203, 242, 156, 228, 132, 34, 35, 37]],
  ["a", [175, 99, 220, 76, 134, 1, 236, 140]],
  ["ab", [8, 156, 68, 7, 181, 69, 152, 106]],
  ["abc", [231, 31, 162, 25, 5, 65, 87, 75]],
  ["deno", [165, 217, 251, 103, 66, 110, 72, 177]]
];
Deno.test("[hash/fnv] testFnv32", () => {
  for (const [input, output] of golden32) {
    const fnv2 = new Fnv32();
    fnv2.write(new TextEncoder().encode(input));
    assertEquals(fnv2.sum(), output);
  }
});
Deno.test("[hash/fnv] testFnv32a", () => {
  for (const [input, output] of golden32a) {
    const fnv2 = new Fnv32a();
    fnv2.write(new TextEncoder().encode(input));
    assertEquals(fnv2.sum(), output);
  }
});
Deno.test("[hash/fnv] testFnv64", () => {
  for (const [input, output] of golden64) {
    const fnv2 = new Fnv64();
    fnv2.write(new TextEncoder().encode(input));
    assertEquals(fnv2.sum(), output);
  }
});
Deno.test("[hash/fnv] testFnv64a", () => {
  for (const [input, output] of golden64a) {
    const fnv2 = new Fnv64a();
    fnv2.write(new TextEncoder().encode(input));
    assertEquals(fnv2.sum(), output);
  }
});
Deno.test("[hash/fnv] testFnv32WriteChain", () => {
  const fnv2 = new Fnv32();
  fnv2.write(new TextEncoder().encode("d")).write(new TextEncoder().encode("e")).write(new TextEncoder().encode("n")).write(new TextEncoder().encode("o"));
  assertEquals(fnv2.sum(), [110, 213, 167, 169]);
});
Deno.test("[hash/fnv] testFnv32aWriteChain", () => {
  const fnv2 = new Fnv32a();
  fnv2.write(new TextEncoder().encode("d")).write(new TextEncoder().encode("e")).write(new TextEncoder().encode("n")).write(new TextEncoder().encode("o"));
  assertEquals(fnv2.sum(), [142, 246, 71, 17]);
});
Deno.test("[hash/fnv] testFnv64WriteChain", () => {
  const fnv2 = new Fnv64();
  fnv2.write(new TextEncoder().encode("d")).write(new TextEncoder().encode("e")).write(new TextEncoder().encode("n")).write(new TextEncoder().encode("o"));
  assertEquals(fnv2.sum(), [20, 237, 178, 126, 236, 218, 173, 201]);
});
Deno.test("[hash/fnv] testFnv64aWriteChain", () => {
  const fnv2 = new Fnv64a();
  fnv2.write(new TextEncoder().encode("d")).write(new TextEncoder().encode("e")).write(new TextEncoder().encode("n")).write(new TextEncoder().encode("o"));
  assertEquals(fnv2.sum(), [165, 217, 251, 103, 66, 110, 72, 177]);
});
