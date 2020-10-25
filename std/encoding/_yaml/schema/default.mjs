import {Schema} from "../schema.mjs";
import {binary, merge, omap, pairs, set, timestamp} from "../type/mod.mjs";
import {core as core2} from "./core.mjs";
export const def = new Schema({
  explicit: [binary, omap, pairs, set],
  implicit: [timestamp, merge],
  include: [core2]
});
