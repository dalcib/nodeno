import {
  decode as convertBase64ToArrayBuffer,
  encode as convertArrayBufferToBase64
} from "./base64.js";
export function addPaddingToBase64url(base64url) {
  if (base64url.length % 4 === 2)
    return base64url + "==";
  if (base64url.length % 4 === 3)
    return base64url + "=";
  if (base64url.length % 4 === 1) {
    throw new TypeError("Illegal base64url string!");
  }
  return base64url;
}
function convertBase64urlToBase64(base64url) {
  return addPaddingToBase64url(base64url).replace(/\-/g, "+").replace(/_/g, "/");
}
function convertBase64ToBase64url(base642) {
  return base642.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
export function encode(data) {
  return convertBase64ToBase64url(convertArrayBufferToBase64(data));
}
export function decode(data) {
  return convertBase64ToArrayBuffer(convertBase64urlToBase64(data));
}
