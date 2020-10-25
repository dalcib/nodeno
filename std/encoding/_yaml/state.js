import {DEFAULT_SCHEMA} from "./schema/mod.js";
export class State {
  constructor(schema = DEFAULT_SCHEMA) {
    this.schema = schema;
  }
}
