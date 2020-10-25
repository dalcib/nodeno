import {assert, assertEquals, unitTest} from "./test_util.mjs";
unitTest(function urlSearchParamsWithMultipleSpaces() {
  const init = {str: "this string has spaces in it"};
  const searchParams = new URLSearchParams(init).toString();
  assertEquals(searchParams, "str=this+string+has+spaces+in+it");
});
unitTest(function urlSearchParamsWithExclamation() {
  const init = [
    ["str", "hello, world!"]
  ];
  const searchParams = new URLSearchParams(init).toString();
  assertEquals(searchParams, "str=hello%2C+world%21");
});
unitTest(function urlSearchParamsWithQuotes() {
  const init = [
    ["str", "'hello world'"]
  ];
  const searchParams = new URLSearchParams(init).toString();
  assertEquals(searchParams, "str=%27hello+world%27");
});
unitTest(function urlSearchParamsWithBraket() {
  const init = [
    ["str", "(hello world)"]
  ];
  const searchParams = new URLSearchParams(init).toString();
  assertEquals(searchParams, "str=%28hello+world%29");
});
unitTest(function urlSearchParamsWithTilde() {
  const init = [
    ["str", "hello~world"]
  ];
  const searchParams = new URLSearchParams(init).toString();
  assertEquals(searchParams, "str=hello%7Eworld");
});
unitTest(function urlSearchParamsInitString() {
  const init = "c=4&a=2&b=3&%C3%A1=1";
  const searchParams = new URLSearchParams(init);
  assert(init === searchParams.toString(), "The init query string does not match");
});
unitTest(function urlSearchParamsInitStringWithPlusCharacter() {
  const init = "q=a+b";
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.toString(), init);
  assertEquals(searchParams.get("q"), "a b");
});
unitTest(function urlSearchParamsInitIterable() {
  const init = [
    ["a", "54"],
    ["b", "true"]
  ];
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.toString(), "a=54&b=true");
});
unitTest(function urlSearchParamsInitRecord() {
  const init = {a: "54", b: "true"};
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.toString(), "a=54&b=true");
});
unitTest(function urlSearchParamsInit() {
  const params1 = new URLSearchParams("a=b");
  assertEquals(params1.toString(), "a=b");
  const params2 = new URLSearchParams(params1);
  assertEquals(params2.toString(), "a=b");
});
unitTest(function urlSearchParamsAppendSuccess() {
  const searchParams = new URLSearchParams();
  searchParams.append("a", "true");
  assertEquals(searchParams.toString(), "a=true");
});
unitTest(function urlSearchParamsDeleteSuccess() {
  const init = "a=54&b=true";
  const searchParams = new URLSearchParams(init);
  searchParams.delete("b");
  assertEquals(searchParams.toString(), "a=54");
});
unitTest(function urlSearchParamsGetAllSuccess() {
  const init = "a=54&b=true&a=true";
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.getAll("a"), ["54", "true"]);
  assertEquals(searchParams.getAll("b"), ["true"]);
  assertEquals(searchParams.getAll("c"), []);
});
unitTest(function urlSearchParamsGetSuccess() {
  const init = "a=54&b=true&a=true";
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.get("a"), "54");
  assertEquals(searchParams.get("b"), "true");
  assertEquals(searchParams.get("c"), null);
});
unitTest(function urlSearchParamsHasSuccess() {
  const init = "a=54&b=true&a=true";
  const searchParams = new URLSearchParams(init);
  assert(searchParams.has("a"));
  assert(searchParams.has("b"));
  assert(!searchParams.has("c"));
});
unitTest(function urlSearchParamsSetReplaceFirstAndRemoveOthers() {
  const init = "a=54&b=true&a=true";
  const searchParams = new URLSearchParams(init);
  searchParams.set("a", "false");
  assertEquals(searchParams.toString(), "a=false&b=true");
});
unitTest(function urlSearchParamsSetAppendNew() {
  const init = "a=54&b=true&a=true";
  const searchParams = new URLSearchParams(init);
  searchParams.set("c", "foo");
  assertEquals(searchParams.toString(), "a=54&b=true&a=true&c=foo");
});
unitTest(function urlSearchParamsSortSuccess() {
  const init = "c=4&a=2&b=3&a=1";
  const searchParams = new URLSearchParams(init);
  searchParams.sort();
  assertEquals(searchParams.toString(), "a=2&a=1&b=3&c=4");
});
unitTest(function urlSearchParamsForEachSuccess() {
  const init = [
    ["a", "54"],
    ["b", "true"]
  ];
  const searchParams = new URLSearchParams(init);
  let callNum = 0;
  searchParams.forEach((value, key, parent) => {
    assertEquals(searchParams, parent);
    assertEquals(value, init[callNum][1]);
    assertEquals(key, init[callNum][0]);
    callNum++;
  });
  assertEquals(callNum, init.length);
});
unitTest(function urlSearchParamsMissingName() {
  const init = "=4";
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.get(""), "4");
  assertEquals(searchParams.toString(), "=4");
});
unitTest(function urlSearchParamsMissingValue() {
  const init = "4=";
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.get("4"), "");
  assertEquals(searchParams.toString(), "4=");
});
unitTest(function urlSearchParamsMissingEqualSign() {
  const init = "4";
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.get("4"), "");
  assertEquals(searchParams.toString(), "4=");
});
unitTest(function urlSearchParamsMissingPair() {
  const init = "c=4&&a=54&";
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.toString(), "c=4&a=54");
});
unitTest(function urlSearchParamsForShortEncodedChar() {
  const init = {linefeed: "\n", tab: "	"};
  const searchParams = new URLSearchParams(init);
  assertEquals(searchParams.toString(), "linefeed=%0A&tab=%09");
});
unitTest(function urlSearchParamsShouldThrowTypeError() {
  let hasThrown = 0;
  try {
    new URLSearchParams([["1"]]);
    hasThrown = 1;
  } catch (err) {
    if (err instanceof TypeError) {
      hasThrown = 2;
    } else {
      hasThrown = 3;
    }
  }
  assertEquals(hasThrown, 2);
  try {
    new URLSearchParams([["1", "2", "3"]]);
    hasThrown = 1;
  } catch (err) {
    if (err instanceof TypeError) {
      hasThrown = 2;
    } else {
      hasThrown = 3;
    }
  }
  assertEquals(hasThrown, 2);
});
unitTest(function urlSearchParamsAppendArgumentsCheck() {
  const methodRequireOneParam = ["delete", "getAll", "get", "has", "forEach"];
  const methodRequireTwoParams = ["append", "set"];
  methodRequireOneParam.concat(methodRequireTwoParams).forEach((method) => {
    const searchParams = new URLSearchParams();
    let hasThrown = 0;
    try {
      searchParams[method]();
      hasThrown = 1;
    } catch (err) {
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    assertEquals(hasThrown, 2);
  });
  methodRequireTwoParams.forEach((method) => {
    const searchParams = new URLSearchParams();
    let hasThrown = 0;
    try {
      searchParams[method]("foo");
      hasThrown = 1;
    } catch (err) {
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    assertEquals(hasThrown, 2);
  });
});
unitTest(function urlSearchParamsDeletingAppendedMultiple() {
  const params = new URLSearchParams();
  params.append("first", 1);
  assert(params.has("first"));
  assertEquals(params.get("first"), "1");
  params.delete("first");
  assertEquals(params.has("first"), false);
  params.append("first", 1);
  params.append("first", 10);
  params.delete("first");
  assertEquals(params.has("first"), false);
});
unitTest(function urlSearchParamsCustomSymbolIterator() {
  const params = new URLSearchParams();
  params[Symbol.iterator] = function* () {
    yield ["a", "b"];
  };
  const params1 = new URLSearchParams(params);
  assertEquals(params1.get("a"), "b");
});
unitTest(function urlSearchParamsCustomSymbolIteratorWithNonStringParams() {
  const params = {};
  params[Symbol.iterator] = function* () {
    yield [1, 2];
  };
  const params1 = new URLSearchParams(params);
  assertEquals(params1.get("1"), "2");
});
unitTest(function urlSearchParamsOverridingAppendNotChangeConstructorAndSet() {
  let overridedAppendCalled = 0;
  class CustomSearchParams extends URLSearchParams {
    append(name, value) {
      ++overridedAppendCalled;
      super.append(name, value);
    }
  }
  new CustomSearchParams("foo=bar");
  new CustomSearchParams([["foo", "bar"]]);
  new CustomSearchParams(new CustomSearchParams({foo: "bar"}));
  new CustomSearchParams().set("foo", "bar");
  assertEquals(overridedAppendCalled, 0);
});
unitTest(function urlSearchParamsOverridingEntriesNotChangeForEach() {
  class CustomSearchParams extends URLSearchParams {
    *entries() {
      yield* [];
    }
  }
  let loopCount = 0;
  const params = new CustomSearchParams({foo: "bar"});
  params.forEach(() => void ++loopCount);
  assertEquals(loopCount, 1);
});
