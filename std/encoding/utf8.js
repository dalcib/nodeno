export const encoder = new TextEncoder();
export function encode(input) {
  return encoder.encode(input);
}
export const decoder = new TextDecoder();
export function decode(input) {
  return decoder.decode(input);
}
