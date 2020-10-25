import {Type} from "../type.js";
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
export const merge = new Type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
