export function rmdir(path, optionsOrCallback, maybeCallback) {
  const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback;
  const options = typeof optionsOrCallback === "object" ? optionsOrCallback : void 0;
  if (!callback)
    throw new Error("No callback function supplied");
  Deno.remove(path, {recursive: options?.recursive}).then((_) => callback()).catch(callback);
}
export function rmdirSync(path, options) {
  Deno.removeSync(path, {recursive: options?.recursive});
}
