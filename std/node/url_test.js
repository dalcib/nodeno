import {assertEquals} from "../testing/asserts.js";
import * as url from "./url.js";
Deno.test({
  name: "[url] URL",
  fn() {
    assertEquals(url.URL, URL);
  }
});
