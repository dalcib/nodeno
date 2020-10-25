export function pooledMap(poolLimit, array, iteratorFn) {
  const res = new TransformStream({
    async transform(p, controller) {
      controller.enqueue(await p);
    }
  });
  (async () => {
    const writer = res.writable.getWriter();
    const executing = [];
    for await (const item of array) {
      const p = Promise.resolve().then(() => iteratorFn(item));
      writer.write(p);
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
    await Promise.all(executing);
    writer.close();
  })();
  return res.readable.getIterator();
}
