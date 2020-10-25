import {Type} from "../type.js";
export const str = new Type("tag:yaml.org,2002:str", {
  construct(data) {
    return data !== null ? data : "";
  },
  kind: "scalar"
});
