import {writeFile as writeFileCallback} from "../_fs_writeFile.js";
export function writeFile(pathOrRid, data, options) {
  return new Promise((resolve, reject) => {
    writeFileCallback(pathOrRid, data, options, (err) => {
      if (err)
        return reject(err);
      resolve();
    });
  });
}
