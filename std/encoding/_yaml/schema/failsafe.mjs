import {Schema} from "../schema.mjs";
import {map, seq, str} from "../type/mod.mjs";
export const failsafe = new Schema({
  explicit: [str, seq, map]
});
