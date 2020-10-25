import {parse} from "../flags/mod.mjs";
if (import.meta.main) {
  console.dir(parse(Deno.args));
}
