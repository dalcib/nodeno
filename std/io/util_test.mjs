import {assert} from "../testing/asserts.mjs";
import * as path from "../path/mod.mjs";
import {tempFile} from "./util.mjs";
Deno.test({
  name: "[io/util] tempfile",
  fn: async function() {
    const f = await tempFile(".", {
      prefix: "prefix-",
      postfix: "-postfix"
    });
    const base = path.basename(f.filepath);
    assert(!!base.match(/^prefix-.+?-postfix$/));
    f.file.close();
    await Deno.remove(f.filepath);
  }
});
