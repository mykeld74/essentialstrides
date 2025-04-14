<script>
	import Image from '$components/image.svelte';
</script>

<div class="contentContainer">
	<h1 class="headline">Fundraising Events</h1>
	<div class="eventContainer">
		<h2>Annual Golf Outing Fundraiser - June 16th, 2025</h2>

		<a
			href="https://ubmeevents.com/event/8efb2757-c2c0-435c-b6f9-610807c5af27"
			target="_blank"
			rel="noopener noreferrer"
			class="eventLink"
		>
			<p>Click here to register</p>
			<Image source="golfScramble" altText="Sips for Strides" />
		</a>
	</div>
</div>

<style lang="scss">
	.contentContainer {
		padding-top: 30px;
		min-height: calc(100vh - 335px);
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
	.headline {
		font-size: 2.5rem;
		text-decoration: underline;
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
	.divider {
		height: 2px;
		background-color: var(--secondaryColor);
	}
</style>
