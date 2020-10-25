import {stringify} from "../../yaml.mjs";
console.log(stringify({
  foo: {
    bar: true,
    test: [
      "a",
      "b",
      {
        a: false
      },
      {
        a: false
      }
    ]
  },
  test: "foobar"
}));
