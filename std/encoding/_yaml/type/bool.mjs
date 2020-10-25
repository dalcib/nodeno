import {Type} from "../type.mjs";
import {isBoolean} from "../utils.mjs";
function resolveYamlBoolean(data) {
  const max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
export const bool = new Type("tag:yaml.org,2002:bool", {
  construct: constructYamlBoolean,
  defaultStyle: "lowercase",
  kind: "scalar",
  predicate: isBoolean,
  represent: {
    lowercase(object) {
      return object ? "true" : "false";
    },
    uppercase(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase(object) {
      return object ? "True" : "False";
    }
  },
  resolve: resolveYamlBoolean
});
