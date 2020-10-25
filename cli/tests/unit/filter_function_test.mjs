import {assertEquals, unitTest} from "./test_util.mjs";
const {createFilterFn} = Deno[Deno.internal];
unitTest(function filterAsString() {
  const filterFn = createFilterFn("my-test");
  const tests = [
    {
      fn() {
      },
      name: "my-test"
    },
    {
      fn() {
      },
      name: "other-test"
    }
  ];
  const filteredTests = tests.filter(filterFn);
  assertEquals(filteredTests.length, 1);
});
unitTest(function filterAsREGEX() {
  const filterFn = createFilterFn("/.+-test/");
  const tests = [
    {
      fn() {
      },
      name: "my-test"
    },
    {
      fn() {
      },
      name: "other-test"
    }
  ];
  const filteredTests = tests.filter(filterFn);
  assertEquals(filteredTests.length, 2);
});
unitTest(function filterAsEscapedREGEX() {
  const filterFn = createFilterFn("/\\w+-test/");
  const tests = [
    {
      fn() {
      },
      name: "my-test"
    },
    {
      fn() {
      },
      name: "other-test"
    }
  ];
  const filteredTests = tests.filter(filterFn);
  assertEquals(filteredTests.length, 2);
});
