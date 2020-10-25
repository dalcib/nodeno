const { readdir } = require("fs/promises");
const { writeFileSync } = require("fs");
const concat = require("concat");

const endFile = `
globalThis.bootstrap.mainRuntime();
Deno[Deno.internal] = globalThis.runTests;
`;

async function readDir(params) {
  let dfiles = await readdir("./rt");
  dfiles.sort();
  dfiles = dfiles.map((d) => "./rt/" + d).filter((d) => d.slice(d.length - 3, d.length) === ".js");
  dfiles.unshift("./src/nodeno.js");
  //dfiles.push("./src/logGlobalThis.js");
  //console.log(dfiles);
  concat(dfiles).then((jstext) => {
    jstext += endFile;
    jstext = jstext.replace(/}[)][(]this[)];/g, "})(globalThis);");
    writeFileSync("./deno.js", jstext);
    console.log(jstext.length);
  });
}
readDir();
