import {serve} from "./server.js";
import {delay as delay2} from "../async/delay.js";
const addr = Deno.args[1] || "127.0.0.1:4501";
const server2 = serve(addr);
function body(i) {
  return `Step${i}
`;
}
async function delayedRespond(request, step2) {
  await delay2(3e3);
  await request.respond({status: 200, body: body(step2)});
}
async function largeRespond(request, c) {
  const b = new Uint8Array(1024 * 1024);
  b.fill(c.charCodeAt(0));
  await request.respond({status: 200, body: b});
}
async function ignoreToConsume(request, step2) {
  await request.respond({status: 200, body: body(step2)});
}
console.log("Racing server listening...\n");
let step = 1;
for await (const request of server2) {
  switch (step) {
    case 1:
      delayedRespond(request, step);
      break;
    case 2:
      largeRespond(request, "a");
      break;
    case 3:
      largeRespond(request, "b");
      break;
    case 4:
      ignoreToConsume(request, step);
      break;
    case 5:
      ignoreToConsume(request, step);
      break;
    case 6:
      ignoreToConsume(request, step);
      break;
    default:
      request.respond({status: 200, body: body(step)});
      break;
  }
  step++;
}
