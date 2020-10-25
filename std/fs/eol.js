export var EOL;
(function(EOL2) {
  EOL2["LF"] = "\n";
  EOL2["CRLF"] = "\r\n";
})(EOL || (EOL = {}));
const regDetect = /(?:\r?\n)/g;
export function detect(content) {
  const d = content.match(regDetect);
  if (!d || d.length === 0) {
    return null;
  }
  const crlf = d.filter((x) => x === EOL.CRLF);
  if (crlf.length > 0) {
    return EOL.CRLF;
  } else {
    return EOL.LF;
  }
}
export function format(content, eol) {
  return content.replace(regDetect, eol);
}
