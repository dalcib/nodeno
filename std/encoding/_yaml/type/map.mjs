import {Type} from "../type.mjs";
export const map = new Type("tag:yaml.org,2002:map", {
  construct(data) {
    return data !== null ? data : {};
  },
  kind: "mapping"
});
