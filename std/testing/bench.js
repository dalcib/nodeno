import {assert as assert2} from "../_util/assert.js";
import {deepAssign} from "../_util/deep_assign.js";
export var ProgressState;
(function(ProgressState2) {
  ProgressState2["BenchmarkingStart"] = "benchmarking_start";
  ProgressState2["BenchStart"] = "bench_start";
  ProgressState2["BenchPartialResult"] = "bench_partial_result";
  ProgressState2["BenchResult"] = "bench_result";
  ProgressState2["BenchmarkingEnd"] = "benchmarking_end";
})(ProgressState || (ProgressState = {}));
export class BenchmarkRunError extends Error {
  constructor(msg, benchmarkName) {
    super(msg);
    this.name = "BenchmarkRunError";
    this.benchmarkName = benchmarkName;
  }
}
function red(text) {
  return Deno.noColor ? text : `[31m${text}[0m`;
}
function blue(text) {
  return Deno.noColor ? text : `[34m${text}[0m`;
}
function verifyOr1Run(runs) {
  return runs && runs >= 1 && runs !== Infinity ? Math.floor(runs) : 1;
}
function assertTiming(clock) {
  if (!clock.stop) {
    throw new BenchmarkRunError(`Running benchmarks FAILED during benchmark named [${clock.for}]. The benchmark timer's stop method must be called`, clock.for);
  } else if (!clock.start) {
    throw new BenchmarkRunError(`Running benchmarks FAILED during benchmark named [${clock.for}]. The benchmark timer's start method must be called`, clock.for);
  } else if (clock.start > clock.stop) {
    throw new BenchmarkRunError(`Running benchmarks FAILED during benchmark named [${clock.for}]. The benchmark timer's start method must be called before its stop method`, clock.for);
  }
}
function createBenchmarkTimer(clock) {
  return {
    start() {
      clock.start = performance.now();
    },
    stop() {
      if (isNaN(clock.start)) {
        throw new BenchmarkRunError(`Running benchmarks FAILED during benchmark named [${clock.for}]. The benchmark timer's start method must be called before its stop method`, clock.for);
      }
      clock.stop = performance.now();
    }
  };
}
const candidates = [];
export function bench(benchmark) {
  if (!benchmark.name) {
    throw new Error("The benchmark function must not be anonymous");
  }
  if (typeof benchmark === "function") {
    candidates.push({name: benchmark.name, runs: 1, func: benchmark});
  } else {
    candidates.push({
      name: benchmark.name,
      runs: verifyOr1Run(benchmark.runs),
      func: benchmark.func
    });
  }
}
export function clearBenchmarks({
  only = /[^\s]/,
  skip = /$^/
} = {}) {
  const keep = candidates.filter(({name}) => !only.test(name) || skip.test(name));
  candidates.splice(0, candidates.length);
  candidates.push(...keep);
}
export async function runBenchmarks({only = /[^\s]/, skip = /^\s*$/, silent} = {}, progressCb) {
  const benchmarks = candidates.filter(({name}) => only.test(name) && !skip.test(name));
  const filtered = candidates.length - benchmarks.length;
  let failError = void 0;
  const clock = {start: NaN, stop: NaN};
  const b = createBenchmarkTimer(clock);
  const progress = {
    queued: benchmarks.map((bench2) => ({
      name: bench2.name,
      runsCount: bench2.runs
    })),
    results: [],
    filtered,
    state: ProgressState.BenchmarkingStart
  };
  await publishProgress(progress, ProgressState.BenchmarkingStart, progressCb);
  if (!silent) {
    console.log("running", benchmarks.length, `benchmark${benchmarks.length === 1 ? " ..." : "s ..."}`);
  }
  for (const {name, runs = 0, func} of benchmarks) {
    if (!silent) {
      console.groupCollapsed(`benchmark ${name} ... `);
    }
    clock.for = name;
    assert2(progress.queued);
    const queueIndex = progress.queued.findIndex((queued) => queued.name === name && queued.runsCount === runs);
    if (queueIndex != -1) {
      progress.queued.splice(queueIndex, 1);
    }
    progress.running = {name, runsCount: runs, measuredRunsMs: []};
    await publishProgress(progress, ProgressState.BenchStart, progressCb);
    let result = "";
    try {
      let pendingRuns = runs;
      let totalMs = 0;
      while (true) {
        await func(b);
        assertTiming(clock);
        const measuredMs = clock.stop - clock.start;
        totalMs += measuredMs;
        progress.running.measuredRunsMs.push(measuredMs);
        await publishProgress(progress, ProgressState.BenchPartialResult, progressCb);
        clock.start = clock.stop = NaN;
        if (!--pendingRuns) {
          result = runs == 1 ? `${totalMs}ms` : `${runs} runs avg: ${totalMs / runs}ms`;
          progress.results.push({
            name,
            totalMs,
            runsCount: runs,
            measuredRunsAvgMs: totalMs / runs,
            measuredRunsMs: progress.running.measuredRunsMs
          });
          delete progress.running;
          await publishProgress(progress, ProgressState.BenchResult, progressCb);
          break;
        }
      }
    } catch (err) {
      failError = err;
      if (!silent) {
        console.groupEnd();
        console.error(red(err.stack));
      }
      break;
    }
    if (!silent) {
      console.log(blue(result));
      console.groupEnd();
    }
    clock.start = clock.stop = NaN;
    delete clock.for;
  }
  delete progress.queued;
  await publishProgress(progress, ProgressState.BenchmarkingEnd, progressCb);
  if (!silent) {
    console.log(`benchmark result: ${failError ? red("FAIL") : blue("DONE")}. ${progress.results.length} measured; ${filtered} filtered`);
  }
  if (failError) {
    throw failError;
  }
  const benchmarkRunResult = {
    filtered,
    results: progress.results
  };
  return benchmarkRunResult;
}
async function publishProgress(progress, state, progressCb) {
  progressCb && await progressCb(cloneProgressWithState(progress, state));
}
function cloneProgressWithState(progress, state) {
  return deepAssign({}, progress, {state});
}
