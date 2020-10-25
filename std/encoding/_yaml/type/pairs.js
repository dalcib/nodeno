import {Type} from "../type.js";
const _toString = Object.prototype.toString;
function resolveYamlPairs(data) {
  const result = new Array(data.length);
  for (let index = 0; index < data.length; index++) {
    const pair = data[index];
    if (_toString.call(pair) !== "[object Object]")
      return false;
    const keys = Object.keys(pair);
    if (keys.length !== 1)
      return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null)
    return [];
  const result = new Array(data.length);
  for (let index = 0; index < data.length; index += 1) {
    const pair = data[index];
    const keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
export const pairs = new Type("tag:yaml.org,2002:pairs", {
  construct: constructYamlPairs,
  kind: "sequence",
  resolve: resolveYamlPairs
});
