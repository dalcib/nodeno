export function hasOwnProperty(obj, v) {
  if (obj == null) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(obj, v);
}
