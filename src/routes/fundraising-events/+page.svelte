<script>
	import Image from '$components/image.svelte';
</script>

<div class="contentContainer">
	<h1 class="headline">Fundraising Events</h1>
	<div class="eventContainer">
		<h2>Annual Fall Gala - Saturday, September 13th, 2025</h2>

		<a
			href="https://ubmeevents.com/event/896d36ab-0f05-4dcf-8c33-75767000cb09"
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
