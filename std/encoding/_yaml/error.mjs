export class YAMLError extends Error {
  constructor(message = "(unknown reason)", mark = "") {
    super(`${message} ${mark}`);
    this.mark = mark;
    this.name = this.constructor.name;
  }
  toString(_compact) {
    return `${this.name}: ${this.message} ${this.mark}`;
  }
}
