var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  manifest: () => manifest
});
module.exports = __toCommonJS(stdin_exports);
const manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["bars.svg", "bars2.svg", "favicon.png", "navArrow.svg", "times.svg", "times2.svg"]),
  mimeTypes: { ".svg": "image/svg+xml", ".png": "image/png" },
  _: {
    entry: { "file": "_app/immutable/start-a0183377.js", "imports": ["_app/immutable/start-a0183377.js", "_app/immutable/chunks/index-3213c06e.js"], "stylesheets": [] },
    nodes: [
      () => Promise.resolve().then(() => __toESM(require("./nodes/0.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/1.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/2.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/3.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/4.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/5.js")))
    ],
    routes: [
      {
        type: "page",
        id: "",
        pattern: /^\/$/,
        names: [],
        types: [],
        errors: [1],
        layouts: [0],
        leaf: 2
      },
      {
        type: "page",
        id: "contact",
        pattern: /^\/contact\/?$/,
        names: [],
        types: [],
        errors: [1],
        layouts: [0],
        leaf: 3
      },
      {
        type: "page",
        id: "donate",
        pattern: /^\/donate\/?$/,
        names: [],
        types: [],
        errors: [1],
        layouts: [0],
        leaf: 4
      },
      {
        type: "page",
        id: "founders",
        pattern: /^\/founders\/?$/,
        names: [],
        types: [],
        errors: [1],
        layouts: [0],
        leaf: 5
      }
    ],
    matchers: async () => {
      return {};
    }
  }
};
