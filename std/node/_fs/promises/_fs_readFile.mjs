import {readFile as readFileCallback} from "../_fs_readFile.mjs";
export function readFile(path, options) {
  return new Promise((resolve, reject) => {
    readFileCallback(path, options, (err, data) => {
      if (err)
        return reject(err);
      if (data == null) {
        return reject(new Error("Invalid state: data missing, but no error"));
      }
      resolve(data);
    });
  });
}
