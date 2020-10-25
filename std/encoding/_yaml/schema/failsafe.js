import {Schema} from "../schema.js";
import {map, seq, str} from "../type/mod.js";
export const failsafe = new Schema({
  explicit: [str, seq, map]
});
