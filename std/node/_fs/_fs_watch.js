import {fromFileUrl} from "../path.js";
import {EventEmitter} from "../events.js";
import {notImplemented} from "../_utils.js";
export function asyncIterableIteratorToCallback(iterator, callback) {
  function next() {
    iterator.next().then((obj) => {
      if (obj.done) {
        callback(obj.value, true);
        return;
      }
      callback(obj.value);
      next();
    });
  }
  next();
}
export function asyncIterableToCallback(iter, callback) {
  const iterator = iter[Symbol.asyncIterator]();
  function next() {
    iterator.next().then((obj) => {
      if (obj.done) {
        callback(obj.value, true);
        return;
      }
      callback(obj.value);
      next();
    });
  }
  next();
}
export function watch(filename, optionsOrListener, optionsOrListener2) {
  const listener = typeof optionsOrListener === "function" ? optionsOrListener : typeof optionsOrListener2 === "function" ? optionsOrListener2 : void 0;
  const options = typeof optionsOrListener === "object" ? optionsOrListener : typeof optionsOrListener2 === "object" ? optionsOrListener2 : void 0;
  filename = filename instanceof URL ? fromFileUrl(filename) : filename;
  const iterator = Deno.watchFs(filename, {
    recursive: options?.recursive || false
  });
  if (!listener)
    throw new Error("No callback function supplied");
  const fsWatcher = new FSWatcher(() => {
    if (iterator.return)
      iterator.return();
  });
  fsWatcher.on("change", listener);
  asyncIterableIteratorToCallback(iterator, (val, done) => {
    if (done)
      return;
    fsWatcher.emit("change", val.kind, val.paths[0]);
  });
  return fsWatcher;
}
class FSWatcher extends EventEmitter {
  constructor(closer) {
    super();
    this.close = closer;
  }
  ref() {
    notImplemented("FSWatcher.ref() is not implemented");
  }
  unref() {
    notImplemented("FSWatcher.unref() is not implemented");
  }
}
