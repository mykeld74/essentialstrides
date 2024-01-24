<script>
	import Image from '$components/image.svelte';
</script>

<div class="contentContainer">
	<h1>Sips for Strides - March 7th 2024</h1>
	<!-- <p>
		Come enjoy Peruvian themed cocktails, hors d'oeuvres, live music and silent auction to help
		raise money for our 2023 trip!
	</p> -->
	<a
		href="https://www.eventbrite.com/e/sips-for-strides-essential-strides-fundraiser-tickets-807381789667?aff=oddtdtcreator"
		target="_blank"
		rel="noopener noreferrer"
		class="eventLink"
	>
		<p>Click here to purchase tickets</p>
		<Image source="sipsForStrides" altText="Sips for Strides" />
	</a>
</div>

<style lang="scss">
	.contentContainer {
		padding-top: 30px;
		min-height: calc(100vh - 335px);
	}
	.eventLink {
		text-decoration: none;

		:hover {
			cursor: pointer;
			--secondaryColor: var(--primaryColor);
		}
		p {
			color: var(--secondaryColor);
			transition: all 0.3s ease-in-out;
		}
	}
</style>
