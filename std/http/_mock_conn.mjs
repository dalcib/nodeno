export function mockConn(base = {}) {
  return {
    localAddr: {
      transport: "tcp",
      hostname: "",
      port: 0
    },
    remoteAddr: {
      transport: "tcp",
      hostname: "",
      port: 0
    },
    rid: -1,
    closeWrite: () => {
    },
    read: () => {
      return Promise.resolve(0);
    },
    write: () => {
      return Promise.resolve(-1);
    },
    close: () => {
    },
    ...base
  };
}
