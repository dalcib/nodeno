import {assertEquals} from "../testing/asserts.mjs";
import * as url from "./url.mjs";
Deno.test({
  name: "[url] URL",
  fn() {
    assertEquals(url.URL, URL);
  }
});
