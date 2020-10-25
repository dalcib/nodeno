function n16(n) {
  return n & 65535;
}
function n32(n) {
  return n >>> 0;
}
function add32WithCarry(a, b) {
  const added = n32(a) + n32(b);
  return [n32(added), added > 4294967295 ? 1 : 0];
}
function mul32WithCarry(a, b) {
  const al = n16(a);
  const ah = n16(a >>> 16);
  const bl = n16(b);
  const bh = n16(b >>> 16);
  const [t, tc] = add32WithCarry(al * bh, ah * bl);
  const [n, nc] = add32WithCarry(al * bl, n32(t << 16));
  const carry = nc + (tc << 16) + n16(t >>> 16) + ah * bh;
  return [n, carry];
}
export function mul32(a, b) {
  const al = n16(a);
  const ah = a - al;
  return n32(n32(ah * b) + al * b);
}
export function mul64([ah, al], [bh, bl]) {
  const [n, c] = mul32WithCarry(al, bl);
  return [n32(mul32(al, bh) + mul32(ah, bl) + c), n];
}
