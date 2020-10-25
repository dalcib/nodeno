import {parse} from "../flags/mod.js";
if (import.meta.main) {
  console.dir(parse(Deno.args));
}
