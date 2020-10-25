import {assert as assert2} from "../_util/assert.mjs";
import {toIMF} from "../datetime/mod.mjs";
function toString(cookie) {
  if (!cookie.name) {
    return "";
  }
  const out = [];
  out.push(`${cookie.name}=${cookie.value}`);
  if (cookie.name.startsWith("__Secure")) {
    cookie.secure = true;
  }
  if (cookie.name.startsWith("__Host")) {
    cookie.path = "/";
    cookie.secure = true;
    delete cookie.domain;
  }
  if (cookie.secure) {
    out.push("Secure");
  }
  if (cookie.httpOnly) {
    out.push("HttpOnly");
  }
  if (typeof cookie.maxAge === "number" && Number.isInteger(cookie.maxAge)) {
    assert2(cookie.maxAge > 0, "Max-Age must be an integer superior to 0");
    out.push(`Max-Age=${cookie.maxAge}`);
  }
  if (cookie.domain) {
    out.push(`Domain=${cookie.domain}`);
  }
  if (cookie.sameSite) {
    out.push(`SameSite=${cookie.sameSite}`);
  }
  if (cookie.path) {
    out.push(`Path=${cookie.path}`);
  }
  if (cookie.expires) {
    const dateString = toIMF(cookie.expires);
    out.push(`Expires=${dateString}`);
  }
  if (cookie.unparsed) {
    out.push(cookie.unparsed.join("; "));
  }
  return out.join("; ");
}
export function getCookies(req) {
  const cookie = req.headers.get("Cookie");
  if (cookie != null) {
    const out = {};
    const c = cookie.split(";");
    for (const kv of c) {
      const [cookieKey, ...cookieVal] = kv.split("=");
      assert2(cookieKey != null);
      const key = cookieKey.trim();
      out[key] = cookieVal.join("=");
    }
    return out;
  }
  return {};
}
export function setCookie(res, cookie) {
  if (!res.headers) {
    res.headers = new Headers();
  }
  const v = toString(cookie);
  if (v) {
    res.headers.append("Set-Cookie", v);
  }
}
export function deleteCookie(res, name) {
  setCookie(res, {
    name,
    value: "",
    expires: new Date(0)
  });
}
