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
  default: () => Layout
});
module.exports = __toCommonJS(stdin_exports);
var import_chunks = require("../../chunks/index.js");
var import_image = require("../../chunks/image.js");
const styles = "";
const nav_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".navOverlay.svelte-213fem.svelte-213fem{position:fixed;width:100vw;height:100vh;inset:0;background:rgba(0, 0, 0, 0.5)}#navContainer.svelte-213fem.svelte-213fem{position:absolute;top:0;right:0;width:100%;max-width:300px;background:var(--secondaryColor);height:100vh;padding:85px 0 0 20px;z-index:900}#navContainer.svelte-213fem a.svelte-213fem{color:var(--navTextColor);text-decoration:none}.navButton.svelte-213fem.svelte-213fem{background:var(--secondaryColor);color:var(--navTextColor);border-radius:50%;border:none;font-size:42px;padding:0;width:60px;height:60px;position:absolute;top:72px;right:10px;outline:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:902;transition:all 0.33s ease-in-out}.navButton.close.svelte-213fem.svelte-213fem{top:10px;right:260px;width:50px;height:50px;border:2px solid var(--baseColor);border-radius:50%}.faIcon.svelte-213fem.svelte-213fem{margin:0;padding:0;width:32px}.iconContainer.svelte-213fem.svelte-213fem{width:16px;transition:all 0.33s ease-in-out;margin-left:var(--arrowMargin)}.iconContainer.svelte-213fem svg.svelte-213fem{width:100%}.arrow.svelte-213fem.svelte-213fem,.icon.svelte-213fem.svelte-213fem{fill:var(--navTextColor);stroke:var(--navTextColor)}ul.svelte-213fem.svelte-213fem{list-style:none;margin-left:0;padding-left:0}.navItem.svelte-213fem.svelte-213fem{width:100%;display:flex;align-items:center;justify-content:flex-start}.navItem.svelte-213fem.svelte-213fem:hover{--arrowMargin:30px}nav.svelte-213fem.svelte-213fem{width:100%;height:100%;overflow:scroll}",
  map: null
};
const Nav = (0, import_chunks.c)(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$2);
  return `<button class="${(0, import_chunks.e)((0, import_chunks.b)(isOpen ? "navButton close" : "navButton"), true) + " svelte-213fem"}"><div class="${"faIcon svelte-213fem"}">${isOpen ? `<div class="${"close"}"><svg viewBox="${"0 0 315 315"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><line x1="${"36.3553"}" y1="${"39"}" x2="${"273.943"}" y2="${"276.588"}" stroke="${"black"}" stroke-width="${"50"}" stroke-linecap="${"round"}" class="${"icon svelte-213fem"}"></line><line x1="${"42"}" y1="${"276.588"}" x2="${"279.588"}" y2="${"38.9999"}" stroke="${"black"}" stroke-width="${"50"}" stroke-linecap="${"round"}" class="${"icon svelte-213fem"}"></line></svg></div>` : `<div class="${"bars"}"><svg viewBox="${"0 0 315 315"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><line x1="${"31"}" y1="${"65"}" x2="${"281"}" y2="${"65"}" stroke="${"black"}" stroke-width="${"50"}" stroke-linecap="${"round"}" class="${"icon topLine svelte-213fem"}"></line><line x1="${"31"}" y1="${"170"}" x2="${"281"}" y2="${"170"}" stroke="${"black"}" stroke-width="${"50"}" stroke-linecap="${"round"}" class="${"icon middleLine svelte-213fem"}"></line><line x1="${"31"}" y1="${"275"}" x2="${"281"}" y2="${"275"}" stroke="${"black"}" stroke-width="${"50"}" stroke-linecap="${"round"}" class="${"icon bottomLine svelte-213fem"}"></line></svg></div>`}</div></button>
${isOpen ? `<div class="${"navOverlay svelte-213fem"}"></div>
	<div id="${"navContainer"}" class="${"svelte-213fem"}"><nav class="${"svelte-213fem"}"><ul class="${"svelte-213fem"}">${(0, import_chunks.d)(navItems, (navItem, i) => {
    return `<li class="${"navItem svelte-213fem"}"><a${(0, import_chunks.f)("href", navItem.link, 0)} class="${"navItem svelte-213fem"}">${(0, import_chunks.e)(navItem.name)}
							<span class="${"iconContainer svelte-213fem"}"><svg viewBox="${"0 0 450 440"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-213fem"}"><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" class="${"arrow svelte-213fem"}" d="${"M281.372 9.15117C272.497 -1.42573 256.728 -2.80537 246.151 6.06963C235.574 14.9449 234.195 30.7137 243.07 41.2906L372.047 195H25C11.1929 195 0 206.193 0 220C0 233.807 11.1929 245 25 245H372.008L243.07 398.662C234.195 409.239 235.574 425.008 246.151 433.883C256.728 442.758 272.497 441.378 281.372 430.802L442.069 239.29C443.173 237.975 444.118 236.579 444.906 235.126C448.103 230.926 450 225.685 450 220C450 214.368 448.138 209.171 444.995 204.991C444.189 203.479 443.214 202.027 442.069 200.662L281.372 9.15117Z"}"></path></svg>
							</span></a>
					</li>`;
  })}</ul></nav></div>` : ``}`;
});
const themeToggle_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: 'button.svelte-129f5mm{--width:40px;--height:calc(var(--width) / 2);--radius:calc(var(--height) / 2);display:flex;position:relative;width:var(--width);height:var(--height);border-radius:var(--radius);border:1px inset var(--backgroundColor);background-color:var(--fontColor);transition:background-color 0.3s ease-in-out;margin-left:20px}button.svelte-129f5mm:after{content:"";position:absolute;top:-2px;left:-1px;width:var(--height);height:var(--height);border-radius:var(--radius);border:1px inset var(--fontColor);background-color:var(--backgroundColor);box-shadow:1px 1px 5px rgba(0, 0, 0, 0.5);transition:all 0.3s ease-in-out}button.dark.svelte-129f5mm::after{transform:translate3d(100%, 0, 0)}',
  map: null
};
const ThemeToggle = (0, import_chunks.c)(($$result, $$props, $$bindings, slots) => {
  let { isToggled = false } = $$props;
  if ($$props.isToggled === void 0 && $$bindings.isToggled && isToggled !== void 0)
    $$bindings.isToggled(isToggled);
  $$result.css.add(css$1);
  return `<button class="${(0, import_chunks.e)((0, import_chunks.b)(isToggled ? "" : "dark"), true) + " svelte-129f5mm"}"></button>`;
});
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".navContainer.svelte-em2l0f{width:100%;background:var(--secondaryColor)}header.svelte-em2l0f{padding:10px 0;border-bottom:3px solid var(--secondaryColor);position:relative}.themeToggle.svelte-em2l0f{position:absolute;right:10px;top:10px}.logoContainer.svelte-em2l0f{width:calc(100% - 40px);max-width:300px;margin:0 auto}footer.svelte-em2l0f{padding:20px;text-align:right;background:var(--primaryColor)}.copyright.svelte-em2l0f{font-size:14px;color:var(--fontColor)}",
  map: null
};
const Layout = (0, import_chunks.c)(($$result, $$props, $$bindings, slots) => {
  const currentYear = new Date().getFullYear();
  let isToggled = false;
  $$result.css.add(css);
  return `<div class="${"navContainer svelte-em2l0f"}">${(0, import_chunks.v)(Nav, "Nav").$$render($$result, {}, {}, {})}</div>
<header class="${"svelte-em2l0f"}"><a href="${"/"}"><div class="${"logoContainer svelte-em2l0f"}">${(0, import_chunks.v)(import_image.I, "Img").$$render(
    $$result,
    {
      source: "esLogo",
      altText: "Essential Strides Logo"
    },
    {},
    {}
  )}</div></a>
	<div class="${"themeToggle svelte-em2l0f"}">${(0, import_chunks.v)(ThemeToggle, "ThemeToggle").$$render($$result, { isToggled }, {}, {})}</div></header>
${slots.default ? slots.default({}) : ``}
<footer class="${"svelte-em2l0f"}"><p class="${"copyright svelte-em2l0f"}">\xA9 ${(0, import_chunks.e)(currentYear)} All content and images are property of Essential Strides
	</p>
</footer>`;
});
