import {bgBlue, bold, italic, red} from "../fmt/colors.mjs";
if (import.meta.main) {
  console.log(bgBlue(italic(red(bold("Hello world!")))));
}
