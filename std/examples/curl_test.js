import {serve} from "../http/server.js";
import {assertStrictEquals} from "../testing/asserts.js";
import {dirname, fromFileUrl} from "../path/mod.js";
const moduleDir = dirname(fromFileUrl(import.meta.url));
Deno.test({
  name: "[examples/curl] send a request to a specified url",
  fn: async () => {
    const server2 = serve({port: 8081});
    const serverPromise = (async () => {
      for await (const req of server2) {
        req.respond({body: "Hello world"});
      }
    })();
    const decoder = new TextDecoder();
    const process = Deno.run({
      cmd: [
        Deno.execPath(),
        "run",
        "--allow-net",
        "curl.ts",
        "http://localhost:8081"
      ],
      cwd: moduleDir,
      stdout: "piped"
    });
    try {
      const output = await process.output();
      const actual = decoder.decode(output).trim();
      const expected = "Hello world";
      assertStrictEquals(actual, expected);
    } finally {
      server2.close();
      process.close();
      await serverPromise;
    }
  }
});
