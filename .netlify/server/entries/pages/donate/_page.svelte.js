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
  default: () => Page
});
module.exports = __toCommonJS(stdin_exports);
var import_chunks = require("../../../chunks/index.js");
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".contentContainer.svelte-5o0cu2{min-height:calc(100vh - 100px)}h1.svelte-5o0cu2{margin-top:30px;text-decoration:underline}h2.svelte-5o0cu2{text-decoration:underline}",
  map: null
};
const Page = (0, import_chunks.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Donations | Essential Strides</title>`, ""}`, ""}

<div class="${"contentContainer svelte-5o0cu2"}"><h1 class="${"svelte-5o0cu2"}">Donate Today</h1>
	<p>We are in the process of getting online donations set up. Until that time you can mail checks
		to:
	</p>
	<p>19284 Cottonwood Drive <br>Suite 201B<br>Parker, CO 80138</p>

	<h2 class="${"svelte-5o0cu2"}">Where your donations go:</h2>
	<p>As a volunteer medical mission group, we are responsible for purchasing all the required
		surgical tools and postoperative supplies, such as antibiotics, walking aids, and bandage
		supplies the patients may need afterward. We also would like to like make a lasting contribution
		to the hosting clinics in Moyobamba by providing equipment and renovations they require such as:
		repairing x-ray equipment, repairing anesthesia machines, and providing more patient beds.
		Additionally, we plan on providing wages to local Peruvian workers aiding our mission.
		Therefore, any donations would be applied to these costs and necessary supplies to make our trip
		successful. We are passionate about this project and greatly thank you for your generosity.
	</p>

	<p>We are an established 501(c)(3) organization and can provide receipts for your records.</p>
</div>`;
});
