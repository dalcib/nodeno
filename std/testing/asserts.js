import {bold, gray, green, red, stripColor, white} from "../fmt/colors.js";
import {diff as diff2, DiffType} from "./_diff.js";
const CAN_NOT_DISPLAY = "[Cannot display]";
export class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}
export function _format(v) {
  return globalThis.Deno ? Deno.inspect(v, {
    depth: Infinity,
    sorted: true,
    trailingComma: true,
    compact: false,
    iterableLimit: Infinity
  }) : `"${String(v).replace(/(?=["\\])/g, "\\")}"`;
}
function createColor(diffType) {
  switch (diffType) {
    case DiffType.added:
      return (s) => green(bold(s));
    case DiffType.removed:
      return (s) => red(bold(s));
    default:
      return white;
  }
}
function createSign(diffType) {
  switch (diffType) {
    case DiffType.added:
      return "+   ";
    case DiffType.removed:
      return "-   ";
    default:
      return "    ";
  }
}
function buildMessage(diffResult) {
  const messages = [];
  messages.push("");
  messages.push("");
  messages.push(`    ${gray(bold("[Diff]"))} ${red(bold("Actual"))} / ${green(bold("Expected"))}`);
  messages.push("");
  messages.push("");
  diffResult.forEach((result) => {
    const c = createColor(result.type);
    messages.push(c(`${createSign(result.type)}${result.value}`));
  });
  messages.push("");
  return messages;
}
function isKeyedCollection(x) {
  return [Symbol.iterator, "size"].every((k) => k in x);
}
export function equal(c, d) {
  const seen = new Map();
  return function compare(a, b) {
    if (a && b && (a instanceof RegExp && b instanceof RegExp || a instanceof URL && b instanceof URL)) {
      return String(a) === String(b);
    }
    if (a instanceof Date && b instanceof Date) {
      const aTime = a.getTime();
      const bTime = b.getTime();
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
        return true;
      }
      return a.getTime() === b.getTime();
    }
    if (Object.is(a, b)) {
      return true;
    }
    if (a && typeof a === "object" && b && typeof b === "object") {
      if (seen.get(a) === b) {
        return true;
      }
      if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
        return false;
      }
      if (isKeyedCollection(a) && isKeyedCollection(b)) {
        if (a.size !== b.size) {
          return false;
        }
        let unmatchedEntries = a.size;
        for (const [aKey, aValue] of a.entries()) {
          for (const [bKey, bValue] of b.entries()) {
            if (aKey === aValue && bKey === bValue && compare(aKey, bKey) || compare(aKey, bKey) && compare(aValue, bValue)) {
              unmatchedEntries--;
            }
          }
        }
        return unmatchedEntries === 0;
      }
      const merged = {...a, ...b};
      for (const key in merged) {
        if (!compare(a && a[key], b && b[key])) {
          return false;
        }
      }
      seen.set(a, b);
      return true;
    }
    return false;
  }(c, d);
}
export function assert(expr, msg = "") {
  if (!expr) {
    throw new AssertionError(msg);
  }
}
export function assertEquals(actual, expected, msg) {
  if (equal(actual, expected)) {
    return;
  }
  let message = "";
  const actualString = _format(actual);
  const expectedString = _format(expected);
  try {
    const diffResult = diff2(actualString.split("\n"), expectedString.split("\n"));
    const diffMsg = buildMessage(diffResult).join("\n");
    message = `Values are not equal:
${diffMsg}`;
  } catch (e) {
    message = `
${red(CAN_NOT_DISPLAY)} + 

`;
  }
  if (msg) {
    message = msg;
  }
  throw new AssertionError(message);
}
export function assertNotEquals(actual, expected, msg) {
  if (!equal(actual, expected)) {
    return;
  }
  let actualString;
  let expectedString;
  try {
    actualString = String(actual);
  } catch (e) {
    actualString = "[Cannot display]";
  }
  try {
    expectedString = String(expected);
  } catch (e) {
    expectedString = "[Cannot display]";
  }
  if (!msg) {
    msg = `actual: ${actualString} expected: ${expectedString}`;
  }
  throw new AssertionError(msg);
}
export function assertStrictEquals(actual, expected, msg) {
  if (actual === expected) {
    return;
  }
  let message;
  if (msg) {
    message = msg;
  } else {
    const actualString = _format(actual);
    const expectedString = _format(expected);
    if (actualString === expectedString) {
      const withOffset = actualString.split("\n").map((l) => `    ${l}`).join("\n");
      message = `Values have the same structure but are not reference-equal:

${red(withOffset)}
`;
    } else {
      try {
        const diffResult = diff2(actualString.split("\n"), expectedString.split("\n"));
        const diffMsg = buildMessage(diffResult).join("\n");
        message = `Values are not strictly equal:
${diffMsg}`;
      } catch (e) {
        message = `
${red(CAN_NOT_DISPLAY)} + 

`;
      }
    }
  }
  throw new AssertionError(message);
}
export function assertNotStrictEquals(actual, expected, msg) {
  if (actual !== expected) {
    return;
  }
  throw new AssertionError(msg ?? `Expected "actual" to be strictly unequal to: ${_format(actual)}
`);
}
export function assertStringContains(actual, expected, msg) {
  if (!actual.includes(expected)) {
    if (!msg) {
      msg = `actual: "${actual}" expected to contain: "${expected}"`;
    }
    throw new AssertionError(msg);
  }
}
export function assertArrayContains(actual, expected, msg) {
  const missing = [];
  for (let i = 0; i < expected.length; i++) {
    let found = false;
    for (let j = 0; j < actual.length; j++) {
      if (equal(expected[i], actual[j])) {
        found = true;
        break;
      }
    }
    if (!found) {
      missing.push(expected[i]);
    }
  }
  if (missing.length === 0) {
    return;
  }
  if (!msg) {
    msg = `actual: "${_format(actual)}" expected to contain: "${_format(expected)}"
missing: ${_format(missing)}`;
  }
  throw new AssertionError(msg);
}
export function assertMatch(actual, expected, msg) {
  if (!expected.test(actual)) {
    if (!msg) {
      msg = `actual: "${actual}" expected to match: "${expected}"`;
    }
    throw new AssertionError(msg);
  }
}
export function assertNotMatch(actual, expected, msg) {
  if (expected.test(actual)) {
    if (!msg) {
      msg = `actual: "${actual}" expected to not match: "${expected}"`;
    }
    throw new AssertionError(msg);
  }
}
export function fail(msg) {
  assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
}
export function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
  let doesThrow = false;
  let error = null;
  try {
    fn();
  } catch (e) {
    if (e instanceof Error === false) {
      throw new AssertionError("A non-Error object was thrown.");
    }
    if (ErrorClass && !(e instanceof ErrorClass)) {
      msg = `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${msg ? `: ${msg}` : "."}`;
      throw new AssertionError(msg);
    }
    if (msgIncludes && !stripColor(e.message).includes(stripColor(msgIncludes))) {
      msg = `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
      throw new AssertionError(msg);
    }
    doesThrow = true;
    error = e;
  }
  if (!doesThrow) {
    msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
    throw new AssertionError(msg);
  }
  return error;
}
export async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
  let doesThrow = false;
  let error = null;
  try {
    await fn();
  } catch (e) {
    if (e instanceof Error === false) {
      throw new AssertionError("A non-Error object was thrown or rejected.");
    }
    if (ErrorClass && !(e instanceof ErrorClass)) {
      msg = `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${msg ? `: ${msg}` : "."}`;
      throw new AssertionError(msg);
    }
    if (msgIncludes && !stripColor(e.message).includes(stripColor(msgIncludes))) {
      msg = `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
      throw new AssertionError(msg);
    }
    doesThrow = true;
    error = e;
  }
  if (!doesThrow) {
    msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
    throw new AssertionError(msg);
  }
  return error;
}
export function unimplemented(msg) {
  throw new AssertionError(msg || "unimplemented");
}
export function unreachable() {
  throw new AssertionError("unreachable");
}
