import {emptyDir} from "../empty_dir.mjs";
emptyDir(Deno.args[0]).then(() => {
  Deno.stdout.write(new TextEncoder().encode("success"));
}).catch((err) => {
  Deno.stdout.write(new TextEncoder().encode(err.message));
});
