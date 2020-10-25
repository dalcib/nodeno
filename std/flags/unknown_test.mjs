import {assertEquals} from "../testing/asserts.mjs";
import {parse} from "./mod.mjs";
Deno.test("booleanAndAliasIsNotUnknown", function() {
  const unknown = [];
  function unknownFn(arg, k, v) {
    unknown.push({arg, k, v});
    return false;
  }
  const aliased = ["-h", "true", "--derp", "true"];
  const regular = ["--herp", "true", "-d", "false"];
  const opts = {
    alias: {h: "herp"},
    boolean: "h",
    unknown: unknownFn
  };
  parse(aliased, opts);
  parse(regular, opts);
  assertEquals(unknown, [
    {arg: "--derp", k: "derp", v: "true"},
    {arg: "-d", k: "d", v: "false"}
  ]);
});
Deno.test("flagBooleanTrueAnyDoubleHyphenArgumentIsNotUnknown", function() {
  const unknown = [];
  function unknownFn(arg, k, v) {
    unknown.push({arg, k, v});
    return false;
  }
  const argv = parse(["--honk", "--tacos=good", "cow", "-p", "55"], {
    boolean: true,
    unknown: unknownFn
  });
  assertEquals(unknown, [
    {arg: "--tacos=good", k: "tacos", v: "good"},
    {arg: "cow", k: void 0, v: void 0},
    {arg: "-p", k: "p", v: "55"}
  ]);
  assertEquals(argv, {
    honk: true,
    _: []
  });
});
Deno.test("stringAndAliasIsNotUnkown", function() {
  const unknown = [];
  function unknownFn(arg, k, v) {
    unknown.push({arg, k, v});
    return false;
  }
  const aliased = ["-h", "hello", "--derp", "goodbye"];
  const regular = ["--herp", "hello", "-d", "moon"];
  const opts = {
    alias: {h: "herp"},
    string: "h",
    unknown: unknownFn
  };
  parse(aliased, opts);
  parse(regular, opts);
  assertEquals(unknown, [
    {arg: "--derp", k: "derp", v: "goodbye"},
    {arg: "-d", k: "d", v: "moon"}
  ]);
});
Deno.test("defaultAndAliasIsNotUnknown", function() {
  const unknown = [];
  function unknownFn(arg, k, v) {
    unknown.push({arg, k, v});
    return false;
  }
  const aliased = ["-h", "hello"];
  const regular = ["--herp", "hello"];
  const opts = {
    default: {h: "bar"},
    alias: {h: "herp"},
    unknown: unknownFn
  };
  parse(aliased, opts);
  parse(regular, opts);
  assertEquals(unknown, []);
});
Deno.test("valueFollowingDoubleHyphenIsNotUnknown", function() {
  const unknown = [];
  function unknownFn(arg, k, v) {
    unknown.push({arg, k, v});
    return false;
  }
  const aliased = ["--bad", "--", "good", "arg"];
  const opts = {
    "--": true,
    unknown: unknownFn
  };
  const argv = parse(aliased, opts);
  assertEquals(unknown, [{arg: "--bad", k: "bad", v: true}]);
  assertEquals(argv, {
    "--": ["good", "arg"],
    _: []
  });
});
