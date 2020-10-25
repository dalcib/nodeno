import {parse} from "../../yaml.mjs";
(() => {
  const yml = Deno.readFileSync(`${Deno.cwd()}/example/sample_document.yml`);
  const document = new TextDecoder().decode(yml);
  const obj = parse(document);
  console.log(obj);
  let i = 0;
  for (const o of Object.values(obj)) {
    console.log(`======${i}`);
    for (const [key, value] of Object.entries(o)) {
      console.log(key, value);
    }
    i++;
  }
})();
