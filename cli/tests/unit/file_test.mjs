import {assert, assertEquals, unitTest} from "./test_util.mjs";
function testFirstArgument(arg1, expectedSize) {
  const file = new File(arg1, "name");
  assert(file instanceof File);
  assertEquals(file.name, "name");
  assertEquals(file.size, expectedSize);
  assertEquals(file.type, "");
}
unitTest(function fileEmptyFileBits() {
  testFirstArgument([], 0);
});
unitTest(function fileStringFileBits() {
  testFirstArgument(["bits"], 4);
});
unitTest(function fileUnicodeStringFileBits() {
  testFirstArgument(["𝓽𝓮𝔁𝓽"], 16);
});
unitTest(function fileStringObjectFileBits() {
  testFirstArgument([new String("string object")], 13);
});
unitTest(function fileEmptyBlobFileBits() {
  testFirstArgument([new Blob()], 0);
});
unitTest(function fileBlobFileBits() {
  testFirstArgument([new Blob(["bits"])], 4);
});
unitTest(function fileEmptyFileFileBits() {
  testFirstArgument([new File([], "world.txt")], 0);
});
unitTest(function fileFileFileBits() {
  testFirstArgument([new File(["bits"], "world.txt")], 4);
});
unitTest(function fileArrayBufferFileBits() {
  testFirstArgument([new ArrayBuffer(8)], 8);
});
unitTest(function fileTypedArrayFileBits() {
  testFirstArgument([new Uint8Array([80, 65, 83, 83])], 4);
});
unitTest(function fileVariousFileBits() {
  testFirstArgument([
    "bits",
    new Blob(["bits"]),
    new Blob(),
    new Uint8Array([80, 65]),
    new Uint16Array([21331]),
    new Uint32Array([1397965136])
  ], 16);
});
unitTest(function fileNumberInFileBits() {
  testFirstArgument([12], 2);
});
unitTest(function fileArrayInFileBits() {
  testFirstArgument([[1, 2, 3]], 5);
});
unitTest(function fileObjectInFileBits() {
  testFirstArgument([{}], 15);
});
function testSecondArgument(arg2, expectedFileName) {
  const file = new File(["bits"], arg2);
  assert(file instanceof File);
  assertEquals(file.name, expectedFileName);
}
unitTest(function fileUsingFileName() {
  testSecondArgument("dummy", "dummy");
});
unitTest(function fileUsingSpecialCharacterInFileName() {
  testSecondArgument("dummy/foo", "dummy:foo");
});
unitTest(function fileUsingNullFileName() {
  testSecondArgument(null, "null");
});
unitTest(function fileUsingNumberFileName() {
  testSecondArgument(1, "1");
});
unitTest(function fileUsingEmptyStringFileName() {
  testSecondArgument("", "");
});
