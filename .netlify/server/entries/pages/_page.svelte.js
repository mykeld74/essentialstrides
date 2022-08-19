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
var import_chunks = require("../../chunks/index.js");
var import_image = require("../../chunks/image.js");
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '.heroContainer.svelte-19zukdy{width:100%;height:70vw;max-height:75vh;background:url("https://res.cloudinary.com/bigbeardeddev/image/upload/f_auto,q_auto/essentialstrides/babyHand") 50% 50%/cover no-repeat;border-bottom:3px solid var(--secondaryColor)}.intro.svelte-19zukdy{display:flex;margin:20px 0 0 0}@media(max-width: 910px){.intro.svelte-19zukdy{flex-direction:column}}.introText.svelte-19zukdy{width:60%;margin-right:20px}@media(max-width: 910px){.introText.svelte-19zukdy{width:100%;margin-right:0}}.or.svelte-19zukdy{width:40%}@media(max-width: 910px){.or.svelte-19zukdy{width:100%}}h2.svelte-19zukdy{text-decoration:underline}.feetImages.svelte-19zukdy{display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr))}',
  map: null
};
const Page = (0, import_chunks.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Essential Strides</title>`, ""}`, ""}

<div class="${"heroContainer svelte-19zukdy"}"></div>


<div class="${"contentContainer"}"><div class="${"intro svelte-19zukdy"}"><div class="${"introText svelte-19zukdy"}"><h2 class="${"svelte-19zukdy"}">Who We Are:</h2>
			<p>Dr. Kevin Blue and Dr. Lauren Molchan founded Essential Strides in 2021. Essential Strides
				is a medical mission nonprofit organization aimed at treating lower extremity conditions
				that limit or prevent the ability to walk. The goal of the Essential Strides is to provide
				surgical and educational services to underserved communities across the globe.
			</p></div>
		<div class="${"or svelte-19zukdy"}">${(0, import_chunks.v)(import_image.I, "Img").$$render(
    $$result,
    {
      source: "operatingRoom",
      altText: "Operating Room"
    },
    {},
    {}
  )}</div></div>

	<div class="${"whyWeExist"}"><h2 class="${"svelte-19zukdy"}">Why We Exist:</h2>
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
		<div class="${"feetImages svelte-19zukdy"}">${(0, import_chunks.v)(import_image.I, "Img").$$render($$result, { source: "babyFeet", altText: "Baby Feet" }, {}, {})}
			${(0, import_chunks.v)(import_image.I, "Img").$$render(
    $$result,
    {
      source: "foot",
      altText: "Foot with defect"
    },
    {},
    {}
  )}</div></div>
	<div class="${"whatWeDo"}"><h2 class="${"svelte-19zukdy"}">What We Do:</h2>
		<p>Our first mission trip will be this upcoming July 2022 to a remote region in Peru called
			Moyobamba. We will be treating approximately 30 patients of all ages. We have two Peruvian
			traumatologists who will be trained in advanced foot and ankle surgery techniques. Please
			continue to check the webpage and Instagram for updates.
		</p></div>
</div>`;
});
