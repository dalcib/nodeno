import {
  CFISBIS
} from "./_fs_stat.js";
export function lstat(path, optionsOrCallback, maybeCallback) {
  const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback;
  const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {bigint: false};
  if (!callback)
    throw new Error("No callback function supplied");
  Deno.lstat(path).then((stat) => callback(void 0, CFISBIS(stat, options.bigint))).catch((err) => callback(err, err));
}
export function lstatSync(path, options) {
  const origin = Deno.lstatSync(path);
  return CFISBIS(origin, options?.bigint || false);
}
