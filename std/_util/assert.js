export class DenoStdInternalError extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
}
export function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}
