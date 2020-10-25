import {assertNotEquals, assertStrictEquals} from "../testing/asserts.js";
import {BufReader} from "../io/bufio.js";
import {dirname, fromFileUrl} from "../path/mod.js";
const moduleDir = dirname(fromFileUrl(import.meta.url));
Deno.test("[examples/echo_server]", async () => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const process = Deno.run({
    cmd: [Deno.execPath(), "run", "--allow-net", "echo_server.ts"],
    cwd: moduleDir,
    stdout: "piped"
  });
  let conn;
  try {
    const processReader = new BufReader(process.stdout);
    const message = await processReader.readLine();
    assertNotEquals(message, null);
    assertStrictEquals(decoder.decode(message.line).trim(), "Listening on 0.0.0.0:8080");
    conn = await Deno.connect({hostname: "127.0.0.1", port: 8080});
    const connReader = new BufReader(conn);
    await conn.write(encoder.encode("Hello echo_server\n"));
    const result = await connReader.readLine();
    assertNotEquals(result, null);
    const actualResponse = decoder.decode(result.line).trim();
    const expectedResponse = "Hello echo_server";
    assertStrictEquals(actualResponse, expectedResponse);
  } finally {
    conn?.close();
    process.stdout.close();
    process.close();
  }
});