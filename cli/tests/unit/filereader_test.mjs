import {assertEquals, unitTest} from "./test_util.mjs";
unitTest(function fileReaderConstruct() {
  const fr = new FileReader();
  assertEquals(fr.readyState, FileReader.EMPTY);
  assertEquals(FileReader.EMPTY, 0);
  assertEquals(FileReader.LOADING, 1);
  assertEquals(FileReader.DONE, 2);
});
unitTest(async function fileReaderLoadBlob() {
  await new Promise((resolve) => {
    const fr = new FileReader();
    const b1 = new Blob(["Hello World"]);
    assertEquals(fr.readyState, FileReader.EMPTY);
    const hasOnEvents = {
      load: false,
      loadend: false,
      loadstart: false,
      progress: 0
    };
    const hasDispatchedEvents = {
      load: false,
      loadend: false,
      loadstart: false,
      progress: 0
    };
    let result = null;
    fr.addEventListener("load", () => {
      hasDispatchedEvents.load = true;
    });
    fr.addEventListener("loadend", () => {
      hasDispatchedEvents.loadend = true;
    });
    fr.addEventListener("loadstart", () => {
      hasDispatchedEvents.loadstart = true;
    });
    fr.addEventListener("progress", () => {
      hasDispatchedEvents.progress += 1;
    });
    fr.onloadstart = () => {
      hasOnEvents.loadstart = true;
    };
    fr.onprogress = () => {
      assertEquals(fr.readyState, FileReader.LOADING);
      hasOnEvents.progress += 1;
    };
    fr.onload = () => {
      hasOnEvents.load = true;
    };
    fr.onloadend = (ev) => {
      hasOnEvents.loadend = true;
      result = fr.result;
      assertEquals(hasOnEvents.loadstart, true);
      assertEquals(hasDispatchedEvents.loadstart, true);
      assertEquals(hasOnEvents.load, true);
      assertEquals(hasDispatchedEvents.load, true);
      assertEquals(hasOnEvents.loadend, true);
      assertEquals(hasDispatchedEvents.loadend, true);
      assertEquals(fr.readyState, FileReader.DONE);
      assertEquals(result, "Hello World");
      assertEquals(ev.lengthComputable, true);
      resolve();
    };
    fr.readAsText(b1);
  });
});
unitTest(async function fileReaderLoadBlobDouble() {
  const fr = new FileReader();
  const b1 = new Blob(["First load"]);
  const b2 = new Blob(["Second load"]);
  await new Promise((resolve) => {
    let result = null;
    fr.onload = () => {
      result = fr.result;
      assertEquals(result === "First load" || result === "Second load", true);
      if (result === "First load") {
        fr.readAsText(b2);
      }
    };
    fr.onloadend = () => {
      assertEquals(result, "Second load");
      resolve();
    };
    fr.readAsText(b1);
  });
});
unitTest(async function fileReaderLoadBlobArrayBuffer() {
  await new Promise((resolve) => {
    const fr = new FileReader();
    const b1 = new Blob(["Hello World"]);
    let result = null;
    fr.onloadend = (ev) => {
      assertEquals(fr.result instanceof ArrayBuffer, true);
      result = fr.result;
      const decoder = new TextDecoder();
      const text = decoder.decode(result);
      assertEquals(text, "Hello World");
      assertEquals(ev.lengthComputable, true);
      resolve();
    };
    fr.readAsArrayBuffer(b1);
  });
});
unitTest(async function fileReaderLoadBlobDataUrl() {
  await new Promise((resolve) => {
    const fr = new FileReader();
    const b1 = new Blob(["Hello World"]);
    let result = null;
    fr.onloadend = (ev) => {
      result = fr.result;
      assertEquals(result, "data:application/octet-stream;base64,SGVsbG8gV29ybGQ=");
      assertEquals(ev.lengthComputable, true);
      resolve();
    };
    fr.readAsDataURL(b1);
  });
});
unitTest(async function fileReaderLoadBlobAbort() {
  await new Promise((resolve) => {
    const fr = new FileReader();
    const b1 = new Blob(["Hello World"]);
    const hasOnEvents = {
      load: false,
      loadend: false,
      abort: false
    };
    fr.onload = () => {
      hasOnEvents.load = true;
    };
    fr.onloadend = (ev) => {
      hasOnEvents.loadend = true;
      assertEquals(hasOnEvents.load, false);
      assertEquals(hasOnEvents.loadend, true);
      assertEquals(hasOnEvents.abort, true);
      assertEquals(fr.readyState, FileReader.DONE);
      assertEquals(fr.result, null);
      assertEquals(ev.lengthComputable, false);
      resolve();
    };
    fr.onabort = () => {
      hasOnEvents.abort = true;
    };
    fr.readAsDataURL(b1);
    fr.abort();
  });
});
unitTest(async function fileReaderLoadBlobAbort2() {
  await new Promise((resolve) => {
    const fr = new FileReader();
    const b1 = new Blob(["Hello World"]);
    const hasOnEvents = {
      load: false,
      loadend: false,
      abort: false
    };
    fr.onload = () => {
      hasOnEvents.load = true;
    };
    fr.onloadend = (ev) => {
      hasOnEvents.loadend = true;
      assertEquals(hasOnEvents.load, false);
      assertEquals(hasOnEvents.loadend, true);
      assertEquals(hasOnEvents.abort, true);
      assertEquals(fr.readyState, FileReader.DONE);
      assertEquals(fr.result, null);
      assertEquals(ev.lengthComputable, false);
      resolve();
    };
    fr.onabort = () => {
      hasOnEvents.abort = true;
    };
    fr.readAsDataURL(b1);
    fr.abort();
  });
});
