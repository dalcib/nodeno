import {
  bench as bench2,
  BenchmarkRunError,
  clearBenchmarks,
  ProgressState,
  runBenchmarks
} from "./bench.mjs";
import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync
} from "./asserts.mjs";
Deno.test({
  name: "benching",
  fn: async function() {
    bench2(function forIncrementX1e3(b) {
      b.start();
      for (let i = 0; i < 1e3; i++)
        ;
      b.stop();
    });
    bench2(function forDecrementX1e3(b) {
      b.start();
      for (let i = 1e3; i > 0; i--)
        ;
      b.stop();
    });
    bench2(async function forAwaitFetchDenolandX10(b) {
      b.start();
      for (let i = 0; i < 10; i++) {
        const r = await fetch("https://deno.land/");
        await r.text();
      }
      b.stop();
    });
    bench2(async function promiseAllFetchDenolandX10(b) {
      const urls = new Array(10).fill("https://deno.land/");
      b.start();
      await Promise.all(urls.map(async (denoland) => {
        const r = await fetch(denoland);
        await r.text();
      }));
      b.stop();
    });
    bench2({
      name: "runs100ForIncrementX1e6",
      runs: 100,
      func(b) {
        b.start();
        for (let i = 0; i < 1e6; i++)
          ;
        b.stop();
      }
    });
    bench2(function throwing(b) {
      b.start();
    });
    const benchResult = await runBenchmarks({skip: /throw/});
    assertEquals(benchResult.filtered, 1);
    assertEquals(benchResult.results.length, 5);
    const resultWithSingleRunsFiltered = benchResult.results.filter(({name}) => name === "forDecrementX1e3");
    assertEquals(resultWithSingleRunsFiltered.length, 1);
    const resultWithSingleRuns = resultWithSingleRunsFiltered[0];
    assert(!!resultWithSingleRuns.runsCount);
    assert(!!resultWithSingleRuns.measuredRunsAvgMs);
    assert(!!resultWithSingleRuns.measuredRunsMs);
    assertEquals(resultWithSingleRuns.runsCount, 1);
    assertEquals(resultWithSingleRuns.measuredRunsMs.length, 1);
    const resultWithMultipleRunsFiltered = benchResult.results.filter(({name}) => name === "runs100ForIncrementX1e6");
    assertEquals(resultWithMultipleRunsFiltered.length, 1);
    const resultWithMultipleRuns = resultWithMultipleRunsFiltered[0];
    assert(!!resultWithMultipleRuns.runsCount);
    assert(!!resultWithMultipleRuns.measuredRunsAvgMs);
    assert(!!resultWithMultipleRuns.measuredRunsMs);
    assertEquals(resultWithMultipleRuns.runsCount, 100);
    assertEquals(resultWithMultipleRuns.measuredRunsMs.length, 100);
    clearBenchmarks();
  }
});
Deno.test({
  name: "Bench without name should throw",
  fn() {
    assertThrows(() => {
      bench2(() => {
      });
    }, Error, "The benchmark function must not be anonymous");
  }
});
Deno.test({
  name: "Bench without stop should throw",
  fn: async function() {
    await assertThrowsAsync(async () => {
      bench2(function benchWithoutStop(b) {
        b.start();
      });
      await runBenchmarks({only: /benchWithoutStop/, silent: true});
    }, BenchmarkRunError, "The benchmark timer's stop method must be called");
  }
});
Deno.test({
  name: "Bench without start should throw",
  fn: async function() {
    await assertThrowsAsync(async () => {
      bench2(function benchWithoutStart(b) {
        b.stop();
      });
      await runBenchmarks({only: /benchWithoutStart/, silent: true});
    }, BenchmarkRunError, "The benchmark timer's start method must be called");
  }
});
Deno.test({
  name: "Bench with stop before start should throw",
  fn: async function() {
    await assertThrowsAsync(async () => {
      bench2(function benchStopBeforeStart(b) {
        b.stop();
        b.start();
      });
      await runBenchmarks({only: /benchStopBeforeStart/, silent: true});
    }, BenchmarkRunError, "The benchmark timer's start method must be called before its stop method");
  }
});
Deno.test({
  name: "clearBenchmarks should clear all candidates",
  fn: async function() {
    dummyBench("test");
    clearBenchmarks();
    const benchingResults = await runBenchmarks({silent: true});
    assertEquals(benchingResults.filtered, 0);
    assertEquals(benchingResults.results.length, 0);
  }
});
Deno.test({
  name: "clearBenchmarks with only as option",
  fn: async function() {
    clearBenchmarks();
    dummyBench("test");
    dummyBench("onlyclear");
    clearBenchmarks({only: /only/});
    const benchingResults = await runBenchmarks({silent: true});
    assertEquals(benchingResults.filtered, 0);
    assertEquals(benchingResults.results.length, 1);
    assertEquals(benchingResults.results[0].name, "test");
  }
});
Deno.test({
  name: "clearBenchmarks with skip as option",
  fn: async function() {
    clearBenchmarks();
    dummyBench("test");
    dummyBench("skipclear");
    clearBenchmarks({skip: /skip/});
    const benchingResults = await runBenchmarks({silent: true});
    assertEquals(benchingResults.filtered, 0);
    assertEquals(benchingResults.results.length, 1);
    assertEquals(benchingResults.results[0].name, "skipclear");
  }
});
Deno.test({
  name: "clearBenchmarks with only and skip as option",
  fn: async function() {
    clearBenchmarks();
    dummyBench("test");
    dummyBench("clearonly");
    dummyBench("clearskip");
    dummyBench("clearonly");
    clearBenchmarks({only: /clear/, skip: /skip/});
    const benchingResults = await runBenchmarks({silent: true});
    assertEquals(benchingResults.filtered, 0);
    assertEquals(benchingResults.results.length, 2);
    assert(!!benchingResults.results.find(({name}) => name === "test"));
    assert(!!benchingResults.results.find(({name}) => name === "clearskip"));
  }
});
Deno.test({
  name: "progressCallback of runBenchmarks",
  fn: async function() {
    clearBenchmarks();
    dummyBench("skip");
    dummyBench("single");
    dummyBench("multiple", 2);
    const progressCallbacks = [];
    const benchingResults = await runBenchmarks({skip: /skip/, silent: true}, (progress2) => {
      progressCallbacks.push(progress2);
    });
    let pc = 0;
    let progress = progressCallbacks[pc++];
    assert(progress.queued);
    assertEquals(progress.state, ProgressState.BenchmarkingStart);
    assertEquals(progress.filtered, 1);
    assertEquals(progress.queued.length, 2);
    assertEquals(progress.running, void 0);
    assertEquals(progress.results, []);
    progress = progressCallbacks[pc++];
    assertEquals(progress.state, ProgressState.BenchStart);
    assertEquals(progress.filtered, 1);
    assert(progress.queued);
    assertEquals(progress.queued.length, 1);
    assert(!!progress.queued.find(({name}) => name == "multiple"));
    assertEquals(progress.running, {
      name: "single",
      runsCount: 1,
      measuredRunsMs: []
    });
    assertEquals(progress.results, []);
    progress = progressCallbacks[pc++];
    assertEquals(progress.state, ProgressState.BenchPartialResult);
    assert(progress.queued);
    assertEquals(progress.queued.length, 1);
    assertEquals(progress.running.measuredRunsMs.length, 1);
    assertEquals(progress.results.length, 0);
    progress = progressCallbacks[pc++];
    assertEquals(progress.state, ProgressState.BenchResult);
    assert(progress.queued);
    assertEquals(progress.queued.length, 1);
    assertEquals(progress.running, void 0);
    assertEquals(progress.results.length, 1);
    assert(!!progress.results.find(({name}) => name == "single"));
    progress = progressCallbacks[pc++];
    assertEquals(progress.state, ProgressState.BenchStart);
    assert(progress.queued);
    assertEquals(progress.queued.length, 0);
    assertEquals(progress.running, {
      name: "multiple",
      runsCount: 2,
      measuredRunsMs: []
    });
    assertEquals(progress.results.length, 1);
    progress = progressCallbacks[pc++];
    assertEquals(progress.state, ProgressState.BenchPartialResult);
    assert(progress.queued);
    assertEquals(progress.queued.length, 0);
    assertEquals(progress.running.measuredRunsMs.length, 1);
    assertEquals(progress.results.length, 1);
    progress = progressCallbacks[pc++];
    assertEquals(progress.state, ProgressState.BenchPartialResult);
    assert(progress.queued);
    assertEquals(progress.queued.length, 0);
    assertEquals(progress.running.measuredRunsMs.length, 2);
    assertEquals(progress.results.length, 1);
    progress = progressCallbacks[pc++];
    assertEquals(progress.state, ProgressState.BenchResult);
    assert(progress.queued);
    assertEquals(progress.queued.length, 0);
    assertEquals(progress.running, void 0);
    assertEquals(progress.results.length, 2);
    assert(!!progress.results.find(({name}) => name == "single"));
    const resultOfMultiple = progress.results.filter(({name}) => name == "multiple");
    assertEquals(resultOfMultiple.length, 1);
    assert(!!resultOfMultiple[0].measuredRunsMs);
    assert(!isNaN(resultOfMultiple[0].measuredRunsAvgMs));
    assertEquals(resultOfMultiple[0].measuredRunsMs.length, 2);
    progress = progressCallbacks[pc++];
    assertEquals(progress.state, ProgressState.BenchmarkingEnd);
    delete progress.state;
    assertEquals(progress, benchingResults);
  }
});
Deno.test({
  name: "async progressCallback",
  fn: async function() {
    clearBenchmarks();
    dummyBench("single");
    const asyncCallbacks = [];
    await runBenchmarks({silent: true}, (progress) => {
      return new Promise((resolve) => {
        queueMicrotask(() => {
          asyncCallbacks.push(progress);
          resolve();
        });
      });
    });
    assertEquals(asyncCallbacks.length, 5);
  }
});
function dummyBench(name, runs = 1) {
  bench2({
    name,
    runs,
    func(b) {
      b.start();
      b.stop();
    }
  });
}
