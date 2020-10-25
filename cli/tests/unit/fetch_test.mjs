import {assert, assertEquals, assertThrows, assertThrowsAsync, fail, unitTest} from "./test_util.mjs";
unitTest({perms: {net: true}}, async function fetchProtocolError() {
  await assertThrowsAsync(async () => {
    await fetch("file:///");
  }, TypeError, "not supported");
});
unitTest({perms: {net: true}}, async function fetchConnectionError() {
  await assertThrowsAsync(async () => {
    await fetch("http://localhost:4000");
  }, Deno.errors.Http, "error trying to connect");
});
unitTest({perms: {net: true}}, async function fetchJsonSuccess() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  const json = await response.json();
  assertEquals(json.name, "deno");
});
unitTest(async function fetchPerm() {
  await assertThrowsAsync(async () => {
    await fetch("http://localhost:4545/cli/tests/fixture.json");
  }, Deno.errors.PermissionDenied);
});
unitTest({perms: {net: true}}, async function fetchUrl() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  assertEquals(response.url, "http://localhost:4545/cli/tests/fixture.json");
  const _json = await response.json();
});
unitTest({perms: {net: true}}, async function fetchURL() {
  const response = await fetch(new URL("http://localhost:4545/cli/tests/fixture.json"));
  assertEquals(response.url, "http://localhost:4545/cli/tests/fixture.json");
  const _json = await response.json();
});
unitTest({perms: {net: true}}, async function fetchHeaders() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  const headers = response.headers;
  assertEquals(headers.get("Content-Type"), "application/json");
  const _json = await response.json();
});
unitTest({perms: {net: true}}, async function fetchBlob() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  const headers = response.headers;
  const blob = await response.blob();
  assertEquals(blob.type, headers.get("Content-Type"));
  assertEquals(blob.size, Number(headers.get("Content-Length")));
});
unitTest({perms: {net: true}}, async function fetchBodyUsed() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  assertEquals(response.bodyUsed, false);
  assertThrows(() => {
    response.bodyUsed = true;
  });
  await response.blob();
  assertEquals(response.bodyUsed, true);
});
unitTest({perms: {net: true}}, async function fetchBodyUsedReader() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  assert(response.body !== null);
  const reader = response.body.getReader();
  assertEquals(response.bodyUsed, false);
  reader.releaseLock();
  await response.json();
  assertEquals(response.bodyUsed, true);
});
unitTest({perms: {net: true}}, async function fetchBodyUsedCancelStream() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  assert(response.body !== null);
  assertEquals(response.bodyUsed, false);
  const promise = response.body.cancel();
  assertEquals(response.bodyUsed, true);
  await promise;
});
unitTest({perms: {net: true}}, async function fetchAsyncIterator() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  const headers = response.headers;
  assert(response.body !== null);
  let total = 0;
  for await (const chunk of response.body) {
    total += chunk.length;
  }
  assertEquals(total, Number(headers.get("Content-Length")));
});
unitTest({perms: {net: true}}, async function fetchBodyReader() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  const headers = response.headers;
  assert(response.body !== null);
  const reader = await response.body.getReader();
  let total = 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done)
      break;
    assert(value);
    total += value.length;
  }
  assertEquals(total, Number(headers.get("Content-Length")));
});
unitTest({perms: {net: true}}, async function fetchBodyReaderBigBody() {
  const data = "a".repeat(10 << 10);
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: data
  });
  assert(response.body !== null);
  const reader = await response.body.getReader();
  let total = 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done)
      break;
    assert(value);
    total += value.length;
  }
  assertEquals(total, data.length);
});
unitTest({perms: {net: true}}, async function responseClone() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  const response1 = response.clone();
  assert(response !== response1);
  assertEquals(response.status, response1.status);
  assertEquals(response.statusText, response1.statusText);
  const u8a = new Uint8Array(await response.arrayBuffer());
  const u8a1 = new Uint8Array(await response1.arrayBuffer());
  for (let i = 0; i < u8a.byteLength; i++) {
    assertEquals(u8a[i], u8a1[i]);
  }
});
unitTest({perms: {net: true}}, async function fetchEmptyInvalid() {
  await assertThrowsAsync(async () => {
    await fetch("");
  }, URIError);
});
unitTest({perms: {net: true}}, async function fetchMultipartFormDataSuccess() {
  const response = await fetch("http://localhost:4545/multipart_form_data.txt");
  const formData = await response.formData();
  assert(formData.has("field_1"));
  assertEquals(formData.get("field_1").toString(), "value_1 \r\n");
  assert(formData.has("field_2"));
  const file = formData.get("field_2");
  assertEquals(file.name, "file.js");
  assertEquals(await file.text(), `console.log("Hi")`);
});
unitTest({perms: {net: true}}, async function fetchURLEncodedFormDataSuccess() {
  const response = await fetch("http://localhost:4545/cli/tests/subdir/form_urlencoded.txt");
  const formData = await response.formData();
  assert(formData.has("field_1"));
  assertEquals(formData.get("field_1").toString(), "Hi");
  assert(formData.has("field_2"));
  assertEquals(formData.get("field_2").toString(), "<Deno>");
});
unitTest({perms: {net: true}}, async function fetchInitFormDataBinaryFileBody() {
  const binaryFile = new Uint8Array([
    108,
    2,
    0,
    0,
    145,
    22,
    162,
    61,
    157,
    227,
    166,
    77,
    138,
    75,
    180,
    56,
    119,
    188,
    177,
    183
  ]);
  const response = await fetch("http://localhost:4545/echo_multipart_file", {
    method: "POST",
    body: binaryFile
  });
  const resultForm = await response.formData();
  const resultFile = resultForm.get("file");
  assertEquals(resultFile.type, "application/octet-stream");
  assertEquals(resultFile.name, "file.bin");
  assertEquals(new Uint8Array(await resultFile.arrayBuffer()), binaryFile);
});
unitTest({perms: {net: true}}, async function fetchInitFormDataMultipleFilesBody() {
  const files = [
    {
      content: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 137, 1, 25]),
      type: "image/png",
      name: "image",
      fileName: "some-image.png"
    },
    {
      content: new Uint8Array([
        108,
        2,
        0,
        0,
        145,
        22,
        162,
        61,
        157,
        227,
        166,
        77,
        138,
        75,
        180,
        56,
        119,
        188,
        177,
        183
      ]),
      name: "file",
      fileName: "file.bin",
      expectedType: "application/octet-stream"
    },
    {
      content: new TextEncoder().encode("deno land"),
      type: "text/plain",
      name: "text",
      fileName: "deno.txt"
    }
  ];
  const form = new FormData();
  form.append("field", "value");
  for (const file of files) {
    form.append(file.name, new Blob([file.content], {type: file.type}), file.fileName);
  }
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: form
  });
  const resultForm = await response.formData();
  assertEquals(form.get("field"), resultForm.get("field"));
  for (const file of files) {
    const inputFile = form.get(file.name);
    const resultFile = resultForm.get(file.name);
    assertEquals(inputFile.size, resultFile.size);
    assertEquals(inputFile.name, resultFile.name);
    assertEquals(file.expectedType || file.type, resultFile.type);
    assertEquals(new Uint8Array(await resultFile.arrayBuffer()), file.content);
  }
});
unitTest({
  perms: {net: true}
}, async function fetchWithRedirection() {
  const response = await fetch("http://localhost:4546/README.md");
  assertEquals(response.status, 200);
  assertEquals(response.statusText, "OK");
  assertEquals(response.url, "http://localhost:4545/README.md");
  const body = await response.text();
  assert(body.includes("Deno"));
});
unitTest({
  perms: {net: true}
}, async function fetchWithRelativeRedirection() {
  const response = await fetch("http://localhost:4545/cli/tests/001_hello.js");
  assertEquals(response.status, 200);
  assertEquals(response.statusText, "OK");
  const body = await response.text();
  assert(body.includes("Hello"));
});
unitTest({
  perms: {net: true}
}, async function fetchWithRelativeRedirectionUrl() {
  const cases = [
    ["end", "http://localhost:4550/a/b/end"],
    ["/end", "http://localhost:4550/end"]
  ];
  for (const [loc, redUrl] of cases) {
    const response = await fetch("http://localhost:4550/a/b/c", {
      headers: new Headers([["x-location", loc]])
    });
    assertEquals(response.url, redUrl);
    assertEquals(response.redirected, true);
    assertEquals(response.status, 404);
    assertEquals(await response.text(), "");
  }
});
unitTest({
  perms: {net: true}
}, async function fetchWithInfRedirection() {
  const response = await fetch("http://localhost:4549/cli/tests");
  assertEquals(response.status, 0);
  assertEquals(response.type, "error");
  assertEquals(response.ok, false);
});
unitTest({perms: {net: true}}, async function fetchInitStringBody() {
  const data = "Hello World";
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: data
  });
  const text = await response.text();
  assertEquals(text, data);
  assert(response.headers.get("content-type").startsWith("text/plain"));
});
unitTest({perms: {net: true}}, async function fetchRequestInitStringBody() {
  const data = "Hello World";
  const req = new Request("http://localhost:4545/echo_server", {
    method: "POST",
    body: data
  });
  const response = await fetch(req);
  const text = await response.text();
  assertEquals(text, data);
});
unitTest({perms: {net: true}}, async function fetchInitTypedArrayBody() {
  const data = "Hello World";
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: new TextEncoder().encode(data)
  });
  const text = await response.text();
  assertEquals(text, data);
});
unitTest({perms: {net: true}}, async function fetchInitArrayBufferBody() {
  const data = "Hello World";
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: new TextEncoder().encode(data).buffer
  });
  const text = await response.text();
  assertEquals(text, data);
});
unitTest({perms: {net: true}}, async function fetchInitURLSearchParamsBody() {
  const data = "param1=value1&param2=value2";
  const params = new URLSearchParams(data);
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: params
  });
  const text = await response.text();
  assertEquals(text, data);
  assert(response.headers.get("content-type").startsWith("application/x-www-form-urlencoded"));
});
unitTest({perms: {net: true}}, async function fetchInitBlobBody() {
  const data = "const a = 1";
  const blob = new Blob([data], {
    type: "text/javascript"
  });
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: blob
  });
  const text = await response.text();
  assertEquals(text, data);
  assert(response.headers.get("content-type").startsWith("text/javascript"));
});
unitTest({perms: {net: true}}, async function fetchInitFormDataBody() {
  const form = new FormData();
  form.append("field", "value");
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: form
  });
  const resultForm = await response.formData();
  assertEquals(form.get("field"), resultForm.get("field"));
});
unitTest({perms: {net: true}}, async function fetchInitFormDataBlobFilenameBody() {
  const form = new FormData();
  form.append("field", "value");
  form.append("file", new Blob([new TextEncoder().encode("deno")]));
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: form
  });
  const resultForm = await response.formData();
  assertEquals(form.get("field"), resultForm.get("field"));
  const file = resultForm.get("file");
  assert(file instanceof File);
  assertEquals(file.name, "blob");
});
unitTest({perms: {net: true}}, async function fetchInitFormDataTextFileBody() {
  const fileContent = "deno land";
  const form = new FormData();
  form.append("field", "value");
  form.append("file", new Blob([new TextEncoder().encode(fileContent)], {
    type: "text/plain"
  }), "deno.txt");
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: form
  });
  const resultForm = await response.formData();
  assertEquals(form.get("field"), resultForm.get("field"));
  const file = form.get("file");
  const resultFile = resultForm.get("file");
  assertEquals(file.size, resultFile.size);
  assertEquals(file.name, resultFile.name);
  assertEquals(file.type, resultFile.type);
  assertEquals(await file.text(), await resultFile.text());
});
unitTest({perms: {net: true}}, async function fetchUserAgent() {
  const data = "Hello World";
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: new TextEncoder().encode(data)
  });
  assertEquals(response.headers.get("user-agent"), `Deno/${Deno.version.deno}`);
  await response.text();
});
function bufferServer(addr) {
  const [hostname, port] = addr.split(":");
  const listener = Deno.listen({
    hostname,
    port: Number(port)
  });
  const buf = new Deno.Buffer();
  listener.accept().then(async (conn) => {
    const p1 = buf.readFrom(conn);
    const p2 = conn.write(new TextEncoder().encode("HTTP/1.0 404 Not Found\r\nContent-Length: 2\r\n\r\nNF"));
    await Promise.all([p1, p2]);
    conn.close();
    listener.close();
  });
  return buf;
}
unitTest({
  perms: {net: true}
}, async function fetchRequest() {
  const addr = "127.0.0.1:4501";
  const buf = bufferServer(addr);
  const response = await fetch(`http://${addr}/blah`, {
    method: "POST",
    headers: [
      ["Hello", "World"],
      ["Foo", "Bar"]
    ]
  });
  await response.arrayBuffer();
  assertEquals(response.status, 404);
  assertEquals(response.headers.get("Content-Length"), "2");
  const actual = new TextDecoder().decode(buf.bytes());
  const expected = [
    "POST /blah HTTP/1.1\r\n",
    "hello: World\r\n",
    "foo: Bar\r\n",
    "accept: */*\r\n",
    `user-agent: Deno/${Deno.version.deno}\r
`,
    "accept-encoding: gzip, br\r\n",
    `host: ${addr}\r
\r
`
  ].join("");
  assertEquals(actual, expected);
});
unitTest({
  perms: {net: true}
}, async function fetchPostBodyString() {
  const addr = "127.0.0.1:4502";
  const buf = bufferServer(addr);
  const body = "hello world";
  const response = await fetch(`http://${addr}/blah`, {
    method: "POST",
    headers: [
      ["Hello", "World"],
      ["Foo", "Bar"]
    ],
    body
  });
  await response.arrayBuffer();
  assertEquals(response.status, 404);
  assertEquals(response.headers.get("Content-Length"), "2");
  const actual = new TextDecoder().decode(buf.bytes());
  const expected = [
    "POST /blah HTTP/1.1\r\n",
    "hello: World\r\n",
    "foo: Bar\r\n",
    "content-type: text/plain;charset=UTF-8\r\n",
    "accept: */*\r\n",
    `user-agent: Deno/${Deno.version.deno}\r
`,
    "accept-encoding: gzip, br\r\n",
    `host: ${addr}\r
`,
    `content-length: ${body.length}\r
\r
`,
    body
  ].join("");
  assertEquals(actual, expected);
});
unitTest({
  perms: {net: true}
}, async function fetchPostBodyTypedArray() {
  const addr = "127.0.0.1:4503";
  const buf = bufferServer(addr);
  const bodyStr = "hello world";
  const body = new TextEncoder().encode(bodyStr);
  const response = await fetch(`http://${addr}/blah`, {
    method: "POST",
    headers: [
      ["Hello", "World"],
      ["Foo", "Bar"]
    ],
    body
  });
  await response.arrayBuffer();
  assertEquals(response.status, 404);
  assertEquals(response.headers.get("Content-Length"), "2");
  const actual = new TextDecoder().decode(buf.bytes());
  const expected = [
    "POST /blah HTTP/1.1\r\n",
    "hello: World\r\n",
    "foo: Bar\r\n",
    "accept: */*\r\n",
    `user-agent: Deno/${Deno.version.deno}\r
`,
    "accept-encoding: gzip, br\r\n",
    `host: ${addr}\r
`,
    `content-length: ${body.byteLength}\r
\r
`,
    bodyStr
  ].join("");
  assertEquals(actual, expected);
});
unitTest({
  perms: {net: true}
}, async function fetchWithManualRedirection() {
  const response = await fetch("http://localhost:4546/", {
    redirect: "manual"
  });
  assertEquals(response.status, 0);
  assertEquals(response.statusText, "");
  assertEquals(response.url, "");
  assertEquals(response.type, "opaqueredirect");
  try {
    await response.text();
    fail("Reponse.text() didn't throw on a filtered response without a body (type opaqueredirect)");
  } catch (e) {
    return;
  }
});
unitTest({
  perms: {net: true}
}, async function fetchWithErrorRedirection() {
  const response = await fetch("http://localhost:4546/", {
    redirect: "error"
  });
  assertEquals(response.status, 0);
  assertEquals(response.statusText, "");
  assertEquals(response.url, "");
  assertEquals(response.type, "error");
  try {
    await response.text();
    fail("Reponse.text() didn't throw on a filtered response without a body (type error)");
  } catch (e) {
    return;
  }
});
unitTest(function responseRedirect() {
  const redir = Response.redirect("example.com/newLocation", 301);
  assertEquals(redir.status, 301);
  assertEquals(redir.statusText, "");
  assertEquals(redir.url, "");
  assertEquals(redir.headers.get("Location"), "example.com/newLocation");
  assertEquals(redir.type, "default");
});
unitTest(async function responseWithoutBody() {
  const response = new Response();
  assertEquals(await response.arrayBuffer(), new ArrayBuffer(0));
  assertEquals(await response.blob(), new Blob([]));
  assertEquals(await response.text(), "");
  await assertThrowsAsync(async () => {
    await response.json();
  });
});
unitTest({perms: {net: true}}, async function fetchBodyReadTwice() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  const _json = await response.json();
  assert(_json);
  const methods = ["json", "text", "formData", "arrayBuffer"];
  for (const method of methods) {
    try {
      await response[method]();
      fail("Reading body multiple times should failed, the stream should've been locked.");
    } catch {
    }
  }
});
unitTest({perms: {net: true}}, async function fetchBodyReaderAfterRead() {
  const response = await fetch("http://localhost:4545/cli/tests/fixture.json");
  assert(response.body !== null);
  const reader = await response.body.getReader();
  while (true) {
    const {done, value} = await reader.read();
    if (done)
      break;
    assert(value);
  }
  try {
    response.body.getReader();
    fail("The stream should've been locked.");
  } catch {
  }
});
unitTest({perms: {net: true}}, async function fetchBodyReaderWithCancelAndNewReader() {
  const data = "a".repeat(1 << 10);
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: data
  });
  assert(response.body !== null);
  const firstReader = await response.body.getReader();
  await firstReader.releaseLock();
  const reader = await response.body.getReader();
  let total = 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done)
      break;
    assert(value);
    total += value.length;
  }
  assertEquals(total, data.length);
});
unitTest({perms: {net: true}}, async function fetchBodyReaderWithReadCancelAndNewReader() {
  const data = "a".repeat(1 << 10);
  const response = await fetch("http://localhost:4545/echo_server", {
    method: "POST",
    body: data
  });
  assert(response.body !== null);
  const firstReader = await response.body.getReader();
  const {value: firstValue} = await firstReader.read();
  assert(firstValue);
  await firstReader.releaseLock();
  const reader = await response.body.getReader();
  let total = firstValue.length || 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done)
      break;
    assert(value);
    total += value.length;
  }
  assertEquals(total, data.length);
});
unitTest({perms: {net: true}}, async function fetchResourceCloseAfterStreamCancel() {
  const res = await fetch("http://localhost:4545/cli/tests/fixture.json");
  assert(res.body !== null);
  await res.body.cancel();
});
unitTest({perms: {net: true}}, async function fetchNullBodyStatus() {
  const nullBodyStatus = [101, 204, 205, 304];
  for (const status of nullBodyStatus) {
    const headers = new Headers([["x-status", String(status)]]);
    const res = await fetch("http://localhost:4545/echo_server", {
      body: "deno",
      method: "POST",
      headers
    });
    assertEquals(res.body, null);
    assertEquals(res.status, status);
  }
});
unitTest({perms: {net: true}}, async function fetchResponseContentLength() {
  const body = new Uint8Array(2 ** 16);
  const headers = new Headers([["content-type", "application/octet-stream"]]);
  const res = await fetch("http://localhost:4545/echo_server", {
    body,
    method: "POST",
    headers
  });
  assertEquals(Number(res.headers.get("content-length")), body.byteLength);
  const blob = await res.blob();
  assertEquals(blob.type, "application/octet-stream");
  assertEquals(blob.size, body.byteLength);
});
unitTest(function fetchResponseConstructorNullBody() {
  const nullBodyStatus = [204, 205, 304];
  for (const status of nullBodyStatus) {
    try {
      new Response("deno", {status});
      fail("Response with null body status cannot have body");
    } catch (e) {
      assert(e instanceof TypeError);
      assertEquals(e.message, "Response with null body status cannot have body");
    }
  }
});
unitTest(function fetchResponseConstructorInvalidStatus() {
  const invalidStatus = [101, 600, 199, null, "", NaN];
  for (const status of invalidStatus) {
    try {
      new Response("deno", {status});
      fail(`Invalid status: ${status}`);
    } catch (e) {
      assert(e instanceof RangeError);
      assertEquals(e.message, `The status provided (${status}) is outside the range [200, 599]`);
    }
  }
});
unitTest(function fetchResponseEmptyConstructor() {
  const response = new Response();
  assertEquals(response.status, 200);
  assertEquals(response.body, null);
  assertEquals(response.type, "default");
  assertEquals(response.url, "");
  assertEquals(response.redirected, false);
  assertEquals(response.ok, true);
  assertEquals(response.bodyUsed, false);
  assertEquals([...response.headers], []);
});
unitTest({perms: {net: true, read: true}}, async function fetchCustomHttpClientSuccess() {
});
