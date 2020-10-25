const rfc1924 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~";
const Z85 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#";
export function encode(uint8, options) {
  const standard = options?.standard ?? "Adobe";
  let output = [], v, n = 0, difference = 0;
  if (uint8.length % 4 !== 0) {
    const tmp = uint8;
    difference = 4 - tmp.length % 4;
    uint8 = new Uint8Array(tmp.length + difference);
    uint8.set(tmp);
  }
  const view = new DataView(uint8.buffer);
  for (let i = 0, len = uint8.length; i < len; i += 4) {
    v = view.getUint32(i);
    if ((standard === "Adobe" || standard === "btoa") && v === 0 && i < len - difference - 3) {
      output[n++] = "z";
      continue;
    }
    if (standard === "btoa" && v === 538976288) {
      output[n++] = "y";
      continue;
    }
    for (let j = 4; j >= 0; j--) {
      output[n + j] = String.fromCharCode(v % 85 + 33);
      v = Math.trunc(v / 85);
    }
    n += 5;
  }
  switch (standard) {
    case "Adobe":
      if (options?.delimiter) {
        return `<~${output.slice(0, output.length - difference).join("")}~>`;
      }
      break;
    case "btoa":
      if (options?.delimiter) {
        return `xbtoa Begin
${output.slice(0, output.length - difference).join("")}
xbtoa End`;
      }
      break;
    case "RFC 1924":
      output = output.map((val) => rfc1924[val.charCodeAt(0) - 33]);
      break;
    case "Z85":
      output = output.map((val) => Z85[val.charCodeAt(0) - 33]);
      break;
  }
  return output.slice(0, output.length - difference).join("");
}
export function decode(ascii85, options) {
  const encoding = options?.standard ?? "Adobe";
  switch (encoding) {
    case "Adobe":
      ascii85 = ascii85.replaceAll(/(<~|~>)/g, "").replaceAll("z", "!!!!!");
      break;
    case "btoa":
      ascii85 = ascii85.replaceAll(/(xbtoa Begin|xbtoa End|\n)/g, "").replaceAll("z", "!!!!!").replaceAll("y", "+<VdL");
      break;
    case "RFC 1924":
      ascii85 = ascii85.replaceAll(/./g, (match) => String.fromCharCode(rfc1924.indexOf(match) + 33));
      break;
    case "Z85":
      ascii85 = ascii85.replaceAll(/./g, (match) => String.fromCharCode(Z85.indexOf(match) + 33));
      break;
  }
  ascii85 = ascii85.replaceAll(/[^!-u]/g, "");
  const len = ascii85.length, output = new Uint8Array(len + 4 - len % 4);
  const view = new DataView(output.buffer);
  let v = 0, n = 0, max = 0;
  for (let i = 0; i < len; ) {
    for (max += 5; i < max; i++) {
      v = v * 85 + (i < len ? ascii85.charCodeAt(i) : 117) - 33;
    }
    view.setUint32(n, v);
    v = 0;
    n += 4;
  }
  return output.slice(0, Math.trunc(len * 0.8));
}
