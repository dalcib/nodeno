import {assertThrows, unitTest} from "./test_util.mjs";
unitTest(function streamReadableHwmError() {
  const invalidHwm = [NaN, Number("NaN"), {}, -1, "two"];
  for (const highWaterMark of invalidHwm) {
    assertThrows(() => {
      new ReadableStream(void 0, {highWaterMark});
    }, RangeError, "highWaterMark must be a positive number or Infinity.  Received:");
  }
  assertThrows(() => {
    new ReadableStream(void 0, {highWaterMark: Symbol("hwk")});
  }, TypeError);
});
unitTest(function streamWriteableHwmError() {
  const invalidHwm = [NaN, Number("NaN"), {}, -1, "two"];
  for (const highWaterMark of invalidHwm) {
    assertThrows(() => {
      new WritableStream(void 0, new CountQueuingStrategy({highWaterMark}));
    }, RangeError, "highWaterMark must be a positive number or Infinity.  Received:");
  }
  assertThrows(() => {
    new WritableStream(void 0, new CountQueuingStrategy({highWaterMark: Symbol("hwmk")}));
  }, TypeError);
});
unitTest(function streamTransformHwmError() {
  const invalidHwm = [NaN, Number("NaN"), {}, -1, "two"];
  for (const highWaterMark of invalidHwm) {
    assertThrows(() => {
      new TransformStream(void 0, void 0, {highWaterMark});
    }, RangeError, "highWaterMark must be a positive number or Infinity.  Received:");
  }
  assertThrows(() => {
    new TransformStream(void 0, void 0, {highWaterMark: Symbol("hwmk")});
  }, TypeError);
});
