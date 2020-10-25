import {assertEquals} from "../testing/asserts.js";
import * as c from "./colors.js";
import "../examples/colors.js";
Deno.test("singleColor", function() {
  assertEquals(c.red("foo bar"), "[31mfoo bar[39m");
});
Deno.test("doubleColor", function() {
  assertEquals(c.bgBlue(c.red("foo bar")), "[44m[31mfoo bar[39m[49m");
});
Deno.test("replacesCloseCharacters", function() {
  assertEquals(c.red("Hel[39mlo"), "[31mHel[31mlo[39m");
});
Deno.test("enablingColors", function() {
  assertEquals(c.getColorEnabled(), true);
  c.setColorEnabled(false);
  assertEquals(c.bgBlue(c.red("foo bar")), "foo bar");
  c.setColorEnabled(true);
  assertEquals(c.red("foo bar"), "[31mfoo bar[39m");
});
Deno.test("testBold", function() {
  assertEquals(c.bold("foo bar"), "[1mfoo bar[22m");
});
Deno.test("testDim", function() {
  assertEquals(c.dim("foo bar"), "[2mfoo bar[22m");
});
Deno.test("testItalic", function() {
  assertEquals(c.italic("foo bar"), "[3mfoo bar[23m");
});
Deno.test("testUnderline", function() {
  assertEquals(c.underline("foo bar"), "[4mfoo bar[24m");
});
Deno.test("testInverse", function() {
  assertEquals(c.inverse("foo bar"), "[7mfoo bar[27m");
});
Deno.test("testHidden", function() {
  assertEquals(c.hidden("foo bar"), "[8mfoo bar[28m");
});
Deno.test("testStrikethrough", function() {
  assertEquals(c.strikethrough("foo bar"), "[9mfoo bar[29m");
});
Deno.test("testBlack", function() {
  assertEquals(c.black("foo bar"), "[30mfoo bar[39m");
});
Deno.test("testRed", function() {
  assertEquals(c.red("foo bar"), "[31mfoo bar[39m");
});
Deno.test("testGreen", function() {
  assertEquals(c.green("foo bar"), "[32mfoo bar[39m");
});
Deno.test("testYellow", function() {
  assertEquals(c.yellow("foo bar"), "[33mfoo bar[39m");
});
Deno.test("testBlue", function() {
  assertEquals(c.blue("foo bar"), "[34mfoo bar[39m");
});
Deno.test("testMagenta", function() {
  assertEquals(c.magenta("foo bar"), "[35mfoo bar[39m");
});
Deno.test("testCyan", function() {
  assertEquals(c.cyan("foo bar"), "[36mfoo bar[39m");
});
Deno.test("testWhite", function() {
  assertEquals(c.white("foo bar"), "[37mfoo bar[39m");
});
Deno.test("testGray", function() {
  assertEquals(c.gray("foo bar"), "[90mfoo bar[39m");
});
Deno.test("testBrightBlack", function() {
  assertEquals(c.brightBlack("foo bar"), "[90mfoo bar[39m");
});
Deno.test("testBrightRed", function() {
  assertEquals(c.brightRed("foo bar"), "[91mfoo bar[39m");
});
Deno.test("testBrightGreen", function() {
  assertEquals(c.brightGreen("foo bar"), "[92mfoo bar[39m");
});
Deno.test("testBrightYellow", function() {
  assertEquals(c.brightYellow("foo bar"), "[93mfoo bar[39m");
});
Deno.test("testBrightBlue", function() {
  assertEquals(c.brightBlue("foo bar"), "[94mfoo bar[39m");
});
Deno.test("testBrightMagenta", function() {
  assertEquals(c.brightMagenta("foo bar"), "[95mfoo bar[39m");
});
Deno.test("testBrightCyan", function() {
  assertEquals(c.brightCyan("foo bar"), "[96mfoo bar[39m");
});
Deno.test("testBrightWhite", function() {
  assertEquals(c.brightWhite("foo bar"), "[97mfoo bar[39m");
});
Deno.test("testBgBlack", function() {
  assertEquals(c.bgBlack("foo bar"), "[40mfoo bar[49m");
});
Deno.test("testBgRed", function() {
  assertEquals(c.bgRed("foo bar"), "[41mfoo bar[49m");
});
Deno.test("testBgGreen", function() {
  assertEquals(c.bgGreen("foo bar"), "[42mfoo bar[49m");
});
Deno.test("testBgYellow", function() {
  assertEquals(c.bgYellow("foo bar"), "[43mfoo bar[49m");
});
Deno.test("testBgBlue", function() {
  assertEquals(c.bgBlue("foo bar"), "[44mfoo bar[49m");
});
Deno.test("testBgMagenta", function() {
  assertEquals(c.bgMagenta("foo bar"), "[45mfoo bar[49m");
});
Deno.test("testBgCyan", function() {
  assertEquals(c.bgCyan("foo bar"), "[46mfoo bar[49m");
});
Deno.test("testBgWhite", function() {
  assertEquals(c.bgWhite("foo bar"), "[47mfoo bar[49m");
});
Deno.test("testBgBrightBlack", function() {
  assertEquals(c.bgBrightBlack("foo bar"), "[100mfoo bar[49m");
});
Deno.test("testBgBrightRed", function() {
  assertEquals(c.bgBrightRed("foo bar"), "[101mfoo bar[49m");
});
Deno.test("testBgBrightGreen", function() {
  assertEquals(c.bgBrightGreen("foo bar"), "[102mfoo bar[49m");
});
Deno.test("testBgBrightYellow", function() {
  assertEquals(c.bgBrightYellow("foo bar"), "[103mfoo bar[49m");
});
Deno.test("testBgBrightBlue", function() {
  assertEquals(c.bgBrightBlue("foo bar"), "[104mfoo bar[49m");
});
Deno.test("testBgBrightMagenta", function() {
  assertEquals(c.bgBrightMagenta("foo bar"), "[105mfoo bar[49m");
});
Deno.test("testBgBrightCyan", function() {
  assertEquals(c.bgBrightCyan("foo bar"), "[106mfoo bar[49m");
});
Deno.test("testBgBrightWhite", function() {
  assertEquals(c.bgBrightWhite("foo bar"), "[107mfoo bar[49m");
});
Deno.test("testClampUsingRgb8", function() {
  assertEquals(c.rgb8("foo bar", -10), "[38;5;0mfoo bar[39m");
});
Deno.test("testTruncateUsingRgb8", function() {
  assertEquals(c.rgb8("foo bar", 42.5), "[38;5;42mfoo bar[39m");
});
Deno.test("testRgb8", function() {
  assertEquals(c.rgb8("foo bar", 42), "[38;5;42mfoo bar[39m");
});
Deno.test("test_bgRgb8", function() {
  assertEquals(c.bgRgb8("foo bar", 42), "[48;5;42mfoo bar[49m");
});
Deno.test("test_rgb24", function() {
  assertEquals(c.rgb24("foo bar", {
    r: 41,
    g: 42,
    b: 43
  }), "[38;2;41;42;43mfoo bar[39m");
});
Deno.test("test_rgb24number", function() {
  assertEquals(c.rgb24("foo bar", 460809), "[38;2;7;8;9mfoo bar[39m");
});
Deno.test("test_bgRgb24", function() {
  assertEquals(c.bgRgb24("foo bar", {
    r: 41,
    g: 42,
    b: 43
  }), "[48;2;41;42;43mfoo bar[49m");
});
Deno.test("test_bgRgb24number", function() {
  assertEquals(c.bgRgb24("foo bar", 460809), "[48;2;7;8;9mfoo bar[49m");
});
