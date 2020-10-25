import {
  assert,
  assertEquals,
  assertStringContains,
  unitTest
} from "./test_util.mjs";
unitTest(function formDataHasCorrectNameProp() {
  assertEquals(FormData.name, "FormData");
});
unitTest(function formDataParamsAppendSuccess() {
  const formData = new FormData();
  formData.append("a", "true");
  assertEquals(formData.get("a"), "true");
});
unitTest(function formDataParamsDeleteSuccess() {
  const formData = new FormData();
  formData.append("a", "true");
  formData.append("b", "false");
  assertEquals(formData.get("b"), "false");
  formData.delete("b");
  assertEquals(formData.get("a"), "true");
  assertEquals(formData.get("b"), null);
});
unitTest(function formDataParamsGetAllSuccess() {
  const formData = new FormData();
  formData.append("a", "true");
  formData.append("b", "false");
  formData.append("a", "null");
  assertEquals(formData.getAll("a"), ["true", "null"]);
  assertEquals(formData.getAll("b"), ["false"]);
  assertEquals(formData.getAll("c"), []);
});
unitTest(function formDataParamsGetSuccess() {
  const formData = new FormData();
  formData.append("a", "true");
  formData.append("b", "false");
  formData.append("a", "null");
  formData.append("d", void 0);
  formData.append("e", null);
  assertEquals(formData.get("a"), "true");
  assertEquals(formData.get("b"), "false");
  assertEquals(formData.get("c"), null);
  assertEquals(formData.get("d"), "undefined");
  assertEquals(formData.get("e"), "null");
});
unitTest(function formDataParamsHasSuccess() {
  const formData = new FormData();
  formData.append("a", "true");
  formData.append("b", "false");
  assert(formData.has("a"));
  assert(formData.has("b"));
  assert(!formData.has("c"));
});
unitTest(function formDataParamsSetSuccess() {
  const formData = new FormData();
  formData.append("a", "true");
  formData.append("b", "false");
  formData.append("a", "null");
  assertEquals(formData.getAll("a"), ["true", "null"]);
  assertEquals(formData.getAll("b"), ["false"]);
  formData.set("a", "false");
  assertEquals(formData.getAll("a"), ["false"]);
  formData.set("d", void 0);
  assertEquals(formData.get("d"), "undefined");
  formData.set("e", null);
  assertEquals(formData.get("e"), "null");
});
unitTest(function fromDataUseDomFile() {
  const formData = new FormData();
  const file = new File(["foo"], "bar", {
    type: "text/plain"
  });
  formData.append("file", file);
  assertEquals(formData.get("file"), file);
});
unitTest(function formDataSetEmptyBlobSuccess() {
  const formData = new FormData();
  formData.set("a", new Blob([]), "blank.txt");
  formData.get("a");
});
unitTest(function formDataBlobFilename() {
  const formData = new FormData();
  const content = new TextEncoder().encode("deno");
  formData.set("a", new Blob([content]));
  const file = formData.get("a");
  assert(file instanceof File);
  assertEquals(file.name, "blob");
});
unitTest(function formDataParamsForEachSuccess() {
  const init = [
    ["a", "54"],
    ["b", "true"]
  ];
  const formData = new FormData();
  for (const [name, value] of init) {
    formData.append(name, value);
  }
  let callNum = 0;
  formData.forEach((value, key, parent) => {
    assertEquals(formData, parent);
    assertEquals(value, init[callNum][1]);
    assertEquals(key, init[callNum][0]);
    callNum++;
  });
  assertEquals(callNum, init.length);
});
unitTest(function formDataParamsArgumentsCheck() {
  const methodRequireOneParam = [
    "delete",
    "getAll",
    "get",
    "has",
    "forEach"
  ];
  const methodRequireTwoParams = ["append", "set"];
  methodRequireOneParam.forEach((method) => {
    const formData = new FormData();
    let hasThrown = 0;
    let errMsg = "";
    try {
      formData[method]();
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
    const formData = new FormData();
    let hasThrown = 0;
    let errMsg = "";
    try {
      formData[method]();
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
      formData[method]("foo");
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
unitTest(function toStringShouldBeWebCompatibility() {
  const formData = new FormData();
  assertEquals(formData.toString(), "[object FormData]");
});
