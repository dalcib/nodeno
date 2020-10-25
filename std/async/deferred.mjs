export function deferred() {
  let methods;
  const promise = new Promise((resolve, reject) => {
    methods = {resolve, reject};
  });
  return Object.assign(promise, methods);
}
