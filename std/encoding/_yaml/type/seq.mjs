import {Type} from "../type.mjs";
export const seq = new Type("tag:yaml.org,2002:seq", {
  construct(data) {
    return data !== null ? data : [];
  },
  kind: "sequence"
});
