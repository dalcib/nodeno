import * as path from "../path/mod.mjs";
export function charCode(s) {
  return s.charCodeAt(0);
}
export async function tempFile(dir, opts = {prefix: "", postfix: ""}) {
  const r = Math.floor(Math.random() * 1e6);
  const filepath = path.resolve(`${dir}/${opts.prefix || ""}${r}${opts.postfix || ""}`);
  await Deno.mkdir(path.dirname(filepath), {recursive: true});
  const file = await Deno.open(filepath, {
    create: true,
    read: true,
    write: true,
    append: true
  });
  return {file, filepath};
}
