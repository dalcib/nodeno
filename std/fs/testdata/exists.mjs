import {exists as exists2} from "../exists.mjs";
exists2(Deno.args[0]).then((isExist) => {
  Deno.stdout.write(new TextEncoder().encode(isExist ? "exist" : "not exist"));
}).catch((err) => {
  Deno.stdout.write(new TextEncoder().encode(err.message));
});
