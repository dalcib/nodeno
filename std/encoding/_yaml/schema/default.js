import {Schema} from "../schema.js";
import {binary, merge, omap, pairs, set, timestamp} from "../type/mod.js";
import {core as core2} from "./core.js";
export const def = new Schema({
  explicit: [binary, omap, pairs, set],
  implicit: [timestamp, merge],
  include: [core2]
});
