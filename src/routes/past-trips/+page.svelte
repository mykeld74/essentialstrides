<script lang="ts">
	import Masonry from '$components/Masonry.svelte';
	import peru2022images from '$utils/peru2022images';

	let items = peru2022images;

	// items = items.sort(() => Math.random() - 0.5);
</script>

<div class="contentContainer">
	<div class="headerContainer">
		<h1>Peru 2022</h1>
		<p>
			Our group made our inaugural trip to Moyobamba, Peru this past July 2022. Our group of
			volunteers consisted of students, residents, surgeons, anesthesiologist, nurses, scrub techs
			and many others. The team screened over 50 patients and performed surgical and nonsurgical
			treatments of patients of all ages from 1 to 36 years of age. We predominately saw patients
			with birth deformities such as club foot that went uncorrected. Although, we treat any lower
			extremity deformity or condition of the patients screened. We also focused efforts on working
			with and training local physicians and medical students. In addition to American volunteers, 3
			Peruvian physicians and 8 Peruvian medical students volunteered and trained with Essential
			Strides. The success of this trip would not be possible without the help of our donors and
			volunteers. If you would like to join our team, please visit our volunteer and donation pages
			for more information. Check our photos page for images from our previous trip.
		</p>
	</div>

	<Masonry {items}>
		{#each items as item}
			<img src={item.imgSrc} alt={`peru trip ${item.id}`} loading="lazy" />
		{/each}
	</Masonry>
</div>

<style>
	.headerContainer {
		padding: 20px 10px;
	}
</style>
