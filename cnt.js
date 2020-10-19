/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");

var files = [
  "core.js",
  "00_bootstrap_namespace.js",
  "01_build.js",
  "01_colors.js",
  "01_errors.js",
  "01_internals.js",
  "01_version.js",
  "01_web_util.js",
  "02_console.js",
  "06_util.js",
  "10_dispatch_minimal.js",
  "11_crypto.js",
  "11_timers.js",
  "11_workers.js",
  "12_io.js",
  "13_buffer.js",
  "27_websocket.js",
  "30_files.js",
  "30_fs.js",
  "30_metrics.js",
  "30_net.js",
  "30_os.js",
  "40_compiler_api.js",
  "40_diagnostics.js",
  "40_error_stack.js",
  "40_fs_events.js",
  "40_net_unstable.js",
  "40_performance.js",
  "40_permissions.js",
  "40_plugins.js",
  "40_process.js",
  "40_read_file.js",
  "40_signals.js",
  "40_testing.js",
  "40_tls.js",
  "40_tty.js",
  "40_write_file.js",
  //"41_prompt.js",
  "90_deno_ns.js",
  "99_main.js",
  "globalThis.js",
].join(" ");

console.log(files);

exec("concat -o denode.js " + files, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  let jsfile = readFileSync("denode.js", "utf8");
  jsfile = jsfile.replace(/}[)][(]this[)];/g, "})(globalThis);");
  writeFileSync("denode.js", jsfile);
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);

  const ops = jsfile
    //.match(/jsonOpSync[(](.*?)[)];/g)
    .match(/jsonOpAsync[(](.*?)\;/g)
    .map((st) =>
      st
        .slice(12)
        .slice(0, st.length - 14)
        .replace('"', "")
        .replace('"', "")
    )
    .sort();
  console.log(ops);
});

//node --expose-internals denode.js

//deno run --allow-all --unstable  unit_test_runner.ts -- version;
