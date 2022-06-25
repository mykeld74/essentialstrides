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
  default: () => _layout
});
module.exports = __toCommonJS(stdin_exports);
var import_index_e92a6b2a = require("../../chunks/index-e92a6b2a.js");
var import_image_18f81acb = require("../../chunks/image-18f81acb.js");
var styles = /* @__PURE__ */ (() => "\n@import url(\"https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap\");/* Document\n   ========================================================================== *//**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */* {\n	box-sizing: border-box;\n}html {\n	line-height: 1.15; /* 1 */\n	-webkit-text-size-adjust: 100%; /* 2 */\n}/* Sections\n   ========================================================================== *//**\n * Remove the margin in all browsers.\n */body {\n	margin: 0;\n}/**\n * Render the `main` element consistently in IE.\n */main {\n	display: block;\n}/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */h1 {\n	font-size: 2em;\n	margin: 0 0 0.67em 0;\n}/* Grouping content\n   ========================================================================== *//**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */hr {\n	box-sizing: content-box; /* 1 */\n	height: 0; /* 1 */\n	overflow: visible; /* 2 */\n}/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */pre {\n	font-family: monospace, monospace; /* 1 */\n	font-size: 1em; /* 2 */\n}/* Text-level semantics\n   ========================================================================== *//**\n * Remove the gray background on active links in IE 10.\n */a {\n	background-color: transparent;\n}/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */abbr[title] {\n	border-bottom: none; /* 1 */\n	text-decoration: underline; /* 2 */\n	text-decoration: underline dotted; /* 2 */\n}/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */b,\nstrong {\n	font-weight: bolder;\n}/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */code,\nkbd,\nsamp {\n	font-family: monospace, monospace; /* 1 */\n	font-size: 1em; /* 2 */\n}/**\n * Add the correct font size in all browsers.\n */small {\n	font-size: 80%;\n}/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */sub,\nsup {\n	font-size: 75%;\n	line-height: 0;\n	position: relative;\n	vertical-align: baseline;\n}sub {\n	bottom: -0.25em;\n}sup {\n	top: -0.5em;\n}/* Embedded content\n   ========================================================================== *//**\n * Remove the border on images inside links in IE 10.\n */img {\n	border-style: none;\n  max-width: 100%;\n}/* Forms\n   ========================================================================== *//**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */button,\ninput,\noptgroup,\nselect,\ntextarea {\n	font-family: inherit; /* 1 */\n	font-size: 100%; /* 1 */\n	line-height: 1.15; /* 1 */\n	margin: 0; /* 2 */\n}/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */button,\ninput {\n	/* 1 */\n	overflow: visible;\n}/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */button,\nselect {\n	/* 1 */\n	text-transform: none;\n}/**\n * Correct the inability to style clickable types in iOS and Safari.\n */button,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n	-webkit-appearance: button;\n}/**\n * Remove the inner border and padding in Firefox.\n */button::-moz-focus-inner,\n[type='button']::-moz-focus-inner,\n[type='reset']::-moz-focus-inner,\n[type='submit']::-moz-focus-inner {\n	border-style: none;\n	padding: 0;\n}/**\n * Restore the focus styles unset by the previous rule.\n */button:-moz-focusring,\n[type='button']:-moz-focusring,\n[type='reset']:-moz-focusring,\n[type='submit']:-moz-focusring {\n	outline: 1px dotted ButtonText;\n}/**\n * Correct the padding in Firefox.\n */fieldset {\n	padding: 0.35em 0.75em 0.625em;\n}/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */legend {\n	box-sizing: border-box; /* 1 */\n	color: inherit; /* 2 */\n	display: table; /* 1 */\n	max-width: 100%; /* 1 */\n	padding: 0; /* 3 */\n	white-space: normal; /* 1 */\n}/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */progress {\n	vertical-align: baseline;\n}/**\n * Remove the default vertical scrollbar in IE 10+.\n */textarea {\n	overflow: auto;\n}/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */[type='checkbox'],\n[type='radio'] {\n	box-sizing: border-box; /* 1 */\n	padding: 0; /* 2 */\n}/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */[type='number']::-webkit-inner-spin-button,\n[type='number']::-webkit-outer-spin-button {\n	height: auto;\n}/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */[type='search'] {\n	-webkit-appearance: textfield; /* 1 */\n	outline-offset: -2px; /* 2 */\n}/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */[type='search']::-webkit-search-decoration {\n	-webkit-appearance: none;\n}/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */::-webkit-file-upload-button {\n	-webkit-appearance: button; /* 1 */\n	font: inherit; /* 2 */\n}/* Interactive\n   ========================================================================== *//*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */details {\n	display: block;\n}/*\n * Add the correct display in all browsers.\n */summary {\n	display: list-item;\n}/* Misc\n   ========================================================================== *//**\n * Add the correct display in IE 10+.\n */template {\n	display: none;\n}/**\n * Add the correct display in IE 10.\n */[hidden] {\n	display: none;\n}:root {\n  --primaryColor: #8dd2bd;\n  --secondaryColor: #8f3d5a;\n  --navTextColor: #fff;\n  --arrowMargin: 10px;\n}body,\nhtml {\n  font-family: \"Libre Franklin\", sans-serif;\n}p,\nli {\n  font-size: clamp(18px, 1.75vw, 22px);\n  line-height: 1.4;\n}.contentContainer {\n  width: calc(100% - 40px);\n  max-width: 1170px;\n  margin: 0 auto;\n}")();
var nav_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => ".navOverlay.svelte-wh9zi6.svelte-wh9zi6{position:fixed;width:100vw;height:100vh;inset:0;background:rgba(0, 0, 0, 0.5)}#navContainer.svelte-wh9zi6.svelte-wh9zi6{position:absolute;top:0;right:0;width:100%;max-width:300px;background:var(--secondaryColor);height:100vh;padding:85px 0 0 20px;z-index:900}#navContainer.svelte-wh9zi6 a.svelte-wh9zi6{color:var(--navTextColor);text-decoration:none}.navButton.svelte-wh9zi6.svelte-wh9zi6{background:var(--secondaryColor);color:var(--navTextColor);border-radius:50%;border:none;font-size:42px;padding:0;width:60px;height:60px;position:absolute;top:72px;right:10px;outline:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:902;transition:all 0.33s ease-in-out}.navButton.close.svelte-wh9zi6.svelte-wh9zi6{top:10px;right:260px;width:50px;height:50px;border:2px solid var(--baseColor);border-radius:50%}.faIcon.svelte-wh9zi6.svelte-wh9zi6{margin:0;padding:0;width:32px}.iconContainer.svelte-wh9zi6.svelte-wh9zi6{width:16px;transition:all 0.33s ease-in-out;margin-left:var(--arrowMargin)}.iconContainer.svelte-wh9zi6 svg.svelte-wh9zi6{width:100%}.arrow.svelte-wh9zi6.svelte-wh9zi6,.icon.svelte-wh9zi6.svelte-wh9zi6{fill:var(--navTextColor)}ul.svelte-wh9zi6.svelte-wh9zi6{list-style:none;margin-left:0;padding-left:0}.navItem.svelte-wh9zi6.svelte-wh9zi6{width:100%;display:flex;align-items:center;justify-content:flex-start}.navItem.svelte-wh9zi6.svelte-wh9zi6:hover{--arrowMargin:30px}nav.svelte-wh9zi6.svelte-wh9zi6{width:100%;height:100%;overflow:scroll}")();
const css$1 = {
  code: ".navOverlay.svelte-wh9zi6.svelte-wh9zi6{position:fixed;width:100vw;height:100vh;inset:0;background:rgba(0, 0, 0, 0.5)}#navContainer.svelte-wh9zi6.svelte-wh9zi6{position:absolute;top:0;right:0;width:100%;max-width:300px;background:var(--secondaryColor);height:100vh;padding:85px 0 0 20px;z-index:900}#navContainer.svelte-wh9zi6 a.svelte-wh9zi6{color:var(--navTextColor);text-decoration:none}.navButton.svelte-wh9zi6.svelte-wh9zi6{background:var(--secondaryColor);color:var(--navTextColor);border-radius:50%;border:none;font-size:42px;padding:0;width:60px;height:60px;position:absolute;top:72px;right:10px;outline:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:902;transition:all 0.33s ease-in-out}.navButton.close.svelte-wh9zi6.svelte-wh9zi6{top:10px;right:260px;width:50px;height:50px;border:2px solid var(--baseColor);border-radius:50%}.faIcon.svelte-wh9zi6.svelte-wh9zi6{margin:0;padding:0;width:32px}.iconContainer.svelte-wh9zi6.svelte-wh9zi6{width:16px;transition:all 0.33s ease-in-out;margin-left:var(--arrowMargin)}.iconContainer.svelte-wh9zi6 svg.svelte-wh9zi6{width:100%}.arrow.svelte-wh9zi6.svelte-wh9zi6,.icon.svelte-wh9zi6.svelte-wh9zi6{fill:var(--navTextColor)}ul.svelte-wh9zi6.svelte-wh9zi6{list-style:none;margin-left:0;padding-left:0}.navItem.svelte-wh9zi6.svelte-wh9zi6{width:100%;display:flex;align-items:center;justify-content:flex-start}.navItem.svelte-wh9zi6.svelte-wh9zi6:hover{--arrowMargin:30px}nav.svelte-wh9zi6.svelte-wh9zi6{width:100%;height:100%;overflow:scroll}",
  map: null
};
const Nav = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
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
var __layout_svelte_svelte_type_style_lang = /* @__PURE__ */ (() => ".navContainer.svelte-tcnw2n{width:100%;background:var(--secondaryColor)}header.svelte-tcnw2n{padding:10px 0;border-bottom:3px solid var(--secondaryColor)}.logoContainer.svelte-tcnw2n{width:calc(100% - 40px);max-width:300px;margin:0 auto}footer.svelte-tcnw2n{padding:20px;text-align:right;background:var(--primaryColor);color:#333}.copyright.svelte-tcnw2n{margin:0 0 20px 0;font-size:14px}")();
const css = {
  code: ".navContainer.svelte-tcnw2n{width:100%;background:var(--secondaryColor)}header.svelte-tcnw2n{padding:10px 0;border-bottom:3px solid var(--secondaryColor)}.logoContainer.svelte-tcnw2n{width:calc(100% - 40px);max-width:300px;margin:0 auto}footer.svelte-tcnw2n{padding:20px;text-align:right;background:var(--primaryColor);color:#333}.copyright.svelte-tcnw2n{margin:0 0 20px 0;font-size:14px}",
  map: null
};
const _layout = (0, import_index_e92a6b2a.c)(($$result, $$props, $$bindings, slots) => {
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
