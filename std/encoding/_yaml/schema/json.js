import {Schema} from "../schema.js";
import {bool, float, int, nil} from "../type/mod.js";
import {failsafe as failsafe2} from "./failsafe.js";
export const json = new Schema({
  implicit: [nil, bool, int, float],
  include: [failsafe2]
});
