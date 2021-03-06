import {serveTLS} from "../server.mjs";
const tlsOptions = {
  hostname: "localhost",
  port: 4503,
  certFile: "./testdata/tls/localhost.crt",
  keyFile: "./testdata/tls/localhost.key"
};
const s = serveTLS(tlsOptions);
console.log(`Simple HTTPS server listening on ${tlsOptions.hostname}:${tlsOptions.port}`);
const body = new TextEncoder().encode("Hello HTTPS");
for await (const req of s) {
  req.respond({body});
}
