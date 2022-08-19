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
var import_image = require("../../../chunks/image.js");
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".headshot.svelte-11e5di0{width:100%;max-width:350px;float:left;margin:0 20px 20px 0;padding:0;box-shadow:4px 4px 4px rgba(0, 0, 0, 0.2)}h1.svelte-11e5di0{text-align:center;margin:20px 0}.blue.svelte-11e5di0{padding-bottom:20px;border-bottom:3px solid var(--primaryColor);margin-bottom:20px}a.svelte-11e5di0{color:var(--secondaryColor);text-decoration:none}a.svelte-11e5di0:hover{text-decoration:underline}",
  map: null
};
const Page = (0, import_chunks.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `${$$result.title = `<title>Meet our Founders | Essential Strides</title>`, ""}`, ""}

<div class="${"contentContainer"}"><h1 class="${"svelte-11e5di0"}">Meet Our Founders:</h1>
	<div class="${"blue svelte-11e5di0"}"><div class="${"headshot svelte-11e5di0"}">${(0, import_chunks.v)(import_image.I, "Img").$$render(
    $$result,
    {
      source: "headshotBlue",
      altText: "Dr. Kevin Blue"
    },
    {},
    {}
  )}</div>
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
	<div class="${"molchan"}"><div class="${"headshot svelte-11e5di0"}">${(0, import_chunks.v)(import_image.I, "Img").$$render(
    $$result,
    {
      source: "headshotMolchan",
      altText: "Dr. Lauren Molchan"
    },
    {},
    {}
  )}</div>
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
