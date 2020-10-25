import {serve} from "../server.mjs";
import {serveFile} from "../file_server.mjs";
const server2 = serve({port: 8e3});
console.log("Server running...");
for await (const req of server2) {
  serveFile(req, "./testdata/hello.html").then((response) => {
    req.respond(response);
  });
}
