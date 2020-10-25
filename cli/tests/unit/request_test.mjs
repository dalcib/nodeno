import {assert, assertEquals, assertThrows, unitTest} from "./test_util.mjs";
unitTest(function fromInit() {
  const req = new Request("http://foo/", {
    body: "ahoyhoy",
    method: "POST",
    headers: {
      "test-header": "value"
    }
  });
  assertEquals("ahoyhoy", req._bodySource);
  assertEquals(req.url, "http://foo/");
  assertEquals(req.headers.get("test-header"), "value");
});
unitTest(function fromRequest() {
  const r = new Request("http://foo/");
  r._bodySource = "ahoyhoy";
  r.headers.set("test-header", "value");
  const req = new Request(r);
  assertEquals(req._bodySource, r._bodySource);
  assertEquals(req.url, r.url);
  assertEquals(req.headers.get("test-header"), r.headers.get("test-header"));
});
unitTest(function requestNonString() {
  const nonString = {
    toString() {
      return "http://foo/";
    }
  };
  assertEquals(new Request(nonString).url, "http://foo/");
});
unitTest(function requestRelativeUrl() {
  assertThrows(() => new Request("relative-url"), TypeError, "Invalid URL.");
});
unitTest(async function cloneRequestBodyStream() {
  const stream = new Request("http://foo/", {body: "a test body"}).body;
  const r1 = new Request("http://foo/", {
    body: stream
  });
  const r2 = r1.clone();
  const b1 = await r1.text();
  const b2 = await r2.text();
  assertEquals(b1, b2);
  assert(r1._bodySource !== r2._bodySource);
});
