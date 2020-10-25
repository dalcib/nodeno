const fs = require("fs");
const fetch = require("node-fetch");

const downloadFile = async (url, path) => {
  const res = await fetch(url, { headers: { "User-Agent": "dalcib" } });
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};

const getFiles = async (url, dir) => {
  const res = await (await fetch(url, { headers: { "User-Agent": "dalcib" } })).json();
  res
    .filter((d) => d.name.slice(d.name.length - 3, d.name.length) === ".js")
    .forEach((d) => downloadFile(d.download_url, dir + d.name));
};

const host = "https://api.github.com/repos/denoland/deno/contents";

const version = "v1.4.6";

getFiles(host + "/cli/rt?ref=" + version, "./rt/");
getFiles(host + "/op_crates/web?ref=" + version, "./rt/");
getFiles(host + "/op_crates/fetdh?ref=" + version, "./rt/");
getFiles(host + "/cli/tests/unit?ref=" + version, "./tests/");
downloadFile("https://raw.githubusercontent.com/denoland/deno/" + version + "/core/core.js", "./rt/00__core.js");
