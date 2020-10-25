import {MuxAsyncIterator} from "../async/mux_async_iterator.mjs";
export function signal(...signos) {
  const mux = new MuxAsyncIterator();
  if (signos.length < 1) {
    throw new Error("No signals are given. You need to specify at least one signal to create a signal stream.");
  }
  const streams = signos.map(Deno.signal);
  streams.forEach((stream) => {
    mux.add(stream);
  });
  const dispose = () => {
    streams.forEach((stream) => {
      stream.dispose();
    });
  };
  return Object.assign(mux, {dispose});
}
export function onSignal(signo, callback) {
  const sig = signal(signo);
  (async () => {
    for await (const _ of sig) {
      callback();
    }
  })();
  return sig;
}
