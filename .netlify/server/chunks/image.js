var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  I: () => Image
});
module.exports = __toCommonJS(stdin_exports);
var import_index = require("./index.js");
const image_svelte_svelte_type_style_lang = "";
const css = {
  code: "img.svelte-1og64i1{width:100%}",
  map: null
};
const Image = (0, import_index.c)(($$result, $$props, $$bindings, slots) => {
  let { source } = $$props;
  let { altText } = $$props;
  let src = `https://res.cloudinary.com/bigbeardeddev/image/upload/f_auto,q_auto/essentialstrides/${source}`;
  if ($$props.source === void 0 && $$bindings.source && source !== void 0)
    $$bindings.source(source);
  if ($$props.altText === void 0 && $$bindings.altText && altText !== void 0)
    $$bindings.altText(altText);
  $$result.css.add(css);
  return `

<img${(0, import_index.f)("src", src, 0)}${(0, import_index.f)("alt", altText, 0)} class="${(0, import_index.e)((0, import_index.b)(source), true) + " svelte-1og64i1"}" loading="${"lazy"}">`;
});
