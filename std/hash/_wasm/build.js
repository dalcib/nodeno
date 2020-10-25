import {encode as base64Encode} from "../../encoding/base64.js";
async function buildWasm(path) {
  const cmd = [
    "wasm-pack",
    "build",
    "--target",
    "web",
    "--release",
    "-d",
    path
  ];
  const builder = Deno.run({cmd});
  const status = await builder.status();
  if (!status.success) {
    console.error(`Failed to build wasm: ${status.code}`);
    Deno.exit(1);
  }
}
async function encodeWasm(wasmPath) {
  const wasm2 = await Deno.readFile(`${wasmPath}/deno_hash_bg.wasm`);
  return base64Encode(wasm2);
}
async function generate(wasm2, output) {
  const initScript = await Deno.readTextFile(`${output}/deno_hash.js`);
  const denoHashScript = `/* eslint-disable */
//deno-fmt-ignore-file
//deno-lint-ignore-file
import * as base64 from "../../encoding/base64.js";export const source = base64.decode("${wasm2}");` + initScript;
  await Deno.writeFile("wasm.js", new TextEncoder().encode(denoHashScript));
}
const OUTPUT_DIR = "./out";
await buildWasm(OUTPUT_DIR);
const wasm = await encodeWasm(OUTPUT_DIR);
await generate(wasm, OUTPUT_DIR);
