export function encode(data) {
  if (typeof data === "string") {
    return btoa(data);
  } else {
    const d = new Uint8Array(data);
    let dataString = "";
    for (let i = 0; i < d.length; ++i) {
      dataString += String.fromCharCode(d[i]);
    }
    return btoa(dataString);
  }
}
export function decode(data) {
  const binaryString = decodeString(data);
  const binary = new Uint8Array(binaryString.length);
  for (let i = 0; i < binary.length; ++i) {
    binary[i] = binaryString.charCodeAt(i);
  }
  return binary.buffer;
}
export function decodeString(data) {
  return atob(data);
}
