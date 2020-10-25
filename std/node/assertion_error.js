function getConsoleWidth() {
  return Deno.consoleSize?.(Deno.stderr.rid).columns ?? 80;
}
import {inspect} from "./util.js";
import {stripColor as removeColors} from "../fmt/colors.js";
const MathMax = Math.max;
const {Error} = globalThis;
const {
  create: ObjectCreate,
  defineProperty: ObjectDefineProperty,
  getPrototypeOf: ObjectGetPrototypeOf,
  getOwnPropertyDescriptor: ObjectGetOwnPropertyDescriptor,
  keys: ObjectKeys
} = Object;
import {codes} from "./_errors.js";
const {ERR_INVALID_ARG_TYPE} = codes;
let blue = "";
let green = "";
let red = "";
let defaultColor = "";
const kReadableOperator = {
  deepStrictEqual: "Expected values to be strictly deep-equal:",
  strictEqual: "Expected values to be strictly equal:",
  strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
  deepEqual: "Expected values to be loosely deep-equal:",
  notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
  notStrictEqual: 'Expected "actual" to be strictly unequal to:',
  notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
  notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
  notIdentical: "Values have same structure but are not reference-equal:",
  notDeepEqualUnequal: "Expected values not to be loosely deep-equal:"
};
const kMaxShortLength = 12;
export function copyError(source) {
  const keys = ObjectKeys(source);
  const target = ObjectCreate(ObjectGetPrototypeOf(source));
  for (const key of keys) {
    const desc = ObjectGetOwnPropertyDescriptor(source, key);
    if (desc !== void 0) {
      ObjectDefineProperty(target, key, desc);
    }
  }
  ObjectDefineProperty(target, "message", {value: source.message});
  return target;
}
export function inspectValue(val) {
  return inspect(val, {
    compact: false,
    customInspect: false,
    depth: 1e3,
    maxArrayLength: Infinity,
    showHidden: false,
    showProxy: false,
    sorted: true,
    getters: true
  });
}
export function createErrDiff(actual, expected, operator) {
  let other = "";
  let res = "";
  let end = "";
  let skipped = false;
  const actualInspected = inspectValue(actual);
  const actualLines = actualInspected.split("\n");
  const expectedLines = inspectValue(expected).split("\n");
  let i = 0;
  let indicator = "";
  if (operator === "strictEqual" && (typeof actual === "object" && actual !== null && typeof expected === "object" && expected !== null || typeof actual === "function" && typeof expected === "function")) {
    operator = "strictEqualObject";
  }
  if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
    const c = inspect.defaultOptions.colors;
    const actualRaw = c ? removeColors(actualLines[0]) : actualLines[0];
    const expectedRaw = c ? removeColors(expectedLines[0]) : expectedLines[0];
    const inputLength = actualRaw.length + expectedRaw.length;
    if (inputLength <= kMaxShortLength) {
      if ((typeof actual !== "object" || actual === null) && (typeof expected !== "object" || expected === null) && (actual !== 0 || expected !== 0)) {
        return `${kReadableOperator[operator]}

${actualLines[0]} !== ${expectedLines[0]}
`;
      }
    } else if (operator !== "strictEqualObject") {
      const maxLength2 = Deno.isatty(Deno.stderr.rid) ? getConsoleWidth() : 80;
      if (inputLength < maxLength2) {
        while (actualRaw[i] === expectedRaw[i]) {
          i++;
        }
        if (i > 2) {
          indicator = `
  ${" ".repeat(i)}^`;
          i = 0;
        }
      }
    }
  }
  let a = actualLines[actualLines.length - 1];
  let b = expectedLines[expectedLines.length - 1];
  while (a === b) {
    if (i++ < 3) {
      end = `
  ${a}${end}`;
    } else {
      other = a;
    }
    actualLines.pop();
    expectedLines.pop();
    if (actualLines.length === 0 || expectedLines.length === 0) {
      break;
    }
    a = actualLines[actualLines.length - 1];
    b = expectedLines[expectedLines.length - 1];
  }
  const maxLines = MathMax(actualLines.length, expectedLines.length);
  if (maxLines === 0) {
    const actualLines2 = actualInspected.split("\n");
    if (actualLines2.length > 50) {
      actualLines2[46] = `${blue}...${defaultColor}`;
      while (actualLines2.length > 47) {
        actualLines2.pop();
      }
    }
    return `${kReadableOperator.notIdentical}

${actualLines2.join("\n")}
`;
  }
  if (i >= 5) {
    end = `
${blue}...${defaultColor}${end}`;
    skipped = true;
  }
  if (other !== "") {
    end = `
  ${other}${end}`;
    other = "";
  }
  let printedLines = 0;
  let identical = 0;
  const msg = kReadableOperator[operator] + `
${green}+ actual${defaultColor} ${red}- expected${defaultColor}`;
  const skippedMsg = ` ${blue}...${defaultColor} Lines skipped`;
  let lines = actualLines;
  let plusMinus = `${green}+${defaultColor}`;
  let maxLength = expectedLines.length;
  if (actualLines.length < maxLines) {
    lines = expectedLines;
    plusMinus = `${red}-${defaultColor}`;
    maxLength = actualLines.length;
  }
  for (i = 0; i < maxLines; i++) {
    if (maxLength < i + 1) {
      if (identical > 2) {
        if (identical > 3) {
          if (identical > 4) {
            if (identical === 5) {
              res += `
  ${lines[i - 3]}`;
              printedLines++;
            } else {
              res += `
${blue}...${defaultColor}`;
              skipped = true;
            }
          }
          res += `
  ${lines[i - 2]}`;
          printedLines++;
        }
        res += `
  ${lines[i - 1]}`;
        printedLines++;
      }
      identical = 0;
      if (lines === actualLines) {
        res += `
${plusMinus} ${lines[i]}`;
      } else {
        other += `
${plusMinus} ${lines[i]}`;
      }
      printedLines++;
    } else {
      const expectedLine = expectedLines[i];
      let actualLine = actualLines[i];
      let divergingLines = actualLine !== expectedLine && (!actualLine.endsWith(",") || actualLine.slice(0, -1) !== expectedLine);
      if (divergingLines && expectedLine.endsWith(",") && expectedLine.slice(0, -1) === actualLine) {
        divergingLines = false;
        actualLine += ",";
      }
      if (divergingLines) {
        if (identical > 2) {
          if (identical > 3) {
            if (identical > 4) {
              if (identical === 5) {
                res += `
  ${actualLines[i - 3]}`;
                printedLines++;
              } else {
                res += `
${blue}...${defaultColor}`;
                skipped = true;
              }
            }
            res += `
  ${actualLines[i - 2]}`;
            printedLines++;
          }
          res += `
  ${actualLines[i - 1]}`;
          printedLines++;
        }
        identical = 0;
        res += `
${green}+${defaultColor} ${actualLine}`;
        other += `
${red}-${defaultColor} ${expectedLine}`;
        printedLines += 2;
      } else {
        res += other;
        other = "";
        identical++;
        if (identical <= 2) {
          res += `
  ${actualLine}`;
          printedLines++;
        }
      }
    }
    if (printedLines > 50 && i < maxLines - 2) {
      return `${msg}${skippedMsg}
${res}
${blue}...${defaultColor}${other}
${blue}...${defaultColor}`;
    }
  }
  return `${msg}${skipped ? skippedMsg : ""}
${res}${other}${end}${indicator}`;
}
export class AssertionError extends Error {
  constructor(options) {
    if (typeof options !== "object" || options === null) {
      throw new ERR_INVALID_ARG_TYPE("options", "Object", options);
    }
    const {
      message,
      operator,
      stackStartFn,
      details,
      stackStartFunction
    } = options;
    let {
      actual,
      expected
    } = options;
    const limit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    if (message != null) {
      super(String(message));
    } else {
      if (Deno.isatty(Deno.stderr.rid)) {
        if (Deno.noColor) {
          blue = "";
          green = "";
          defaultColor = "";
          red = "";
        } else {
          blue = "[34m";
          green = "[32m";
          defaultColor = "[39m";
          red = "[31m";
        }
      }
      if (typeof actual === "object" && actual !== null && typeof expected === "object" && expected !== null && "stack" in actual && actual instanceof Error && "stack" in expected && expected instanceof Error) {
        actual = copyError(actual);
        expected = copyError(expected);
      }
      if (operator === "deepStrictEqual" || operator === "strictEqual") {
        super(createErrDiff(actual, expected, operator));
      } else if (operator === "notDeepStrictEqual" || operator === "notStrictEqual") {
        let base = kReadableOperator[operator];
        const res = inspectValue(actual).split("\n");
        if (operator === "notStrictEqual" && (typeof actual === "object" && actual !== null || typeof actual === "function")) {
          base = kReadableOperator.notStrictEqualObject;
        }
        if (res.length > 50) {
          res[46] = `${blue}...${defaultColor}`;
          while (res.length > 47) {
            res.pop();
          }
        }
        if (res.length === 1) {
          super(`${base}${res[0].length > 5 ? "\n\n" : " "}${res[0]}`);
        } else {
          super(`${base}

${res.join("\n")}
`);
        }
      } else {
        let res = inspectValue(actual);
        let other = inspectValue(expected);
        const knownOperator = kReadableOperator[operator ?? ""];
        if (operator === "notDeepEqual" && res === other) {
          res = `${knownOperator}

${res}`;
          if (res.length > 1024) {
            res = `${res.slice(0, 1021)}...`;
          }
          super(res);
        } else {
          if (res.length > 512) {
            res = `${res.slice(0, 509)}...`;
          }
          if (other.length > 512) {
            other = `${other.slice(0, 509)}...`;
          }
          if (operator === "deepEqual") {
            res = `${knownOperator}

${res}

should loosely deep-equal

`;
          } else {
            const newOp = kReadableOperator[`${operator}Unequal`];
            if (newOp) {
              res = `${newOp}

${res}

should not loosely deep-equal

`;
            } else {
              other = ` ${operator} ${other}`;
            }
          }
          super(`${res}${other}`);
        }
      }
    }
    Error.stackTraceLimit = limit;
    this.generatedMessage = !message;
    ObjectDefineProperty(this, "name", {
      value: "AssertionError [ERR_ASSERTION]",
      enumerable: false,
      writable: true,
      configurable: true
    });
    this.code = "ERR_ASSERTION";
    if (details) {
      this.actual = void 0;
      this.expected = void 0;
      this.operator = void 0;
      for (let i = 0; i < details.length; i++) {
        this["message " + i] = details[i].message;
        this["actual " + i] = details[i].actual;
        this["expected " + i] = details[i].expected;
        this["operator " + i] = details[i].operator;
        this["stack trace " + i] = details[i].stack;
      }
    } else {
      this.actual = actual;
      this.expected = expected;
      this.operator = operator;
    }
    Error.captureStackTrace(this, stackStartFn || stackStartFunction);
    this.stack;
    this.name = "AssertionError";
  }
  toString() {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
  [inspect.custom](recurseTimes, ctx) {
    const tmpActual = this.actual;
    const tmpExpected = this.expected;
    for (const name of ["actual", "expected"]) {
      if (typeof this[name] === "string") {
        const value = this[name];
        const lines = value.split("\n");
        if (lines.length > 10) {
          lines.length = 10;
          this[name] = `${lines.join("\n")}
...`;
        } else if (value.length > 512) {
          this[name] = `${value.slice(512)}...`;
        }
      }
    }
    const result = inspect(this, {
      ...ctx,
      customInspect: false,
      depth: 0
    });
    this.actual = tmpActual;
    this.expected = tmpExpected;
    return result;
  }
}
export default AssertionError;
