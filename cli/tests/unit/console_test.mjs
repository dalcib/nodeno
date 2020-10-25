import {
  assert,
  assertEquals,
  assertStringContains,
  unitTest
} from "./test_util.mjs";
import {stripColor} from "../../../std/fmt/colors.mjs";
const customInspect = Deno.customInspect;
const {
  Console,
  cssToAnsi: cssToAnsi_,
  inspectArgs,
  parseCss: parseCss_,
  parseCssColor: parseCssColor_
} = Deno[Deno.internal];
function stringify(...args) {
  return stripColor(inspectArgs(args).replace(/\n$/, ""));
}
const DEFAULT_CSS = {
  backgroundColor: null,
  color: null,
  fontWeight: null,
  fontStyle: null,
  textDecorationColor: null,
  textDecorationLine: []
};
function parseCss(cssString) {
  return parseCss_(cssString);
}
function parseCssColor(colorString) {
  return parseCssColor_(colorString);
}
function cssToAnsiEsc(css, prevCss = null) {
  return cssToAnsi_(css, prevCss).replaceAll("", "_");
}
unitTest(function consoleShouldBeANamespace() {
  const prototype1 = Object.getPrototypeOf(console);
  const prototype2 = Object.getPrototypeOf(prototype1);
  assertEquals(Object.getOwnPropertyNames(prototype1).length, 0);
  assertEquals(prototype2, Object.prototype);
});
unitTest(function consoleHasRightInstance() {
  assert(console instanceof Console);
  assertEquals({} instanceof Console, false);
});
unitTest(function consoleTestAssertShouldNotThrowError() {
  mockConsole((console2) => {
    console2.assert(true);
    let hasThrown = void 0;
    try {
      console2.assert(false);
      hasThrown = false;
    } catch {
      hasThrown = true;
    }
    assertEquals(hasThrown, false);
  });
});
unitTest(function consoleTestStringifyComplexObjects() {
  assertEquals(stringify("foo"), "foo");
  assertEquals(stringify(["foo", "bar"]), `[ "foo", "bar" ]`);
  assertEquals(stringify({foo: "bar"}), `{ foo: "bar" }`);
});
unitTest(function consoleTestStringifyComplexObjectsWithEscapedSequences() {
  assertEquals(stringify(["foo\b", "foo\f", "foo\n", "foo\r", "foo	", "foo\v", "foo\0"]), `[
  "foo\\b",   "foo\\f",
  "foo\\n",   "foo\\r",
  "foo\\t",   "foo\\v",
  "foo\\x00"
]`);
  assertEquals(stringify([
    Symbol(),
    Symbol(""),
    Symbol("foo\b"),
    Symbol("foo\f"),
    Symbol("foo\n"),
    Symbol("foo\r"),
    Symbol("foo	"),
    Symbol("foo\v"),
    Symbol("foo\0")
  ]), `[
  Symbol(),
  Symbol(""),
  Symbol("foo\\b"),
  Symbol("foo\\f"),
  Symbol("foo\\n"),
  Symbol("foo\\r"),
  Symbol("foo\\t"),
  Symbol("foo\\v"),
  Symbol("foo\\x00")
]`);
  assertEquals(stringify({"foo\b": "bar\n", "bar\r": "baz	", "qux\0": "qux\0"}), `{ "foo\\b": "bar\\n", "bar\\r": "baz\\t", "qux\\x00": "qux\\x00" }`);
  assertEquals(stringify({
    [Symbol("foo\b")]: `Symbol("foo
")`,
    [Symbol("bar\n")]: `Symbol("bar
")`,
    [Symbol("bar\r")]: `Symbol("bar\r")`,
    [Symbol("baz	")]: `Symbol("baz	")`,
    [Symbol("qux\0")]: `Symbol("qux\0")`
  }), `{
  [Symbol("foo\\b")]: 'Symbol("foo\\n")',
  [Symbol("bar\\n")]: 'Symbol("bar\\n")',
  [Symbol("bar\\r")]: 'Symbol("bar\\r")',
  [Symbol("baz\\t")]: 'Symbol("baz\\t")',
  [Symbol("qux\\x00")]: 'Symbol("qux\\x00")'
}`);
  assertEquals(stringify(new Set(["foo\n", "foo\r", "foo\0"])), `Set { "foo\\n", "foo\\r", "foo\\x00" }`);
});
unitTest(function consoleTestStringifyQuotes() {
  assertEquals(stringify(["\\"]), `[ "\\\\" ]`);
  assertEquals(stringify(['\\,"']), `[ '\\\\,"' ]`);
  assertEquals(stringify([`\\,",'`]), `[ \`\\\\,",'\` ]`);
  assertEquals(stringify(["\\,\",',`"]), `[ "\\\\,\\",',\`" ]`);
});
unitTest(function consoleTestStringifyLongStrings() {
  const veryLongString = "a".repeat(200);
  let actual = stringify({veryLongString});
  assert(actual.includes("..."));
  assert(actual.length < 200);
  actual = stringify(veryLongString);
  assertEquals(actual, veryLongString);
});
unitTest(function consoleTestStringifyCircular() {
  class Base {
    constructor() {
      this.a = 1;
    }
    m1() {
    }
  }
  class Extended extends Base {
    constructor() {
      super(...arguments);
      this.b = 2;
    }
    m2() {
    }
  }
  const nestedObj = {
    num: 1,
    bool: true,
    str: "a",
    method() {
    },
    async asyncMethod() {
    },
    *generatorMethod() {
    },
    un: void 0,
    nu: null,
    arrowFunc: () => {
    },
    extendedClass: new Extended(),
    nFunc: new Function(),
    extendedCstr: Extended
  };
  const circularObj = {
    num: 2,
    bool: false,
    str: "b",
    method() {
    },
    un: void 0,
    nu: null,
    nested: nestedObj,
    emptyObj: {},
    arr: [1, "s", false, null, nestedObj],
    baseClass: new Base()
  };
  nestedObj.o = circularObj;
  const nestedObjExpected = `{
  num: 1,
  bool: true,
  str: "a",
  method: [Function: method],
  asyncMethod: [AsyncFunction: asyncMethod],
  generatorMethod: [GeneratorFunction: generatorMethod],
  un: undefined,
  nu: null,
  arrowFunc: [Function: arrowFunc],
  extendedClass: Extended { a: 1, b: 2 },
  nFunc: [Function],
  extendedCstr: [Function: Extended],
  o: {
    num: 2,
    bool: false,
    str: "b",
    method: [Function: method],
    un: undefined,
    nu: null,
    nested: [Circular],
    emptyObj: {},
    arr: [ 1, "s", false, null, [Circular] ],
    baseClass: Base { a: 1 }
  }
}`;
  assertEquals(stringify(1), "1");
  assertEquals(stringify(-0), "-0");
  assertEquals(stringify(1n), "1n");
  assertEquals(stringify("s"), "s");
  assertEquals(stringify(false), "false");
  assertEquals(stringify(new Number(1)), "[Number: 1]");
  assertEquals(stringify(new Boolean(true)), "[Boolean: true]");
  assertEquals(stringify(new String("deno")), `[String: "deno"]`);
  assertEquals(stringify(/[0-9]*/), "/[0-9]*/");
  assertEquals(stringify(new Date("2018-12-10T02:26:59.002Z")), "2018-12-10T02:26:59.002Z");
  assertEquals(stringify(new Set([1, 2, 3])), "Set { 1, 2, 3 }");
  assertEquals(stringify(new Map([
    [1, "one"],
    [2, "two"]
  ])), `Map { 1 => "one", 2 => "two" }`);
  assertEquals(stringify(new WeakSet()), "WeakSet { [items unknown] }");
  assertEquals(stringify(new WeakMap()), "WeakMap { [items unknown] }");
  assertEquals(stringify(Symbol(1)), `Symbol("1")`);
  assertEquals(stringify(null), "null");
  assertEquals(stringify(void 0), "undefined");
  assertEquals(stringify(new Extended()), "Extended { a: 1, b: 2 }");
  assertEquals(stringify(function f() {
  }), "[Function: f]");
  assertEquals(stringify(async function af() {
  }), "[AsyncFunction: af]");
  assertEquals(stringify(function* gf() {
  }), "[GeneratorFunction: gf]");
  assertEquals(stringify(async function* agf() {
  }), "[AsyncGeneratorFunction: agf]");
  assertEquals(stringify(new Uint8Array([1, 2, 3])), "Uint8Array(3) [ 1, 2, 3 ]");
  assertEquals(stringify(Uint8Array.prototype), "Uint8Array {}");
  assertEquals(stringify({a: {b: {c: {d: new Set([1])}}}}), "{ a: { b: { c: { d: [Set] } } } }");
  assertEquals(stringify(nestedObj), nestedObjExpected);
  assertEquals(stringify(JSON), 'JSON { [Symbol(Symbol.toStringTag)]: "JSON" }');
  assertEquals(stringify(console), `{
  log: [Function: log],
  debug: [Function: log],
  info: [Function: log],
  dir: [Function: dir],
  dirxml: [Function: dir],
  warn: [Function: warn],
  error: [Function: warn],
  assert: [Function: assert],
  count: [Function: count],
  countReset: [Function: countReset],
  table: [Function: table],
  time: [Function: time],
  timeLog: [Function: timeLog],
  timeEnd: [Function: timeEnd],
  group: [Function: group],
  groupCollapsed: [Function: group],
  groupEnd: [Function: groupEnd],
  clear: [Function: clear],
  trace: [Function: trace],
  indentLevel: 0,
  [Symbol(isConsoleInstance)]: true
}`);
  assertEquals(stringify({str: 1, [Symbol.for("sym")]: 2, [Symbol.toStringTag]: "TAG"}), 'TAG { str: 1, [Symbol(sym)]: 2, [Symbol(Symbol.toStringTag)]: "TAG" }');
  assertEquals(stripColor(Deno.inspect(nestedObj)), nestedObjExpected);
});
unitTest(function consoleTestStringifyWithDepth() {
  const nestedObj = {a: {b: {c: {d: {e: {f: 42}}}}}};
  assertEquals(stripColor(inspectArgs([nestedObj], {depth: 3})), "{ a: { b: { c: [Object] } } }");
  assertEquals(stripColor(inspectArgs([nestedObj], {depth: 4})), "{ a: { b: { c: { d: [Object] } } } }");
  assertEquals(stripColor(inspectArgs([nestedObj], {depth: 0})), "[Object]");
  assertEquals(stripColor(inspectArgs([nestedObj])), "{ a: { b: { c: { d: [Object] } } } }");
  assertEquals(stripColor(Deno.inspect(nestedObj, {depth: 4})), "{ a: { b: { c: { d: [Object] } } } }");
});
unitTest(function consoleTestStringifyLargeObject() {
  const obj = {
    a: 2,
    o: {
      a: "1",
      b: "2",
      c: "3",
      d: "4",
      e: "5",
      f: "6",
      g: 10,
      asd: 2,
      asda: 3,
      x: {a: "asd", x: 3}
    }
  };
  assertEquals(stringify(obj), `{
  a: 2,
  o: {
    a: "1",
    b: "2",
    c: "3",
    d: "4",
    e: "5",
    f: "6",
    g: 10,
    asd: 2,
    asda: 3,
    x: { a: "asd", x: 3 }
  }
}`);
});
unitTest(function consoleTestStringifyIterable() {
  const shortArray = [1, 2, 3, 4, 5];
  assertEquals(stringify(shortArray), "[ 1, 2, 3, 4, 5 ]");
  const longArray = new Array(200).fill(0);
  assertEquals(stringify(longArray), `[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ... 100 more items
]`);
  const obj = {a: "a", longArray};
  assertEquals(stringify(obj), `{
  a: "a",
  longArray: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ... 100 more items
  ]
}`);
  const shortMap = new Map([
    ["a", 0],
    ["b", 1]
  ]);
  assertEquals(stringify(shortMap), `Map { "a" => 0, "b" => 1 }`);
  const longMap = new Map();
  for (const key of Array(200).keys()) {
    longMap.set(`${key}`, key);
  }
  assertEquals(stringify(longMap), `Map {
  "0" => 0,
  "1" => 1,
  "2" => 2,
  "3" => 3,
  "4" => 4,
  "5" => 5,
  "6" => 6,
  "7" => 7,
  "8" => 8,
  "9" => 9,
  "10" => 10,
  "11" => 11,
  "12" => 12,
  "13" => 13,
  "14" => 14,
  "15" => 15,
  "16" => 16,
  "17" => 17,
  "18" => 18,
  "19" => 19,
  "20" => 20,
  "21" => 21,
  "22" => 22,
  "23" => 23,
  "24" => 24,
  "25" => 25,
  "26" => 26,
  "27" => 27,
  "28" => 28,
  "29" => 29,
  "30" => 30,
  "31" => 31,
  "32" => 32,
  "33" => 33,
  "34" => 34,
  "35" => 35,
  "36" => 36,
  "37" => 37,
  "38" => 38,
  "39" => 39,
  "40" => 40,
  "41" => 41,
  "42" => 42,
  "43" => 43,
  "44" => 44,
  "45" => 45,
  "46" => 46,
  "47" => 47,
  "48" => 48,
  "49" => 49,
  "50" => 50,
  "51" => 51,
  "52" => 52,
  "53" => 53,
  "54" => 54,
  "55" => 55,
  "56" => 56,
  "57" => 57,
  "58" => 58,
  "59" => 59,
  "60" => 60,
  "61" => 61,
  "62" => 62,
  "63" => 63,
  "64" => 64,
  "65" => 65,
  "66" => 66,
  "67" => 67,
  "68" => 68,
  "69" => 69,
  "70" => 70,
  "71" => 71,
  "72" => 72,
  "73" => 73,
  "74" => 74,
  "75" => 75,
  "76" => 76,
  "77" => 77,
  "78" => 78,
  "79" => 79,
  "80" => 80,
  "81" => 81,
  "82" => 82,
  "83" => 83,
  "84" => 84,
  "85" => 85,
  "86" => 86,
  "87" => 87,
  "88" => 88,
  "89" => 89,
  "90" => 90,
  "91" => 91,
  "92" => 92,
  "93" => 93,
  "94" => 94,
  "95" => 95,
  "96" => 96,
  "97" => 97,
  "98" => 98,
  "99" => 99,
  ... 100 more items
}`);
  const shortSet = new Set([1, 2, 3]);
  assertEquals(stringify(shortSet), `Set { 1, 2, 3 }`);
  const longSet = new Set();
  for (const key of Array(200).keys()) {
    longSet.add(key);
  }
  assertEquals(stringify(longSet), `Set {
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  64,
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  82,
  83,
  84,
  85,
  86,
  87,
  88,
  89,
  90,
  91,
  92,
  93,
  94,
  95,
  96,
  97,
  98,
  99,
  ... 100 more items
}`);
  const withEmptyEl = Array(10);
  withEmptyEl.fill(0, 4, 6);
  assertEquals(stringify(withEmptyEl), `[ <4 empty items>, 0, 0, <4 empty items> ]`);
});
unitTest(function consoleTestStringifyIterableWhenGrouped() {
  const withOddNumberOfEls = new Float64Array([
    2.1,
    2.01,
    2.001,
    2.0001,
    2.00001,
    2.000001,
    2.0000001,
    2.00000001,
    2.000000001,
    2.0000000001,
    2
  ]);
  assertEquals(stringify(withOddNumberOfEls), `Float64Array(11) [
          2.1,         2.01,
        2.001,       2.0001,
      2.00001,     2.000001,
    2.0000001,   2.00000001,
  2.000000001, 2.0000000001,
            2
]`);
  const withEvenNumberOfEls = new Float64Array([
    2.1,
    2.01,
    2.001,
    2.0001,
    2.00001,
    2.000001,
    2.0000001,
    2.00000001,
    2.000000001,
    2.0000000001,
    2,
    2
  ]);
  assertEquals(stringify(withEvenNumberOfEls), `Float64Array(12) [
          2.1,         2.01,
        2.001,       2.0001,
      2.00001,     2.000001,
    2.0000001,   2.00000001,
  2.000000001, 2.0000000001,
            2,            2
]`);
  const withThreeColumns = [
    2,
    2.1,
    2.11,
    2,
    2.111,
    2.1111,
    2,
    2.1,
    2.11,
    2,
    2.1
  ];
  assertEquals(stringify(withThreeColumns), `[
  2,   2.1,   2.11,
  2, 2.111, 2.1111,
  2,   2.1,   2.11,
  2,   2.1
]`);
});
unitTest(async function consoleTestStringifyPromises() {
  const pendingPromise = new Promise((_res, _rej) => {
  });
  assertEquals(stringify(pendingPromise), "Promise { <pending> }");
  const resolvedPromise = new Promise((res, _rej) => {
    res("Resolved!");
  });
  assertEquals(stringify(resolvedPromise), `Promise { "Resolved!" }`);
  let rejectedPromise;
  try {
    rejectedPromise = new Promise((_, rej) => {
      rej(Error("Whoops"));
    });
    await rejectedPromise;
  } catch (err) {
  }
  const strLines = stringify(rejectedPromise).split("\n");
  assertEquals(strLines[0], "Promise {");
  assertEquals(strLines[1], "  <rejected> Error: Whoops");
});
unitTest(function consoleTestWithCustomInspector() {
  class A {
    [customInspect]() {
      return "b";
    }
  }
  assertEquals(stringify(new A()), "b");
});
unitTest(function consoleTestWithCustomInspectorError() {
  class A {
    [customInspect]() {
      throw new Error("BOOM");
    }
  }
  assertEquals(stringify(new A()), "A {}");
  class B {
    constructor(field) {
      this.field = field;
    }
    [customInspect]() {
      return this.field.a;
    }
  }
  assertEquals(stringify(new B({a: "a"})), "a");
  assertEquals(stringify(B.prototype), "B { [Symbol(Deno.customInspect)]: [Function: [Deno.customInspect]] }");
});
unitTest(function consoleTestWithCustomInspectFunction() {
  function a() {
  }
  Object.assign(a, {
    [customInspect]() {
      return "b";
    }
  });
  assertEquals(stringify(a), "b");
});
unitTest(function consoleTestWithIntegerFormatSpecifier() {
  assertEquals(stringify("%i"), "%i");
  assertEquals(stringify("%i", 42), "42");
  assertEquals(stringify("%i", 42), "42");
  assertEquals(stringify("%i", "42"), "NaN");
  assertEquals(stringify("%i", 1.5), "1");
  assertEquals(stringify("%i", -0.5), "0");
  assertEquals(stringify("%i", ""), "NaN");
  assertEquals(stringify("%i", Symbol()), "NaN");
  assertEquals(stringify("%i %d", 42, 43), "42 43");
  assertEquals(stringify("%d %i", 42), "42 %i");
  assertEquals(stringify("%d", 12345678901234568e6), "1");
  assertEquals(stringify("%i", 12345678901234567890123n), "12345678901234567890123n");
});
unitTest(function consoleTestWithFloatFormatSpecifier() {
  assertEquals(stringify("%f"), "%f");
  assertEquals(stringify("%f", 42), "42");
  assertEquals(stringify("%f", 42), "42");
  assertEquals(stringify("%f", "42"), "NaN");
  assertEquals(stringify("%f", 1.5), "1.5");
  assertEquals(stringify("%f", -0.5), "-0.5");
  assertEquals(stringify("%f", Math.PI), "3.141592653589793");
  assertEquals(stringify("%f", ""), "NaN");
  assertEquals(stringify("%f", Symbol("foo")), "NaN");
  assertEquals(stringify("%f", 5n), "NaN");
  assertEquals(stringify("%f %f", 42, 43), "42 43");
  assertEquals(stringify("%f %f", 42), "42 %f");
});
unitTest(function consoleTestWithStringFormatSpecifier() {
  assertEquals(stringify("%s"), "%s");
  assertEquals(stringify("%s", void 0), "undefined");
  assertEquals(stringify("%s", "foo"), "foo");
  assertEquals(stringify("%s", 42), "42");
  assertEquals(stringify("%s", "42"), "42");
  assertEquals(stringify("%s %s", 42, 43), "42 43");
  assertEquals(stringify("%s %s", 42), "42 %s");
  assertEquals(stringify("%s", Symbol("foo")), "Symbol(foo)");
});
unitTest(function consoleTestWithObjectFormatSpecifier() {
  assertEquals(stringify("%o"), "%o");
  assertEquals(stringify("%o", 42), "42");
  assertEquals(stringify("%o", "foo"), `"foo"`);
  assertEquals(stringify("o: %o, a: %O", {}, []), "o: {}, a: []");
  assertEquals(stringify("%o", {a: 42}), "{ a: 42 }");
  assertEquals(stringify("%o", {a: {b: {c: {d: new Set([1])}}}}), "{ a: { b: { c: { d: [Set] } } } }");
});
unitTest(function consoleTestWithStyleSpecifier() {
  assertEquals(stringify("%cfoo%cbar"), "%cfoo%cbar");
  assertEquals(stringify("%cfoo%cbar", ""), "foo%cbar");
  assertEquals(stripColor(stringify("%cfoo%cbar", "", "color: red")), "foobar");
});
unitTest(function consoleParseCssColor() {
  assertEquals(parseCssColor("black"), [0, 0, 0]);
  assertEquals(parseCssColor("darkmagenta"), [139, 0, 139]);
  assertEquals(parseCssColor("slateblue"), [106, 90, 205]);
  assertEquals(parseCssColor("#ffaa00"), [255, 170, 0]);
  assertEquals(parseCssColor("#ffaa00"), [255, 170, 0]);
  assertEquals(parseCssColor("#18d"), [16, 128, 208]);
  assertEquals(parseCssColor("#18D"), [16, 128, 208]);
  assertEquals(parseCssColor("rgb(100, 200, 50)"), [100, 200, 50]);
  assertEquals(parseCssColor("rgb(+100.3, -200, .5)"), [100, 0, 1]);
  assertEquals(parseCssColor("hsl(75, 60%, 40%)"), [133, 163, 41]);
  assertEquals(parseCssColor("rgb(100,200,50)"), [100, 200, 50]);
  assertEquals(parseCssColor("rgb( 	\n100 	\n, 	\n200 	\n, 	\n50 	\n)"), [100, 200, 50]);
});
unitTest(function consoleParseCss() {
  assertEquals(parseCss("background-color: red"), {...DEFAULT_CSS, backgroundColor: [255, 0, 0]});
  assertEquals(parseCss("color: blue"), {...DEFAULT_CSS, color: [0, 0, 255]});
  assertEquals(parseCss("font-weight: bold"), {...DEFAULT_CSS, fontWeight: "bold"});
  assertEquals(parseCss("font-style: italic"), {...DEFAULT_CSS, fontStyle: "italic"});
  assertEquals(parseCss("font-style: oblique"), {...DEFAULT_CSS, fontStyle: "italic"});
  assertEquals(parseCss("text-decoration-color: green"), {...DEFAULT_CSS, textDecorationColor: [0, 128, 0]});
  assertEquals(parseCss("text-decoration-line: underline overline line-through"), {
    ...DEFAULT_CSS,
    textDecorationLine: ["underline", "overline", "line-through"]
  });
  assertEquals(parseCss("text-decoration: yellow underline"), {
    ...DEFAULT_CSS,
    textDecorationColor: [255, 255, 0],
    textDecorationLine: ["underline"]
  });
  assertEquals(parseCss("color:red;font-weight:bold;"), {...DEFAULT_CSS, color: [255, 0, 0], fontWeight: "bold"});
  assertEquals(parseCss(" 	\ncolor 	\n: 	\nred 	\n; 	\nfont-weight 	\n: 	\nbold 	\n; 	\n"), {...DEFAULT_CSS, color: [255, 0, 0], fontWeight: "bold"});
  assertEquals(parseCss("color: red; font-weight: bold, font-style: italic"), {...DEFAULT_CSS, color: [255, 0, 0]});
});
unitTest(function consoleCssToAnsi() {
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, backgroundColor: [200, 201, 202]}), "_[48;2;200;201;202m");
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, color: [203, 204, 205]}), "_[38;2;203;204;205m");
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, fontWeight: "bold"}), "_[1m");
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, fontStyle: "italic"}), "_[3m");
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, textDecorationColor: [206, 207, 208]}), "_[58;2;206;207;208m");
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, textDecorationLine: ["underline"]}), "_[4m");
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, textDecorationLine: ["overline", "line-through"]}), "_[9m_[53m");
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, color: [203, 204, 205], fontWeight: "bold"}), "_[38;2;203;204;205m_[1m");
  assertEquals(cssToAnsiEsc({...DEFAULT_CSS, color: [0, 0, 0], fontWeight: "bold"}, {...DEFAULT_CSS, color: [203, 204, 205], fontStyle: "italic"}), "_[38;2;0;0;0m_[1m_[23m");
});
unitTest(function consoleTestWithVariousOrInvalidFormatSpecifier() {
  assertEquals(stringify("%s:%s"), "%s:%s");
  assertEquals(stringify("%i:%i"), "%i:%i");
  assertEquals(stringify("%d:%d"), "%d:%d");
  assertEquals(stringify("%%s%s", "foo"), "%sfoo");
  assertEquals(stringify("%s:%s", void 0), "undefined:%s");
  assertEquals(stringify("%s:%s", "foo", "bar"), "foo:bar");
  assertEquals(stringify("%s:%s", "foo", "bar", "baz"), "foo:bar baz");
  assertEquals(stringify("%%%s%%", "hi"), "%hi%");
  assertEquals(stringify("%d:%d", 12), "12:%d");
  assertEquals(stringify("%i:%i", 12), "12:%i");
  assertEquals(stringify("%f:%f", 12), "12:%f");
  assertEquals(stringify("o: %o, a: %o", {}), "o: {}, a: %o");
  assertEquals(stringify("abc%", 1), "abc% 1");
});
unitTest(function consoleTestCallToStringOnLabel() {
  const methods = ["count", "countReset", "time", "timeLog", "timeEnd"];
  mockConsole((console2) => {
    for (const method of methods) {
      let hasCalled = false;
      console2[method]({
        toString() {
          hasCalled = true;
        }
      });
      assertEquals(hasCalled, true);
    }
  });
});
unitTest(function consoleTestError() {
  class MyError extends Error {
    constructor(errStr) {
      super(errStr);
      this.name = "MyError";
    }
  }
  try {
    throw new MyError("This is an error");
  } catch (e) {
    assert(stringify(e).split("\n")[0].includes("MyError: This is an error"));
  }
});
unitTest(function consoleTestClear() {
  mockConsole((console2, out) => {
    console2.clear();
    assertEquals(out.toString(), "[1;1H[0J");
  });
});
unitTest(function consoleDetachedLog() {
  mockConsole((console2) => {
    const log = console2.log;
    const dir = console2.dir;
    const dirxml = console2.dirxml;
    const debug = console2.debug;
    const info = console2.info;
    const warn = console2.warn;
    const error = console2.error;
    const consoleAssert = console2.assert;
    const consoleCount = console2.count;
    const consoleCountReset = console2.countReset;
    const consoleTable2 = console2.table;
    const consoleTime = console2.time;
    const consoleTimeLog = console2.timeLog;
    const consoleTimeEnd = console2.timeEnd;
    const consoleGroup2 = console2.group;
    const consoleGroupEnd = console2.groupEnd;
    const consoleClear = console2.clear;
    log("Hello world");
    dir("Hello world");
    dirxml("Hello world");
    debug("Hello world");
    info("Hello world");
    warn("Hello world");
    error("Hello world");
    consoleAssert(true);
    consoleCount("Hello world");
    consoleCountReset("Hello world");
    consoleTable2({test: "Hello world"});
    consoleTime("Hello world");
    consoleTimeLog("Hello world");
    consoleTimeEnd("Hello world");
    consoleGroup2("Hello world");
    consoleGroupEnd();
    consoleClear();
  });
});
class StringBuffer {
  constructor() {
    this.chunks = [];
  }
  add(x) {
    this.chunks.push(x);
  }
  toString() {
    return this.chunks.join("");
  }
}
function mockConsole(f) {
  const out = new StringBuffer();
  const err = new StringBuffer();
  const both = new StringBuffer();
  const csl = new Console((x, isErr, printsNewLine) => {
    const content = x + (printsNewLine ? "\n" : "");
    const buf = isErr ? err : out;
    buf.add(content);
    both.add(content);
  });
  f(csl, out, err, both);
}
unitTest(function consoleGroup() {
  mockConsole((console2, out) => {
    console2.group("1");
    console2.log("2");
    console2.group("3");
    console2.log("4");
    console2.groupEnd();
    console2.groupEnd();
    console2.log("5");
    console2.log("6");
    assertEquals(out.toString(), `1
    2
    3
        4
5
6
`);
  });
});
unitTest(function consoleGroupWarn() {
  mockConsole((console2, _out, _err, both) => {
    assert(both);
    console2.warn("1");
    console2.group();
    console2.warn("2");
    console2.group();
    console2.warn("3");
    console2.groupEnd();
    console2.warn("4");
    console2.groupEnd();
    console2.warn("5");
    console2.warn("6");
    console2.warn("7");
    assertEquals(both.toString(), `1
    2
        3
    4
5
6
7
`);
  });
});
unitTest(function consoleTable() {
  mockConsole((console2, out) => {
    console2.table({a: "test", b: 1});
    assertEquals(stripColor(out.toString()), `┌───────┬────────┐
│ (idx) │ Values │
├───────┼────────┤
│   a   │ "test" │
│   b   │   1    │
└───────┴────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table({a: {b: 10}, b: {b: 20, c: 30}}, ["c"]);
    assertEquals(stripColor(out.toString()), `┌───────┬────┐
│ (idx) │ c  │
├───────┼────┤
│   a   │    │
│   b   │ 30 │
└───────┴────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table([1, 2, [3, [4]], [5, 6], [[7], [8]]]);
    assertEquals(stripColor(out.toString()), `┌───────┬───────┬───────┬────────┐
│ (idx) │   0   │   1   │ Values │
├───────┼───────┼───────┼────────┤
│   0   │       │       │   1    │
│   1   │       │       │   2    │
│   2   │   3   │ [ 4 ] │        │
│   3   │   5   │   6   │        │
│   4   │ [ 7 ] │ [ 8 ] │        │
└───────┴───────┴───────┴────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table(new Set([1, 2, 3, "test"]));
    assertEquals(stripColor(out.toString()), `┌────────────┬────────┐
│ (iter idx) │ Values │
├────────────┼────────┤
│     0      │   1    │
│     1      │   2    │
│     2      │   3    │
│     3      │ "test" │
└────────────┴────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table(new Map([
      [1, "one"],
      [2, "two"]
    ]));
    assertEquals(stripColor(out.toString()), `┌────────────┬─────┬────────┐
│ (iter idx) │ Key │ Values │
├────────────┼─────┼────────┤
│     0      │  1  │ "one"  │
│     1      │  2  │ "two"  │
└────────────┴─────┴────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table({
      a: true,
      b: {c: {d: 10}, e: [1, 2, [5, 6]]},
      f: "test",
      g: new Set([1, 2, 3, "test"]),
      h: new Map([[1, "one"]])
    });
    assertEquals(stripColor(out.toString()), `┌───────┬───────────┬───────────────────┬────────┐
│ (idx) │     c     │         e         │ Values │
├───────┼───────────┼───────────────────┼────────┤
│   a   │           │                   │  true  │
│   b   │ { d: 10 } │ [ 1, 2, [Array] ] │        │
│   f   │           │                   │ "test" │
│   g   │           │                   │        │
│   h   │           │                   │        │
└───────┴───────────┴───────────────────┴────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table([
      1,
      "test",
      false,
      {a: 10},
      ["test", {b: 20, c: "test"}]
    ]);
    assertEquals(stripColor(out.toString()), `┌───────┬────────┬──────────────────────┬────┬────────┐
│ (idx) │   0    │          1           │ a  │ Values │
├───────┼────────┼──────────────────────┼────┼────────┤
│   0   │        │                      │    │   1    │
│   1   │        │                      │    │ "test" │
│   2   │        │                      │    │ false  │
│   3   │        │                      │ 10 │        │
│   4   │ "test" │ { b: 20, c: "test" } │    │        │
└───────┴────────┴──────────────────────┴────┴────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table([]);
    assertEquals(stripColor(out.toString()), `┌───────┐
│ (idx) │
├───────┤
└───────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table({});
    assertEquals(stripColor(out.toString()), `┌───────┐
│ (idx) │
├───────┤
└───────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table(new Set());
    assertEquals(stripColor(out.toString()), `┌────────────┐
│ (iter idx) │
├────────────┤
└────────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table(new Map());
    assertEquals(stripColor(out.toString()), `┌────────────┐
│ (iter idx) │
├────────────┤
└────────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table("test");
    assertEquals(out.toString(), "test\n");
  });
  mockConsole((console2, out) => {
    console2.table(["Hello", "你好", "Amapá"]);
    assertEquals(stripColor(out.toString()), `┌───────┬─────────┐
│ (idx) │ Values  │
├───────┼─────────┤
│   0   │ "Hello" │
│   1   │ "你好"  │
│   2   │ "Amapá" │
└───────┴─────────┘
`);
  });
  mockConsole((console2, out) => {
    console2.table([
      [1, 2],
      [3, 4]
    ]);
    assertEquals(stripColor(out.toString()), `┌───────┬───┬───┐
│ (idx) │ 0 │ 1 │
├───────┼───┼───┤
│   0   │ 1 │ 2 │
│   1   │ 3 │ 4 │
└───────┴───┴───┘
`);
  });
  mockConsole((console2, out) => {
    console2.table({1: {a: 4, b: 5}, 2: null, 3: {b: 6, c: 7}}, ["b"]);
    assertEquals(stripColor(out.toString()), `┌───────┬───┐
│ (idx) │ b │
├───────┼───┤
│   1   │ 5 │
│   2   │   │
│   3   │ 6 │
└───────┴───┘
`);
  });
});
unitTest(function consoleLogShouldNotThrowError() {
  mockConsole((console2) => {
    let result = 0;
    try {
      console2.log(new Error("foo"));
      result = 1;
    } catch (e) {
      result = 2;
    }
    assertEquals(result, 1);
  });
  mockConsole((console2, out) => {
    console2.log(new Error("foo"));
    assertEquals(out.toString().includes("Uncaught"), false);
  });
});
unitTest(function consoleLogShoultNotThrowErrorWhenInvalidDateIsPassed() {
  mockConsole((console2, out) => {
    const invalidDate = new Date("test");
    console2.log(invalidDate);
    assertEquals(stripColor(out.toString()), "Invalid Date\n");
  });
});
unitTest(function consoleDir() {
  mockConsole((console2, out) => {
    console2.dir("DIR");
    assertEquals(out.toString(), "DIR\n");
  });
  mockConsole((console2, out) => {
    console2.dir("DIR", {indentLevel: 2});
    assertEquals(out.toString(), "    DIR\n");
  });
});
unitTest(function consoleDirXml() {
  mockConsole((console2, out) => {
    console2.dirxml("DIRXML");
    assertEquals(out.toString(), "DIRXML\n");
  });
  mockConsole((console2, out) => {
    console2.dirxml("DIRXML", {indentLevel: 2});
    assertEquals(out.toString(), "    DIRXML\n");
  });
});
unitTest(function consoleTrace() {
  mockConsole((console2, _out, err) => {
    console2.trace("%s", "custom message");
    assert(err);
    assert(err.toString().includes("Trace: custom message"));
  });
});
unitTest(function inspectString() {
  assertEquals(stripColor(Deno.inspect("\0")), `"\\x00"`);
  assertEquals(stripColor(Deno.inspect("[2J")), `"\\x1b[2J"`);
});
unitTest(function inspectGetterError() {
  assertEquals(Deno.inspect({
    get foo() {
      throw new Error("bar");
    }
  }), "{ foo: [Thrown Error: bar] }");
});
unitTest(function inspectPrototype() {
  class A {
  }
  assertEquals(Deno.inspect(A.prototype), "A {}");
});
unitTest(function inspectSorted() {
  assertEquals(stripColor(Deno.inspect({b: 2, a: 1}, {sorted: true})), "{ a: 1, b: 2 }");
  assertEquals(stripColor(Deno.inspect(new Set(["b", "a"]), {sorted: true})), `Set { "a", "b" }`);
  assertEquals(stripColor(Deno.inspect(new Map([
    ["b", 2],
    ["a", 1]
  ]), {sorted: true})), `Map { "a" => 1, "b" => 2 }`);
});
unitTest(function inspectTrailingComma() {
  assertEquals(stripColor(Deno.inspect([
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  ], {trailingComma: true})), `[
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
]`);
  assertEquals(stripColor(Deno.inspect({
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1,
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2
  }, {trailingComma: true})), `{
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1,
  bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2,
}`);
  assertEquals(stripColor(Deno.inspect(new Set([
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  ]), {trailingComma: true})), `Set {
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
}`);
  assertEquals(stripColor(Deno.inspect(new Map([
    ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 1],
    ["bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", 2]
  ]), {trailingComma: true})), `Map {
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" => 1,
  "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" => 2,
}`);
});
unitTest(function inspectCompact() {
  assertEquals(stripColor(Deno.inspect({a: 1, b: 2}, {compact: false})), `{
  a: 1,
  b: 2
}`);
});
unitTest(function inspectIterableLimit() {
  assertEquals(stripColor(Deno.inspect(["a", "b", "c"], {iterableLimit: 2})), `[ "a", "b", ... 1 more items ]`);
  assertEquals(stripColor(Deno.inspect(new Set(["a", "b", "c"]), {iterableLimit: 2})), `Set { "a", "b", ... 1 more items }`);
  assertEquals(stripColor(Deno.inspect(new Map([
    ["a", 1],
    ["b", 2],
    ["c", 3]
  ]), {iterableLimit: 2})), `Map { "a" => 1, "b" => 2, ... 1 more items }`);
});
unitTest(function inspectProxy() {
  assertEquals(stripColor(Deno.inspect(new Proxy([1, 2, 3], {get() {
  }}))), "[ 1, 2, 3 ]");
  assertEquals(stripColor(Deno.inspect(new Proxy({key: "value"}, {get() {
  }}))), `{ key: "value" }`);
  assertEquals(stripColor(Deno.inspect(new Proxy([1, 2, 3], {get() {
  }}), {showProxy: true})), "Proxy [ [ 1, 2, 3 ], { get: [Function: get] } ]");
  assertEquals(stripColor(Deno.inspect(new Proxy({a: 1}, {
    set() {
      return false;
    }
  }), {showProxy: true})), "Proxy [ { a: 1 }, { set: [Function: set] } ]");
  assertEquals(stripColor(Deno.inspect(new Proxy([1, 2, 3, 4, 5, 6, 7], {get() {
  }}), {showProxy: true})), `Proxy [ [
    1, 2, 3, 4,
    5, 6, 7
  ], { get: [Function: get] } ]`);
  assertEquals(stripColor(Deno.inspect(new Proxy(function fn() {
  }, {get() {
  }}), {showProxy: true})), "Proxy [ [Function: fn], { get: [Function: get] } ]");
});
unitTest(function inspectColors() {
  assertEquals(Deno.inspect(1), "1");
  assertStringContains(Deno.inspect(1, {colors: true}), "[");
});
