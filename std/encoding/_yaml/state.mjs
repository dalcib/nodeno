import {DEFAULT_SCHEMA} from "./schema/mod.mjs";
export class State {
  constructor(schema = DEFAULT_SCHEMA) {
    this.schema = schema;
  }
}
