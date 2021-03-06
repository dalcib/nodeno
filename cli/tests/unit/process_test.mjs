import {
  assert,
  assertEquals,
  assertStringContains,
  assertThrows,
  unitTest
} from "./test_util.mjs";
unitTest(function runPermissions() {
  assertThrows(() => {
    Deno.run({cmd: ["python", "-c", "print('hello world')"]});
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {run: true}}, async function runSuccess() {
  const p = Deno.run({
    cmd: ["python", "-c", "print('hello world')"],
    stdout: "piped",
    stderr: "null"
  });
  const status = await p.status();
  assertEquals(status.success, true);
  assertEquals(status.code, 0);
  assertEquals(status.signal, void 0);
  p.stdout.close();
  p.close();
});
unitTest({perms: {run: true}}, async function runUrl() {
  const q = Deno.run({
    cmd: ["python", "-c", "import sys; print sys.executable"],
    stdout: "piped"
  });
  await q.status();
  const pythonPath = new TextDecoder().decode(await q.output()).trim();
  q.close();
  const p = Deno.run({
    cmd: [new URL(`file:///${pythonPath}`), "-c", "print('hello world')"],
    stdout: "piped",
    stderr: "null"
  });
  const status = await p.status();
  assertEquals(status.success, true);
  assertEquals(status.code, 0);
  assertEquals(status.signal, void 0);
  p.stdout.close();
  p.close();
});
unitTest({perms: {run: true}}, async function runStdinRid0() {
  const p = Deno.run({
    cmd: ["python", "-c", "print('hello world')"],
    stdin: 0,
    stdout: "piped",
    stderr: "null"
  });
  const status = await p.status();
  assertEquals(status.success, true);
  assertEquals(status.code, 0);
  assertEquals(status.signal, void 0);
  p.stdout.close();
  p.close();
});
unitTest({perms: {run: true}}, function runInvalidStdio() {
  assertThrows(() => Deno.run({
    cmd: ["python", "-c", "print('hello world')"],
    stdin: "a"
  }));
  assertThrows(() => Deno.run({
    cmd: ["python", "-c", "print('hello world')"],
    stdout: "b"
  }));
  assertThrows(() => Deno.run({
    cmd: ["python", "-c", "print('hello world')"],
    stderr: "c"
  }));
});
unitTest({perms: {run: true}}, async function runCommandFailedWithCode() {
  const p = Deno.run({
    cmd: ["python", "-c", "import sys;sys.exit(41 + 1)"]
  });
  const status = await p.status();
  assertEquals(status.success, false);
  assertEquals(status.code, 42);
  assertEquals(status.signal, void 0);
  p.close();
});
unitTest({
  ignore: Deno.build.os === "windows",
  perms: {run: true}
}, async function runCommandFailedWithSignal() {
  const p = Deno.run({
    cmd: ["python", "-c", "import os;os.kill(os.getpid(), 9)"]
  });
  const status = await p.status();
  assertEquals(status.success, false);
  assertEquals(status.code, 128 + 9);
  assertEquals(status.signal, 9);
  p.close();
});
unitTest({perms: {run: true}}, function runNotFound() {
  let error;
  try {
    Deno.run({cmd: ["this file hopefully doesn't exist"]});
  } catch (e) {
    error = e;
  }
  assert(error !== void 0);
  assert(error instanceof Deno.errors.NotFound);
});
unitTest({perms: {write: true, run: true}}, async function runWithCwdIsAsync() {
  const enc = new TextEncoder();
  const cwd = await Deno.makeTempDir({prefix: "deno_command_test"});
  const exitCodeFile = "deno_was_here";
  const pyProgramFile = "poll_exit.py";
  const pyProgram = `
from sys import exit
from time import sleep

while True:
  try:
    with open("${exitCodeFile}", "r") as f:
      line = f.readline()
    code = int(line)
    exit(code)
  except IOError:
    # Retry if we got here before deno wrote the file.
    sleep(0.01)
    pass
`;
  Deno.writeFileSync(`${cwd}/${pyProgramFile}.py`, enc.encode(pyProgram));
  const p = Deno.run({
    cwd,
    cmd: ["python", `${pyProgramFile}.py`]
  });
  const code = 84;
  Deno.writeFileSync(`${cwd}/${exitCodeFile}`, enc.encode(`${code}`));
  const status = await p.status();
  assertEquals(status.success, false);
  assertEquals(status.code, code);
  assertEquals(status.signal, void 0);
  p.close();
});
unitTest({perms: {run: true}}, async function runStdinPiped() {
  const p = Deno.run({
    cmd: ["python", "-c", "import sys; assert 'hello' == sys.stdin.read();"],
    stdin: "piped"
  });
  assert(p.stdin);
  assert(!p.stdout);
  assert(!p.stderr);
  const msg = new TextEncoder().encode("hello");
  const n = await p.stdin.write(msg);
  assertEquals(n, msg.byteLength);
  p.stdin.close();
  const status = await p.status();
  assertEquals(status.success, true);
  assertEquals(status.code, 0);
  assertEquals(status.signal, void 0);
  p.close();
});
unitTest({perms: {run: true}}, async function runStdoutPiped() {
  const p = Deno.run({
    cmd: ["python", "-c", "import sys; sys.stdout.write('hello')"],
    stdout: "piped"
  });
  assert(!p.stdin);
  assert(!p.stderr);
  const data = new Uint8Array(10);
  let r = await p.stdout.read(data);
  if (r === null) {
    throw new Error("p.stdout.read(...) should not be null");
  }
  assertEquals(r, 5);
  const s = new TextDecoder().decode(data.subarray(0, r));
  assertEquals(s, "hello");
  r = await p.stdout.read(data);
  assertEquals(r, null);
  p.stdout.close();
  const status = await p.status();
  assertEquals(status.success, true);
  assertEquals(status.code, 0);
  assertEquals(status.signal, void 0);
  p.close();
});
unitTest({perms: {run: true}}, async function runStderrPiped() {
  const p = Deno.run({
    cmd: ["python", "-c", "import sys; sys.stderr.write('hello')"],
    stderr: "piped"
  });
  assert(!p.stdin);
  assert(!p.stdout);
  const data = new Uint8Array(10);
  let r = await p.stderr.read(data);
  if (r === null) {
    throw new Error("p.stderr.read should not return null here");
  }
  assertEquals(r, 5);
  const s = new TextDecoder().decode(data.subarray(0, r));
  assertEquals(s, "hello");
  r = await p.stderr.read(data);
  assertEquals(r, null);
  p.stderr.close();
  const status = await p.status();
  assertEquals(status.success, true);
  assertEquals(status.code, 0);
  assertEquals(status.signal, void 0);
  p.close();
});
unitTest({perms: {run: true}}, async function runOutput() {
  const p = Deno.run({
    cmd: ["python", "-c", "import sys; sys.stdout.write('hello')"],
    stdout: "piped"
  });
  const output = await p.output();
  const s = new TextDecoder().decode(output);
  assertEquals(s, "hello");
  p.close();
});
unitTest({perms: {run: true}}, async function runStderrOutput() {
  const p = Deno.run({
    cmd: ["python", "-c", "import sys; sys.stderr.write('error')"],
    stderr: "piped"
  });
  const error = await p.stderrOutput();
  const s = new TextDecoder().decode(error);
  assertEquals(s, "error");
  p.close();
});
unitTest({perms: {run: true, write: true, read: true}}, async function runRedirectStdoutStderr() {
  const tempDir = await Deno.makeTempDir();
  const fileName = tempDir + "/redirected_stdio.txt";
  const file = await Deno.open(fileName, {
    create: true,
    write: true
  });
  const p = Deno.run({
    cmd: [
      "python",
      "-c",
      "import sys; sys.stderr.write('error\\n'); sys.stdout.write('output\\n');"
    ],
    stdout: file.rid,
    stderr: file.rid
  });
  await p.status();
  p.close();
  file.close();
  const fileContents = await Deno.readFile(fileName);
  const decoder = new TextDecoder();
  const text = decoder.decode(fileContents);
  assertStringContains(text, "error");
  assertStringContains(text, "output");
});
unitTest({perms: {run: true, write: true, read: true}}, async function runRedirectStdin() {
  const tempDir = await Deno.makeTempDir();
  const fileName = tempDir + "/redirected_stdio.txt";
  const encoder = new TextEncoder();
  await Deno.writeFile(fileName, encoder.encode("hello"));
  const file = await Deno.open(fileName);
  const p = Deno.run({
    cmd: ["python", "-c", "import sys; assert 'hello' == sys.stdin.read();"],
    stdin: file.rid
  });
  const status = await p.status();
  assertEquals(status.code, 0);
  p.close();
  file.close();
});
unitTest({perms: {run: true}}, async function runEnv() {
  const p = Deno.run({
    cmd: [
      "python",
      "-c",
      "import os, sys; sys.stdout.write(os.environ.get('FOO', '') + os.environ.get('BAR', ''))"
    ],
    env: {
      FOO: "0123",
      BAR: "4567"
    },
    stdout: "piped"
  });
  const output = await p.output();
  const s = new TextDecoder().decode(output);
  assertEquals(s, "01234567");
  p.close();
});
unitTest({perms: {run: true}}, async function runClose() {
  const p = Deno.run({
    cmd: [
      "python",
      "-c",
      "from time import sleep; import sys; sleep(10000); sys.stderr.write('error')"
    ],
    stderr: "piped"
  });
  assert(!p.stdin);
  assert(!p.stdout);
  p.close();
  const data = new Uint8Array(10);
  const r = await p.stderr.read(data);
  assertEquals(r, null);
  p.stderr.close();
});
unitTest({perms: {run: true}}, async function runKillAfterStatus() {
  const p = Deno.run({
    cmd: ["python", "-c", 'print("hello")']
  });
  await p.status();
  const expectedErrorType = Deno.build.os === "windows" ? Deno.errors.PermissionDenied : Deno.errors.NotFound;
  assertThrows(() => p.kill(Deno.Signal.SIGTERM), expectedErrorType);
  p.close();
});
unitTest(function signalNumbers() {
  if (Deno.build.os === "darwin") {
    assertEquals(Deno.Signal.SIGSTOP, 17);
  } else if (Deno.build.os === "linux") {
    assertEquals(Deno.Signal.SIGSTOP, 19);
  }
});
unitTest(function killPermissions() {
  assertThrows(() => {
    Deno.kill(Deno.pid, Deno.Signal.SIGCONT);
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {run: true}}, async function killSuccess() {
  const p = Deno.run({
    cmd: ["python", "-c", "from time import sleep; sleep(10000)"]
  });
  assertEquals(Deno.Signal.SIGINT, 2);
  Deno.kill(p.pid, Deno.Signal.SIGINT);
  const status = await p.status();
  assertEquals(status.success, false);
  try {
    assertEquals(status.code, 128 + Deno.Signal.SIGINT);
    assertEquals(status.signal, Deno.Signal.SIGINT);
  } catch {
    assertEquals(status.code, 1);
    assertEquals(status.signal, void 0);
  }
  p.close();
});
unitTest({perms: {run: true}}, function killFailed() {
  const p = Deno.run({
    cmd: ["python", "-c", "from time import sleep; sleep(10000)"]
  });
  assert(!p.stdin);
  assert(!p.stdout);
  assertThrows(() => {
    Deno.kill(p.pid, 12345);
  }, TypeError);
  p.close();
});
