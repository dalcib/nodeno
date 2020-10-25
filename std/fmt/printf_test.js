import {sprintf} from "./printf.js";
import {assertEquals} from "../testing/asserts.js";
const S = sprintf;
Deno.test("noVerb", function() {
  assertEquals(sprintf("bla"), "bla");
});
Deno.test("percent", function() {
  assertEquals(sprintf("%%"), "%");
  assertEquals(sprintf("!%%!"), "!%!");
  assertEquals(sprintf("!%%"), "!%");
  assertEquals(sprintf("%%!"), "%!");
});
Deno.test("testBoolean", function() {
  assertEquals(sprintf("%t", true), "true");
  assertEquals(sprintf("%10t", true), "      true");
  assertEquals(sprintf("%-10t", false), "false     ");
  assertEquals(sprintf("%t", false), "false");
  assertEquals(sprintf("bla%t", true), "blatrue");
  assertEquals(sprintf("%tbla", false), "falsebla");
});
Deno.test("testIntegerB", function() {
  assertEquals(S("%b", 4), "100");
  assertEquals(S("%b", -4), "-100");
  assertEquals(S("%b", 4.1), "100.0001100110011001100110011001100110011001100110011");
  assertEquals(S("%b", -4.1), "-100.0001100110011001100110011001100110011001100110011");
  assertEquals(S("%b", Number.MAX_SAFE_INTEGER), "11111111111111111111111111111111111111111111111111111");
  assertEquals(S("%b", Number.MIN_SAFE_INTEGER), "-11111111111111111111111111111111111111111111111111111");
  assertEquals(S("%4b", 4), " 100");
});
Deno.test("testIntegerC", function() {
  assertEquals(S("%c", 49), "1");
  assertEquals(S("%c%b", 49, 1), "11");
  assertEquals(S("%c", 128169), "💩");
  assertEquals(S("%4c", 49), "   1");
});
Deno.test("testIntegerD", function() {
  assertEquals(S("%d", 4), "4");
  assertEquals(S("%d", -4), "-4");
  assertEquals(S("%d", Number.MAX_SAFE_INTEGER), "9007199254740991");
  assertEquals(S("%d", Number.MIN_SAFE_INTEGER), "-9007199254740991");
});
Deno.test("testIntegerO", function() {
  assertEquals(S("%o", 4), "4");
  assertEquals(S("%o", -4), "-4");
  assertEquals(S("%o", 9), "11");
  assertEquals(S("%o", -9), "-11");
  assertEquals(S("%o", Number.MAX_SAFE_INTEGER), "377777777777777777");
  assertEquals(S("%o", Number.MIN_SAFE_INTEGER), "-377777777777777777");
  assertEquals(S("%4o", 4), "   4");
});
Deno.test("testIntegerx", function() {
  assertEquals(S("%x", 4), "4");
  assertEquals(S("%x", -4), "-4");
  assertEquals(S("%x", 9), "9");
  assertEquals(S("%x", -9), "-9");
  assertEquals(S("%x", Number.MAX_SAFE_INTEGER), "1fffffffffffff");
  assertEquals(S("%x", Number.MIN_SAFE_INTEGER), "-1fffffffffffff");
  assertEquals(S("%4x", -4), "  -4");
  assertEquals(S("%-4x", -4), "-4  ");
  assertEquals(S("%+4x", 4), "  +4");
  assertEquals(S("%-+4x", 4), "+4  ");
});
Deno.test("testIntegerX", function() {
  assertEquals(S("%X", 4), "4");
  assertEquals(S("%X", -4), "-4");
  assertEquals(S("%X", 9), "9");
  assertEquals(S("%X", -9), "-9");
  assertEquals(S("%X", Number.MAX_SAFE_INTEGER), "1FFFFFFFFFFFFF");
  assertEquals(S("%X", Number.MIN_SAFE_INTEGER), "-1FFFFFFFFFFFFF");
});
Deno.test("testFloate", function() {
  assertEquals(S("%e", 4), "4.000000e+00");
  assertEquals(S("%e", -4), "-4.000000e+00");
  assertEquals(S("%e", 4.1), "4.100000e+00");
  assertEquals(S("%e", -4.1), "-4.100000e+00");
  assertEquals(S("%e", Number.MAX_SAFE_INTEGER), "9.007199e+15");
  assertEquals(S("%e", Number.MIN_SAFE_INTEGER), "-9.007199e+15");
});
Deno.test("testFloatE", function() {
  assertEquals(S("%E", 4), "4.000000E+00");
  assertEquals(S("%E", -4), "-4.000000E+00");
  assertEquals(S("%E", 4.1), "4.100000E+00");
  assertEquals(S("%E", -4.1), "-4.100000E+00");
  assertEquals(S("%E", Number.MAX_SAFE_INTEGER), "9.007199E+15");
  assertEquals(S("%E", Number.MIN_SAFE_INTEGER), "-9.007199E+15");
  assertEquals(S("%E", Number.MIN_VALUE), "5.000000E-324");
  assertEquals(S("%E", Number.MAX_VALUE), "1.797693E+308");
});
Deno.test("testFloatfF", function() {
  assertEquals(S("%f", 4), "4.000000");
  assertEquals(S("%F", 4), "4.000000");
  assertEquals(S("%f", -4), "-4.000000");
  assertEquals(S("%F", -4), "-4.000000");
  assertEquals(S("%f", 4.1), "4.100000");
  assertEquals(S("%F", 4.1), "4.100000");
  assertEquals(S("%f", -4.1), "-4.100000");
  assertEquals(S("%F", -4.1), "-4.100000");
  assertEquals(S("%f", Number.MAX_SAFE_INTEGER), "9007199254740991.000000");
  assertEquals(S("%F", Number.MAX_SAFE_INTEGER), "9007199254740991.000000");
  assertEquals(S("%f", Number.MIN_SAFE_INTEGER), "-9007199254740991.000000");
  assertEquals(S("%F", Number.MIN_SAFE_INTEGER), "-9007199254740991.000000");
  assertEquals(S("%f", Number.MIN_VALUE), "0.000000");
  assertEquals(S("%.324f", Number.MIN_VALUE), "0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005");
  assertEquals(S("%F", Number.MIN_VALUE), "0.000000");
  assertEquals(S("%f", Number.MAX_VALUE), "179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000.000000");
  assertEquals(S("%F", Number.MAX_VALUE), "179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000.000000");
});
Deno.test("testString", function() {
  assertEquals(S("%s World%s", "Hello", "!"), "Hello World!");
});
Deno.test("testHex", function() {
  assertEquals(S("%x", "123"), "313233");
  assertEquals(S("%x", "n"), "6e");
});
Deno.test("testHeX", function() {
  assertEquals(S("%X", "123"), "313233");
  assertEquals(S("%X", "n"), "6E");
});
Deno.test("testType", function() {
  assertEquals(S("%T", new Date()), "object");
  assertEquals(S("%T", 123), "number");
  assertEquals(S("%T", "123"), "string");
  assertEquals(S("%.3T", "123"), "str");
});
Deno.test("testPositional", function() {
  assertEquals(S("%[1]d%[2]d", 1, 2), "12");
  assertEquals(S("%[2]d%[1]d", 1, 2), "21");
});
Deno.test("testSharp", function() {
  assertEquals(S("%#x", "123"), "0x313233");
  assertEquals(S("%#X", "123"), "0X313233");
  assertEquals(S("%#x", 123), "0x7b");
  assertEquals(S("%#X", 123), "0X7B");
  assertEquals(S("%#o", 123), "0173");
  assertEquals(S("%#b", 4), "0b100");
});
Deno.test("testWidthAndPrecision", function() {
  assertEquals(S("%9.99d", 9), "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009");
  assertEquals(S("%1.12d", 9), "000000000009");
  assertEquals(S("%2s", "a"), " a");
  assertEquals(S("%2d", 1), " 1");
  assertEquals(S("%#4x", 1), " 0x1");
  assertEquals(S("%*.99d", 9, 9), "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009");
  assertEquals(S("%9.*d", 99, 9), "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009");
  assertEquals(S("%*s", 2, "a"), " a");
  assertEquals(S("%*d", 2, 1), " 1");
  assertEquals(S("%#*x", 4, 1), " 0x1");
});
Deno.test("testDash", function() {
  assertEquals(S("%-2s", "a"), "a ");
  assertEquals(S("%-2d", 1), "1 ");
});
Deno.test("testPlus", function() {
  assertEquals(S("%-+3d", 1), "+1 ");
  assertEquals(S("%+3d", 1), " +1");
  assertEquals(S("%+3d", -1), " -1");
});
Deno.test("testSpace", function() {
  assertEquals(S("% -3d", 3), " 3 ");
});
Deno.test("testZero", function() {
  assertEquals(S("%04s", "a"), "000a");
});
const tests = [
  ["%d", 12345, "12345"],
  ["%v", 12345, "12345"],
  ["%t", true, "true"],
  ["%s", "abc", "abc"],
  ["%x", "abc", "616263"],
  ["%x", "ÿðÿ", "fff00fff"],
  ["%X", "ÿðÿ", "FFF00FFF"],
  ["%x", "", ""],
  ["% x", "", ""],
  ["%#x", "", ""],
  ["%# x", "", ""],
  ["%x", "xyz", "78797a"],
  ["%X", "xyz", "78797A"],
  ["% x", "xyz", "78 79 7a"],
  ["% X", "xyz", "78 79 7A"],
  ["%#x", "xyz", "0x78797a"],
  ["%#X", "xyz", "0X78797A"],
  ["%# x", "xyz", "0x78 0x79 0x7a"],
  ["%# X", "xyz", "0X78 0X79 0X7A"],
  ["%c", "x".charCodeAt(0), "x"],
  ["%c", 228, "ä"],
  ["%c", 26412, "本"],
  ["%c", "日".charCodeAt(0), "日"],
  ["%.0c", "⌘".charCodeAt(0), "⌘"],
  ["%3c", "⌘".charCodeAt(0), "  ⌘"],
  ["%-3c", "⌘".charCodeAt(0), "⌘  "],
  ["%c", -1, "�"],
  ["%c", 1114112, "�"],
  ["%c", 68719476735, "�"],
  ["%5s", "abc", "  abc"],
  ["%2s", "☺", " ☺"],
  ["%-5s", "abc", "abc  "],
  ["%05s", "abc", "00abc"],
  ["%5s", "abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz"],
  ["%.5s", "abcdefghijklmnopqrstuvwxyz", "abcde"],
  ["%.0s", "日本語日本語", ""],
  ["%.5s", "日本語日本語", "日本語日本"],
  ["%.10s", "日本語日本語", "日本語日本語"],
  ["%.5x", "abcdefghijklmnopqrstuvwxyz", "6162636465"],
  ["%.1x", "日本語", "e5"],
  ["%d", 12345, "12345"],
  ["%d", -12345, "-12345"],
  ["%d", -1 << 7, "-128"],
  ["%d", -1 << 15, "-32768"],
  ["%d", -1 << 31, "-2147483648"],
  ["%.d", 0, ""],
  ["%.0d", 0, ""],
  ["%6.0d", 0, "      "],
  ["%06.0d", 0, "      "],
  ["% d", 12345, " 12345"],
  ["%+d", 12345, "+12345"],
  ["%+d", -12345, "-12345"],
  ["%b", 7, "111"],
  ["%b", -6, "-110"],
  ["%o", parseInt("01234", 8), "1234"],
  ["%#o", parseInt("01234", 8), "01234"],
  ["%#X", 0, "0X0"],
  ["%x", 313249263, "12abcdef"],
  ["%X", 313249263, "12ABCDEF"],
  ["%.20b", 7, "00000000000000000111"],
  ["%10d", 12345, "     12345"],
  ["%10d", -12345, "    -12345"],
  ["%+10d", 12345, "    +12345"],
  ["%010d", 12345, "0000012345"],
  ["%010d", -12345, "-000012345"],
  ["%20.8d", 1234, "            00001234"],
  ["%20.8d", -1234, "           -00001234"],
  ["%020.8d", 1234, "            00001234"],
  ["%020.8d", -1234, "           -00001234"],
  ["%-20.8d", 1234, "00001234            "],
  ["%-20.8d", -1234, "-00001234           "],
  ["%-#20.8x", 19090108, "0x01234abc          "],
  ["%-#20.8X", 19090108, "0X01234ABC          "],
  ["%-#20.8o", parseInt("01234", 8), "00001234            "],
  ["%+.3e", 0, "+0.000e+00"],
  ["%+.3e", 1, "+1.000e+00"],
  ["%+.3f", -1, "-1.000"],
  ["%+.3F", -1, "-1.000"],
  ["%+07.2f", 1, "+001.00"],
  ["%+07.2f", -1, "-001.00"],
  ["%-07.2f", 1, "1.00   "],
  ["%-07.2f", -1, "-1.00  "],
  ["%+-07.2f", 1, "+1.00  "],
  ["%+-07.2f", -1, "-1.00  "],
  ["%-+07.2f", 1, "+1.00  "],
  ["%-+07.2f", -1, "-1.00  "],
  ["%+10.2f", 1, "     +1.00"],
  ["%+10.2f", -1, "     -1.00"],
  ["% .3E", -1, "-1.000E+00"],
  ["% .3e", 1, " 1.000e+00"],
  ["%+.3g", 0, "+0"],
  ["%+.3g", 1, "+1"],
  ["%+.3g", -1, "-1"],
  ["% .3g", -1, "-1"],
  ["% .3g", 1, " 1"],
  ["%#g", 1e-323, "1.00000e-323"],
  ["%#g", -1, "-1.00000"],
  ["%#g", 1.1, "1.10000"],
  ["%#g", 123456, "123456."],
  ["%#g", 1234567, "1.23457e+06"],
  ["%#g", 123e4, "1.23000e+06"],
  ["%#g", 1e6, "1.00000e+06"],
  ["%#.0f", 1, "1."],
  ["%#.0e", 1, "1.e+00"],
  ["%#.0g", 1, "1."],
  ["%#.0g", 11e5, "1.e+06"],
  ["%#.4f", 1, "1.0000"],
  ["%#.4e", 1, "1.0000e+00"],
  ["%#.4g", 1, "1.000"],
  ["%#.4g", 1e5, "1.000e+05"],
  ["%#.0f", 123, "123."],
  ["%#.0e", 123, "1.e+02"],
  ["%#.0g", 123, "1.e+02"],
  ["%#.4f", 123, "123.0000"],
  ["%#.4e", 123, "1.2300e+02"],
  ["%#.4g", 123, "123.0"],
  ["%#.4g", 123e3, "1.230e+05"],
  ["%#9.4g", 1, "    1.000"],
  ["%f", Number.POSITIVE_INFINITY, "+Inf"],
  ["%.1f", Number.NEGATIVE_INFINITY, "-Inf"],
  ["% f", NaN, " NaN"],
  ["%20f", Number.POSITIVE_INFINITY, "                +Inf"],
  ["% 20e", Number.NEGATIVE_INFINITY, "                -Inf"],
  ["%+20E", Number.NEGATIVE_INFINITY, "                -Inf"],
  ["% +20g", Number.NEGATIVE_INFINITY, "                -Inf"],
  ["%+-20G", Number.POSITIVE_INFINITY, "+Inf                "],
  ["%20e", NaN, "                 NaN"],
  ["% +20E", NaN, "                +NaN"],
  ["% -20g", NaN, " NaN                "],
  ["%+-20G", NaN, "+NaN                "],
  ["%+020e", Number.POSITIVE_INFINITY, "                +Inf"],
  ["%-020f", Number.NEGATIVE_INFINITY, "-Inf                "],
  ["%-020E", NaN, "NaN                 "],
  ["%e", 1, "1.000000e+00"],
  ["%e", 12345678e-1, "1.234568e+06"],
  ["%e", 12345678e-12, "1.234568e-05"],
  ["%e", -7, "-7.000000e+00"],
  ["%e", -1e-9, "-1.000000e-09"],
  ["%f", 12345678e-1, "1234567.800000"],
  ["%f", 12345678e-12, "0.000012"],
  ["%f", -7, "-7.000000"],
  ["%f", -1e-9, "-0.000000"],
  ["%g", 12345678e-1, "1.23457e+06"],
  ["%g", 12345678e-12, "1.23457e-05"],
  ["%g", -7, "-7"],
  ["%g", -1e-9, "-1e-09"],
  ["%E", 1, "1.000000E+00"],
  ["%E", 12345678e-1, "1.234568E+06"],
  ["%E", 12345678e-12, "1.234568E-05"],
  ["%E", -7, "-7.000000E+00"],
  ["%E", -1e-9, "-1.000000E-09"],
  ["%G", 12345678e-1, "1.23457E+06"],
  ["%G", 12345678e-12, "1.23457E-05"],
  ["%G", -7, "-7"],
  ["%G", -1e-9, "-1E-09"],
  ["%20.5s", "qwertyuiop", "               qwert"],
  ["%.5s", "qwertyuiop", "qwert"],
  ["%-20.5s", "qwertyuiop", "qwert               "],
  ["%20c", "x".charCodeAt(0), "                   x"],
  ["%-20c", "x".charCodeAt(0), "x                   "],
  ["%20.6e", 1234.5, "        1.234500e+03"],
  ["%20.6e", 12345e-7, "        1.234500e-03"],
  ["%20e", 1234.5, "        1.234500e+03"],
  ["%20e", 12345e-7, "        1.234500e-03"],
  ["%20.8e", 1234.5, "      1.23450000e+03"],
  ["%20f", 1234.56789, "         1234.567890"],
  ["%20f", 0.00123456789, "            0.001235"],
  ["%20f", 12345678901234568e-6, "  12345678901.234568"],
  ["%-20f", 1234.56789, "1234.567890         "],
  ["%20.8f", 1234.56789, "       1234.56789000"],
  ["%20.8f", 0.00123456789, "          0.00123457"],
  ["%g", 1234.56789, "1234.57"],
  ["%g", 0.00123456789, "0.00123457"],
  ["%g", 123456789e12, "1.23457e+20"],
  ["%2x", "", "  "],
  ["%#2x", "", "  "],
  ["% 02x", "", "00"],
  ["%# 02x", "", "00"],
  ["%-2x", "", "  "],
  ["%-02x", "", "  "],
  ["%8x", "«", "      ab"],
  ["% 8x", "«", "      ab"],
  ["%#8x", "«", "    0xab"],
  ["%# 8x", "«", "    0xab"],
  ["%08x", "«", "000000ab"],
  ["% 08x", "«", "000000ab"],
  ["%#08x", "«", "00000xab"],
  ["%# 08x", "«", "00000xab"],
  ["%10x", "«Í", "      abcd"],
  ["% 10x", "«Í", "     ab cd"],
  ["%#10x", "«Í", "    0xabcd"],
  ["%# 10x", "«Í", " 0xab 0xcd"],
  ["%010x", "«Í", "000000abcd"],
  ["% 010x", "«Í", "00000ab cd"],
  ["%#010x", "«Í", "00000xabcd"],
  ["%# 010x", "«Í", "00xab 0xcd"],
  ["%-10X", "«", "AB        "],
  ["% -010X", "«", "AB        "],
  ["%#-10X", "«Í", "0XABCD    "],
  ["%# -010X", "«Í", "0XAB 0XCD "],
  ["%T", {}, "object"],
  ["%T", 1, "number"],
  ["%T", "", "string"],
  ["%T", void 0, "undefined"],
  ["%T", null, "object"],
  ["%T", S, "function"],
  ["%T", true, "boolean"],
  ["%T", Symbol(), "symbol"],
  ["%.2f", 1, "1.00"],
  ["%.2f", -1, "-1.00"],
  ["% .2f", 1, " 1.00"],
  ["% .2f", -1, "-1.00"],
  ["%+.2f", 1, "+1.00"],
  ["%+.2f", -1, "-1.00"],
  ["%7.2f", 1, "   1.00"],
  ["%7.2f", -1, "  -1.00"],
  ["% 7.2f", 1, "   1.00"],
  ["% 7.2f", -1, "  -1.00"],
  ["%+7.2f", 1, "  +1.00"],
  ["%+7.2f", -1, "  -1.00"],
  ["% +7.2f", 1, "  +1.00"],
  ["% +7.2f", -1, "  -1.00"],
  ["%07.2f", 1, "0001.00"],
  ["%07.2f", -1, "-001.00"],
  ["% 07.2f", 1, " 001.00"],
  ["% 07.2f", -1, "-001.00"],
  ["%+07.2f", 1, "+001.00"],
  ["%+07.2f", -1, "-001.00"],
  ["% +07.2f", 1, "+001.00"],
  ["% +07.2f", -1, "-001.00"]
];
Deno.test("testThorough", function() {
  tests.forEach((t, i) => {
    const is = S(t[0], t[1]);
    const should = t[2];
    assertEquals(is, should, `failed case[${i}] : is >${is}< should >${should}<`);
  });
});
Deno.test("testWeirdos", function() {
  assertEquals(S("%.d", 9), "9");
  assertEquals(S("dec[%d]=%d hex[%[1]d]=%#x oct[%[1]d]=%#o %s", 1, 255, "Third"), "dec[1]=255 hex[1]=0xff oct[1]=0377 Third");
});
Deno.test("formatV", function() {
  const a = {a: {a: {a: {a: {a: {a: {a: {}}}}}}}};
  assertEquals(S("%v", a), "[object Object]");
  assertEquals(S("%#v", a), `{ a: { a: { a: { a: [Object] } } } }`);
  assertEquals(S("%#.8v", a), "{ a: { a: { a: { a: { a: { a: { a: {} } } } } } } }");
  assertEquals(S("%#.1v", a), `{ a: [Object] }`);
});
Deno.test("formatJ", function() {
  const a = {a: {a: {a: {a: {a: {a: {a: {}}}}}}}};
  assertEquals(S("%j", a), `{"a":{"a":{"a":{"a":{"a":{"a":{"a":{}}}}}}}}`);
});
Deno.test("flagLessThan", function() {
  const a = {a: {a: {a: {a: {a: {a: {a: {}}}}}}}};
  const aArray = [a, a, a];
  assertEquals(S("%<#.1v", aArray), `[ { a: [Object] }, { a: [Object] }, { a: [Object] } ]`);
  const fArray = [1.2345, 0.98765, 1234567895678e-4];
  assertEquals(S("%<.2f", fArray), "[ 1.23, 0.99, 123456789.57 ]");
});
Deno.test("testErrors", function() {
  assertEquals(S("A %h", ""), "A %!(BAD VERB 'h')");
  assertEquals(S("%J", ""), "%!(BAD VERB 'J')");
  assertEquals(S("bla%J", ""), "bla%!(BAD VERB 'J')");
  assertEquals(S("%Jbla", ""), "%!(BAD VERB 'J')bla");
  assertEquals(S("%d"), "%!(MISSING 'd')");
  assertEquals(S("%d %d", 1), "1 %!(MISSING 'd')");
  assertEquals(S("%d %f A", 1), "1 %!(MISSING 'f') A");
  assertEquals(S("%*.2f", "a", 1.1), "%!(BAD WIDTH 'a')");
  assertEquals(S("%.*f", "a", 1.1), "%!(BAD PREC 'a')");
  assertEquals(S("%.[2]*f", 1.23, "p"), `%!(BAD PREC 'p')%!(EXTRA '1.23')`);
  assertEquals(S("%.[2]*[1]f Yippie!", 1.23, "p"), "%!(BAD PREC 'p') Yippie!");
  assertEquals(S("%[1]*.2f", "a", "p"), "%!(BAD WIDTH 'a')");
  assertEquals(S("A", "a", "p"), `A%!(EXTRA '"a"' '"p"')`);
  assertEquals(S("%[2]s %[2]s", "a", "p"), `p p%!(EXTRA '"a"')`);
  assertEquals(S("%[hallo]s %d %d %d", 1, 2, 3, 4), "%!(BAD INDEX) 2 3 4");
  assertEquals(S("%[5]s", 1, 2, 3, 4), `%!(BAD INDEX)%!(EXTRA '2' '3' '4')`);
  assertEquals(S("%[5]f"), "%!(BAD INDEX)");
  assertEquals(S("%.[5]f"), "%!(BAD INDEX)");
  assertEquals(S("%.[5]*f"), "%!(BAD INDEX)");
});
