import {Schema} from "../schema.js";
import {json as json2} from "./json.js";
export const core = new Schema({
  include: [json2]
});
