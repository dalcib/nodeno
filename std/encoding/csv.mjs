import {BufReader} from "../io/bufio.mjs";
import {TextProtoReader} from "../textproto/mod.mjs";
import {StringReader} from "../io/readers.mjs";
import {assert as assert2} from "../_util/assert.mjs";
const INVALID_RUNE = ["\r", "\n", '"'];
export const ERR_BARE_QUOTE = 'bare " in non-quoted-field';
export const ERR_QUOTE = 'extraneous or missing " in quoted-field';
export const ERR_INVALID_DELIM = "Invalid Delimiter";
export const ERR_FIELD_COUNT = "wrong number of fields";
export class ParseError extends Error {
  constructor(start, line, column, message) {
    super();
    this.startLine = start;
    this.column = column;
    this.line = line;
    if (message === ERR_FIELD_COUNT) {
      this.message = `record on line ${line}: ${message}`;
    } else if (start !== line) {
      this.message = `record on line ${start}; parse error on line ${line}, column ${column}: ${message}`;
    } else {
      this.message = `parse error on line ${line}, column ${column}: ${message}`;
    }
  }
}
function chkOptions(opt) {
  if (!opt.separator) {
    opt.separator = ",";
  }
  if (!opt.trimLeadingSpace) {
    opt.trimLeadingSpace = false;
  }
  if (INVALID_RUNE.includes(opt.separator) || typeof opt.comment === "string" && INVALID_RUNE.includes(opt.comment) || opt.separator === opt.comment) {
    throw new Error(ERR_INVALID_DELIM);
  }
}
async function readRecord(startLine, reader, opt = {separator: ",", trimLeadingSpace: false}) {
  const tp = new TextProtoReader(reader);
  let line = await readLine(tp);
  let lineIndex = startLine + 1;
  if (line === null)
    return null;
  if (line.length === 0) {
    return [];
  }
  if (opt.comment && line[0] === opt.comment) {
    return [];
  }
  assert2(opt.separator != null);
  let fullLine = line;
  let quoteError = null;
  const quote = '"';
  const quoteLen = quote.length;
  const separatorLen = opt.separator.length;
  let recordBuffer = "";
  const fieldIndexes = [];
  parseField:
    for (; ; ) {
      if (opt.trimLeadingSpace) {
        line = line.trimLeft();
      }
      if (line.length === 0 || !line.startsWith(quote)) {
        const i = line.indexOf(opt.separator);
        let field = line;
        if (i >= 0) {
          field = field.substring(0, i);
        }
        if (!opt.lazyQuotes) {
          const j = field.indexOf(quote);
          if (j >= 0) {
            const col = runeCount(fullLine.slice(0, fullLine.length - line.slice(j).length));
            quoteError = new ParseError(startLine + 1, lineIndex, col, ERR_BARE_QUOTE);
            break parseField;
          }
        }
        recordBuffer += field;
        fieldIndexes.push(recordBuffer.length);
        if (i >= 0) {
          line = line.substring(i + separatorLen);
          continue parseField;
        }
        break parseField;
      } else {
        line = line.substring(quoteLen);
        for (; ; ) {
          const i = line.indexOf(quote);
          if (i >= 0) {
            recordBuffer += line.substring(0, i);
            line = line.substring(i + quoteLen);
            if (line.startsWith(quote)) {
              recordBuffer += quote;
              line = line.substring(quoteLen);
            } else if (line.startsWith(opt.separator)) {
              line = line.substring(separatorLen);
              fieldIndexes.push(recordBuffer.length);
              continue parseField;
            } else if (line.length === 0) {
              fieldIndexes.push(recordBuffer.length);
              break parseField;
            } else if (opt.lazyQuotes) {
              recordBuffer += quote;
            } else {
              const col = runeCount(fullLine.slice(0, fullLine.length - line.length - quoteLen));
              quoteError = new ParseError(startLine + 1, lineIndex, col, ERR_QUOTE);
              break parseField;
            }
          } else if (line.length > 0 || !await isEOF(tp)) {
            recordBuffer += line;
            const r = await readLine(tp);
            lineIndex++;
            line = r ?? "";
            fullLine = line;
            if (r === null) {
              if (!opt.lazyQuotes) {
                const col = runeCount(fullLine);
                quoteError = new ParseError(startLine + 1, lineIndex, col, ERR_QUOTE);
                break parseField;
              }
              fieldIndexes.push(recordBuffer.length);
              break parseField;
            }
            recordBuffer += "\n";
          } else {
            if (!opt.lazyQuotes) {
              const col = runeCount(fullLine);
              quoteError = new ParseError(startLine + 1, lineIndex, col, ERR_QUOTE);
              break parseField;
            }
            fieldIndexes.push(recordBuffer.length);
            break parseField;
          }
        }
      }
    }
  if (quoteError) {
    throw quoteError;
  }
  const result = [];
  let preIdx = 0;
  for (const i of fieldIndexes) {
    result.push(recordBuffer.slice(preIdx, i));
    preIdx = i;
  }
  return result;
}
async function isEOF(tp) {
  return await tp.r.peek(0) === null;
}
function runeCount(s) {
  return Array.from(s).length;
}
async function readLine(tp) {
  let line;
  const r = await tp.readLine();
  if (r === null)
    return null;
  line = r;
  if (await isEOF(tp) && line.length > 0 && line[line.length - 1] === "\r") {
    line = line.substring(0, line.length - 1);
  }
  if (line.length >= 2 && line[line.length - 2] === "\r" && line[line.length - 1] === "\n") {
    line = line.substring(0, line.length - 2);
    line = line + "\n";
  }
  return line;
}
export async function readMatrix(reader, opt = {
  separator: ",",
  trimLeadingSpace: false,
  lazyQuotes: false
}) {
  const result = [];
  let _nbFields;
  let lineResult;
  let first = true;
  let lineIndex = 0;
  chkOptions(opt);
  for (; ; ) {
    const r = await readRecord(lineIndex, reader, opt);
    if (r === null)
      break;
    lineResult = r;
    lineIndex++;
    if (first) {
      first = false;
      if (opt.fieldsPerRecord !== void 0) {
        if (opt.fieldsPerRecord === 0) {
          _nbFields = lineResult.length;
        } else {
          _nbFields = opt.fieldsPerRecord;
        }
      }
    }
    if (lineResult.length > 0) {
      if (_nbFields && _nbFields !== lineResult.length) {
        throw new ParseError(lineIndex, lineIndex, null, ERR_FIELD_COUNT);
      }
      result.push(lineResult);
    }
  }
  return result;
}
export async function parse(input, opt = {
  skipFirstRow: false
}) {
  let r;
  if (input instanceof BufReader) {
    r = await readMatrix(input, opt);
  } else {
    r = await readMatrix(new BufReader(new StringReader(input)), opt);
  }
  if (opt.skipFirstRow || opt.columns) {
    let headers = [];
    let i = 0;
    if (opt.skipFirstRow) {
      const head = r.shift();
      assert2(head != null);
      headers = head.map((e) => {
        return {
          name: e
        };
      });
      i++;
    }
    if (opt.columns) {
      if (typeof opt.columns[0] !== "string") {
        headers = opt.columns;
      } else {
        const h = opt.columns;
        headers = h.map((e) => {
          return {
            name: e
          };
        });
      }
    }
    return r.map((e) => {
      if (e.length !== headers.length) {
        throw `Error number of fields line:${i}`;
      }
      i++;
      const out = {};
      for (let j = 0; j < e.length; j++) {
        const h = headers[j];
        if (h.parse) {
          out[h.name] = h.parse(e[j]);
        } else {
          out[h.name] = e[j];
        }
      }
      if (opt.parse) {
        return opt.parse(out);
      }
      return out;
    });
  }
  if (opt.parse) {
    return r.map((e) => {
      assert2(opt.parse, "opt.parse must be set");
      return opt.parse(e);
    });
  }
  return r;
}
