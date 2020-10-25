export const setTimeout = window.setTimeout;
export const clearTimeout = window.clearTimeout;
export const setInterval = window.setInterval;
export const clearInterval = window.clearInterval;
export const setImmediate = (cb, ...args) => window.setTimeout(cb, 0, ...args);
export const clearImmediate = window.clearTimeout;
