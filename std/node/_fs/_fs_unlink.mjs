export function unlink(path, callback) {
  if (!callback)
    throw new Error("No callback function supplied");
  Deno.remove(path).then((_) => callback()).catch(callback);
}
export function unlinkSync(path) {
  Deno.removeSync(path);
}
