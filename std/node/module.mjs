import "./global.mjs";
import * as nodeBuffer from "./buffer.mjs";
import * as nodeEvents from "./events.mjs";
import * as nodeFS from "./fs.mjs";
import * as nodeOs from "./os.mjs";
import * as nodePath from "./path.mjs";
import * as nodeTimers from "./timers.mjs";
import * as nodeQueryString from "./querystring.mjs";
import * as nodeStringDecoder from "./string_decoder.mjs";
import * as nodeUtil from "./util.mjs";
import * as path from "../path/mod.mjs";
import {assert as assert2} from "../_util/assert.mjs";
import {fileURLToPath, pathToFileURL} from "./url.mjs";
const CHAR_FORWARD_SLASH = "/".charCodeAt(0);
const CHAR_BACKWARD_SLASH = "\\".charCodeAt(0);
const CHAR_COLON = ":".charCodeAt(0);
const isWindows = Deno.build.os == "windows";
const relativeResolveCache = Object.create(null);
let requireDepth = 0;
let statCache = null;
function stat(filename) {
  filename = path.toNamespacedPath(filename);
  if (statCache !== null) {
    const result = statCache.get(filename);
    if (result !== void 0)
      return result;
  }
  try {
    const info = Deno.statSync(filename);
    const result = info.isFile ? 0 : 1;
    if (statCache !== null)
      statCache.set(filename, result);
    return result;
  } catch (e) {
    if (e instanceof Deno.errors.PermissionDenied) {
      throw new Error("CJS loader requires --allow-read.");
    }
    return -1;
  }
}
function updateChildren(parent, child, scan) {
  const children = parent && parent.children;
  if (children && !(scan && children.includes(child))) {
    children.push(child);
  }
}
class Module {
  constructor(id = "", parent) {
    this.id = id;
    this.exports = {};
    this.parent = parent || null;
    updateChildren(parent || null, this, false);
    this.filename = null;
    this.loaded = false;
    this.children = [];
    this.paths = [];
    this.path = path.dirname(id);
  }
  require(id) {
    if (id === "") {
      throw new Error(`id '${id}' must be a non-empty string`);
    }
    requireDepth++;
    try {
      return Module._load(id, this, false);
    } finally {
      requireDepth--;
    }
  }
  load(filename) {
    assert2(!this.loaded);
    this.filename = filename;
    this.paths = Module._nodeModulePaths(path.dirname(filename));
    const extension = findLongestRegisteredExtension(filename);
    Module._extensions[extension](this, filename);
    this.loaded = true;
  }
  _compile(content, filename) {
    const compiledWrapper = wrapSafe(filename, content);
    const dirname = path.dirname(filename);
    const require = makeRequireFunction(this);
    const exports = this.exports;
    const thisValue = exports;
    if (requireDepth === 0) {
      statCache = new Map();
    }
    const result = compiledWrapper.call(thisValue, exports, require, this, filename, dirname);
    if (requireDepth === 0) {
      statCache = null;
    }
    return result;
  }
  static _resolveLookupPaths(request, parent) {
    if (request.charAt(0) !== "." || request.length > 1 && request.charAt(1) !== "." && request.charAt(1) !== "/" && (!isWindows || request.charAt(1) !== "\\")) {
      let paths = modulePaths;
      if (parent !== null && parent.paths && parent.paths.length) {
        paths = parent.paths.concat(paths);
      }
      return paths.length > 0 ? paths : null;
    }
    if (!parent || !parent.id || !parent.filename) {
      return ["."].concat(Module._nodeModulePaths("."), modulePaths);
    }
    return [path.dirname(parent.filename)];
  }
  static _resolveFilename(request, parent, isMain, options) {
    if (nativeModuleCanBeRequiredByUsers(request)) {
      return request;
    }
    let paths;
    if (typeof options === "object" && options !== null) {
      if (Array.isArray(options.paths)) {
        const isRelative = request.startsWith("./") || request.startsWith("../") || isWindows && request.startsWith(".\\") || request.startsWith("..\\");
        if (isRelative) {
          paths = options.paths;
        } else {
          const fakeParent = new Module("", null);
          paths = [];
          for (let i = 0; i < options.paths.length; i++) {
            const path2 = options.paths[i];
            fakeParent.paths = Module._nodeModulePaths(path2);
            const lookupPaths = Module._resolveLookupPaths(request, fakeParent);
            for (let j = 0; j < lookupPaths.length; j++) {
              if (!paths.includes(lookupPaths[j])) {
                paths.push(lookupPaths[j]);
              }
            }
          }
        }
      } else if (options.paths === void 0) {
        paths = Module._resolveLookupPaths(request, parent);
      } else {
        throw new Error("options.paths is invalid");
      }
    } else {
      paths = Module._resolveLookupPaths(request, parent);
    }
    const filename = Module._findPath(request, paths, isMain);
    if (!filename) {
      const requireStack = [];
      for (let cursor = parent; cursor; cursor = cursor.parent) {
        requireStack.push(cursor.filename || cursor.id);
      }
      let message = `Cannot find module '${request}'`;
      if (requireStack.length > 0) {
        message = message + "\nRequire stack:\n- " + requireStack.join("\n- ");
      }
      const err = new Error(message);
      err.code = "MODULE_NOT_FOUND";
      err.requireStack = requireStack;
      throw err;
    }
    return filename;
  }
  static _findPath(request, paths, isMain) {
    const absoluteRequest = path.isAbsolute(request);
    if (absoluteRequest) {
      paths = [""];
    } else if (!paths || paths.length === 0) {
      return false;
    }
    const cacheKey = request + "\0" + (paths.length === 1 ? paths[0] : paths.join("\0"));
    const entry = Module._pathCache[cacheKey];
    if (entry) {
      return entry;
    }
    let exts;
    let trailingSlash = request.length > 0 && request.charCodeAt(request.length - 1) === CHAR_FORWARD_SLASH;
    if (!trailingSlash) {
      trailingSlash = /(?:^|\/)\.?\.$/.test(request);
    }
    for (let i = 0; i < paths.length; i++) {
      const curPath = paths[i];
      if (curPath && stat(curPath) < 1)
        continue;
      const basePath = resolveExports(curPath, request, absoluteRequest);
      let filename;
      const rc = stat(basePath);
      if (!trailingSlash) {
        if (rc === 0) {
          filename = toRealPath(basePath);
        }
        if (!filename) {
          if (exts === void 0)
            exts = Object.keys(Module._extensions);
          filename = tryExtensions(basePath, exts, isMain);
        }
      }
      if (!filename && rc === 1) {
        if (exts === void 0)
          exts = Object.keys(Module._extensions);
        filename = tryPackage(basePath, exts, isMain, request);
      }
      if (filename) {
        Module._pathCache[cacheKey] = filename;
        return filename;
      }
    }
    return false;
  }
  static _load(request, parent, isMain) {
    let relResolveCacheIdentifier;
    if (parent) {
      relResolveCacheIdentifier = `${parent.path}\0${request}`;
      const filename2 = relativeResolveCache[relResolveCacheIdentifier];
      if (filename2 !== void 0) {
        const cachedModule2 = Module._cache[filename2];
        if (cachedModule2 !== void 0) {
          updateChildren(parent, cachedModule2, true);
          if (!cachedModule2.loaded) {
            return getExportsForCircularRequire(cachedModule2);
          }
          return cachedModule2.exports;
        }
        delete relativeResolveCache[relResolveCacheIdentifier];
      }
    }
    const filename = Module._resolveFilename(request, parent, isMain);
    const cachedModule = Module._cache[filename];
    if (cachedModule !== void 0) {
      updateChildren(parent, cachedModule, true);
      if (!cachedModule.loaded) {
        return getExportsForCircularRequire(cachedModule);
      }
      return cachedModule.exports;
    }
    const mod = loadNativeModule(filename, request);
    if (mod)
      return mod.exports;
    const module = new Module(filename, parent);
    if (isMain) {
      module.id = ".";
    }
    Module._cache[filename] = module;
    if (parent !== void 0) {
      assert2(relResolveCacheIdentifier);
      relativeResolveCache[relResolveCacheIdentifier] = filename;
    }
    let threw = true;
    try {
      module.load(filename);
      threw = false;
    } finally {
      if (threw) {
        delete Module._cache[filename];
        if (parent !== void 0) {
          assert2(relResolveCacheIdentifier);
          delete relativeResolveCache[relResolveCacheIdentifier];
        }
      } else if (module.exports && Object.getPrototypeOf(module.exports) === CircularRequirePrototypeWarningProxy) {
        Object.setPrototypeOf(module.exports, PublicObjectPrototype);
      }
    }
    return module.exports;
  }
  static wrap(script) {
    return `${Module.wrapper[0]}${script}${Module.wrapper[1]}`;
  }
  static _nodeModulePaths(from) {
    if (isWindows) {
      from = path.resolve(from);
      if (from.charCodeAt(from.length - 1) === CHAR_BACKWARD_SLASH && from.charCodeAt(from.length - 2) === CHAR_COLON) {
        return [from + "node_modules"];
      }
      const paths = [];
      for (let i = from.length - 1, p = 0, last = from.length; i >= 0; --i) {
        const code = from.charCodeAt(i);
        if (code === CHAR_BACKWARD_SLASH || code === CHAR_FORWARD_SLASH || code === CHAR_COLON) {
          if (p !== nmLen)
            paths.push(from.slice(0, last) + "\\node_modules");
          last = i;
          p = 0;
        } else if (p !== -1) {
          if (nmChars[p] === code) {
            ++p;
          } else {
            p = -1;
          }
        }
      }
      return paths;
    } else {
      from = path.resolve(from);
      if (from === "/")
        return ["/node_modules"];
      const paths = [];
      for (let i = from.length - 1, p = 0, last = from.length; i >= 0; --i) {
        const code = from.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
          if (p !== nmLen)
            paths.push(from.slice(0, last) + "/node_modules");
          last = i;
          p = 0;
        } else if (p !== -1) {
          if (nmChars[p] === code) {
            ++p;
          } else {
            p = -1;
          }
        }
      }
      paths.push("/node_modules");
      return paths;
    }
  }
  static createRequire(filename) {
    let filepath;
    if (filename instanceof URL || typeof filename === "string" && !path.isAbsolute(filename)) {
      filepath = fileURLToPath(filename);
    } else if (typeof filename !== "string") {
      throw new Error("filename should be a string");
    } else {
      filepath = filename;
    }
    return createRequireFromPath(filepath);
  }
  static _initPaths() {
    const homeDir = Deno.env.get("HOME");
    const nodePath2 = Deno.env.get("NODE_PATH");
    let paths = [];
    if (homeDir) {
      paths.unshift(path.resolve(homeDir, ".node_libraries"));
      paths.unshift(path.resolve(homeDir, ".node_modules"));
    }
    if (nodePath2) {
      paths = nodePath2.split(path.delimiter).filter(function pathsFilterCB(path2) {
        return !!path2;
      }).concat(paths);
    }
    modulePaths = paths;
    Module.globalPaths = modulePaths.slice(0);
  }
  static _preloadModules(requests) {
    if (!Array.isArray(requests)) {
      return;
    }
    const parent = new Module("internal/preload", null);
    try {
      parent.paths = Module._nodeModulePaths(Deno.cwd());
    } catch (e) {
      if (e.code !== "ENOENT") {
        throw e;
      }
    }
    for (let n = 0; n < requests.length; n++) {
      parent.require(requests[n]);
    }
  }
}
Module.builtinModules = [];
Module._extensions = Object.create(null);
Module._cache = Object.create(null);
Module._pathCache = Object.create(null);
Module.globalPaths = [];
Module.wrapper = [
  "(function (exports, require, module, __filename, __dirname) { ",
  "\n});"
];
const nativeModulePolyfill = new Map();
function createNativeModule(id, exports) {
  const mod = new Module(id);
  mod.exports = exports;
  mod.loaded = true;
  return mod;
}
nativeModulePolyfill.set("buffer", createNativeModule("buffer", nodeBuffer));
nativeModulePolyfill.set("events", createNativeModule("events", nodeEvents));
nativeModulePolyfill.set("fs", createNativeModule("fs", nodeFS));
nativeModulePolyfill.set("os", createNativeModule("os", nodeOs));
nativeModulePolyfill.set("path", createNativeModule("path", nodePath));
nativeModulePolyfill.set("querystring", createNativeModule("querystring", nodeQueryString));
nativeModulePolyfill.set("string_decoder", createNativeModule("string_decoder", nodeStringDecoder));
nativeModulePolyfill.set("timers", createNativeModule("timers", nodeTimers));
nativeModulePolyfill.set("util", createNativeModule("util", nodeUtil));
function loadNativeModule(_filename, request) {
  return nativeModulePolyfill.get(request);
}
function nativeModuleCanBeRequiredByUsers(request) {
  return nativeModulePolyfill.has(request);
}
for (const id of nativeModulePolyfill.keys()) {
  Module.builtinModules.push(id);
}
let modulePaths = [];
const packageJsonCache = new Map();
function readPackage(requestPath) {
  const jsonPath = path.resolve(requestPath, "package.json");
  const existing = packageJsonCache.get(jsonPath);
  if (existing !== void 0) {
    return existing;
  }
  let json;
  try {
    json = new TextDecoder().decode(Deno.readFileSync(path.toNamespacedPath(jsonPath)));
  } catch {
  }
  if (json === void 0) {
    packageJsonCache.set(jsonPath, null);
    return null;
  }
  try {
    const parsed = JSON.parse(json);
    const filtered = {
      name: parsed.name,
      main: parsed.main,
      exports: parsed.exports,
      type: parsed.type
    };
    packageJsonCache.set(jsonPath, filtered);
    return filtered;
  } catch (e) {
    e.path = jsonPath;
    e.message = "Error parsing " + jsonPath + ": " + e.message;
    throw e;
  }
}
function readPackageScope(checkPath) {
  const rootSeparatorIndex = checkPath.indexOf(path.sep);
  let separatorIndex;
  while ((separatorIndex = checkPath.lastIndexOf(path.sep)) > rootSeparatorIndex) {
    checkPath = checkPath.slice(0, separatorIndex);
    if (checkPath.endsWith(path.sep + "node_modules"))
      return false;
    const pjson = readPackage(checkPath);
    if (pjson) {
      return {
        path: checkPath,
        data: pjson
      };
    }
  }
  return false;
}
function readPackageMain(requestPath) {
  const pkg = readPackage(requestPath);
  return pkg ? pkg.main : void 0;
}
function readPackageExports(requestPath) {
  const pkg = readPackage(requestPath);
  return pkg ? pkg.exports : void 0;
}
function tryPackage(requestPath, exts, isMain, _originalPath) {
  const pkg = readPackageMain(requestPath);
  if (!pkg) {
    return tryExtensions(path.resolve(requestPath, "index"), exts, isMain);
  }
  const filename = path.resolve(requestPath, pkg);
  let actual = tryFile(filename, isMain) || tryExtensions(filename, exts, isMain) || tryExtensions(path.resolve(filename, "index"), exts, isMain);
  if (actual === false) {
    actual = tryExtensions(path.resolve(requestPath, "index"), exts, isMain);
    if (!actual) {
      const err = new Error(`Cannot find module '${filename}'. Please verify that the package.json has a valid "main" entry`);
      err.code = "MODULE_NOT_FOUND";
      throw err;
    }
  }
  return actual;
}
function tryFile(requestPath, _isMain) {
  const rc = stat(requestPath);
  return rc === 0 && toRealPath(requestPath);
}
function toRealPath(requestPath) {
  let fullPath = requestPath;
  while (true) {
    try {
      fullPath = Deno.readLinkSync(fullPath);
    } catch {
      break;
    }
  }
  return path.resolve(requestPath);
}
function tryExtensions(p, exts, isMain) {
  for (let i = 0; i < exts.length; i++) {
    const filename = tryFile(p + exts[i], isMain);
    if (filename) {
      return filename;
    }
  }
  return false;
}
function findLongestRegisteredExtension(filename) {
  const name = path.basename(filename);
  let currentExtension;
  let index;
  let startIndex = 0;
  while ((index = name.indexOf(".", startIndex)) !== -1) {
    startIndex = index + 1;
    if (index === 0)
      continue;
    currentExtension = name.slice(index);
    if (Module._extensions[currentExtension])
      return currentExtension;
  }
  return ".js";
}
function isConditionalDotExportSugar(exports, _basePath) {
  if (typeof exports === "string")
    return true;
  if (Array.isArray(exports))
    return true;
  if (typeof exports !== "object")
    return false;
  let isConditional = false;
  let firstCheck = true;
  for (const key of Object.keys(exports)) {
    const curIsConditional = key[0] !== ".";
    if (firstCheck) {
      firstCheck = false;
      isConditional = curIsConditional;
    } else if (isConditional !== curIsConditional) {
      throw new Error(`"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.`);
    }
  }
  return isConditional;
}
function applyExports(basePath, expansion) {
  const mappingKey = `.${expansion}`;
  let pkgExports = readPackageExports(basePath);
  if (pkgExports === void 0 || pkgExports === null) {
    return path.resolve(basePath, mappingKey);
  }
  if (isConditionalDotExportSugar(pkgExports, basePath)) {
    pkgExports = {".": pkgExports};
  }
  if (typeof pkgExports === "object") {
    if (Object.prototype.hasOwnProperty.call(pkgExports, mappingKey)) {
      const mapping = pkgExports[mappingKey];
      return resolveExportsTarget(pathToFileURL(basePath + "/"), mapping, "", basePath, mappingKey);
    }
    if (mappingKey === ".")
      return basePath;
    let dirMatch = "";
    for (const candidateKey of Object.keys(pkgExports)) {
      if (candidateKey[candidateKey.length - 1] !== "/")
        continue;
      if (candidateKey.length > dirMatch.length && mappingKey.startsWith(candidateKey)) {
        dirMatch = candidateKey;
      }
    }
    if (dirMatch !== "") {
      const mapping = pkgExports[dirMatch];
      const subpath = mappingKey.slice(dirMatch.length);
      return resolveExportsTarget(pathToFileURL(basePath + "/"), mapping, subpath, basePath, mappingKey);
    }
  }
  if (mappingKey === ".")
    return basePath;
  const e = new Error(`Package exports for '${basePath}' do not define a '${mappingKey}' subpath`);
  e.code = "MODULE_NOT_FOUND";
  throw e;
}
const EXPORTS_PATTERN = /^((?:@[^/\\%]+\/)?[^./\\%][^/\\%]*)(\/.*)?$/;
function resolveExports(nmPath, request, absoluteRequest) {
  if (!absoluteRequest) {
    const [, name, expansion = ""] = request.match(EXPORTS_PATTERN) || [];
    if (!name) {
      return path.resolve(nmPath, request);
    }
    const basePath = path.resolve(nmPath, name);
    return applyExports(basePath, expansion);
  }
  return path.resolve(nmPath, request);
}
function resolveExportsTarget(pkgPath, target, subpath, basePath, mappingKey) {
  if (typeof target === "string") {
    if (target.startsWith("./") && (subpath.length === 0 || target.endsWith("/"))) {
      const resolvedTarget = new URL(target, pkgPath);
      const pkgPathPath = pkgPath.pathname;
      const resolvedTargetPath = resolvedTarget.pathname;
      if (resolvedTargetPath.startsWith(pkgPathPath) && resolvedTargetPath.indexOf("/node_modules/", pkgPathPath.length - 1) === -1) {
        const resolved = new URL(subpath, resolvedTarget);
        const resolvedPath = resolved.pathname;
        if (resolvedPath.startsWith(resolvedTargetPath) && resolvedPath.indexOf("/node_modules/", pkgPathPath.length - 1) === -1) {
          return fileURLToPath(resolved);
        }
      }
    }
  } else if (Array.isArray(target)) {
    for (const targetValue of target) {
      if (Array.isArray(targetValue))
        continue;
      try {
        return resolveExportsTarget(pkgPath, targetValue, subpath, basePath, mappingKey);
      } catch (e2) {
        if (e2.code !== "MODULE_NOT_FOUND")
          throw e2;
      }
    }
  } else if (typeof target === "object" && target !== null) {
    if (Object.prototype.hasOwnProperty.call(target, "default")) {
      try {
        return resolveExportsTarget(pkgPath, target.default, subpath, basePath, mappingKey);
      } catch (e2) {
        if (e2.code !== "MODULE_NOT_FOUND")
          throw e2;
      }
    }
  }
  let e;
  if (mappingKey !== ".") {
    e = new Error(`Package exports for '${basePath}' do not define a valid '${mappingKey}' target${subpath ? " for " + subpath : ""}`);
  } else {
    e = new Error(`No valid exports main found for '${basePath}'`);
  }
  e.code = "MODULE_NOT_FOUND";
  throw e;
}
const nmChars = [115, 101, 108, 117, 100, 111, 109, 95, 101, 100, 111, 110];
const nmLen = nmChars.length;
function emitCircularRequireWarning(prop) {
  console.error(`Accessing non-existent property '${String(prop)}' of module exports inside circular dependency`);
}
const CircularRequirePrototypeWarningProxy = new Proxy({}, {
  get(target, prop) {
    if (prop in target)
      return target[prop];
    emitCircularRequireWarning(prop);
    return void 0;
  },
  getOwnPropertyDescriptor(target, prop) {
    if (Object.prototype.hasOwnProperty.call(target, prop)) {
      return Object.getOwnPropertyDescriptor(target, prop);
    }
    emitCircularRequireWarning(prop);
    return void 0;
  }
});
const PublicObjectPrototype = window.Object.prototype;
function getExportsForCircularRequire(module) {
  if (module.exports && Object.getPrototypeOf(module.exports) === PublicObjectPrototype && !module.exports.__esModule) {
    Object.setPrototypeOf(module.exports, CircularRequirePrototypeWarningProxy);
  }
  return module.exports;
}
function wrapSafe(filename, content) {
  const wrapper = Module.wrap(content);
  const [f, err] = Deno.core.evalContext(wrapper, filename);
  if (err) {
    throw err;
  }
  return f;
}
Module._extensions[".js"] = (module, filename) => {
  if (filename.endsWith(".js")) {
    const pkg = readPackageScope(filename);
    if (pkg !== false && pkg.data && pkg.data.type === "module") {
      throw new Error("Importing ESM module");
    }
  }
  const content = new TextDecoder().decode(Deno.readFileSync(filename));
  module._compile(content, filename);
};
Module._extensions[".json"] = (module, filename) => {
  const content = new TextDecoder().decode(Deno.readFileSync(filename));
  try {
    module.exports = JSON.parse(stripBOM(content));
  } catch (err) {
    err.message = filename + ": " + err.message;
    throw err;
  }
};
function createRequireFromPath(filename) {
  const trailingSlash = filename.endsWith("/") || isWindows && filename.endsWith("\\");
  const proxyPath = trailingSlash ? path.join(filename, "noop.js") : filename;
  const m = new Module(proxyPath);
  m.filename = proxyPath;
  m.paths = Module._nodeModulePaths(m.path);
  return makeRequireFunction(m);
}
function makeRequireFunction(mod) {
  const require = function require2(path2) {
    return mod.require(path2);
  };
  function resolve(request, options) {
    return Module._resolveFilename(request, mod, false, options);
  }
  require.resolve = resolve;
  function paths(request) {
    return Module._resolveLookupPaths(request, mod);
  }
  resolve.paths = paths;
  require.extensions = Module._extensions;
  require.cache = Module._cache;
  return require;
}
function stripBOM(content) {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
}
export const builtinModules = Module.builtinModules;
export const createRequire = Module.createRequire;
export default Module;
