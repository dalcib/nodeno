import {assert, assertEquals, assertMatch, unitTest} from "./test_util.mjs";
const {setPrepareStackTrace} = Deno[Deno.internal];
function getMockCallSite(fileName, lineNumber, columnNumber) {
  return {
    getThis() {
      return void 0;
    },
    getTypeName() {
      return "";
    },
    getFunction() {
      return () => {
      };
    },
    getFunctionName() {
      return "";
    },
    getMethodName() {
      return "";
    },
    getFileName() {
      return fileName;
    },
    getLineNumber() {
      return lineNumber;
    },
    getColumnNumber() {
      return columnNumber;
    },
    getEvalOrigin() {
      return null;
    },
    isToplevel() {
      return false;
    },
    isEval() {
      return false;
    },
    isNative() {
      return false;
    },
    isConstructor() {
      return false;
    },
    isAsync() {
      return false;
    },
    isPromiseAll() {
      return false;
    },
    getPromiseIndex() {
      return null;
    }
  };
}
unitTest(function errorStackMessageLine() {
  const e1 = new Error();
  e1.name = "Foo";
  e1.message = "bar";
  assertMatch(e1.stack, /^Foo: bar\n/);
  const e2 = new Error();
  e2.name = "";
  e2.message = "bar";
  assertMatch(e2.stack, /^bar\n/);
  const e3 = new Error();
  e3.name = "Foo";
  e3.message = "";
  assertMatch(e3.stack, /^Foo\n/);
  const e4 = new Error();
  e4.name = "";
  e4.message = "";
  assertMatch(e4.stack, /^\n/);
  const e5 = new Error();
  e5.name = void 0;
  e5.message = void 0;
  assertMatch(e5.stack, /^Error\n/);
  const e6 = new Error();
  e6.name = null;
  e6.message = null;
  assertMatch(e6.stack, /^null: null\n/);
});
unitTest({ignore: true}, function prepareStackTrace() {
  const MockError = {};
  setPrepareStackTrace(MockError);
  assert(typeof MockError.prepareStackTrace === "function");
  const prepareStackTrace2 = MockError.prepareStackTrace;
  const result = prepareStackTrace2(new Error("foo"), [
    getMockCallSite("CLI_SNAPSHOT.js", 23, 0)
  ]);
  assert(result.startsWith("Error: foo\n"));
  assert(result.includes(".ts:"), "should remap to something in 'js/'");
});
unitTest(function captureStackTrace() {
  function foo() {
    const error = new Error();
    const stack1 = error.stack;
    Error.captureStackTrace(error, foo);
    const stack2 = error.stack;
    assertEquals(stack2, stack1.replace(/(?<=^[^\n]*\n)[^\n]*\n/, ""));
  }
  foo();
});
unitTest({ignore: true}, function applySourceMap() {
  const result = Deno.applySourceMap({
    fileName: "CLI_SNAPSHOT.js",
    lineNumber: 23,
    columnNumber: 0
  });
  Deno.core.print(`result: ${result}`, true);
  assert(result.fileName.endsWith(".ts"));
  assert(result.lineNumber != null);
  assert(result.columnNumber != null);
});
