import {Schema} from "../schema.mjs";
import {bool, float, int, nil} from "../type/mod.mjs";
import {failsafe as failsafe2} from "./failsafe.mjs";
export const json = new Schema({
  implicit: [nil, bool, int, float],
  include: [failsafe2]
});
