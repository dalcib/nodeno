import {serve} from "../server.js";
const addr = "0.0.0.0:4502";
console.log(`Simple server listening on ${addr}`);
for await (const req of serve(addr)) {
  req.respond({});
}
