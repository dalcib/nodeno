import {bench as bench2, runBenchmarks} from "./bench.js";
bench2(function forIncrementX1e9(b) {
  b.start();
  for (let i = 0; i < 1e9; i++)
    ;
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
if (import.meta.main) {
  runBenchmarks({skip: /throw/});
}
