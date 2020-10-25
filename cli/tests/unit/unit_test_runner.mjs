#!/usr/bin/env -S deno run --reload --allow-run
import "./unit_tests.mjs";
import {
  colors,
  fmtPerms,
  parseArgs,
  permissionCombinations,
  readLines,
  REGISTERED_UNIT_TESTS,
  registerUnitTests,
  reportToConn,
} from "./test_util.mjs";
const internalObj = Deno[Deno.internal];
const reportToConsole = internalObj.reportToConsole;
const runTests = internalObj.runTests;
const PERMISSIONS = ["read", "write", "net", "env", "run", "plugin", "hrtime"];
async function dropWorkerPermissions(requiredPermissions) {
  const permsToDrop = PERMISSIONS.filter((p) => {
    return !requiredPermissions.includes(p);
  });
  for (const perm of permsToDrop) {
    await Deno.permissions.revoke({ name: perm });
  }
}
async function workerRunnerMain(addrStr, permsStr, filter) {
  const [hostname, port] = addrStr.split(":");
  const addr = { hostname, port: Number(port) };
  let perms = [];
  if (permsStr.length > 0) {
    perms = permsStr.split(",");
  }
  const conn = await Deno.connect(addr);
  await dropWorkerPermissions(perms);
  await registerUnitTests();
  await runTests({
    exitOnFail: false,
    filter,
    reportToConsole: false,
    onMessage: reportToConn.bind(null, conn),
  });
}
function spawnWorkerRunner(verbose, addr, perms, filter) {
  const permStr = Object.keys(perms)
    .filter((permName) => {
      return perms[permName] === true;
    })
    .join(",");
  const cmd = [
    Deno.execPath(),
    "run",
    "--unstable",
    "-A",
    "cli/tests/unit/unit_test_runner.ts",
    "--worker",
    `--addr=${addr}`,
    `--perms=${permStr}`,
  ];
  if (filter) {
    cmd.push("--");
    cmd.push(filter);
  }
  const ioMode = verbose ? "inherit" : "null";
  const p = Deno.run({
    cmd,
    stdin: ioMode,
    stdout: ioMode,
    stderr: ioMode,
  });
  return p;
}
async function runTestsForPermissionSet(listener, addrStr, verbose, perms, filter) {
  const permsFmt = fmtPerms(perms);
  console.log(`Running tests for: ${permsFmt}`);
  const workerProcess = spawnWorkerRunner(verbose, addrStr, perms, filter);
  const conn = await listener.accept();
  let expectedPassedTests;
  let endMessage;
  try {
    for await (const line of readLines(conn)) {
      const message = JSON.parse(line);
      reportToConsole(message);
      if (message.start != null) {
        expectedPassedTests = message.start.tests.length;
      } else if (message.end != null) {
        endMessage = message.end;
      }
    }
  } finally {
    conn.close();
  }
  if (expectedPassedTests == null) {
    throw new Error("Worker runner didn't report start");
  }
  if (endMessage == null) {
    throw new Error("Worker runner didn't report end");
  }
  const workerStatus = await workerProcess.status();
  if (!workerStatus.success) {
    throw new Error(`Worker runner exited with status code: ${workerStatus.code}`);
  }
  workerProcess.close();
  const passed = expectedPassedTests === endMessage.passed + endMessage.ignored;
  return {
    perms,
    passed,
    permsStr: permsFmt,
    endMessage,
  };
}
async function masterRunnerMain(verbose, filter) {
  console.log("Discovered permission combinations for tests:", permissionCombinations.size);
  for (const perms of permissionCombinations.values()) {
    console.log("	" + fmtPerms(perms));
  }
  const testResults = new Set();
  const addr = { hostname: "127.0.0.1", port: 4510 };
  const addrStr = `${addr.hostname}:${addr.port}`;
  const listener = Deno.listen(addr);
  for (const perms of permissionCombinations.values()) {
    const result = await runTestsForPermissionSet(listener, addrStr, verbose, perms, filter);
    testResults.add(result);
  }
  let testsPassed = true;
  for (const testResult of testResults) {
    const { permsStr, endMessage } = testResult;
    console.log(`Summary for ${permsStr}`);
    reportToConsole({ end: endMessage });
    testsPassed = testsPassed && testResult.passed;
  }
  if (!testsPassed) {
    console.error("Unit tests failed");
    Deno.exit(1);
  }
  console.log("Unit tests passed");
  if (REGISTERED_UNIT_TESTS.find(({ only }) => only)) {
    console.error(`
    ${colors.red("FAILED")} because the "only" option was used`);
    Deno.exit(1);
  }
}
const HELP = `Unit test runner

Run tests matching current process permissions:

deno --allow-write unit_test_runner.ts

deno --allow-net --allow-hrtime unit_test_runner.ts

deno --allow-write unit_test_runner.ts -- testWriteFile

Run "master" process that creates "worker" processes
for each discovered permission combination:

deno -A unit_test_runner.ts --master

Run worker process for given permissions:

deno -A unit_test_runner.ts --worker --perms=net,read,write --addr=127.0.0.1:4500


OPTIONS:
--master
Run in master mode, spawning worker processes for
each discovered permission combination

--worker
Run in worker mode, requires "perms" and "addr" flags,
should be run with "-A" flag; after setup worker will
drop permissions to required set specified in "perms"

--perms=<perm_name>...
Set of permissions this process should run tests with,

--addr=<addr>
Address of TCP socket for reporting

ARGS:
-- <filter>...
Run only tests with names matching filter, must
be used after "--"
`;
function assertOrHelp(expr) {
  if (!expr) {
    console.log(HELP);
    Deno.exit(1);
  }
}

async function main() {
  const args = parseArgs(Deno.args, {
    boolean: ["master", "worker", "verbose"],
    "--": true,
  });
  if (args.help) {
    console.log(HELP);
    return;
  }
  const filter = args["--"][0];
  if (args.master) {
    return masterRunnerMain(args.verbose, filter);
  }
  if (args.worker) {
    assertOrHelp(typeof args.addr === "string");
    assertOrHelp(typeof args.perms === "string");
    return workerRunnerMain(args.addr, args.perms, filter);
  }

  console.log(filter);
  await registerUnitTests();
  await runTests({ filter });
}
main();
