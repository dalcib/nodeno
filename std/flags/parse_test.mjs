import {assertEquals} from "../testing/asserts.mjs";
import {parse} from "./mod.mjs";
Deno.test("parseArgs", function() {
  assertEquals(parse(["--no-moo"]), {moo: false, _: []});
  assertEquals(parse(["-v", "a", "-v", "b", "-v", "c"]), {
    v: ["a", "b", "c"],
    _: []
  });
});
Deno.test("comprehensive", function() {
  assertEquals(parse([
    "--name=meowmers",
    "bare",
    "-cats",
    "woo",
    "-h",
    "awesome",
    "--multi=quux",
    "--key",
    "value",
    "-b",
    "--bool",
    "--no-meep",
    "--multi=baz",
    "--",
    "--not-a-flag",
    "eek"
  ]), {
    c: true,
    a: true,
    t: true,
    s: "woo",
    h: "awesome",
    b: true,
    bool: true,
    key: "value",
    multi: ["quux", "baz"],
    meep: false,
    name: "meowmers",
    _: ["bare", "--not-a-flag", "eek"]
  });
});
Deno.test("flagBoolean", function() {
  const argv = parse(["-t", "moo"], {boolean: "t"});
  assertEquals(argv, {t: true, _: ["moo"]});
  assertEquals(typeof argv.t, "boolean");
});
Deno.test("flagBooleanValue", function() {
  const argv = parse(["--verbose", "false", "moo", "-t", "true"], {
    boolean: ["t", "verbose"],
    default: {verbose: true}
  });
  assertEquals(argv, {
    verbose: false,
    t: true,
    _: ["moo"]
  });
  assertEquals(typeof argv.verbose, "boolean");
  assertEquals(typeof argv.t, "boolean");
});
Deno.test("newlinesInParams", function() {
  const args = parse(["-s", "X\nX"]);
  assertEquals(args, {_: [], s: "X\nX"});
  const args2 = parse(["--s=X\nX"]);
  assertEquals(args2, {_: [], s: "X\nX"});
});
Deno.test("strings", function() {
  const s = parse(["-s", "0001234"], {string: "s"}).s;
  assertEquals(s, "0001234");
  assertEquals(typeof s, "string");
  const x = parse(["-x", "56"], {string: "x"}).x;
  assertEquals(x, "56");
  assertEquals(typeof x, "string");
});
Deno.test("stringArgs", function() {
  const s = parse(["  ", "  "], {string: "_"})._;
  assertEquals(s.length, 2);
  assertEquals(typeof s[0], "string");
  assertEquals(s[0], "  ");
  assertEquals(typeof s[1], "string");
  assertEquals(s[1], "  ");
});
Deno.test("emptyStrings", function() {
  const s = parse(["-s"], {string: "s"}).s;
  assertEquals(s, "");
  assertEquals(typeof s, "string");
  const str = parse(["--str"], {string: "str"}).str;
  assertEquals(str, "");
  assertEquals(typeof str, "string");
  const letters = parse(["-art"], {
    string: ["a", "t"]
  });
  assertEquals(letters.a, "");
  assertEquals(letters.r, true);
  assertEquals(letters.t, "");
});
Deno.test("stringAndAlias", function() {
  const x = parse(["--str", "000123"], {
    string: "s",
    alias: {s: "str"}
  });
  assertEquals(x.str, "000123");
  assertEquals(typeof x.str, "string");
  assertEquals(x.s, "000123");
  assertEquals(typeof x.s, "string");
  const y = parse(["-s", "000123"], {
    string: "str",
    alias: {str: "s"}
  });
  assertEquals(y.str, "000123");
  assertEquals(typeof y.str, "string");
  assertEquals(y.s, "000123");
  assertEquals(typeof y.s, "string");
});
Deno.test("slashBreak", function() {
  assertEquals(parse(["-I/foo/bar/baz"]), {I: "/foo/bar/baz", _: []});
  assertEquals(parse(["-xyz/foo/bar/baz"]), {
    x: true,
    y: true,
    z: "/foo/bar/baz",
    _: []
  });
});
Deno.test("alias", function() {
  const argv = parse(["-f", "11", "--zoom", "55"], {
    alias: {z: "zoom"}
  });
  assertEquals(argv.zoom, 55);
  assertEquals(argv.z, argv.zoom);
  assertEquals(argv.f, 11);
});
Deno.test("multiAlias", function() {
  const argv = parse(["-f", "11", "--zoom", "55"], {
    alias: {z: ["zm", "zoom"]}
  });
  assertEquals(argv.zoom, 55);
  assertEquals(argv.z, argv.zoom);
  assertEquals(argv.z, argv.zm);
  assertEquals(argv.f, 11);
});
Deno.test("nestedDottedObjects", function() {
  const argv = parse([
    "--foo.bar",
    "3",
    "--foo.baz",
    "4",
    "--foo.quux.quibble",
    "5",
    "--foo.quux.oO",
    "--beep.boop"
  ]);
  assertEquals(argv.foo, {
    bar: 3,
    baz: 4,
    quux: {
      quibble: 5,
      oO: true
    }
  });
  assertEquals(argv.beep, {boop: true});
});
Deno.test("flagBuiltinProperty", function() {
  const argv = parse(["--toString", "--valueOf", "foo"]);
  assertEquals(argv, {toString: true, valueOf: "foo", _: []});
  assertEquals(typeof argv.toString, "boolean");
  assertEquals(typeof argv.valueOf, "string");
});
