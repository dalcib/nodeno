import {Schema} from "../schema.mjs";
import {json as json2} from "./json.mjs";
export const core = new Schema({
  include: [json2]
});
