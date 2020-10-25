var State;
(function(State2) {
  State2[State2["PASSTHROUGH"] = 0] = "PASSTHROUGH";
  State2[State2["PERCENT"] = 1] = "PERCENT";
  State2[State2["POSITIONAL"] = 2] = "POSITIONAL";
  State2[State2["PRECISION"] = 3] = "PRECISION";
  State2[State2["WIDTH"] = 4] = "WIDTH";
})(State || (State = {}));
var WorP;
(function(WorP2) {
  WorP2[WorP2["WIDTH"] = 0] = "WIDTH";
  WorP2[WorP2["PRECISION"] = 1] = "PRECISION";
})(WorP || (WorP = {}));
class Flags {
  constructor() {
    this.width = -1;
    this.precision = -1;
  }
}
const min = Math.min;
const UNICODE_REPLACEMENT_CHARACTER = "�";
const DEFAULT_PRECISION = 6;
const FLOAT_REGEXP = /(-?)(\d)\.?(\d*)e([+-])(\d+)/;
var F;
(function(F2) {
  F2[F2["sign"] = 1] = "sign";
  F2[F2["mantissa"] = 2] = "mantissa";
  F2[F2["fractional"] = 3] = "fractional";
  F2[F2["esign"] = 4] = "esign";
  F2[F2["exponent"] = 5] = "exponent";
})(F || (F = {}));
class Printf {
  constructor(format, ...args) {
    this.state = 0;
    this.verb = "";
    this.buf = "";
    this.argNum = 0;
    this.flags = new Flags();
    this.format = format;
    this.args = args;
    this.haveSeen = new Array(args.length);
    this.i = 0;
  }
  doPrintf() {
    for (; this.i < this.format.length; ++this.i) {
      const c = this.format[this.i];
      switch (this.state) {
        case 0:
          if (c === "%") {
            this.state = 1;
          } else {
            this.buf += c;
          }
          break;
        case 1:
          if (c === "%") {
            this.buf += c;
            this.state = 0;
          } else {
            this.handleFormat();
          }
          break;
        default:
          throw Error("Should be unreachable, certainly a bug in the lib.");
      }
    }
    let extras = false;
    let err = "%!(EXTRA";
    for (let i = 0; i !== this.haveSeen.length; ++i) {
      if (!this.haveSeen[i]) {
        extras = true;
        err += ` '${Deno.inspect(this.args[i])}'`;
      }
    }
    err += ")";
    if (extras) {
      this.buf += err;
    }
    return this.buf;
  }
  handleFormat() {
    this.flags = new Flags();
    const flags = this.flags;
    for (; this.i < this.format.length; ++this.i) {
      const c = this.format[this.i];
      switch (this.state) {
        case 1:
          switch (c) {
            case "[":
              this.handlePositional();
              this.state = 2;
              break;
            case "+":
              flags.plus = true;
              break;
            case "<":
              flags.lessthan = true;
              break;
            case "-":
              flags.dash = true;
              flags.zero = false;
              break;
            case "#":
              flags.sharp = true;
              break;
            case " ":
              flags.space = true;
              break;
            case "0":
              flags.zero = !flags.dash;
              break;
            default:
              if ("1" <= c && c <= "9" || c === "." || c === "*") {
                if (c === ".") {
                  this.flags.precision = 0;
                  this.state = 3;
                  this.i++;
                } else {
                  this.state = 4;
                }
                this.handleWidthAndPrecision(flags);
              } else {
                this.handleVerb();
                return;
              }
          }
          break;
        case 2:
          if (c === "*") {
            const worp = this.flags.precision === -1 ? 0 : 1;
            this.handleWidthOrPrecisionRef(worp);
            this.state = 1;
            break;
          } else {
            this.handleVerb();
            return;
          }
        default:
          throw new Error(`Should not be here ${this.state}, library bug!`);
      }
    }
  }
  handleWidthOrPrecisionRef(wOrP) {
    if (this.argNum >= this.args.length) {
      return;
    }
    const arg = this.args[this.argNum];
    this.haveSeen[this.argNum] = true;
    if (typeof arg === "number") {
      switch (wOrP) {
        case 0:
          this.flags.width = arg;
          break;
        default:
          this.flags.precision = arg;
      }
    } else {
      const tmp = wOrP === 0 ? "WIDTH" : "PREC";
      this.tmpError = `%!(BAD ${tmp} '${this.args[this.argNum]}')`;
    }
    this.argNum++;
  }
  handleWidthAndPrecision(flags) {
    const fmt = this.format;
    for (; this.i !== this.format.length; ++this.i) {
      const c = fmt[this.i];
      switch (this.state) {
        case 4:
          switch (c) {
            case ".":
              this.flags.precision = 0;
              this.state = 3;
              break;
            case "*":
              this.handleWidthOrPrecisionRef(0);
              break;
            default: {
              const val = parseInt(c);
              if (isNaN(val)) {
                this.i--;
                this.state = 1;
                return;
              }
              flags.width = flags.width == -1 ? 0 : flags.width;
              flags.width *= 10;
              flags.width += val;
            }
          }
          break;
        case 3: {
          if (c === "*") {
            this.handleWidthOrPrecisionRef(1);
            break;
          }
          const val = parseInt(c);
          if (isNaN(val)) {
            this.i--;
            this.state = 1;
            return;
          }
          flags.precision *= 10;
          flags.precision += val;
          break;
        }
        default:
          throw new Error("can't be here. bug.");
      }
    }
  }
  handlePositional() {
    if (this.format[this.i] !== "[") {
      throw new Error("Can't happen? Bug.");
    }
    let positional = 0;
    const format = this.format;
    this.i++;
    let err = false;
    for (; this.i !== this.format.length; ++this.i) {
      if (format[this.i] === "]") {
        break;
      }
      positional *= 10;
      const val = parseInt(format[this.i]);
      if (isNaN(val)) {
        this.tmpError = "%!(BAD INDEX)";
        err = true;
      }
      positional += val;
    }
    if (positional - 1 >= this.args.length) {
      this.tmpError = "%!(BAD INDEX)";
      err = true;
    }
    this.argNum = err ? this.argNum : positional - 1;
    return;
  }
  handleLessThan() {
    const arg = this.args[this.argNum];
    if ((arg || {}).constructor.name !== "Array") {
      throw new Error(`arg ${arg} is not an array. Todo better error handling`);
    }
    let str = "[ ";
    for (let i = 0; i !== arg.length; ++i) {
      if (i !== 0)
        str += ", ";
      str += this._handleVerb(arg[i]);
    }
    return str + " ]";
  }
  handleVerb() {
    const verb = this.format[this.i];
    this.verb = verb;
    if (this.tmpError) {
      this.buf += this.tmpError;
      this.tmpError = void 0;
      if (this.argNum < this.haveSeen.length) {
        this.haveSeen[this.argNum] = true;
      }
    } else if (this.args.length <= this.argNum) {
      this.buf += `%!(MISSING '${verb}')`;
    } else {
      const arg = this.args[this.argNum];
      this.haveSeen[this.argNum] = true;
      if (this.flags.lessthan) {
        this.buf += this.handleLessThan();
      } else {
        this.buf += this._handleVerb(arg);
      }
    }
    this.argNum++;
    this.state = 0;
  }
  _handleVerb(arg) {
    switch (this.verb) {
      case "t":
        return this.pad(arg.toString());
      case "b":
        return this.fmtNumber(arg, 2);
      case "c":
        return this.fmtNumberCodePoint(arg);
      case "d":
        return this.fmtNumber(arg, 10);
      case "o":
        return this.fmtNumber(arg, 8);
      case "x":
        return this.fmtHex(arg);
      case "X":
        return this.fmtHex(arg, true);
      case "e":
        return this.fmtFloatE(arg);
      case "E":
        return this.fmtFloatE(arg, true);
      case "f":
      case "F":
        return this.fmtFloatF(arg);
      case "g":
        return this.fmtFloatG(arg);
      case "G":
        return this.fmtFloatG(arg, true);
      case "s":
        return this.fmtString(arg);
      case "T":
        return this.fmtString(typeof arg);
      case "v":
        return this.fmtV(arg);
      case "j":
        return this.fmtJ(arg);
      default:
        return `%!(BAD VERB '${this.verb}')`;
    }
  }
  pad(s) {
    const padding = this.flags.zero ? "0" : " ";
    if (this.flags.dash) {
      return s.padEnd(this.flags.width, padding);
    }
    return s.padStart(this.flags.width, padding);
  }
  padNum(nStr, neg) {
    let sign;
    if (neg) {
      sign = "-";
    } else if (this.flags.plus || this.flags.space) {
      sign = this.flags.plus ? "+" : " ";
    } else {
      sign = "";
    }
    const zero = this.flags.zero;
    if (!zero) {
      nStr = sign + nStr;
    }
    const pad = zero ? "0" : " ";
    const len = zero ? this.flags.width - sign.length : this.flags.width;
    if (this.flags.dash) {
      nStr = nStr.padEnd(len, pad);
    } else {
      nStr = nStr.padStart(len, pad);
    }
    if (zero) {
      nStr = sign + nStr;
    }
    return nStr;
  }
  fmtNumber(n, radix, upcase = false) {
    let num = Math.abs(n).toString(radix);
    const prec = this.flags.precision;
    if (prec !== -1) {
      this.flags.zero = false;
      num = n === 0 && prec === 0 ? "" : num;
      while (num.length < prec) {
        num = "0" + num;
      }
    }
    let prefix = "";
    if (this.flags.sharp) {
      switch (radix) {
        case 2:
          prefix += "0b";
          break;
        case 8:
          prefix += num.startsWith("0") ? "" : "0";
          break;
        case 16:
          prefix += "0x";
          break;
        default:
          throw new Error("cannot handle base: " + radix);
      }
    }
    num = num.length === 0 ? num : prefix + num;
    if (upcase) {
      num = num.toUpperCase();
    }
    return this.padNum(num, n < 0);
  }
  fmtNumberCodePoint(n) {
    let s = "";
    try {
      s = String.fromCodePoint(n);
    } catch (RangeError) {
      s = UNICODE_REPLACEMENT_CHARACTER;
    }
    return this.pad(s);
  }
  fmtFloatSpecial(n) {
    if (isNaN(n)) {
      this.flags.zero = false;
      return this.padNum("NaN", false);
    }
    if (n === Number.POSITIVE_INFINITY) {
      this.flags.zero = false;
      this.flags.plus = true;
      return this.padNum("Inf", false);
    }
    if (n === Number.NEGATIVE_INFINITY) {
      this.flags.zero = false;
      return this.padNum("Inf", true);
    }
    return "";
  }
  roundFractionToPrecision(fractional, precision) {
    if (fractional.length > precision) {
      fractional = "1" + fractional;
      let tmp = parseInt(fractional.substr(0, precision + 2)) / 10;
      tmp = Math.round(tmp);
      fractional = Math.floor(tmp).toString();
      fractional = fractional.substr(1);
    } else {
      while (fractional.length < precision) {
        fractional += "0";
      }
    }
    return fractional;
  }
  fmtFloatE(n, upcase = false) {
    const special = this.fmtFloatSpecial(n);
    if (special !== "") {
      return special;
    }
    const m = n.toExponential().match(FLOAT_REGEXP);
    if (!m) {
      throw Error("can't happen, bug");
    }
    let fractional = m[3];
    const precision = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
    fractional = this.roundFractionToPrecision(fractional, precision);
    let e = m[5];
    e = e.length == 1 ? "0" + e : e;
    const val = `${m[2]}.${fractional}${upcase ? "E" : "e"}${m[4]}${e}`;
    return this.padNum(val, n < 0);
  }
  fmtFloatF(n) {
    const special = this.fmtFloatSpecial(n);
    if (special !== "") {
      return special;
    }
    function expandNumber(n2) {
      if (Number.isSafeInteger(n2)) {
        return n2.toString() + ".";
      }
      const t = n2.toExponential().split("e");
      let m = t[0].replace(".", "");
      const e = parseInt(t[1]);
      if (e < 0) {
        let nStr = "0.";
        for (let i = 0; i !== Math.abs(e) - 1; ++i) {
          nStr += "0";
        }
        return nStr += m;
      } else {
        const splIdx = e + 1;
        while (m.length < splIdx) {
          m += "0";
        }
        return m.substr(0, splIdx) + "." + m.substr(splIdx);
      }
    }
    const val = expandNumber(Math.abs(n));
    const arr = val.split(".");
    const dig = arr[0];
    let fractional = arr[1];
    const precision = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
    fractional = this.roundFractionToPrecision(fractional, precision);
    return this.padNum(`${dig}.${fractional}`, n < 0);
  }
  fmtFloatG(n, upcase = false) {
    const special = this.fmtFloatSpecial(n);
    if (special !== "") {
      return special;
    }
    let P = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
    P = P === 0 ? 1 : P;
    const m = n.toExponential().match(FLOAT_REGEXP);
    if (!m) {
      throw Error("can't happen");
    }
    const X = parseInt(m[5]) * (m[4] === "-" ? -1 : 1);
    let nStr = "";
    if (P > X && X >= -4) {
      this.flags.precision = P - (X + 1);
      nStr = this.fmtFloatF(n);
      if (!this.flags.sharp) {
        nStr = nStr.replace(/\.?0*$/, "");
      }
    } else {
      this.flags.precision = P - 1;
      nStr = this.fmtFloatE(n);
      if (!this.flags.sharp) {
        nStr = nStr.replace(/\.?0*e/, upcase ? "E" : "e");
      }
    }
    return nStr;
  }
  fmtString(s) {
    if (this.flags.precision !== -1) {
      s = s.substr(0, this.flags.precision);
    }
    return this.pad(s);
  }
  fmtHex(val, upper = false) {
    switch (typeof val) {
      case "number":
        return this.fmtNumber(val, 16, upper);
      case "string": {
        const sharp = this.flags.sharp && val.length !== 0;
        let hex = sharp ? "0x" : "";
        const prec = this.flags.precision;
        const end = prec !== -1 ? min(prec, val.length) : val.length;
        for (let i = 0; i !== end; ++i) {
          if (i !== 0 && this.flags.space) {
            hex += sharp ? " 0x" : " ";
          }
          const c = (val.charCodeAt(i) & 255).toString(16);
          hex += c.length === 1 ? `0${c}` : c;
        }
        if (upper) {
          hex = hex.toUpperCase();
        }
        return this.pad(hex);
      }
      default:
        throw new Error("currently only number and string are implemented for hex");
    }
  }
  fmtV(val) {
    if (this.flags.sharp) {
      const options = this.flags.precision !== -1 ? {depth: this.flags.precision} : {};
      return this.pad(Deno.inspect(val, options));
    } else {
      const p = this.flags.precision;
      return p === -1 ? val.toString() : val.toString().substr(0, p);
    }
  }
  fmtJ(val) {
    return JSON.stringify(val);
  }
}
export function sprintf(format, ...args) {
  const printf2 = new Printf(format, ...args);
  return printf2.doPrintf();
}
export function printf(format, ...args) {
  const s = sprintf(format, ...args);
  Deno.stdout.writeSync(new TextEncoder().encode(s));
}
