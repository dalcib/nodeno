import {BufReader} from "../io/bufio.js";
import {TextProtoReader} from "./mod.js";
import {StringReader} from "../io/readers.js";
import {assert, assertEquals, assertThrows} from "../testing/asserts.js";
function reader(s) {
  return new TextProtoReader(new BufReader(new StringReader(s)));
}
Deno.test({
  ignore: true,
  name: "[textproto] Reader : DotBytes",
  fn() {
    const _input = "dotlines\r\n.foo\r\n..bar\n...baz\nquux\r\n\r\n.\r\nanot.her\r\n";
    return Promise.resolve();
  }
});
Deno.test("[textproto] ReadEmpty", async () => {
  const r = reader("");
  const m = await r.readMIMEHeader();
  assertEquals(m, null);
});
Deno.test("[textproto] Reader", async () => {
  const r = reader("line1\nline2\n");
  let s = await r.readLine();
  assertEquals(s, "line1");
  s = await r.readLine();
  assertEquals(s, "line2");
  s = await r.readLine();
  assert(s === null);
});
Deno.test({
  name: "[textproto] Reader : MIME Header",
  async fn() {
    const input = "my-key: Value 1  \r\nLong-key: Even Longer Value\r\nmy-Key: Value 2\r\n\n";
    const r = reader(input);
    const m = await r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("My-Key"), "Value 1, Value 2");
    assertEquals(m.get("Long-key"), "Even Longer Value");
  }
});
Deno.test({
  name: "[textproto] Reader : MIME Header Single",
  async fn() {
    const input = "Foo: bar\n\n";
    const r = reader(input);
    const m = await r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Foo"), "bar");
  }
});
Deno.test({
  name: "[textproto] Reader : MIME Header No Key",
  async fn() {
    const input = ": bar\ntest-1: 1\n\n";
    const r = reader(input);
    const m = await r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Test-1"), "1");
  }
});
Deno.test({
  name: "[textproto] Reader : Large MIME Header",
  async fn() {
    const data = [];
    for (let i = 0; i < 1024; i++) {
      data.push("x");
    }
    const sdata = data.join("");
    const r = reader(`Cookie: ${sdata}\r
\r
`);
    const m = await r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Cookie"), sdata);
  }
});
Deno.test({
  name: "[textproto] Reader : MIME Header Non compliant",
  async fn() {
    const input = "Foo: bar\r\nContent-Language: en\r\nSID : 0\r\nAudio Mode : None\r\nPrivilege : 127\r\n\r\n";
    const r = reader(input);
    const m = await r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Foo"), "bar");
    assertEquals(m.get("Content-Language"), "en");
    assertEquals(m.get("SID"), null);
    assertEquals(m.get("Privilege"), null);
    assertThrows(() => {
      assertEquals(m.get("Audio Mode"), "None");
    });
  }
});
Deno.test({
  name: "[textproto] Reader : MIME Header Malformed",
  async fn() {
    const input = [
      "No colon first line\r\nFoo: foo\r\n\r\n",
      " No colon first line with leading space\r\nFoo: foo\r\n\r\n",
      "	No colon first line with leading tab\r\nFoo: foo\r\n\r\n",
      " First: line with leading space\r\nFoo: foo\r\n\r\n",
      "	First: line with leading tab\r\nFoo: foo\r\n\r\n",
      "Foo: foo\r\nNo colon second line\r\n\r\n"
    ];
    const r = reader(input.join(""));
    let err;
    try {
      await r.readMIMEHeader();
    } catch (e) {
      err = e;
    }
    assert(err instanceof Deno.errors.InvalidData);
  }
});
Deno.test({
  name: "[textproto] Reader : MIME Header Trim Continued",
  async fn() {
    const input = "a:\n 0 \r\nb:1 	\r\nc: 2\r\n 3	\n  	 4  \r\n\n";
    const r = reader(input);
    let err;
    try {
      await r.readMIMEHeader();
    } catch (e) {
      err = e;
    }
    assert(err instanceof Deno.errors.InvalidData);
  }
});
Deno.test({
  name: "[textproto] #409 issue : multipart form boundary",
  async fn() {
    const input = [
      "Accept: */*\r\n",
      'Content-Disposition: form-data; name="test"\r\n',
      " \r\n",
      "------WebKitFormBoundaryimeZ2Le9LjohiUiG--\r\n\n"
    ];
    const r = reader(input.join(""));
    const m = await r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Accept"), "*/*");
    assertEquals(m.get("Content-Disposition"), 'form-data; name="test"');
  }
});
Deno.test({
  name: "[textproto] #4521 issue",
  async fn() {
    const input = "abcdefghijklmnopqrstuvwxyz";
    const bufSize = 25;
    const tp = new TextProtoReader(new BufReader(new StringReader(input), bufSize));
    const line = await tp.readLine();
    assertEquals(line, input);
  }
});
