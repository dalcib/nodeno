import {
  assert,
  assertEquals,
  assertStringContains,
  unitTest
} from "./test_util.mjs";
const {
  inspectArgs
} = Deno[Deno.internal];
unitTest(function headersHasCorrectNameProp() {
  assertEquals(Headers.name, "Headers");
});
unitTest(function newHeaderTest() {
  new Headers();
  new Headers(void 0);
  new Headers({});
  try {
    new Headers(null);
  } catch (e) {
    assertEquals(e.message, "Failed to construct 'Headers'; The provided value was not valid");
  }
});
const headerDict = {
  name1: "value1",
  name2: "value2",
  name3: "value3",
  name4: void 0,
  "Content-Type": "value4"
};
const headerSeq = [];
for (const name in headerDict) {
  headerSeq.push([name, headerDict[name]]);
}
unitTest(function newHeaderWithSequence() {
  const headers = new Headers(headerSeq);
  for (const name in headerDict) {
    assertEquals(headers.get(name), String(headerDict[name]));
  }
  assertEquals(headers.get("length"), null);
});
unitTest(function newHeaderWithRecord() {
  const headers = new Headers(headerDict);
  for (const name in headerDict) {
    assertEquals(headers.get(name), String(headerDict[name]));
  }
});
unitTest(function newHeaderWithHeadersInstance() {
  const headers = new Headers(headerDict);
  const headers2 = new Headers(headers);
  for (const name in headerDict) {
    assertEquals(headers2.get(name), String(headerDict[name]));
  }
});
unitTest(function headerAppendSuccess() {
  const headers = new Headers();
  for (const name in headerDict) {
    headers.append(name, headerDict[name]);
    assertEquals(headers.get(name), String(headerDict[name]));
  }
});
unitTest(function headerSetSuccess() {
  const headers = new Headers();
  for (const name in headerDict) {
    headers.set(name, headerDict[name]);
    assertEquals(headers.get(name), String(headerDict[name]));
  }
});
unitTest(function headerHasSuccess() {
  const headers = new Headers(headerDict);
  for (const name in headerDict) {
    assert(headers.has(name), "headers has name " + name);
    assert(!headers.has("nameNotInHeaders"), "headers do not have header: nameNotInHeaders");
  }
});
unitTest(function headerDeleteSuccess() {
  const headers = new Headers(headerDict);
  for (const name in headerDict) {
    assert(headers.has(name), "headers have a header: " + name);
    headers.delete(name);
    assert(!headers.has(name), "headers do not have anymore a header: " + name);
  }
});
unitTest(function headerGetSuccess() {
  const headers = new Headers(headerDict);
  for (const name in headerDict) {
    assertEquals(headers.get(name), String(headerDict[name]));
    assertEquals(headers.get("nameNotInHeaders"), null);
  }
});
unitTest(function headerEntriesSuccess() {
  const headers = new Headers(headerDict);
  const iterators = headers.entries();
  for (const it of iterators) {
    const key = it[0];
    const value = it[1];
    assert(headers.has(key));
    assertEquals(value, headers.get(key));
  }
});
unitTest(function headerKeysSuccess() {
  const headers = new Headers(headerDict);
  const iterators = headers.keys();
  for (const it of iterators) {
    assert(headers.has(it));
  }
});
unitTest(function headerValuesSuccess() {
  const headers = new Headers(headerDict);
  const iterators = headers.values();
  const entries = headers.entries();
  const values = [];
  for (const pair of entries) {
    values.push(pair[1]);
  }
  for (const it of iterators) {
    assert(values.includes(it));
  }
});
const headerEntriesDict = {
  name1: "value1",
  Name2: "value2",
  name: "value3",
  "content-Type": "value4",
  "Content-Typ": "value5",
  "Content-Types": "value6"
};
unitTest(function headerForEachSuccess() {
  const headers = new Headers(headerEntriesDict);
  const keys = Object.keys(headerEntriesDict);
  keys.forEach((key) => {
    const value = headerEntriesDict[key];
    const newkey = key.toLowerCase();
    headerEntriesDict[newkey] = value;
  });
  let callNum = 0;
  headers.forEach((value, key, container) => {
    assertEquals(headers, container);
    assertEquals(value, headerEntriesDict[key]);
    callNum++;
  });
  assertEquals(callNum, keys.length);
});
unitTest(function headerSymbolIteratorSuccess() {
  assert(Symbol.iterator in Headers.prototype);
  const headers = new Headers(headerEntriesDict);
  for (const header of headers) {
    const key = header[0];
    const value = header[1];
    assert(headers.has(key));
    assertEquals(value, headers.get(key));
  }
});
unitTest(function headerTypesAvailable() {
  function newHeaders() {
    return new Headers();
  }
  const headers = newHeaders();
  assert(headers instanceof Headers);
});
unitTest(function headerIllegalReject() {
  let errorCount = 0;
  try {
    new Headers({"He y": "ok"});
  } catch (e) {
    errorCount++;
  }
  try {
    new Headers({"Hé-y": "ok"});
  } catch (e) {
    errorCount++;
  }
  try {
    new Headers({"He-y": "ăk"});
  } catch (e) {
    errorCount++;
  }
  const headers = new Headers();
  try {
    headers.append("Hé-y", "ok");
  } catch (e) {
    errorCount++;
  }
  try {
    headers.delete("Hé-y");
  } catch (e) {
    errorCount++;
  }
  try {
    headers.get("Hé-y");
  } catch (e) {
    errorCount++;
  }
  try {
    headers.has("Hé-y");
  } catch (e) {
    errorCount++;
  }
  try {
    headers.set("Hé-y", "ok");
  } catch (e) {
    errorCount++;
  }
  try {
    headers.set("", "ok");
  } catch (e) {
    errorCount++;
  }
  assertEquals(errorCount, 9);
  new Headers({"He-y": "o k"});
});
unitTest(function headerParamsShouldThrowTypeError() {
  let hasThrown = 0;
  try {
    new Headers([["1"]]);
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
unitTest(function headerParamsArgumentsCheck() {
  const methodRequireOneParam = ["delete", "get", "has", "forEach"];
  const methodRequireTwoParams = ["append", "set"];
  methodRequireOneParam.forEach((method) => {
    const headers = new Headers();
    let hasThrown = 0;
    let errMsg = "";
    try {
      headers[method]();
      hasThrown = 1;
    } catch (err) {
      errMsg = err.message;
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    assertEquals(hasThrown, 2);
    assertStringContains(errMsg, `${method} requires at least 1 argument, but only 0 present`);
  });
  methodRequireTwoParams.forEach((method) => {
    const headers = new Headers();
    let hasThrown = 0;
    let errMsg = "";
    try {
      headers[method]();
      hasThrown = 1;
    } catch (err) {
      errMsg = err.message;
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    assertEquals(hasThrown, 2);
    assertStringContains(errMsg, `${method} requires at least 2 arguments, but only 0 present`);
    hasThrown = 0;
    errMsg = "";
    try {
      headers[method]("foo");
      hasThrown = 1;
    } catch (err) {
      errMsg = err.message;
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    assertEquals(hasThrown, 2);
    assertStringContains(errMsg, `${method} requires at least 2 arguments, but only 1 present`);
  });
});
unitTest(function headersInitMultiple() {
  const headers = new Headers([
    ["Set-Cookie", "foo=bar"],
    ["Set-Cookie", "bar=baz"],
    ["X-Deno", "foo"],
    ["X-Deno", "bar"]
  ]);
  const actual = [...headers];
  assertEquals(actual, [
    ["set-cookie", "foo=bar"],
    ["set-cookie", "bar=baz"],
    ["x-deno", "foo, bar"]
  ]);
});
unitTest(function headersAppendMultiple() {
  const headers = new Headers([
    ["Set-Cookie", "foo=bar"],
    ["X-Deno", "foo"]
  ]);
  headers.append("set-Cookie", "bar=baz");
  headers.append("x-Deno", "bar");
  const actual = [...headers];
  assertEquals(actual, [
    ["set-cookie", "foo=bar"],
    ["x-deno", "foo, bar"],
    ["set-cookie", "bar=baz"]
  ]);
});
unitTest(function headersAppendDuplicateSetCookieKey() {
  const headers = new Headers([["Set-Cookie", "foo=bar"]]);
  headers.append("set-Cookie", "foo=baz");
  headers.append("Set-cookie", "baz=bar");
  const actual = [...headers];
  assertEquals(actual, [
    ["set-cookie", "foo=baz"],
    ["set-cookie", "baz=bar"]
  ]);
});
unitTest(function headersSetDuplicateCookieKey() {
  const headers = new Headers([["Set-Cookie", "foo=bar"]]);
  headers.set("set-Cookie", "foo=baz");
  headers.set("set-cookie", "bar=qat");
  const actual = [...headers];
  assertEquals(actual, [
    ["set-cookie", "foo=baz"],
    ["set-cookie", "bar=qat"]
  ]);
});
unitTest(function headersGetSetCookie() {
  const headers = new Headers([
    ["Set-Cookie", "foo=bar"],
    ["set-Cookie", "bar=qat"]
  ]);
  assertEquals(headers.get("SET-COOKIE"), "foo=bar, bar=qat");
});
unitTest(function toStringShouldBeWebCompatibility() {
  const headers = new Headers();
  assertEquals(headers.toString(), "[object Headers]");
});
function stringify(...args) {
  return inspectArgs(args).replace(/\n$/, "");
}
unitTest(function customInspectReturnsCorrectHeadersFormat() {
  const blankHeaders = new Headers();
  assertEquals(stringify(blankHeaders), "Headers {}");
  const singleHeader = new Headers([["Content-Type", "application/json"]]);
  assertEquals(stringify(singleHeader), "Headers { content-type: application/json }");
  const multiParamHeader = new Headers([
    ["Content-Type", "application/json"],
    ["Content-Length", "1337"]
  ]);
  assertEquals(stringify(multiParamHeader), "Headers { content-type: application/json, content-length: 1337 }");
});
