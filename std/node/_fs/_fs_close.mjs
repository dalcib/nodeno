export function close(fd, callback) {
  queueMicrotask(() => {
    try {
      Deno.close(fd);
      callback(null);
    } catch (err) {
      callback(err);
    }
  });
}
export function closeSync(fd) {
  Deno.close(fd);
}
