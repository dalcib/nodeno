const fs = require("fs");
const path = require("path");

/* async function readDir(params) {
  let dfiles = await fs.readdir("./rt");
  dfiles.sort();
  dfiles = dfiles.map((d) => "./rt/" + d).filter((d) => d.slice(d.length - 3, d.length) === ".js");
  dfiles.unshift("./src/nodeno.js");
  dfiles.push("./src/logGlobalThis.js");
  //console.log(dfiles);
  concat(dfiles).then((jstext) => {
    jstext = jstext.replace(/}[)][(]this[)];/g, "})(globalThis);");
    writeFileSync("./deno.js", jstext);
    console.log(jstext.length);
  });
}
readDir(); */

const myDirPath = "./cli/tests/unit/";
//const myDirPath = "./std/";

const { transformSync } = require("esbuild");

const getAllFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

let dfiles = getAllFiles(myDirPath);
dfiles = dfiles.filter((d) => d.slice(d.length - 3, d.length) === ".ts");
//console.log(dfiles);
dfiles.forEach((file) => {
  //const file = myDirPath + "archive/tar.ts";
  const textFile = fs.readFileSync(file, "utf8");
  //console.log(textFile);
  const newTextFile = textFile.replace(/\.ts";/g, '.mjs";');
  //console.log(newTextFile);
  const { js } = transformSync(newTextFile, { loader: "ts" /* , format: "cjs"  */ });
  //console.log(js);
  const jsFileName = file.replace(/\.ts$/, ".mjs");
  fs.writeFileSync(jsFileName, js);
  console.log(jsFileName);
});
