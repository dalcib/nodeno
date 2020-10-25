import {assert} from "../testing/asserts.js";
import * as path from "../path/mod.js";
import {tempFile} from "./util.js";
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
