const { readFileSync } = require("fs");

const jsfile = readFileSync("./src/denode.js", "utf8");

const opsSync = jsfile
  .replace(/\r?\n|\r/g, "")
  .replace(/\s+/g, " ")
  .match(/jsonOpSync[(](.*?);/g)
  .map((st) =>
    st
      .slice(12)
      .slice(0, st.length - 14)
      .replace('"', "")
      .replace('"', "")
  )
  .sort();

const opsAsync = jsfile
  .replace(/\r?\n|\r/g, "")
  .replace(/\s+/g, " ")
  .match(/jsonOpAsync[(](.*?);/g)
  .map((st) =>
    st
      .slice(12)
      .slice(0, st.length - 14)
      .replace('"', "")
      .replace('"', "")
  )
  .sort();
console.log("opsSync:", opsSync, "opsAsync", opsAsync);
