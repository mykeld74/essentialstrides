var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// .netlify/multipart-parser-d6fbdf05.js
var require_multipart_parser_d6fbdf05 = __commonJS({
  ".netlify/multipart-parser-d6fbdf05.js"(exports2) {
    "use strict";
    require("fs");
    require("path");
    var shims = require_shims();
    require("http");
    require("https");
    require("zlib");
    require("stream");
    require("buffer");
    require("util");
    require("url");
    require("net");
    require("crypto");
    var s = 0;
    var S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    var f = 1;
    var F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    var LF = 10;
    var CR = 13;
    var SPACE = 32;
    var HYPHEN = 45;
    var COLON = 58;
    var A = 97;
    var Z = 122;
    var lower = (c) => c | 32;
    var noop = () => {
    };
    var MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i = 0; i < boundary.length; i++) {
          ui8a[i] = boundary.charCodeAt(i);
          this.boundaryChars[ui8a[i]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i = 0; i < length_; i++) {
          c = data[i];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i += boundaryEnd;
                while (i < bufferLength && !(data[i] in boundaryChars)) {
                  i += boundaryLength;
                }
                i -= boundaryEnd;
                c = data[i];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
    function _fileName(headerValue) {
      const m = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
      if (!m) {
        return;
      }
      const match = m[2] || m[3] || "";
      let filename = match.slice(match.lastIndexOf("\\") + 1);
      filename = filename.replace(/%22/g, '"');
      filename = filename.replace(/&#(\d{4});/g, (m2, code) => {
        return String.fromCharCode(code);
      });
      return filename;
    }
    async function toFormData(Body, ct) {
      if (!/multipart/i.test(ct)) {
        throw new TypeError("Failed to fetch");
      }
      const m = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
      if (!m) {
        throw new TypeError("no or bad content-type header, no multipart boundary");
      }
      const parser = new MultipartParser(m[1] || m[2]);
      let headerField;
      let headerValue;
      let entryValue;
      let entryName;
      let contentType;
      let filename;
      const entryChunks = [];
      const formData = new shims.FormData();
      const onPartData = (ui8a) => {
        entryValue += decoder.decode(ui8a, { stream: true });
      };
      const appendToFile = (ui8a) => {
        entryChunks.push(ui8a);
      };
      const appendFileToFormData = () => {
        const file = new shims.File(entryChunks, filename, { type: contentType });
        formData.append(entryName, file);
      };
      const appendEntryToFormData = () => {
        formData.append(entryName, entryValue);
      };
      const decoder = new TextDecoder("utf-8");
      decoder.decode();
      parser.onPartBegin = function() {
        parser.onPartData = onPartData;
        parser.onPartEnd = appendEntryToFormData;
        headerField = "";
        headerValue = "";
        entryValue = "";
        entryName = "";
        contentType = "";
        filename = null;
        entryChunks.length = 0;
      };
      parser.onHeaderField = function(ui8a) {
        headerField += decoder.decode(ui8a, { stream: true });
      };
      parser.onHeaderValue = function(ui8a) {
        headerValue += decoder.decode(ui8a, { stream: true });
      };
      parser.onHeaderEnd = function() {
        headerValue += decoder.decode();
        headerField = headerField.toLowerCase();
        if (headerField === "content-disposition") {
          const m2 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
          if (m2) {
            entryName = m2[2] || m2[3] || "";
          }
          filename = _fileName(headerValue);
          if (filename) {
            parser.onPartData = appendToFile;
            parser.onPartEnd = appendFileToFormData;
          }
        } else if (headerField === "content-type") {
          contentType = headerValue;
        }
        headerValue = "";
        headerField = "";
      };
      for await (const chunk of Body) {
        parser.write(chunk);
      }
      parser.end();
      return formData;
    }
    exports2.toFormData = toFormData;
  }
});

// .netlify/shims.js
var require_shims = __commonJS({
  ".netlify/shims.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var http = require("http");
    var https = require("https");
    var zlib = require("zlib");
    var Stream = require("stream");
    var node_buffer = require("buffer");
    var node_util = require("util");
    var node_url = require("url");
    var node_net = require("net");
    require("fs");
    require("path");
    var crypto2 = require("crypto");
    function _interopDefaultLegacy(e2) {
      return e2 && typeof e2 === "object" && "default" in e2 ? e2 : { "default": e2 };
    }
    var http__default = /* @__PURE__ */ _interopDefaultLegacy(http);
    var https__default = /* @__PURE__ */ _interopDefaultLegacy(https);
    var zlib__default = /* @__PURE__ */ _interopDefaultLegacy(zlib);
    var Stream__default = /* @__PURE__ */ _interopDefaultLegacy(Stream);
    var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    function dataUriToBuffer(uri) {
      if (!/^data:/i.test(uri)) {
        throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
      }
      uri = uri.replace(/\r?\n/g, "");
      const firstComma = uri.indexOf(",");
      if (firstComma === -1 || firstComma <= 4) {
        throw new TypeError("malformed data: URI");
      }
      const meta = uri.substring(5, firstComma).split(";");
      let charset = "";
      let base64 = false;
      const type = meta[0] || "text/plain";
      let typeFull = type;
      for (let i2 = 1; i2 < meta.length; i2++) {
        if (meta[i2] === "base64") {
          base64 = true;
        } else {
          typeFull += `;${meta[i2]}`;
          if (meta[i2].indexOf("charset=") === 0) {
            charset = meta[i2].substring(8);
          }
        }
      }
      if (!meta[0] && !charset.length) {
        typeFull += ";charset=US-ASCII";
        charset = "US-ASCII";
      }
      const encoding = base64 ? "base64" : "ascii";
      const data = unescape(uri.substring(firstComma + 1));
      const buffer = Buffer.from(data, encoding);
      buffer.type = type;
      buffer.typeFull = typeFull;
      buffer.charset = charset;
      return buffer;
    }
    var ponyfill_es2018 = { exports: {} };
    (function(module3, exports3) {
      (function(global2, factory) {
        factory(exports3);
      })(commonjsGlobal, function(exports4) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals2 = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals2 && globals2.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F, V, args) {
          if (typeof F !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F, V, args);
        }
        function promiseCall(F, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve, reject) => {
            reader._closedPromise_resolve = resolve;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a4) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry = this._queue.shift();
              this._queueTotalSize -= entry.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a4) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a4;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a4 = stream._writableStreamController._abortController) === null || _a4 === void 0 ? void 0 : _a4.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve, reject) => {
            const closeRequest = {
              _resolve: resolve,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve, reject) => {
            const writeRequest = {
              _resolve: resolve,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error) {
          stream._inFlightWriteRequest._reject(error);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error) {
          stream._inFlightCloseRequest._reject(error);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve, reject) => {
            writer._closedPromise_resolve = resolve;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve, reject) => {
            writer._readyPromise_resolve = resolve;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a4) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
              } else {
                finalize(isError, error);
              }
            }
            function finalize(isError, error) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error);
              } else {
                resolve(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve) => {
            resolveCancelPromise = resolve;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve) => {
            resolveCancelPromise = resolve;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable, "readable", "ReadableWritablePair");
          assertReadableStream(readable, `${context} has member 'readable' that`);
          const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable, "writable", "ReadableWritablePair");
          assertWritableStream(writable, `${context} has member 'writable' that`);
          return { readable, writable };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        try {
          Object.defineProperty(byteLengthSizeFunction, "name", {
            value: "size",
            configurable: true
          });
        } catch (_a4) {
        }
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        try {
          Object.defineProperty(countSizeFunction, "name", {
            value: "size",
            configurable: true
          });
        } catch (_a4) {
        }
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve) => {
              startPromise_resolve = resolve;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve) => {
            stream._backpressureChangePromise_resolve = resolve;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable = stream._writable;
              const state = writable._state;
              if (state === "erroring") {
                throw writable._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable._state === "errored") {
              throw readable._storedError;
            }
            ReadableStreamDefaultControllerClose(readable._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports4.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports4.CountQueuingStrategy = CountQueuingStrategy;
        exports4.ReadableByteStreamController = ReadableByteStreamController;
        exports4.ReadableStream = ReadableStream2;
        exports4.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports4.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports4.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports4.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports4.TransformStream = TransformStream;
        exports4.TransformStreamDefaultController = TransformStreamDefaultController;
        exports4.WritableStream = WritableStream;
        exports4.WritableStreamDefaultController = WritableStreamDefaultController;
        exports4.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports4, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    var POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error) {
          process2.emitWarning = emitWarning;
          throw error;
        }
      } catch (error) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob2 } = require("buffer");
      if (Blob2 && !Blob2.prototype.stream) {
        Blob2.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error) {
    }
    var POOL_SIZE = 65536;
    async function* toIterator(parts, clone2) {
      for (const part of parts) {
        if ("stream" in part) {
          yield* part.stream();
        } else if (ArrayBuffer.isView(part)) {
          if (clone2) {
            let position = part.byteOffset;
            const end = part.byteOffset + part.byteLength;
            while (position !== end) {
              const size = Math.min(end - position, POOL_SIZE);
              const chunk = part.buffer.slice(position, position + size);
              position += chunk.byteLength;
              yield new Uint8Array(chunk);
            }
          } else {
            yield part;
          }
        } else {
          let position = 0, b = part;
          while (position !== b.size) {
            const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
            const buffer = await chunk.arrayBuffer();
            position += buffer.byteLength;
            yield new Uint8Array(buffer);
          }
        }
      }
    }
    var _parts, _type, _size, _endings, _a;
    var _Blob = (_a = class {
      constructor(blobParts = [], options = {}) {
        __privateAdd(this, _parts, []);
        __privateAdd(this, _type, "");
        __privateAdd(this, _size, 0);
        __privateAdd(this, _endings, "transparent");
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof _a) {
            part = element;
          } else {
            part = encoder.encode(`${element}`);
          }
          const size = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (size) {
            __privateSet(this, _size, __privateGet(this, _size) + size);
            __privateGet(this, _parts).push(part);
          }
        }
        __privateSet(this, _endings, `${options.endings === void 0 ? "transparent" : options.endings}`);
        const type = options.type === void 0 ? "" : String(options.type);
        __privateSet(this, _type, /^[\x20-\x7E]*$/.test(type) ? type : "");
      }
      get size() {
        return __privateGet(this, _size);
      }
      get type() {
        return __privateGet(this, _type);
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(__privateGet(this, _parts), false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(__privateGet(this, _parts), false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(__privateGet(this, _parts), true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = __privateGet(this, _parts);
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new _a([], { type: String(type).toLowerCase() });
        __privateSet(blob, _size, span);
        __privateSet(blob, _parts, blobParts);
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    }, _parts = new WeakMap(), _type = new WeakMap(), _size = new WeakMap(), _endings = new WeakMap(), _a);
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    var Blob = _Blob;
    var Blob$1 = Blob;
    var _lastModified, _name, _a2;
    var _File = (_a2 = class extends Blob$1 {
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        __privateAdd(this, _lastModified, 0);
        __privateAdd(this, _name, "");
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          __privateSet(this, _lastModified, lastModified);
        }
        __privateSet(this, _name, String(fileName));
      }
      get name() {
        return __privateGet(this, _name);
      }
      get lastModified() {
        return __privateGet(this, _lastModified);
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof Blob$1 && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    }, _lastModified = new WeakMap(), _name = new WeakMap(), _a2);
    var File = _File;
    var { toStringTag: t, iterator: i, hasInstance: h } = Symbol;
    var r = Math.random;
    var m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    var f = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    var e = (c, f2) => (f2 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    var x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    var _d, _a3;
    var FormData = (_a3 = class {
      constructor(...a) {
        __privateAdd(this, _d, []);
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        __privateGet(this, _d).push(f(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        __privateSet(this, _d, __privateGet(this, _d).filter(([b]) => b !== a));
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = __privateGet(this, _d), l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        __privateGet(this, _d).forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return __privateGet(this, _d).some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f(...a);
        __privateGet(this, _d).forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        __privateSet(this, _d, b);
      }
      *entries() {
        yield* __privateGet(this, _d);
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    }, _d = new WeakMap(), _a3);
    function formDataToBlob(F, B = Blob$1) {
      var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
      F.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
      c.push(`--${b}--`);
      return new B(c, { type: "multipart/form-data; boundary=" + b });
    }
    var FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    var FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    var NAME = Symbol.toStringTag;
    var isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    var isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    var isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    var isDomainOrSubdomain = (destination, original) => {
      const orig = new URL(original).hostname;
      const dest = new URL(destination).hostname;
      return orig === dest || orig.endsWith(`.${dest}`);
    };
    var pipeline = node_util.promisify(Stream__default["default"].pipeline);
    var INTERNALS$2 = Symbol("Body internals");
    var Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = node_buffer.Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (node_buffer.Buffer.isBuffer(body))
          ;
        else if (node_util.types.isAnyArrayBuffer(body)) {
          body = node_buffer.Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof Stream__default["default"])
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = node_buffer.Buffer.from(String(body));
        }
        let stream = body;
        if (node_buffer.Buffer.isBuffer(body)) {
          stream = Stream__default["default"].Readable.from(body);
        } else if (isBlob(body)) {
          stream = Stream__default["default"].Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof Stream__default["default"]) {
          body.on("error", (error_) => {
            const error = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData } = await Promise.resolve().then(function() {
          return require_multipart_parser_d6fbdf05();
        });
        return toFormData(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.arrayBuffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const text = await this.text();
        return JSON.parse(text);
      }
      async text() {
        const buffer = await consumeBody(this);
        return new TextDecoder().decode(buffer);
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = node_util.deprecate(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true },
      data: { get: node_util.deprecate(() => {
      }, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") }
    });
    async function consumeBody(data) {
      if (data[INTERNALS$2].disturbed) {
        throw new TypeError(`body used already for: ${data.url}`);
      }
      data[INTERNALS$2].disturbed = true;
      if (data[INTERNALS$2].error) {
        throw data[INTERNALS$2].error;
      }
      const { body } = data;
      if (body === null) {
        return node_buffer.Buffer.alloc(0);
      }
      if (!(body instanceof Stream__default["default"])) {
        return node_buffer.Buffer.alloc(0);
      }
      const accum = [];
      let accumBytes = 0;
      try {
        for await (const chunk of body) {
          if (data.size > 0 && accumBytes + chunk.length > data.size) {
            const error = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
            body.destroy(error);
            throw error;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        }
      } catch (error) {
        const error_ = error instanceof FetchBaseError ? error : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
        throw error_;
      }
      if (body.readableEnded === true || body._readableState.ended === true) {
        try {
          if (accum.every((c) => typeof c === "string")) {
            return node_buffer.Buffer.from(accum.join(""));
          }
          return node_buffer.Buffer.concat(accum, accumBytes);
        } catch (error) {
          throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
        }
      } else {
        throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
      }
    }
    var clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream__default["default"] && typeof body.getBoundary !== "function") {
        p1 = new Stream.PassThrough({ highWaterMark });
        p2 = new Stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    var getNonSpecFormDataBoundary = node_util.deprecate((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    var extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (node_buffer.Buffer.isBuffer(body) || node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof Stream__default["default"]) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    var getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (node_buffer.Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    var writeToStream = async (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        await pipeline(body, dest);
      }
    };
    var validateHeaderName = typeof http__default["default"].validateHeaderName === "function" ? http__default["default"].validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error;
      }
    };
    var validateHeaderValue = typeof http__default["default"].validateHeaderValue === "function" ? http__default["default"].validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error, "code", { value: "ERR_INVALID_CHAR" });
        throw error;
      }
    };
    var Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    function fromRawHeaders(headers = []) {
      return new Headers2(headers.reduce((result, value, index, array) => {
        if (index % 2 === 0) {
          result.push(array.slice(index, index + 2));
        }
        return result;
      }, []).filter(([name, value]) => {
        try {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return true;
        } catch {
          return false;
        }
      }));
    }
    var redirectStatus = new Set([301, 302, 303, 307, 308]);
    var isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    var INTERNALS$1 = Symbol("Response internals");
    var Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    var getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
    };
    function stripURLForUseAsAReferrer(url, originOnly = false) {
      if (url == null) {
        return "no-referrer";
      }
      url = new URL(url);
      if (/^(about|blob|data):$/.test(url.protocol)) {
        return "no-referrer";
      }
      url.username = "";
      url.password = "";
      url.hash = "";
      if (originOnly) {
        url.pathname = "";
        url.search = "";
      }
      return url;
    }
    var ReferrerPolicy = new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    function validateReferrerPolicy(referrerPolicy) {
      if (!ReferrerPolicy.has(referrerPolicy)) {
        throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
      }
      return referrerPolicy;
    }
    function isOriginPotentiallyTrustworthy(url) {
      if (/^(http|ws)s:$/.test(url.protocol)) {
        return true;
      }
      const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
      const hostIPVersion = node_net.isIP(hostIp);
      if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
        return true;
      }
      if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
        return true;
      }
      if (/^(.+\.)*localhost$/.test(url.host)) {
        return false;
      }
      if (url.protocol === "file:") {
        return true;
      }
      return false;
    }
    function isUrlPotentiallyTrustworthy(url) {
      if (/^about:(blank|srcdoc)$/.test(url)) {
        return true;
      }
      if (url.protocol === "data:") {
        return true;
      }
      if (/^(blob|filesystem):$/.test(url.protocol)) {
        return true;
      }
      return isOriginPotentiallyTrustworthy(url);
    }
    function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
      if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
        return null;
      }
      const policy = request.referrerPolicy;
      if (request.referrer === "about:client") {
        return "no-referrer";
      }
      const referrerSource = request.referrer;
      let referrerURL = stripURLForUseAsAReferrer(referrerSource);
      let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
      if (referrerURL.toString().length > 4096) {
        referrerURL = referrerOrigin;
      }
      if (referrerURLCallback) {
        referrerURL = referrerURLCallback(referrerURL);
      }
      if (referrerOriginCallback) {
        referrerOrigin = referrerOriginCallback(referrerOrigin);
      }
      const currentURL = new URL(request.url);
      switch (policy) {
        case "no-referrer":
          return "no-referrer";
        case "origin":
          return referrerOrigin;
        case "unsafe-url":
          return referrerURL;
        case "strict-origin":
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerOrigin.toString();
        case "strict-origin-when-cross-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerOrigin;
        case "same-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          return "no-referrer";
        case "origin-when-cross-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          return referrerOrigin;
        case "no-referrer-when-downgrade":
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerURL;
        default:
          throw new TypeError(`Invalid referrerPolicy: ${policy}`);
      }
    }
    function parseReferrerPolicyFromHeader(headers) {
      const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
      let policy = "";
      for (const token of policyTokens) {
        if (token && ReferrerPolicy.has(token)) {
          policy = token;
        }
      }
      return policy;
    }
    var INTERNALS = Symbol("Request internals");
    var isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    var doBadDataWarn = node_util.deprecate(() => {
    }, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
    var Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
        }
        let method = init2.method || input.method || "GET";
        if (/^(delete|get|head|options|post|put)$/i.test(method)) {
          method = method.toUpperCase();
        }
        if ("data" in init2) {
          doBadDataWarn();
        }
        if ((init2.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return node_url.format(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    var getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    var AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    var supportedSchemas = new Set(["data:", "http:", "https:"]);
    async function fetch2(url, options_) {
      return new Promise((resolve, reject) => {
        const request = new Request2(url, options_);
        const { parsedURL, options } = getNodeRequestOptions(request);
        if (!supportedSchemas.has(parsedURL.protocol)) {
          throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
        }
        if (parsedURL.protocol === "data:") {
          const data = dataUriToBuffer(request.url);
          const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
          resolve(response2);
          return;
        }
        const send = (parsedURL.protocol === "https:" ? https__default["default"] : http__default["default"]).request;
        const { signal } = request;
        let response = null;
        const abort = () => {
          const error = new AbortError("The operation was aborted.");
          reject(error);
          if (request.body && request.body instanceof Stream__default["default"].Readable) {
            request.body.destroy(error);
          }
          if (!response || !response.body) {
            return;
          }
          response.body.emit("error", error);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = () => {
          abort();
          finalize();
        };
        const request_ = send(parsedURL.toString(), options);
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        const finalize = () => {
          request_.abort();
          if (signal) {
            signal.removeEventListener("abort", abortAndFinalize);
          }
        };
        request_.on("error", (error) => {
          reject(new FetchError(`request to ${request.url} failed, reason: ${error.message}`, "system", error));
          finalize();
        });
        fixResponseChunkedTransferBadEnding(request_, (error) => {
          response.body.destroy(error);
        });
        if (process.version < "v14") {
          request_.on("socket", (s) => {
            let endedWithEventsCount;
            s.prependListener("end", () => {
              endedWithEventsCount = s._eventsCount;
            });
            s.prependListener("close", (hadError) => {
              if (response && endedWithEventsCount < s._eventsCount && !hadError) {
                const error = new Error("Premature close");
                error.code = "ERR_STREAM_PREMATURE_CLOSE";
                response.body.emit("error", error);
              }
            });
          });
        }
        request_.on("response", (response_) => {
          request_.setTimeout(0);
          const headers = fromRawHeaders(response_.rawHeaders);
          if (isRedirect(response_.statusCode)) {
            const location = headers.get("Location");
            let locationURL = null;
            try {
              locationURL = location === null ? null : new URL(location, request.url);
            } catch {
              if (request.redirect !== "manual") {
                reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
                finalize();
                return;
              }
            }
            switch (request.redirect) {
              case "error":
                reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                break;
              case "follow": {
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOptions = {
                  headers: new Headers2(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: clone(request),
                  signal: request.signal,
                  size: request.size,
                  referrer: request.referrer,
                  referrerPolicy: request.referrerPolicy
                };
                if (!isDomainOrSubdomain(request.url, locationURL)) {
                  for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                    requestOptions.headers.delete(name);
                  }
                }
                if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream__default["default"].Readable) {
                  reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
                  requestOptions.method = "GET";
                  requestOptions.body = void 0;
                  requestOptions.headers.delete("content-length");
                }
                const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
                if (responseReferrerPolicy) {
                  requestOptions.referrerPolicy = responseReferrerPolicy;
                }
                resolve(fetch2(new Request2(locationURL, requestOptions)));
                finalize();
                return;
              }
              default:
                return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
            }
          }
          if (signal) {
            response_.once("end", () => {
              signal.removeEventListener("abort", abortAndFinalize);
            });
          }
          let body = Stream.pipeline(response_, new Stream.PassThrough(), (error) => {
            if (error) {
              reject(error);
            }
          });
          if (process.version < "v12.10") {
            response_.on("aborted", abortAndFinalize);
          }
          const responseOptions = {
            url: request.url,
            status: response_.statusCode,
            statusText: response_.statusMessage,
            headers,
            size: request.size,
            counter: request.counter,
            highWaterMark: request.highWaterMark
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          const zlibOptions = {
            flush: zlib__default["default"].Z_SYNC_FLUSH,
            finishFlush: zlib__default["default"].Z_SYNC_FLUSH
          };
          if (codings === "gzip" || codings === "x-gzip") {
            body = Stream.pipeline(body, zlib__default["default"].createGunzip(zlibOptions), (error) => {
              if (error) {
                reject(error);
              }
            });
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          if (codings === "deflate" || codings === "x-deflate") {
            const raw = Stream.pipeline(response_, new Stream.PassThrough(), (error) => {
              if (error) {
                reject(error);
              }
            });
            raw.once("data", (chunk) => {
              if ((chunk[0] & 15) === 8) {
                body = Stream.pipeline(body, zlib__default["default"].createInflate(), (error) => {
                  if (error) {
                    reject(error);
                  }
                });
              } else {
                body = Stream.pipeline(body, zlib__default["default"].createInflateRaw(), (error) => {
                  if (error) {
                    reject(error);
                  }
                });
              }
              response = new Response2(body, responseOptions);
              resolve(response);
            });
            raw.once("end", () => {
              if (!response) {
                response = new Response2(body, responseOptions);
                resolve(response);
              }
            });
            return;
          }
          if (codings === "br") {
            body = Stream.pipeline(body, zlib__default["default"].createBrotliDecompress(), (error) => {
              if (error) {
                reject(error);
              }
            });
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          response = new Response2(body, responseOptions);
          resolve(response);
        });
        writeToStream(request_, request).catch(reject);
      });
    }
    function fixResponseChunkedTransferBadEnding(request, errorCallback) {
      const LAST_CHUNK = node_buffer.Buffer.from("0\r\n\r\n");
      let isChunkedTransfer = false;
      let properLastChunkReceived = false;
      let previousChunk;
      request.on("response", (response) => {
        const { headers } = response;
        isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
      });
      request.on("socket", (socket) => {
        const onSocketClose = () => {
          if (isChunkedTransfer && !properLastChunkReceived) {
            const error = new Error("Premature close");
            error.code = "ERR_STREAM_PREMATURE_CLOSE";
            errorCallback(error);
          }
        };
        socket.prependListener("close", onSocketClose);
        request.on("abort", () => {
          socket.removeListener("close", onSocketClose);
        });
        socket.on("data", (buf) => {
          properLastChunkReceived = node_buffer.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
          if (!properLastChunkReceived && previousChunk) {
            properLastChunkReceived = node_buffer.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && node_buffer.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
          }
          previousChunk = buf;
        });
      });
    }
    var globals = {
      crypto: crypto2.webcrypto,
      fetch: fetch2,
      Response: Response2,
      Request: Request2,
      Headers: Headers2
    };
    function installPolyfills() {
      for (const name in globals) {
        Object.defineProperty(globalThis, name, {
          enumerable: true,
          configurable: true,
          value: globals[name]
        });
      }
    }
    installPolyfills();
    exports2.File = File;
    exports2.FormData = FormData;
  }
});

// .netlify/server/chunks/index-e92a6b2a.js
var require_index_e92a6b2a = __commonJS({
  ".netlify/server/chunks/index-e92a6b2a.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      a: () => each,
      b: () => add_attribute,
      c: () => create_ssr_component,
      e: () => escape,
      m: () => missing_component,
      n: () => null_to_empty,
      s: () => setContext,
      v: () => validate_component
    });
    module2.exports = __toCommonJS(stdin_exports);
    function run(fn) {
      return fn();
    }
    function blank_object() {
      return /* @__PURE__ */ Object.create(null);
    }
    function run_all(fns) {
      fns.forEach(run);
    }
    function null_to_empty(value) {
      return value == null ? "" : value;
    }
    var current_component;
    function set_current_component(component) {
      current_component = component;
    }
    function get_current_component() {
      if (!current_component)
        throw new Error("Function called outside component initialization");
      return current_component;
    }
    function setContext(key, context) {
      get_current_component().$$.context.set(key, context);
      return context;
    }
    Promise.resolve();
    var escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    function escape(html) {
      return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
    }
    function escape_attribute_value(value) {
      return typeof value === "string" ? escape(value) : value;
    }
    function each(items, fn) {
      let str = "";
      for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
      }
      return str;
    }
    var missing_component = {
      $$render: () => ""
    };
    function validate_component(component, name) {
      if (!component || !component.$$render) {
        if (name === "svelte:component")
          name += " this={...}";
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
      }
      return component;
    }
    var on_destroy;
    function create_ssr_component(fn) {
      function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
          on_destroy,
          context: new Map(context || (parent_component ? parent_component.$$.context : [])),
          on_mount: [],
          before_update: [],
          after_update: [],
          callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
      }
      return {
        render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
          on_destroy = [];
          const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
          const html = $$render(result, props, {}, $$slots, context);
          run_all(on_destroy);
          return {
            html,
            css: {
              code: Array.from(result.css).map((css) => css.code).join("\n"),
              map: null
            },
            head: result.title + result.head
          };
        },
        $$render
      };
    }
    function add_attribute(name, value, boolean) {
      if (value == null || boolean && !value)
        return "";
      const assignment = boolean && value === true ? "" : `="${escape_attribute_value(value.toString())}"`;
      return ` ${name}${assignment}`;
    }
  }
});

// .netlify/server/chunks/hooks-1c45ba0b.js
var require_hooks_1c45ba0b = __commonJS({
  ".netlify/server/chunks/hooks-1c45ba0b.js"() {
  }
});

// .netlify/server/index.js
var require_server = __commonJS({
  ".netlify/server/index.js"(exports2, module2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key2 of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key2) && key2 !== except)
            __defProp2(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var __accessCheck2 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    var __privateGet2 = (obj, member, getter) => {
      __accessCheck2(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    var __privateAdd2 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    var __privateSet2 = (obj, member, value, setter) => {
      __accessCheck2(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    var stdin_exports = {};
    __export(stdin_exports, {
      Server: () => Server,
      override: () => override
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_e92a6b2a = require_index_e92a6b2a();
    var _use_hashes;
    var _dev;
    var _script_needs_csp;
    var _style_needs_csp;
    var _directives;
    var _script_src;
    var _style_src;
    function afterUpdate() {
    }
    var Root = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
      let { stores } = $$props;
      let { page } = $$props;
      let { components } = $$props;
      let { props_0 = null } = $$props;
      let { props_1 = null } = $$props;
      let { props_2 = null } = $$props;
      (0, import_index_e92a6b2a.s)("__svelte__", stores);
      afterUpdate(stores.page.notify);
      if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
        $$bindings.stores(stores);
      if ($$props.page === void 0 && $$bindings.page && page !== void 0)
        $$bindings.page(page);
      if ($$props.components === void 0 && $$bindings.components && components !== void 0)
        $$bindings.components(components);
      if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
        $$bindings.props_0(props_0);
      if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
        $$bindings.props_1(props_1);
      if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
        $$bindings.props_2(props_2);
      {
        stores.page.set(page);
      }
      return `


${components[1] ? `${(0, import_index_e92a6b2a.v)(components[0] || import_index_e92a6b2a.m, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
        default: () => {
          return `${components[2] ? `${(0, import_index_e92a6b2a.v)(components[1] || import_index_e92a6b2a.m, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
            default: () => {
              return `${(0, import_index_e92a6b2a.v)(components[2] || import_index_e92a6b2a.m, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
            }
          })}` : `${(0, import_index_e92a6b2a.v)(components[1] || import_index_e92a6b2a.m, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
        }
      })}` : `${(0, import_index_e92a6b2a.v)(components[0] || import_index_e92a6b2a.m, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
    });
    function to_headers(object) {
      const headers = new Headers();
      if (object) {
        for (const key2 in object) {
          const value = object[key2];
          if (!value)
            continue;
          if (Array.isArray(value)) {
            value.forEach((value2) => {
              headers.append(key2, value2);
            });
          } else {
            headers.set(key2, value);
          }
        }
      }
      return headers;
    }
    function hash(value) {
      let hash2 = 5381;
      let i = value.length;
      if (typeof value === "string") {
        while (i)
          hash2 = hash2 * 33 ^ value.charCodeAt(--i);
      } else {
        while (i)
          hash2 = hash2 * 33 ^ value[--i];
      }
      return (hash2 >>> 0).toString(36);
    }
    function lowercase_keys(obj) {
      const clone = {};
      for (const key2 in obj) {
        clone[key2.toLowerCase()] = obj[key2];
      }
      return clone;
    }
    function decode_params(params) {
      for (const key2 in params) {
        params[key2] = params[key2].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
      }
      return params;
    }
    function is_pojo(body) {
      if (typeof body !== "object")
        return false;
      if (body) {
        if (body instanceof Uint8Array)
          return false;
        if (body._readableState && typeof body.pipe === "function")
          return false;
        if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
          return false;
      }
      return true;
    }
    function normalize_request_method(event) {
      const method = event.request.method.toLowerCase();
      return method === "delete" ? "del" : method;
    }
    function error(body) {
      return new Response(body, {
        status: 500
      });
    }
    function is_string(s2) {
      return typeof s2 === "string" || s2 instanceof String;
    }
    var text_types = /* @__PURE__ */ new Set([
      "application/xml",
      "application/json",
      "application/x-www-form-urlencoded",
      "multipart/form-data"
    ]);
    function is_text(content_type) {
      if (!content_type)
        return true;
      const type = content_type.split(";")[0].toLowerCase();
      return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
    }
    async function render_endpoint(event, mod) {
      const method = normalize_request_method(event);
      let handler = mod[method];
      if (!handler && method === "head") {
        handler = mod.get;
      }
      if (!handler) {
        const allowed = [];
        for (const method2 in ["get", "post", "put", "patch"]) {
          if (mod[method2])
            allowed.push(method2.toUpperCase());
        }
        if (mod.del)
          allowed.push("DELETE");
        if (mod.get || mod.head)
          allowed.push("HEAD");
        return event.request.headers.get("x-sveltekit-load") ? new Response(void 0, {
          status: 204
        }) : new Response(`${event.request.method} method not allowed`, {
          status: 405,
          headers: {
            allow: allowed.join(", ")
          }
        });
      }
      const response = await handler(event);
      const preface = `Invalid response from route ${event.url.pathname}`;
      if (typeof response !== "object") {
        return error(`${preface}: expected an object, got ${typeof response}`);
      }
      if (response.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status = 200, body = {} } = response;
      const headers = response.headers instanceof Headers ? new Headers(response.headers) : to_headers(response.headers);
      const type = headers.get("content-type");
      if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
        return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
      }
      let normalized_body;
      if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
        headers.set("content-type", "application/json; charset=utf-8");
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
        const cache_control = headers.get("cache-control");
        if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
          headers.set("etag", `"${hash(normalized_body)}"`);
        }
      }
      return new Response(method !== "head" ? normalized_body : void 0, {
        status,
        headers
      });
    }
    var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
    var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
    var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
    var escaped = {
      "<": "\\u003C",
      ">": "\\u003E",
      "/": "\\u002F",
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\0": "\\0",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
    function devalue(value) {
      var counts = /* @__PURE__ */ new Map();
      function walk(thing) {
        if (typeof thing === "function") {
          throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
          counts.set(thing, counts.get(thing) + 1);
          return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
          var type = getType(thing);
          switch (type) {
            case "Number":
            case "String":
            case "Boolean":
            case "Date":
            case "RegExp":
              return;
            case "Array":
              thing.forEach(walk);
              break;
            case "Set":
            case "Map":
              Array.from(thing).forEach(walk);
              break;
            default:
              var proto = Object.getPrototypeOf(thing);
              if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
                throw new Error("Cannot stringify arbitrary non-POJOs");
              }
              if (Object.getOwnPropertySymbols(thing).length > 0) {
                throw new Error("Cannot stringify POJOs with symbolic keys");
              }
              Object.keys(thing).forEach(function(key2) {
                return walk(thing[key2]);
              });
          }
        }
      }
      walk(value);
      var names = /* @__PURE__ */ new Map();
      Array.from(counts).filter(function(entry) {
        return entry[1] > 1;
      }).sort(function(a, b) {
        return b[1] - a[1];
      }).forEach(function(entry, i) {
        names.set(entry[0], getName(i));
      });
      function stringify(thing) {
        if (names.has(thing)) {
          return names.get(thing);
        }
        if (isPrimitive(thing)) {
          return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
          case "Number":
          case "String":
          case "Boolean":
            return "Object(" + stringify(thing.valueOf()) + ")";
          case "RegExp":
            return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
          case "Date":
            return "new Date(" + thing.getTime() + ")";
          case "Array":
            var members = thing.map(function(v, i) {
              return i in thing ? stringify(v) : "";
            });
            var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
            return "[" + members.join(",") + tail + "]";
          case "Set":
          case "Map":
            return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
          default:
            var obj = "{" + Object.keys(thing).map(function(key2) {
              return safeKey(key2) + ":" + stringify(thing[key2]);
            }).join(",") + "}";
            var proto = Object.getPrototypeOf(thing);
            if (proto === null) {
              return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
            }
            return obj;
        }
      }
      var str = stringify(value);
      if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function(name, thing) {
          params_1.push(name);
          if (isPrimitive(thing)) {
            values_1.push(stringifyPrimitive(thing));
            return;
          }
          var type = getType(thing);
          switch (type) {
            case "Number":
            case "String":
            case "Boolean":
              values_1.push("Object(" + stringify(thing.valueOf()) + ")");
              break;
            case "RegExp":
              values_1.push(thing.toString());
              break;
            case "Date":
              values_1.push("new Date(" + thing.getTime() + ")");
              break;
            case "Array":
              values_1.push("Array(" + thing.length + ")");
              thing.forEach(function(v, i) {
                statements_1.push(name + "[" + i + "]=" + stringify(v));
              });
              break;
            case "Set":
              values_1.push("new Set");
              statements_1.push(name + "." + Array.from(thing).map(function(v) {
                return "add(" + stringify(v) + ")";
              }).join("."));
              break;
            case "Map":
              values_1.push("new Map");
              statements_1.push(name + "." + Array.from(thing).map(function(_a) {
                var k = _a[0], v = _a[1];
                return "set(" + stringify(k) + ", " + stringify(v) + ")";
              }).join("."));
              break;
            default:
              values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
              Object.keys(thing).forEach(function(key2) {
                statements_1.push("" + name + safeProp(key2) + "=" + stringify(thing[key2]));
              });
          }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
      } else {
        return str;
      }
    }
    function getName(num) {
      var name = "";
      do {
        name = chars$1[num % chars$1.length] + name;
        num = ~~(num / chars$1.length) - 1;
      } while (num >= 0);
      return reserved.test(name) ? name + "_" : name;
    }
    function isPrimitive(thing) {
      return Object(thing) !== thing;
    }
    function stringifyPrimitive(thing) {
      if (typeof thing === "string")
        return stringifyString(thing);
      if (thing === void 0)
        return "void 0";
      if (thing === 0 && 1 / thing < 0)
        return "-0";
      var str = String(thing);
      if (typeof thing === "number")
        return str.replace(/^(-)?0\./, "$1.");
      return str;
    }
    function getType(thing) {
      return Object.prototype.toString.call(thing).slice(8, -1);
    }
    function escapeUnsafeChar(c) {
      return escaped[c] || c;
    }
    function escapeUnsafeChars(str) {
      return str.replace(unsafeChars, escapeUnsafeChar);
    }
    function safeKey(key2) {
      return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escapeUnsafeChars(JSON.stringify(key2));
    }
    function safeProp(key2) {
      return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? "." + key2 : "[" + escapeUnsafeChars(JSON.stringify(key2)) + "]";
    }
    function stringifyString(str) {
      var result = '"';
      for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
          result += '\\"';
        } else if (char in escaped) {
          result += escaped[char];
        } else if (code >= 55296 && code <= 57343) {
          var next = str.charCodeAt(i + 1);
          if (code <= 56319 && (next >= 56320 && next <= 57343)) {
            result += char + str[++i];
          } else {
            result += "\\u" + code.toString(16).toUpperCase();
          }
        } else {
          result += char;
        }
      }
      result += '"';
      return result;
    }
    function noop() {
    }
    function safe_not_equal(a, b) {
      return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
    }
    Promise.resolve();
    var subscriber_queue = [];
    function readable(value, start) {
      return {
        subscribe: writable(value, start).subscribe
      };
    }
    function writable(value, start = noop) {
      let stop;
      const subscribers = /* @__PURE__ */ new Set();
      function set(new_value) {
        if (safe_not_equal(value, new_value)) {
          value = new_value;
          if (stop) {
            const run_queue = !subscriber_queue.length;
            for (const subscriber of subscribers) {
              subscriber[1]();
              subscriber_queue.push(subscriber, value);
            }
            if (run_queue) {
              for (let i = 0; i < subscriber_queue.length; i += 2) {
                subscriber_queue[i][0](subscriber_queue[i + 1]);
              }
              subscriber_queue.length = 0;
            }
          }
        }
      }
      function update(fn) {
        set(fn(value));
      }
      function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
          stop = start(set) || noop;
        }
        run(value);
        return () => {
          subscribers.delete(subscriber);
          if (subscribers.size === 0) {
            stop();
            stop = null;
          }
        };
      }
      return { set, update, subscribe };
    }
    function coalesce_to_error(err) {
      return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
    }
    var render_json_payload_script_dict = {
      "<": "\\u003C",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    var render_json_payload_script_regex = new RegExp(`[${Object.keys(render_json_payload_script_dict).join("")}]`, "g");
    function render_json_payload_script(attrs, payload) {
      const safe_payload = JSON.stringify(payload).replace(render_json_payload_script_regex, (match) => render_json_payload_script_dict[match]);
      let safe_attrs = "";
      for (const [key2, value] of Object.entries(attrs)) {
        if (value === void 0)
          continue;
        safe_attrs += ` sveltekit:data-${key2}=${escape_html_attr(value)}`;
      }
      return `<script type="application/json"${safe_attrs}>${safe_payload}<\/script>`;
    }
    var escape_html_attr_dict = {
      "&": "&amp;",
      '"': "&quot;"
    };
    var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
    function escape_html_attr(str) {
      const escaped_str = str.replace(escape_html_attr_regex, (match) => {
        var _a;
        if (match.length === 2) {
          return match;
        }
        return (_a = escape_html_attr_dict[match]) != null ? _a : `&#${match.charCodeAt(0)};`;
      });
      return `"${escaped_str}"`;
    }
    var s = JSON.stringify;
    function create_prerendering_url_proxy(url) {
      return new Proxy(url, {
        get: (target, prop, receiver) => {
          if (prop === "search" || prop === "searchParams") {
            throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
          }
          return Reflect.get(target, prop, receiver);
        }
      });
    }
    var encoder = new TextEncoder();
    function sha256(data) {
      if (!key[0])
        precompute();
      const out = init2.slice(0);
      const array2 = encode$1(data);
      for (let i = 0; i < array2.length; i += 16) {
        const w = array2.subarray(i, i + 16);
        let tmp;
        let a;
        let b;
        let out0 = out[0];
        let out1 = out[1];
        let out2 = out[2];
        let out3 = out[3];
        let out4 = out[4];
        let out5 = out[5];
        let out6 = out[6];
        let out7 = out[7];
        for (let i2 = 0; i2 < 64; i2++) {
          if (i2 < 16) {
            tmp = w[i2];
          } else {
            a = w[i2 + 1 & 15];
            b = w[i2 + 14 & 15];
            tmp = w[i2 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i2 & 15] + w[i2 + 9 & 15] | 0;
          }
          tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i2];
          out7 = out6;
          out6 = out5;
          out5 = out4;
          out4 = out3 + tmp | 0;
          out3 = out2;
          out2 = out1;
          out1 = out0;
          out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
        }
        out[0] = out[0] + out0 | 0;
        out[1] = out[1] + out1 | 0;
        out[2] = out[2] + out2 | 0;
        out[3] = out[3] + out3 | 0;
        out[4] = out[4] + out4 | 0;
        out[5] = out[5] + out5 | 0;
        out[6] = out[6] + out6 | 0;
        out[7] = out[7] + out7 | 0;
      }
      const bytes = new Uint8Array(out.buffer);
      reverse_endianness(bytes);
      return base64(bytes);
    }
    var init2 = new Uint32Array(8);
    var key = new Uint32Array(64);
    function precompute() {
      function frac(x) {
        return (x - Math.floor(x)) * 4294967296;
      }
      let prime = 2;
      for (let i = 0; i < 64; prime++) {
        let is_prime = true;
        for (let factor = 2; factor * factor <= prime; factor++) {
          if (prime % factor === 0) {
            is_prime = false;
            break;
          }
        }
        if (is_prime) {
          if (i < 8) {
            init2[i] = frac(prime ** (1 / 2));
          }
          key[i] = frac(prime ** (1 / 3));
          i++;
        }
      }
    }
    function reverse_endianness(bytes) {
      for (let i = 0; i < bytes.length; i += 4) {
        const a = bytes[i + 0];
        const b = bytes[i + 1];
        const c = bytes[i + 2];
        const d = bytes[i + 3];
        bytes[i + 0] = d;
        bytes[i + 1] = c;
        bytes[i + 2] = b;
        bytes[i + 3] = a;
      }
    }
    function encode$1(str) {
      const encoded = encoder.encode(str);
      const length = encoded.length * 8;
      const size = 512 * Math.ceil((length + 65) / 512);
      const bytes = new Uint8Array(size / 8);
      bytes.set(encoded);
      bytes[encoded.length] = 128;
      reverse_endianness(bytes);
      const words = new Uint32Array(bytes.buffer);
      words[words.length - 2] = Math.floor(length / 4294967296);
      words[words.length - 1] = length;
      return words;
    }
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    function base64(bytes) {
      const l = bytes.length;
      let result = "";
      let i;
      for (i = 2; i < l; i += 3) {
        result += chars[bytes[i - 2] >> 2];
        result += chars[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
        result += chars[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
        result += chars[bytes[i] & 63];
      }
      if (i === l + 1) {
        result += chars[bytes[i - 2] >> 2];
        result += chars[(bytes[i - 2] & 3) << 4];
        result += "==";
      }
      if (i === l) {
        result += chars[bytes[i - 2] >> 2];
        result += chars[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
        result += chars[(bytes[i - 1] & 15) << 2];
        result += "=";
      }
      return result;
    }
    var csp_ready;
    var array = new Uint8Array(16);
    function generate_nonce() {
      crypto.getRandomValues(array);
      return base64(array);
    }
    var quoted = /* @__PURE__ */ new Set([
      "self",
      "unsafe-eval",
      "unsafe-hashes",
      "unsafe-inline",
      "none",
      "strict-dynamic",
      "report-sample"
    ]);
    var crypto_pattern = /^(nonce|sha\d\d\d)-/;
    var Csp = class {
      constructor({ mode, directives }, { dev, prerender, needs_nonce }) {
        __privateAdd2(this, _use_hashes, void 0);
        __privateAdd2(this, _dev, void 0);
        __privateAdd2(this, _script_needs_csp, void 0);
        __privateAdd2(this, _style_needs_csp, void 0);
        __privateAdd2(this, _directives, void 0);
        __privateAdd2(this, _script_src, void 0);
        __privateAdd2(this, _style_src, void 0);
        __privateSet2(this, _use_hashes, mode === "hash" || mode === "auto" && prerender);
        __privateSet2(this, _directives, dev ? __spreadValues({}, directives) : directives);
        __privateSet2(this, _dev, dev);
        const d = __privateGet2(this, _directives);
        if (dev) {
          const effective_style_src2 = d["style-src"] || d["default-src"];
          if (effective_style_src2 && !effective_style_src2.includes("unsafe-inline")) {
            d["style-src"] = [...effective_style_src2, "unsafe-inline"];
          }
        }
        __privateSet2(this, _script_src, []);
        __privateSet2(this, _style_src, []);
        const effective_script_src = d["script-src"] || d["default-src"];
        const effective_style_src = d["style-src"] || d["default-src"];
        __privateSet2(this, _script_needs_csp, !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0);
        __privateSet2(this, _style_needs_csp, !dev && !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0);
        this.script_needs_nonce = __privateGet2(this, _script_needs_csp) && !__privateGet2(this, _use_hashes);
        this.style_needs_nonce = __privateGet2(this, _style_needs_csp) && !__privateGet2(this, _use_hashes);
        if (this.script_needs_nonce || this.style_needs_nonce || needs_nonce) {
          this.nonce = generate_nonce();
        }
      }
      add_script(content) {
        if (__privateGet2(this, _script_needs_csp)) {
          if (__privateGet2(this, _use_hashes)) {
            __privateGet2(this, _script_src).push(`sha256-${sha256(content)}`);
          } else if (__privateGet2(this, _script_src).length === 0) {
            __privateGet2(this, _script_src).push(`nonce-${this.nonce}`);
          }
        }
      }
      add_style(content) {
        if (__privateGet2(this, _style_needs_csp)) {
          if (__privateGet2(this, _use_hashes)) {
            __privateGet2(this, _style_src).push(`sha256-${sha256(content)}`);
          } else if (__privateGet2(this, _style_src).length === 0) {
            __privateGet2(this, _style_src).push(`nonce-${this.nonce}`);
          }
        }
      }
      get_header(is_meta = false) {
        const header = [];
        const directives = __spreadValues({}, __privateGet2(this, _directives));
        if (__privateGet2(this, _style_src).length > 0) {
          directives["style-src"] = [
            ...directives["style-src"] || directives["default-src"] || [],
            ...__privateGet2(this, _style_src)
          ];
        }
        if (__privateGet2(this, _script_src).length > 0) {
          directives["script-src"] = [
            ...directives["script-src"] || directives["default-src"] || [],
            ...__privateGet2(this, _script_src)
          ];
        }
        for (const key2 in directives) {
          if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
            continue;
          }
          const value = directives[key2];
          if (!value)
            continue;
          const directive = [key2];
          if (Array.isArray(value)) {
            value.forEach((value2) => {
              if (quoted.has(value2) || crypto_pattern.test(value2)) {
                directive.push(`'${value2}'`);
              } else {
                directive.push(value2);
              }
            });
          }
          header.push(directive.join(" "));
        }
        return header.join("; ");
      }
      get_meta() {
        const content = escape_html_attr(this.get_header(true));
        return `<meta http-equiv="content-security-policy" content=${content}>`;
      }
    };
    _use_hashes = new WeakMap();
    _dev = new WeakMap();
    _script_needs_csp = new WeakMap();
    _style_needs_csp = new WeakMap();
    _directives = new WeakMap();
    _script_src = new WeakMap();
    _style_src = new WeakMap();
    var updated = __spreadProps(__spreadValues({}, readable(false)), {
      check: () => false
    });
    async function render_response({
      branch,
      options,
      state,
      $session,
      page_config,
      status,
      error: error2 = null,
      event,
      resolve_opts,
      stuff
    }) {
      if (state.prerendering) {
        if (options.csp.mode === "nonce") {
          throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
        }
        if (options.template_contains_nonce) {
          throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
        }
      }
      const stylesheets = new Set(options.manifest._.entry.css);
      const modulepreloads = new Set(options.manifest._.entry.js);
      const styles = /* @__PURE__ */ new Map();
      const serialized_data = [];
      let shadow_props;
      let rendered;
      let is_private = false;
      let cache;
      if (error2) {
        error2.stack = options.get_stack(error2);
      }
      if (resolve_opts.ssr) {
        branch.forEach(({ node, props: props2, loaded, fetched, uses_credentials }) => {
          var _a;
          if (node.css)
            node.css.forEach((url) => stylesheets.add(url));
          if (node.js)
            node.js.forEach((url) => modulepreloads.add(url));
          if (node.styles)
            Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
          if (fetched && page_config.hydrate)
            serialized_data.push(...fetched);
          if (props2)
            shadow_props = props2;
          cache = loaded == null ? void 0 : loaded.cache;
          is_private = (_a = cache == null ? void 0 : cache.private) != null ? _a : uses_credentials;
        });
        const session = writable($session);
        const props = {
          stores: {
            page: writable(null),
            navigating: writable(null),
            session: __spreadProps(__spreadValues({}, session), {
              subscribe: (fn) => {
                var _a;
                is_private = (_a = cache == null ? void 0 : cache.private) != null ? _a : true;
                return session.subscribe(fn);
              }
            }),
            updated
          },
          page: {
            error: error2,
            params: event.params,
            routeId: event.routeId,
            status,
            stuff,
            url: state.prerendering ? create_prerendering_url_proxy(event.url) : event.url
          },
          components: branch.map(({ node }) => node.module.default)
        };
        const print_error = (property, replacement) => {
          Object.defineProperty(props.page, property, {
            get: () => {
              throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
            }
          });
        };
        print_error("origin", "origin");
        print_error("path", "pathname");
        print_error("query", "searchParams");
        for (let i = 0; i < branch.length; i += 1) {
          props[`props_${i}`] = await branch[i].loaded.props;
        }
        rendered = options.root.render(props);
      } else {
        rendered = { head: "", html: "", css: { code: "", map: null } };
      }
      let { head, html: body } = rendered;
      const inlined_style = Array.from(styles.values()).join("\n");
      await csp_ready;
      const csp = new Csp(options.csp, {
        dev: options.dev,
        prerender: !!state.prerendering,
        needs_nonce: options.template_contains_nonce
      });
      const target = hash(body);
      const init_app = `
		import { start } from ${s(options.prefix + options.manifest._.entry.file)};
		start({
			target: document.querySelector('[data-sveltekit-hydrate="${target}"]').parentNode,
			paths: ${s(options.paths)},
			session: ${try_serialize($session, (error3) => {
        throw new Error(`Failed to serialize session data: ${error3.message}`);
      })},
			route: ${!!page_config.router},
			spa: ${!resolve_opts.ssr},
			trailing_slash: ${s(options.trailing_slash)},
			hydrate: ${resolve_opts.ssr && page_config.hydrate ? `{
				status: ${status},
				error: ${serialize_error(error2)},
				nodes: [${branch.map(({ node }) => node.index).join(", ")}],
				params: ${devalue(event.params)},
				routeId: ${s(event.routeId)}
			}` : "null"}
		});
	`;
      const init_service_worker = `
		if ('serviceWorker' in navigator) {
			addEventListener('load', () => {
				navigator.serviceWorker.register('${options.service_worker}');
			});
		}
	`;
      if (inlined_style) {
        const attributes = [];
        if (options.dev)
          attributes.push(" data-sveltekit");
        if (csp.style_needs_nonce)
          attributes.push(` nonce="${csp.nonce}"`);
        csp.add_style(inlined_style);
        head += `
	<style${attributes.join("")}>${inlined_style}</style>`;
      }
      head += Array.from(stylesheets).map((dep) => {
        const attributes = [
          'rel="stylesheet"',
          `href="${options.prefix + dep}"`
        ];
        if (csp.style_needs_nonce) {
          attributes.push(`nonce="${csp.nonce}"`);
        }
        if (styles.has(dep)) {
          attributes.push("disabled", 'media="(max-width: 0)"');
        }
        return `
	<link ${attributes.join(" ")}>`;
      }).join("");
      if (page_config.router || page_config.hydrate) {
        head += Array.from(modulepreloads).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
        const attributes = ['type="module"', `data-sveltekit-hydrate="${target}"`];
        csp.add_script(init_app);
        if (csp.script_needs_nonce) {
          attributes.push(`nonce="${csp.nonce}"`);
        }
        body += `
		<script ${attributes.join(" ")}>${init_app}<\/script>`;
        body += serialized_data.map(({ url, body: body2, response }) => render_json_payload_script({ type: "data", url, body: typeof body2 === "string" ? hash(body2) : void 0 }, response)).join("\n	");
        if (shadow_props) {
          body += render_json_payload_script({ type: "props" }, shadow_props);
        }
      }
      if (options.service_worker) {
        csp.add_script(init_service_worker);
        head += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_service_worker}<\/script>`;
      }
      if (state.prerendering) {
        const http_equiv = [];
        const csp_headers = csp.get_meta();
        if (csp_headers) {
          http_equiv.push(csp_headers);
        }
        if (cache) {
          http_equiv.push(`<meta http-equiv="cache-control" content="max-age=${cache.maxage}">`);
        }
        if (http_equiv.length > 0) {
          head = http_equiv.join("\n") + head;
        }
      }
      const segments = event.url.pathname.slice(options.paths.base.length).split("/").slice(2);
      const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
      const html = await resolve_opts.transformPage({
        html: options.template({ head, body, assets: assets2, nonce: csp.nonce })
      });
      const headers = new Headers({
        "content-type": "text/html",
        etag: `"${hash(html)}"`
      });
      if (cache) {
        headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${cache.maxage}`);
      }
      if (!options.floc) {
        headers.set("permissions-policy", "interest-cohort=()");
      }
      if (!state.prerendering) {
        const csp_header = csp.get_header();
        if (csp_header) {
          headers.set("content-security-policy", csp_header);
        }
      }
      return new Response(html, {
        status,
        headers
      });
    }
    function try_serialize(data, fail) {
      try {
        return devalue(data);
      } catch (err) {
        if (fail)
          fail(coalesce_to_error(err));
        return null;
      }
    }
    function serialize_error(error2) {
      if (!error2)
        return null;
      let serialized = try_serialize(error2);
      if (!serialized) {
        const { name, message, stack } = error2;
        serialized = try_serialize(__spreadProps(__spreadValues({}, error2), { name, message, stack }));
      }
      if (!serialized) {
        serialized = "{}";
      }
      return serialized;
    }
    var parse_1 = parse$1;
    var serialize_1 = serialize;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse$1(str, options) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options || {};
      var dec = opt.decode || decode;
      var index = 0;
      while (index < str.length) {
        var eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key2 = str.slice(index, eqIdx).trim();
        if (obj[key2] === void 0) {
          var val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key2] = tryDecode(val, dec);
        }
        index = endIdx + 1;
      }
      return obj;
    }
    function serialize(name, val, options) {
      var opt = options || {};
      var enc = opt.encode || encode;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (opt.maxAge != null) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function encode(val) {
      return encodeURIComponent(val);
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
    var setCookie = { exports: {} };
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str) {
      return typeof str === "string" && !!str.trim();
    }
    function parseString(setCookieValue, options) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValue = parts.shift().split("=");
      var name = nameValue.shift();
      var value = nameValue.join("=");
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      try {
        value = options.decodeValues ? decodeURIComponent(value) : value;
      } catch (e) {
        console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e);
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key2 = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key2 === "expires") {
          cookie.expires = new Date(value2);
        } else if (key2 === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key2 === "secure") {
          cookie.secure = true;
        } else if (key2 === "httponly") {
          cookie.httpOnly = true;
        } else if (key2 === "samesite") {
          cookie.sameSite = value2;
        } else {
          cookie[key2] = value2;
        }
      });
      return cookie;
    }
    function parse(input, options) {
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!input) {
        if (!options.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers && input.headers["set-cookie"]) {
        input = input.headers["set-cookie"];
      } else if (input.headers) {
        var sch = input.headers[Object.keys(input.headers).find(function(key2) {
          return key2.toLowerCase() === "set-cookie";
        })];
        if (!sch && input.headers.cookie && !options.silent) {
          console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
        }
        input = sch;
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!options.map) {
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString(str, options);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString(str, options);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    function splitCookiesString(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    setCookie.exports = parse;
    setCookie.exports.parse = parse;
    var parseString_1 = setCookie.exports.parseString = parseString;
    var splitCookiesString_1 = setCookie.exports.splitCookiesString = splitCookiesString;
    function normalize(loaded) {
      if (loaded.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      if ("maxage" in loaded) {
        throw new Error("maxage should be replaced with cache: { maxage }");
      }
      const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
      if (loaded.error || has_error_status) {
        const status = loaded.status;
        if (!loaded.error && has_error_status) {
          return { status: status || 500, error: new Error() };
        }
        const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
        if (!(error2 instanceof Error)) {
          return {
            status: 500,
            error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
          };
        }
        if (!status || status < 400 || status > 599) {
          console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
          return { status: 500, error: error2 };
        }
        return { status, error: error2 };
      }
      if (loaded.redirect) {
        if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
          throw new Error('"redirect" property returned from load() must be accompanied by a 3xx status code');
        }
        if (typeof loaded.redirect !== "string") {
          throw new Error('"redirect" property returned from load() must be a string');
        }
      }
      if (loaded.dependencies) {
        if (!Array.isArray(loaded.dependencies) || loaded.dependencies.some((dep) => typeof dep !== "string")) {
          throw new Error('"dependencies" property returned from load() must be of type string[]');
        }
      }
      if (loaded.context) {
        throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
      }
      return loaded;
    }
    var absolute = /^([a-z]+:)?\/?\//;
    var scheme = /^[a-z]+:/;
    function resolve(base2, path) {
      if (scheme.test(path))
        return path;
      const base_match = absolute.exec(base2);
      const path_match = absolute.exec(path);
      if (!base_match) {
        throw new Error(`bad base path: "${base2}"`);
      }
      const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
      const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
      baseparts.pop();
      for (let i = 0; i < pathparts.length; i += 1) {
        const part = pathparts[i];
        if (part === ".")
          continue;
        else if (part === "..")
          baseparts.pop();
        else
          baseparts.push(part);
      }
      const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
      return `${prefix}${baseparts.join("/")}`;
    }
    function is_root_relative(path) {
      return path[0] === "/" && path[1] !== "/";
    }
    function normalize_path(path, trailing_slash) {
      if (path === "/" || trailing_slash === "ignore")
        return path;
      if (trailing_slash === "never") {
        return path.endsWith("/") ? path.slice(0, -1) : path;
      } else if (trailing_slash === "always" && !path.endsWith("/")) {
        return path + "/";
      }
      return path;
    }
    var LoadURL = class extends URL {
      get hash() {
        throw new Error("url.hash is inaccessible from load. Consider accessing hash from the page store within the script tag of your component.");
      }
    };
    function domain_matches(hostname, constraint) {
      if (!constraint)
        return true;
      const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
      if (hostname === normalized)
        return true;
      return hostname.endsWith("." + normalized);
    }
    function path_matches(path, constraint) {
      if (!constraint)
        return true;
      const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
      if (path === normalized)
        return true;
      return path.startsWith(normalized + "/");
    }
    async function load_node({
      event,
      options,
      state,
      route,
      node,
      $session,
      stuff,
      is_error,
      is_leaf,
      status,
      error: error2
    }) {
      var _a;
      const { module: module22 } = node;
      let uses_credentials = false;
      const fetched = [];
      const cookies = parse_1(event.request.headers.get("cookie") || "");
      const new_cookies = [];
      let loaded;
      const should_prerender = (_a = node.module.prerender) != null ? _a : options.prerender.default;
      const shadow = is_leaf ? await load_shadow_data(route, event, options, should_prerender) : {};
      if (shadow.cookies) {
        shadow.cookies.forEach((header) => {
          new_cookies.push(parseString_1(header));
        });
      }
      if (shadow.error) {
        loaded = {
          status: shadow.status,
          error: shadow.error
        };
      } else if (shadow.redirect) {
        loaded = {
          status: shadow.status,
          redirect: shadow.redirect
        };
      } else if (module22.load) {
        const load_input = {
          url: state.prerendering ? create_prerendering_url_proxy(event.url) : new LoadURL(event.url),
          params: event.params,
          props: shadow.body || {},
          routeId: event.routeId,
          get session() {
            var _a2;
            if ((_a2 = node.module.prerender) != null ? _a2 : options.prerender.default) {
              throw Error("Attempted to access session from a prerendered page. Session would never be populated.");
            }
            uses_credentials = true;
            return $session;
          },
          fetch: async (resource, opts = {}) => {
            let requested;
            if (typeof resource === "string") {
              requested = resource;
            } else {
              requested = resource.url;
              opts = __spreadValues({
                method: resource.method,
                headers: resource.headers,
                body: resource.body,
                mode: resource.mode,
                credentials: resource.credentials,
                cache: resource.cache,
                redirect: resource.redirect,
                referrer: resource.referrer,
                integrity: resource.integrity
              }, opts);
            }
            opts.headers = new Headers(opts.headers);
            for (const [key2, value] of event.request.headers) {
              if (key2 !== "authorization" && key2 !== "cookie" && key2 !== "host" && key2 !== "if-none-match" && !opts.headers.has(key2)) {
                opts.headers.set(key2, value);
              }
            }
            const resolved = resolve(event.url.pathname, requested.split("?")[0]);
            let response;
            let dependency;
            const prefix = options.paths.assets || options.paths.base;
            const filename = decodeURIComponent(resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
            const filename_html = `${filename}/index.html`;
            const is_asset = options.manifest.assets.has(filename);
            const is_asset_html = options.manifest.assets.has(filename_html);
            if (is_asset || is_asset_html) {
              const file = is_asset ? filename : filename_html;
              if (options.read) {
                const type = is_asset ? options.manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
                response = new Response(options.read(file), {
                  headers: type ? { "content-type": type } : {}
                });
              } else {
                response = await fetch(`${event.url.origin}/${file}`, opts);
              }
            } else if (is_root_relative(resolved)) {
              if (opts.credentials !== "omit") {
                uses_credentials = true;
                const authorization = event.request.headers.get("authorization");
                const combined_cookies = __spreadValues({}, cookies);
                for (const cookie2 of new_cookies) {
                  if (!domain_matches(event.url.hostname, cookie2.domain))
                    continue;
                  if (!path_matches(resolved, cookie2.path))
                    continue;
                  combined_cookies[cookie2.name] = cookie2.value;
                }
                const cookie = Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
                if (cookie) {
                  opts.headers.set("cookie", cookie);
                }
                if (authorization && !opts.headers.has("authorization")) {
                  opts.headers.set("authorization", authorization);
                }
              }
              if (opts.body && typeof opts.body !== "string") {
                throw new Error("Request body must be a string");
              }
              response = await respond(new Request(new URL(requested, event.url).href, __spreadValues({}, opts)), options, __spreadProps(__spreadValues({}, state), {
                initiator: route
              }));
              if (state.prerendering) {
                dependency = { response, body: null };
                state.prerendering.dependencies.set(resolved, dependency);
              }
            } else {
              if (resolved.startsWith("//")) {
                requested = event.url.protocol + requested;
              }
              if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
                uses_credentials = true;
                const cookie = event.request.headers.get("cookie");
                if (cookie)
                  opts.headers.set("cookie", cookie);
              }
              const external_request = new Request(requested, opts);
              response = await options.hooks.externalFetch.call(null, external_request);
            }
            const set_cookie = response.headers.get("set-cookie");
            if (set_cookie) {
              new_cookies.push(...splitCookiesString_1(set_cookie).map((str) => parseString_1(str)));
            }
            const proxy = new Proxy(response, {
              get(response2, key2, _receiver) {
                async function text() {
                  const body = await response2.text();
                  const headers = {};
                  for (const [key3, value] of response2.headers) {
                    if (key3 !== "set-cookie" && key3 !== "etag") {
                      headers[key3] = value;
                    }
                  }
                  if (!opts.body || typeof opts.body === "string") {
                    const status_number = Number(response2.status);
                    if (isNaN(status_number)) {
                      throw new Error(`response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`);
                    }
                    fetched.push({
                      url: requested,
                      body: opts.body,
                      response: {
                        status: status_number,
                        statusText: response2.statusText,
                        headers,
                        body
                      }
                    });
                  }
                  if (dependency) {
                    dependency.body = body;
                  }
                  return body;
                }
                if (key2 === "arrayBuffer") {
                  return async () => {
                    const buffer = await response2.arrayBuffer();
                    if (dependency) {
                      dependency.body = new Uint8Array(buffer);
                    }
                    return buffer;
                  };
                }
                if (key2 === "text") {
                  return text;
                }
                if (key2 === "json") {
                  return async () => {
                    return JSON.parse(await text());
                  };
                }
                return Reflect.get(response2, key2, response2);
              }
            });
            return proxy;
          },
          stuff: __spreadValues({}, stuff),
          status: is_error ? status != null ? status : null : null,
          error: is_error ? error2 != null ? error2 : null : null
        };
        if (options.dev) {
          Object.defineProperty(load_input, "page", {
            get: () => {
              throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
            }
          });
        }
        loaded = await module22.load.call(null, load_input);
        if (!loaded) {
          throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
        }
      } else if (shadow.body) {
        loaded = {
          props: shadow.body
        };
      } else {
        loaded = {};
      }
      if (shadow.body && state.prerendering) {
        const pathname = `${event.url.pathname.replace(/\/$/, "")}/__data.json`;
        const dependency = {
          response: new Response(void 0),
          body: JSON.stringify(shadow.body)
        };
        state.prerendering.dependencies.set(pathname, dependency);
      }
      return {
        node,
        props: shadow.body,
        loaded: normalize(loaded),
        stuff: loaded.stuff || stuff,
        fetched,
        set_cookie_headers: new_cookies.map((new_cookie) => {
          const _a2 = new_cookie, { name, value } = _a2, options2 = __objRest(_a2, ["name", "value"]);
          return serialize_1(name, value, options2);
        }),
        uses_credentials
      };
    }
    async function load_shadow_data(route, event, options, prerender) {
      if (!route.shadow)
        return {};
      try {
        const mod = await route.shadow();
        if (prerender && (mod.post || mod.put || mod.del || mod.patch)) {
          throw new Error("Cannot prerender pages that have endpoints with mutative methods");
        }
        const method = normalize_request_method(event);
        const is_get = method === "head" || method === "get";
        const handler = method === "head" ? mod.head || mod.get : mod[method];
        if (!handler && !is_get) {
          return {
            status: 405,
            error: new Error(`${method} method not allowed`)
          };
        }
        const data = {
          status: 200,
          cookies: [],
          body: {}
        };
        if (!is_get) {
          const result = await handler(event);
          if (result.fallthrough) {
            throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
          }
          const { status, headers, body } = validate_shadow_output(result);
          data.status = status;
          add_cookies(data.cookies, headers);
          if (status >= 300 && status < 400) {
            data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
            return data;
          }
          data.body = body;
        }
        const get = method === "head" && mod.head || mod.get;
        if (get) {
          const result = await get(event);
          if (result.fallthrough) {
            throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
          }
          const { status, headers, body } = validate_shadow_output(result);
          add_cookies(data.cookies, headers);
          data.status = status;
          if (status >= 400) {
            data.error = new Error("Failed to load data");
            return data;
          }
          if (status >= 300) {
            data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
            return data;
          }
          data.body = __spreadValues(__spreadValues({}, body), data.body);
        }
        return data;
      } catch (e) {
        const error2 = coalesce_to_error(e);
        options.handle_error(error2, event);
        return {
          status: 500,
          error: error2
        };
      }
    }
    function add_cookies(target, headers) {
      const cookies = headers["set-cookie"];
      if (cookies) {
        if (Array.isArray(cookies)) {
          target.push(...cookies);
        } else {
          target.push(cookies);
        }
      }
    }
    function validate_shadow_output(result) {
      const { status = 200, body = {} } = result;
      let headers = result.headers || {};
      if (headers instanceof Headers) {
        if (headers.has("set-cookie")) {
          throw new Error("Endpoint request handler cannot use Headers interface with Set-Cookie headers");
        }
      } else {
        headers = lowercase_keys(headers);
      }
      if (!is_pojo(body)) {
        throw new Error("Body returned from endpoint request handler must be a plain object");
      }
      return { status, headers, body };
    }
    async function respond_with_error({
      event,
      options,
      state,
      $session,
      status,
      error: error2,
      resolve_opts
    }) {
      try {
        const branch = [];
        let stuff = {};
        if (resolve_opts.ssr) {
          const default_layout = await options.manifest._.nodes[0]();
          const default_error = await options.manifest._.nodes[1]();
          const layout_loaded = await load_node({
            event,
            options,
            state,
            route: null,
            node: default_layout,
            $session,
            stuff: {},
            is_error: false,
            is_leaf: false
          });
          const error_loaded = await load_node({
            event,
            options,
            state,
            route: null,
            node: default_error,
            $session,
            stuff: layout_loaded ? layout_loaded.stuff : {},
            is_error: true,
            is_leaf: false,
            status,
            error: error2
          });
          branch.push(layout_loaded, error_loaded);
          stuff = error_loaded.stuff;
        }
        return await render_response({
          options,
          state,
          $session,
          page_config: {
            hydrate: options.hydrate,
            router: options.router
          },
          stuff,
          status,
          error: error2,
          branch,
          event,
          resolve_opts
        });
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return new Response(error3.stack, {
          status: 500
        });
      }
    }
    async function respond$1(opts) {
      var _a;
      const { event, options, state, $session, route, resolve_opts } = opts;
      let nodes;
      if (!resolve_opts.ssr) {
        return await render_response(__spreadProps(__spreadValues({}, opts), {
          branch: [],
          page_config: {
            hydrate: true,
            router: true
          },
          status: 200,
          error: null,
          event,
          stuff: {}
        }));
      }
      try {
        nodes = await Promise.all(route.a.map((n) => n == void 0 ? n : options.manifest._.nodes[n]()));
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return await respond_with_error({
          event,
          options,
          state,
          $session,
          status: 500,
          error: error3,
          resolve_opts
        });
      }
      const leaf = nodes[nodes.length - 1].module;
      let page_config = get_page_config(leaf, options);
      if (state.prerendering) {
        const should_prerender = (_a = leaf.prerender) != null ? _a : options.prerender.default;
        if (!should_prerender) {
          return new Response(void 0, {
            status: 204
          });
        }
      }
      let branch = [];
      let status = 200;
      let error2 = null;
      let set_cookie_headers = [];
      let stuff = {};
      ssr: {
        for (let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i];
          let loaded;
          if (node) {
            try {
              loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                node,
                stuff,
                is_error: false,
                is_leaf: i === nodes.length - 1
              }));
              set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
              if (loaded.loaded.redirect) {
                return with_cookies(new Response(void 0, {
                  status: loaded.loaded.status,
                  headers: {
                    location: loaded.loaded.redirect
                  }
                }), set_cookie_headers);
              }
              if (loaded.loaded.error) {
                ({ status, error: error2 } = loaded.loaded);
              }
            } catch (err) {
              const e = coalesce_to_error(err);
              options.handle_error(e, event);
              status = 500;
              error2 = e;
            }
            if (loaded && !error2) {
              branch.push(loaded);
            }
            if (error2) {
              while (i--) {
                if (route.b[i]) {
                  const index = route.b[i];
                  const error_node = await options.manifest._.nodes[index]();
                  let node_loaded;
                  let j = i;
                  while (!(node_loaded = branch[j])) {
                    j -= 1;
                  }
                  try {
                    const error_loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                      node: error_node,
                      stuff: node_loaded.stuff,
                      is_error: true,
                      is_leaf: false,
                      status,
                      error: error2
                    }));
                    if (error_loaded.loaded.error) {
                      continue;
                    }
                    page_config = get_page_config(error_node.module, options);
                    branch = branch.slice(0, j + 1).concat(error_loaded);
                    stuff = __spreadValues(__spreadValues({}, node_loaded.stuff), error_loaded.stuff);
                    break ssr;
                  } catch (err) {
                    const e = coalesce_to_error(err);
                    options.handle_error(e, event);
                    continue;
                  }
                }
              }
              return with_cookies(await respond_with_error({
                event,
                options,
                state,
                $session,
                status,
                error: error2,
                resolve_opts
              }), set_cookie_headers);
            }
          }
          if (loaded && loaded.loaded.stuff) {
            stuff = __spreadValues(__spreadValues({}, stuff), loaded.loaded.stuff);
          }
        }
      }
      try {
        return with_cookies(await render_response(__spreadProps(__spreadValues({}, opts), {
          stuff,
          event,
          page_config,
          status,
          error: error2,
          branch: branch.filter(Boolean)
        })), set_cookie_headers);
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return with_cookies(await respond_with_error(__spreadProps(__spreadValues({}, opts), {
          status: 500,
          error: error3
        })), set_cookie_headers);
      }
    }
    function get_page_config(leaf, options) {
      if ("ssr" in leaf) {
        throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");
      }
      return {
        router: "router" in leaf ? !!leaf.router : options.router,
        hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
      };
    }
    function with_cookies(response, set_cookie_headers) {
      if (set_cookie_headers.length) {
        set_cookie_headers.forEach((value) => {
          response.headers.append("set-cookie", value);
        });
      }
      return response;
    }
    async function render_page(event, route, options, state, resolve_opts) {
      if (state.initiator === route) {
        return new Response(`Not found: ${event.url.pathname}`, {
          status: 404
        });
      }
      if (route.shadow) {
        const type = negotiate(event.request.headers.get("accept") || "text/html", [
          "text/html",
          "application/json"
        ]);
        if (type === "application/json") {
          return render_endpoint(event, await route.shadow());
        }
      }
      const $session = await options.hooks.getSession(event);
      return respond$1({
        event,
        options,
        state,
        $session,
        resolve_opts,
        route
      });
    }
    function negotiate(accept, types) {
      const parts = accept.split(",").map((str, i) => {
        const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
        if (match) {
          const [, type, subtype, q = "1"] = match;
          return { type, subtype, q: +q, i };
        }
        throw new Error(`Invalid Accept header: ${accept}`);
      }).sort((a, b) => {
        if (a.q !== b.q) {
          return b.q - a.q;
        }
        if (a.subtype === "*" !== (b.subtype === "*")) {
          return a.subtype === "*" ? 1 : -1;
        }
        if (a.type === "*" !== (b.type === "*")) {
          return a.type === "*" ? 1 : -1;
        }
        return a.i - b.i;
      });
      let accepted;
      let min_priority = Infinity;
      for (const mimetype of types) {
        const [type, subtype] = mimetype.split("/");
        const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
        if (priority !== -1 && priority < min_priority) {
          accepted = mimetype;
          min_priority = priority;
        }
      }
      return accepted;
    }
    function exec(match, names, types, matchers) {
      const params = {};
      for (let i = 0; i < names.length; i += 1) {
        const name = names[i];
        const type = types[i];
        const value = match[i + 1] || "";
        if (type) {
          const matcher = matchers[type];
          if (!matcher)
            throw new Error(`Missing "${type}" param matcher`);
          if (!matcher(value))
            return;
        }
        params[name] = value;
      }
      return params;
    }
    var DATA_SUFFIX = "/__data.json";
    var default_transform = ({ html }) => html;
    async function respond(request, options, state) {
      var _a, _b, _c, _d;
      let url = new URL(request.url);
      const { parameter, allowed } = options.method_override;
      const method_override = (_a = url.searchParams.get(parameter)) == null ? void 0 : _a.toUpperCase();
      if (method_override) {
        if (request.method === "POST") {
          if (allowed.includes(method_override)) {
            request = new Proxy(request, {
              get: (target, property, _receiver) => {
                if (property === "method")
                  return method_override;
                return Reflect.get(target, property, target);
              }
            });
          } else {
            const verb = allowed.length === 0 ? "enabled" : "allowed";
            const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs/configuration#methodoverride`;
            return new Response(body, {
              status: 400
            });
          }
        } else {
          throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
        }
      }
      let decoded = decodeURI(url.pathname);
      let route = null;
      let params = {};
      if (options.paths.base && !((_b = state.prerendering) == null ? void 0 : _b.fallback)) {
        if (!decoded.startsWith(options.paths.base)) {
          return new Response(void 0, { status: 404 });
        }
        decoded = decoded.slice(options.paths.base.length) || "/";
      }
      const is_data_request = decoded.endsWith(DATA_SUFFIX);
      if (is_data_request) {
        const data_suffix_length = DATA_SUFFIX.length - (options.trailing_slash === "always" ? 1 : 0);
        decoded = decoded.slice(0, -data_suffix_length) || "/";
        url = new URL(url.origin + url.pathname.slice(0, -data_suffix_length) + url.search);
      }
      if (!((_c = state.prerendering) == null ? void 0 : _c.fallback)) {
        const matchers = await options.manifest._.matchers();
        for (const candidate of options.manifest._.routes) {
          const match = candidate.pattern.exec(decoded);
          if (!match)
            continue;
          const matched = exec(match, candidate.names, candidate.types, matchers);
          if (matched) {
            route = candidate;
            params = decode_params(matched);
            break;
          }
        }
      }
      if (route) {
        if (route.type === "page") {
          const normalized = normalize_path(url.pathname, options.trailing_slash);
          if (normalized !== url.pathname && !((_d = state.prerendering) == null ? void 0 : _d.fallback)) {
            return new Response(void 0, {
              status: 301,
              headers: {
                "x-sveltekit-normalize": "1",
                location: (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
              }
            });
          }
        } else if (is_data_request) {
          return new Response(void 0, {
            status: 404
          });
        }
      }
      const event = {
        get clientAddress() {
          if (!state.getClientAddress) {
            throw new Error(`${"@sveltejs/adapter-netlify"} does not specify getClientAddress. Please raise an issue`);
          }
          Object.defineProperty(event, "clientAddress", {
            value: state.getClientAddress()
          });
          return event.clientAddress;
        },
        locals: {},
        params,
        platform: state.platform,
        request,
        routeId: route && route.id,
        url
      };
      const removed = (property, replacement, suffix = "") => ({
        get: () => {
          throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
        }
      });
      const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
      const body_getter = {
        get: () => {
          throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
        }
      };
      Object.defineProperties(event, {
        method: removed("method", "request.method", details),
        headers: removed("headers", "request.headers", details),
        origin: removed("origin", "url.origin"),
        path: removed("path", "url.pathname"),
        query: removed("query", "url.searchParams"),
        body: body_getter,
        rawBody: body_getter
      });
      let resolve_opts = {
        ssr: true,
        transformPage: default_transform
      };
      try {
        const response = await options.hooks.handle({
          event,
          resolve: async (event2, opts) => {
            var _a2;
            if (opts) {
              resolve_opts = {
                ssr: opts.ssr !== false,
                transformPage: opts.transformPage || default_transform
              };
            }
            if ((_a2 = state.prerendering) == null ? void 0 : _a2.fallback) {
              return await render_response({
                event: event2,
                options,
                state,
                $session: await options.hooks.getSession(event2),
                page_config: { router: true, hydrate: true },
                stuff: {},
                status: 200,
                error: null,
                branch: [],
                resolve_opts: __spreadProps(__spreadValues({}, resolve_opts), {
                  ssr: false
                })
              });
            }
            if (route) {
              let response2;
              if (is_data_request && route.type === "page" && route.shadow) {
                response2 = await render_endpoint(event2, await route.shadow());
                if (request.headers.has("x-sveltekit-load")) {
                  if (response2.status >= 300 && response2.status < 400) {
                    const location = response2.headers.get("location");
                    if (location) {
                      const headers = new Headers(response2.headers);
                      headers.set("x-sveltekit-location", location);
                      response2 = new Response(void 0, {
                        status: 204,
                        headers
                      });
                    }
                  }
                }
              } else {
                response2 = route.type === "endpoint" ? await render_endpoint(event2, await route.load()) : await render_page(event2, route, options, state, resolve_opts);
              }
              if (response2) {
                if (response2.status === 200 && response2.headers.has("etag")) {
                  let if_none_match_value = request.headers.get("if-none-match");
                  if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith('W/"')) {
                    if_none_match_value = if_none_match_value.substring(2);
                  }
                  const etag = response2.headers.get("etag");
                  if (if_none_match_value === etag) {
                    const headers = new Headers({ etag });
                    for (const key2 of [
                      "cache-control",
                      "content-location",
                      "date",
                      "expires",
                      "vary"
                    ]) {
                      const value = response2.headers.get(key2);
                      if (value)
                        headers.set(key2, value);
                    }
                    return new Response(void 0, {
                      status: 304,
                      headers
                    });
                  }
                }
                return response2;
              }
            }
            if (!state.initiator) {
              const $session = await options.hooks.getSession(event2);
              return await respond_with_error({
                event: event2,
                options,
                state,
                $session,
                status: 404,
                error: new Error(`Not found: ${event2.url.pathname}`),
                resolve_opts
              });
            }
            if (state.prerendering) {
              return new Response("not found", { status: 404 });
            }
            return await fetch(request);
          },
          get request() {
            throw new Error("request in handle has been replaced with event" + details);
          }
        });
        if (response && !(response instanceof Response)) {
          throw new Error("handle must return a Response object" + details);
        }
        return response;
      } catch (e) {
        const error2 = coalesce_to_error(e);
        options.handle_error(error2, event);
        try {
          const $session = await options.hooks.getSession(event);
          return await respond_with_error({
            event,
            options,
            state,
            $session,
            status: 500,
            error: error2,
            resolve_opts
          });
        } catch (e2) {
          const error3 = coalesce_to_error(e2);
          return new Response(options.dev ? error3.stack : error3.message, {
            status: 500
          });
        }
      }
    }
    var base = "";
    var assets = "";
    function set_paths(paths) {
      base = paths.base;
      assets = paths.assets || base;
    }
    function set_prerendering(value) {
    }
    var template = ({ head, body, assets: assets2, nonce }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="' + assets2 + '/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + "\n	</head>\n	<body>\n		<div>" + body + "</div>\n	</body>\n</html>\n";
    var read = null;
    set_paths({ "base": "", "assets": "" });
    var default_protocol = "https";
    function override(settings) {
      default_protocol = settings.protocol || default_protocol;
      set_paths(settings.paths);
      set_prerendering(settings.prerendering);
      read = settings.read;
    }
    var Server = class {
      constructor(manifest) {
        this.options = {
          csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
          dev: false,
          floc: false,
          get_stack: (error2) => String(error2),
          handle_error: (error2, event) => {
            this.options.hooks.handleError({
              error: error2,
              event,
              get request() {
                throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
              }
            });
            error2.stack = this.options.get_stack(error2);
          },
          hooks: null,
          hydrate: true,
          manifest,
          method_override: { "parameter": "_method", "allowed": [] },
          paths: { base, assets },
          prefix: assets + "/_app/immutable/",
          prerender: {
            default: false,
            enabled: true
          },
          read,
          root: Root,
          service_worker: null,
          router: true,
          template,
          template_contains_nonce: false,
          trailing_slash: "never"
        };
      }
      async respond(request, options = {}) {
        if (!(request instanceof Request)) {
          throw new Error("The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
        }
        if (!this.options.hooks) {
          const module22 = await Promise.resolve().then(() => __toESM(require_hooks_1c45ba0b()));
          this.options.hooks = {
            getSession: module22.getSession || (() => ({})),
            handle: module22.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
            handleError: module22.handleError || (({ error: error2 }) => console.error(error2.stack)),
            externalFetch: module22.externalFetch || fetch
          };
        }
        return respond(request, this.options, options);
      }
    };
  }
});

// .netlify/serverless.js
var require_serverless = __commonJS({
  ".netlify/serverless.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    require_shims();
    var _0SERVER = require_server();
    require("http");
    require("https");
    require("zlib");
    require("stream");
    require("buffer");
    require("util");
    require("url");
    require("net");
    require("fs");
    require("path");
    require("crypto");
    var setCookie = { exports: {} };
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str) {
      return typeof str === "string" && !!str.trim();
    }
    function parseString(setCookieValue, options) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValue = parts.shift().split("=");
      var name = nameValue.shift();
      var value = nameValue.join("=");
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      try {
        value = options.decodeValues ? decodeURIComponent(value) : value;
      } catch (e) {
        console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e);
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key === "expires") {
          cookie.expires = new Date(value2);
        } else if (key === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key === "secure") {
          cookie.secure = true;
        } else if (key === "httponly") {
          cookie.httpOnly = true;
        } else if (key === "samesite") {
          cookie.sameSite = value2;
        } else {
          cookie[key] = value2;
        }
      });
      return cookie;
    }
    function parse(input, options) {
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!input) {
        if (!options.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers && input.headers["set-cookie"]) {
        input = input.headers["set-cookie"];
      } else if (input.headers) {
        var sch = input.headers[Object.keys(input.headers).find(function(key) {
          return key.toLowerCase() === "set-cookie";
        })];
        if (!sch && input.headers.cookie && !options.silent) {
          console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
        }
        input = sch;
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!options.map) {
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString(str, options);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString(str, options);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    function splitCookiesString(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    setCookie.exports = parse;
    setCookie.exports.parse = parse;
    setCookie.exports.parseString = parseString;
    var splitCookiesString_1 = setCookie.exports.splitCookiesString = splitCookiesString;
    function split_headers(headers) {
      const h = {};
      const m = {};
      headers.forEach((value, key) => {
        if (key === "set-cookie") {
          m[key] = splitCookiesString_1(value);
        } else {
          h[key] = value;
        }
      });
      return {
        headers: h,
        multiValueHeaders: m
      };
    }
    function init2(manifest) {
      const server = new _0SERVER.Server(manifest);
      return async (event, context) => {
        const response = await server.respond(to_request(event), {
          platform: { context },
          getClientAddress() {
            return event.headers["x-nf-client-connection-ip"];
          }
        });
        const partial_response = __spreadValues({
          statusCode: response.status
        }, split_headers(response.headers));
        if (!is_text(response.headers.get("content-type"))) {
          return __spreadProps(__spreadValues({}, partial_response), {
            isBase64Encoded: true,
            body: Buffer.from(await response.arrayBuffer()).toString("base64")
          });
        }
        return __spreadProps(__spreadValues({}, partial_response), {
          body: await response.text()
        });
      };
    }
    function to_request(event) {
      const { httpMethod, headers, rawUrl, body, isBase64Encoded } = event;
      const init3 = {
        method: httpMethod,
        headers: new Headers(headers)
      };
      if (httpMethod !== "GET" && httpMethod !== "HEAD") {
        const encoding = isBase64Encoded ? "base64" : "utf-8";
        init3.body = typeof body === "string" ? Buffer.from(body, encoding) : body;
      }
      return new Request(rawUrl, init3);
    }
    var text_types = new Set([
      "application/xml",
      "application/json",
      "application/x-www-form-urlencoded",
      "multipart/form-data"
    ]);
    function is_text(content_type) {
      if (!content_type)
        return true;
      const type = content_type.split(";")[0].toLowerCase();
      return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
    }
    exports2.init = init2;
  }
});

// .netlify/server/chunks/image-18f81acb.js
var require_image_18f81acb = __commonJS({
  ".netlify/server/chunks/image-18f81acb.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      I: () => Image
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_e92a6b2a = require_index_e92a6b2a();
    var css = {
      code: "img.svelte-1og64i1{width:100%}",
      map: null
    };
    var Image = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
      let { source } = $$props;
      let { altText } = $$props;
      let src = `https://res.cloudinary.com/bigbeardeddev/image/upload/f_auto,q_auto/essentialstrides/${source}`;
      if ($$props.source === void 0 && $$bindings.source && source !== void 0)
        $$bindings.source(source);
      if ($$props.altText === void 0 && $$bindings.altText && altText !== void 0)
        $$bindings.altText(altText);
      $$result.css.add(css);
      return `

<img${(0, import_index_e92a6b2a.b)("src", src, 0)}${(0, import_index_e92a6b2a.b)("alt", altText, 0)} class="${(0, import_index_e92a6b2a.e)((0, import_index_e92a6b2a.n)(source)) + " svelte-1og64i1"}" loading="${"lazy"}">`;
    });
  }
});

// .netlify/server/entries/pages/__layout.svelte.js
var require_layout_svelte = __commonJS({
  ".netlify/server/entries/pages/__layout.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => _layout
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_e92a6b2a = require_index_e92a6b2a();
    var import_image_18f81acb = require_image_18f81acb();
    var css$1 = {
      code: ".navOverlay.svelte-wh9zi6.svelte-wh9zi6{position:fixed;width:100vw;height:100vh;inset:0;background:rgba(0, 0, 0, 0.5)}#navContainer.svelte-wh9zi6.svelte-wh9zi6{position:absolute;top:0;right:0;width:100%;max-width:300px;background:var(--secondaryColor);height:100vh;padding:85px 0 0 20px;z-index:900}#navContainer.svelte-wh9zi6 a.svelte-wh9zi6{color:var(--navTextColor);text-decoration:none}.navButton.svelte-wh9zi6.svelte-wh9zi6{background:var(--secondaryColor);color:var(--navTextColor);border-radius:50%;border:none;font-size:42px;padding:0;width:60px;height:60px;position:absolute;top:72px;right:10px;outline:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:902;transition:all 0.33s ease-in-out}.navButton.close.svelte-wh9zi6.svelte-wh9zi6{top:10px;right:260px;width:50px;height:50px;border:2px solid var(--baseColor);border-radius:50%}.faIcon.svelte-wh9zi6.svelte-wh9zi6{margin:0;padding:0;width:32px}.iconContainer.svelte-wh9zi6.svelte-wh9zi6{width:16px;transition:all 0.33s ease-in-out;margin-left:var(--arrowMargin)}.iconContainer.svelte-wh9zi6 svg.svelte-wh9zi6{width:100%}.arrow.svelte-wh9zi6.svelte-wh9zi6,.icon.svelte-wh9zi6.svelte-wh9zi6{fill:var(--navTextColor)}ul.svelte-wh9zi6.svelte-wh9zi6{list-style:none;margin-left:0;padding-left:0}.navItem.svelte-wh9zi6.svelte-wh9zi6{width:100%;display:flex;align-items:center;justify-content:flex-start}.navItem.svelte-wh9zi6.svelte-wh9zi6:hover{--arrowMargin:30px}nav.svelte-wh9zi6.svelte-wh9zi6{width:100%;height:100%;overflow:scroll}",
      map: null
    };
    var Nav = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
      const navItems = [
        { name: "Home", link: "/", order: 0 },
        {
          name: "Meet the Founders",
          link: "/founders",
          order: 1
        },
        {
          name: "Contact",
          link: "/contact",
          order: 2
        },
        {
          name: "Donate",
          link: "/donate",
          order: 3
        }
      ];
      let { isOpen = false } = $$props;
      if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
        $$bindings.isOpen(isOpen);
      $$result.css.add(css$1);
      return `<button class="${(0, import_index_e92a6b2a.e)((0, import_index_e92a6b2a.n)(isOpen ? "navButton close" : "navButton")) + " svelte-wh9zi6"}"><div class="${"faIcon svelte-wh9zi6"}">${isOpen ? `<div class="${"close"}"><svg viewBox="${"0 0 254 248"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><rect x="${"41.6116"}" y="${"0.256348"}" width="${"300"}" height="${"50"}" rx="${"25"}" transform="${"rotate(45 41.6116 0.256348)"}" class="${"icon svelte-wh9zi6"}"></rect><rect x="${"0.256348"}" y="${"212.388"}" width="${"300"}" height="${"50"}" rx="${"25"}" transform="${"rotate(-45 0.256348 212.388)"}" class="${"icon svelte-wh9zi6"}"></rect></svg></div>` : `<div class="${"bars"}"><svg viewBox="${"0 0 300 252"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><rect width="${"300"}" height="${"50"}" rx="${"25"}" class="${"icon svelte-wh9zi6"}"></rect><rect y="${"101"}" width="${"300"}" height="${"50"}" rx="${"25"}" class="${"icon svelte-wh9zi6"}"></rect><rect y="${"202"}" width="${"300"}" height="${"50"}" rx="${"25"}" class="${"icon svelte-wh9zi6"}"></rect></svg></div>`}</div></button>
${isOpen ? `<div class="${"navOverlay svelte-wh9zi6"}"></div>
	<div id="${"navContainer"}" class="${"svelte-wh9zi6"}"><nav class="${"svelte-wh9zi6"}"><ul class="${"svelte-wh9zi6"}">${(0, import_index_e92a6b2a.a)(navItems, (navItem, i) => {
        return `<li class="${"navItem svelte-wh9zi6"}"><a${(0, import_index_e92a6b2a.b)("href", navItem.link, 0)} class="${"navItem svelte-wh9zi6"}">${(0, import_index_e92a6b2a.e)(navItem.name)}
							<span class="${"iconContainer svelte-wh9zi6"}"><svg viewBox="${"0 0 450 440"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-wh9zi6"}"><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" class="${"arrow svelte-wh9zi6"}" d="${"M281.372 9.15117C272.497 -1.42573 256.728 -2.80537 246.151 6.06963C235.574 14.9449 234.195 30.7137 243.07 41.2906L372.047 195H25C11.1929 195 0 206.193 0 220C0 233.807 11.1929 245 25 245H372.008L243.07 398.662C234.195 409.239 235.574 425.008 246.151 433.883C256.728 442.758 272.497 441.378 281.372 430.802L442.069 239.29C443.173 237.975 444.118 236.579 444.906 235.126C448.103 230.926 450 225.685 450 220C450 214.368 448.138 209.171 444.995 204.991C444.189 203.479 443.214 202.027 442.069 200.662L281.372 9.15117Z"}"></path></svg>
							</span></a>
					</li>`;
      })}</ul></nav></div>` : ``}`;
    });
    var css = {
      code: ".navContainer.svelte-tcnw2n{width:100%;background:var(--secondaryColor)}header.svelte-tcnw2n{padding:10px 0;border-bottom:3px solid var(--secondaryColor)}.logoContainer.svelte-tcnw2n{width:calc(100% - 40px);max-width:300px;margin:0 auto}footer.svelte-tcnw2n{padding:20px;text-align:right;background:var(--primaryColor);color:#333}.copyright.svelte-tcnw2n{margin:0 0 20px 0;font-size:14px}",
      map: null
    };
    var _layout = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
      const currentYear = new Date().getFullYear();
      $$result.css.add(css);
      return `<div class="${"navContainer svelte-tcnw2n"}">${(0, import_index_e92a6b2a.v)(Nav, "Nav").$$render($$result, {}, {}, {})}</div>
<header class="${"svelte-tcnw2n"}"><div class="${"logoContainer svelte-tcnw2n"}">${(0, import_index_e92a6b2a.v)(import_image_18f81acb.I, "Img").$$render($$result, {
        source: "esLogo",
        altText: "Essential Strides Logo"
      }, {}, {})}</div></header>
${slots.default ? slots.default({}) : ``}
<footer class="${"svelte-tcnw2n"}"><p class="${"copyright svelte-tcnw2n"}">\xA9 ${(0, import_index_e92a6b2a.e)(currentYear)} All content and images are property of Essential Strides
	</p>
</footer>`;
    });
  }
});

// .netlify/server/nodes/0.js
var require__ = __commonJS({
  ".netlify/server/nodes/0.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      index: () => index,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_layout_svelte());
    var index = 0;
    var entry = "pages/__layout.svelte-6cfd7677.js";
    var js = ["pages/__layout.svelte-6cfd7677.js", "chunks/index-33b36d9c.js", "chunks/image-5d9c1289.js"];
    var css = ["assets/pages/__layout.svelte-d0f63f14.css", "assets/image-2b33fc8e.css"];
  }
});

// .netlify/server/entries/fallbacks/error.svelte.js
var require_error_svelte = __commonJS({
  ".netlify/server/entries/fallbacks/error.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Error2,
      load: () => load
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_e92a6b2a = require_index_e92a6b2a();
    function load({ error, status }) {
      return { props: { error, status } };
    }
    var Error2 = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error !== void 0)
        $$bindings.error(error);
      return `<h1>${(0, import_index_e92a6b2a.e)(status)}</h1>

<pre>${(0, import_index_e92a6b2a.e)(error.message)}</pre>



${error.frame ? `<pre>${(0, import_index_e92a6b2a.e)(error.frame)}</pre>` : ``}
${error.stack ? `<pre>${(0, import_index_e92a6b2a.e)(error.stack)}</pre>` : ``}`;
    });
  }
});

// .netlify/server/nodes/1.js
var require__2 = __commonJS({
  ".netlify/server/nodes/1.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      index: () => index,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_error_svelte());
    var index = 1;
    var entry = "error.svelte-e664369f.js";
    var js = ["error.svelte-e664369f.js", "chunks/index-33b36d9c.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/index.svelte.js
var require_index_svelte = __commonJS({
  ".netlify/server/entries/pages/index.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Routes
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_e92a6b2a = require_index_e92a6b2a();
    var import_image_18f81acb = require_image_18f81acb();
    var css = {
      code: '.heroContainer.svelte-qbiae9{width:100%;height:70vw;max-height:75vh;background:url("https://res.cloudinary.com/bigbeardeddev/image/upload/f_auto,q_auto/essentialstrides/babyHand") 50% 50%/cover no-repeat;border-bottom:3px solid var(--secondaryColor)}.intro.svelte-qbiae9{display:flex;margin:20px 0 0 0}@media(max-width: 910px){.intro.svelte-qbiae9{flex-direction:column}}.introText.svelte-qbiae9{width:60%;margin-right:20px}@media(max-width: 910px){.introText.svelte-qbiae9{width:100%;margin-right:0}}.or.svelte-qbiae9{width:40%}@media(max-width: 910px){.or.svelte-qbiae9{width:100%}}.feetImages.svelte-qbiae9{display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr))}',
      map: null
    };
    var Routes = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `<div class="${"heroContainer svelte-qbiae9"}"></div>


<div class="${"contentContainer"}"><div class="${"intro svelte-qbiae9"}"><div class="${"introText svelte-qbiae9"}"><h2>Who We Are:</h2>
			<p>Dr. Kevin Blue and Dr. Lauren Molchan founded Essential Strides in 2021. Essential Strides
				is a medical mission nonprofit organization aimed at treating lower extremity conditions
				that limit or prevent the ability to walk. The goal of the Essential Strides is to provide
				surgical and educational services to underserved communities across the globe.
			</p></div>
		<div class="${"or svelte-qbiae9"}">${(0, import_index_e92a6b2a.v)(import_image_18f81acb.I, "Img").$$render($$result, {
        source: "operatingRoom",
        altText: "Operating Room"
      }, {}, {})}</div></div>

	<div class="${"whyWeExist"}"><h2>Why We Exist:</h2>
		<p>Pain free gait is a luxury many of take for granted. Thousands of people across the world live
			with congenital anomalies or neglected trauma leaving them unable to walk or with limited and
			painful mobility. These conditions prevent children from playing with their peers or parents
			from working and providing for their families. These disabilities are correctable with the
			right care. However, many of these people live remotely and have no access to the advanced
			care or reconstructive surgical services they would require to return to fuller functioning.
			The mission of Essential Strides is to provide this surgical and follow up care to ensure
			these patients\u2019 mobility is restored. We work with local physicians in the areas of our
			missions to ensure a more lasting impact to the local communities and patients we treat. We
			help train and educate doctors of the regions we visit in the surgical techniques that we use.
			These doctors will also help provide the follow up care for the patients moving forward. We
			plan to maintain close relationships with our medical peers abroad throughout the year as part
			of an ongoing partnership.
		</p>
		<div class="${"feetImages svelte-qbiae9"}">${(0, import_index_e92a6b2a.v)(import_image_18f81acb.I, "Img").$$render($$result, { source: "babyFeet", altText: "Baby Feet" }, {}, {})}
			${(0, import_index_e92a6b2a.v)(import_image_18f81acb.I, "Img").$$render($$result, {
        source: "foot",
        altText: "Foot with defect"
      }, {}, {})}</div></div>
	<div class="${"whatWeDo"}"><h2>What We Do:</h2>
		<p>Our first mission trip will be this upcoming July 2022 to a remote region in Peru called
			Moyobamba. We will be treating approximately 30 patients of all ages. We have two Peruvian
			traumatologists who will be trained in advanced foot and ankle surgery techniques. Please
			continue to check the webpage and Instagram for updates.
		</p></div>
</div>`;
    });
  }
});

// .netlify/server/nodes/3.js
var require__3 = __commonJS({
  ".netlify/server/nodes/3.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      index: () => index,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_index_svelte());
    var index = 3;
    var entry = "pages/index.svelte-4ccd5817.js";
    var js = ["pages/index.svelte-4ccd5817.js", "chunks/index-33b36d9c.js", "chunks/image-5d9c1289.js"];
    var css = ["assets/pages/index.svelte-4af294e9.css", "assets/image-2b33fc8e.css"];
  }
});

// .netlify/server/entries/pages/founders.svelte.js
var require_founders_svelte = __commonJS({
  ".netlify/server/entries/pages/founders.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Founders
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_e92a6b2a = require_index_e92a6b2a();
    var import_image_18f81acb = require_image_18f81acb();
    var css = {
      code: ".headshot.svelte-11e5di0{width:100%;max-width:350px;float:left;margin:0 20px 20px 0;padding:0;box-shadow:4px 4px 4px rgba(0, 0, 0, 0.2)}h1.svelte-11e5di0{text-align:center;margin:20px 0}.blue.svelte-11e5di0{padding-bottom:20px;border-bottom:3px solid var(--primaryColor);margin-bottom:20px}a.svelte-11e5di0{color:var(--secondaryColor);text-decoration:none}a.svelte-11e5di0:hover{text-decoration:underline}",
      map: null
    };
    var Founders = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `<div class="${"contentContainer"}"><h1 class="${"svelte-11e5di0"}">Meet Our Founders:</h1>
	<div class="${"blue svelte-11e5di0"}"><div class="${"headshot svelte-11e5di0"}">${(0, import_index_e92a6b2a.v)(import_image_18f81acb.I, "Img").$$render($$result, {
        source: "headshotBlue",
        altText: "Dr. Kevin Blue"
      }, {}, {})}</div>
		<p>Kevin Blue, DPM, FACFAS, is a sports medicine fellowship-trained surgical podiatrist that is
			double-board certified. He is dedicated to providing advanced care for foot and ankle
			conditions in patients of all ages, including young children, teens, and seniors.
		</p>
		<p>Dr. Blue is a Parker, Colorado Podiatrist, and is fully qualified in the forefoot, rearfoot,
			and ankle surgery. He completed his medical degree at the California School of Podiatric
			Medicine at Samuel Merritt University, followed by a three-year surgical residency at
			Highlands/Presbyterian St. Luke\u2019s in Denver, where he performed more than 2,400 surgical
			procedures with an emphasis on traumatic injuries and reconstruction. In addition, he
			completed a one-year fellowship in sports medicine podiatry, treating patients of all ages,
			including children.
		</p>
		<p>Dr. Blue is committed to providing patient-centered care and treatment programs tailored to
			the specific needs of each patient, in addition to providing education and information to help
			patients play an active role in their care. His practice helps athletes of all levels,
			including student-athletes, recover from injuries and other foot- and ankle-related issues so
			they can enjoy a rapid return to the activities they love.
		</p>
		<p>Contact: <a href="${"https://www.footsportsmed.com/"}" target="${"_blank"}" rel="${"noopener noreferrer"}" class="${"svelte-11e5di0"}">www.footsportsmed.com</a></p></div>
	<div class="${"molchan"}"><div class="${"headshot svelte-11e5di0"}">${(0, import_index_e92a6b2a.v)(import_image_18f81acb.I, "Img").$$render($$result, {
        source: "headshotMolchan",
        altText: "Dr. Lauren Molchan"
      }, {}, {})}</div>
		<p>Dr. Lauren Molchan, DPM, AACFAS is a skilled and compassionate podiatrist practicing at Foot
			Specialists Associates in Denver, Colorado.
		</p>

		<p>Dr. Molchan began her undergraduate education at the University of Tennessee, where she pole
			vaulted on their women\u2019s track team. She later graduated from Moravian College with her BS in
			biology, where she continued her collegiate athletic career. She then worked in clinical
			research at UCLA, where she developed her interest in surgery. Her combined passion for sports
			and medicine led her to pursue her Doctorate in Podiatric Medicine &amp; Surgery from the Western
			University of Health Sciences in Pomona, California.
		</p>

		<p>Dr. Molchan completed her three-year foot and ankle surgery residency in Denver, Colorado, at
			Highlands-Presbyterian/St. Luke\u2019s Medical Center and served as chief resident in her final
			year. Her training involved exposure to all aspects of foot and ankle surgery. She is the
			youngest member of the board of directors for the Colorado Podiatric Medical Association and
			participates in training surgical residents as an attending in the Denver area. Dr. Molchan
			has a passion for global medicine.
		</p>

		<p>She enjoys treating a wide variety of foot and ankle pathologies, including sports injuries,
			trauma, pediatrics, forefoot and rearfoot deformities, arthroscopy, arthritic conditions, and
			total joint replacement. Her mission is to provide superior comprehensive foot and ankle care
			while adhering to principles of focused and patient-centered care. She believes the best
			outcomes are achieved when both the patient and physician work as a team. She is excited to
			serve the greater Denver community that she trained in. In her spare time, she enjoys yoga,
			hiking, skiing, rock climbing, and painting.
		</p>
		<p>Contact: <a href="${"https://www.coloradofootcare.com/"}" target="${"_blank"}" rel="${"noopener noreferrer"}" class="${"svelte-11e5di0"}">www.coloradofootcare.com</a></p></div>
</div>`;
    });
  }
});

// .netlify/server/nodes/2.js
var require__4 = __commonJS({
  ".netlify/server/nodes/2.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      index: () => index,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_founders_svelte());
    var index = 2;
    var entry = "pages/founders.svelte-19afa4dc.js";
    var js = ["pages/founders.svelte-19afa4dc.js", "chunks/index-33b36d9c.js", "chunks/image-5d9c1289.js"];
    var css = ["assets/pages/founders.svelte-9c79f218.css", "assets/image-2b33fc8e.css"];
  }
});

// .netlify/functions-internal/render.js
var { init } = require_serverless();
exports.handler = init({
  appDir: "_app",
  assets: new Set(["bars.svg", "favicon.png", "navArrow.svg", "times.png", "times.svg"]),
  mimeTypes: { ".svg": "image/svg+xml", ".png": "image/png" },
  _: {
    entry: { "file": "start-f9b41969.js", "js": ["start-f9b41969.js", "chunks/index-33b36d9c.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => require__()),
      () => Promise.resolve().then(() => require__2()),
      () => Promise.resolve().then(() => require__3()),
      () => Promise.resolve().then(() => require__4())
    ],
    routes: [
      {
        type: "page",
        id: "",
        pattern: /^\/$/,
        names: [],
        types: [],
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        id: "founders",
        pattern: /^\/founders\/?$/,
        names: [],
        types: [],
        path: "/founders",
        shadow: null,
        a: [0, 3],
        b: [1]
      }
    ],
    matchers: async () => {
      return {};
    }
  }
});
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
//# sourceMappingURL=render.js.map
