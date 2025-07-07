<script>
	import Image from '$components/image.svelte';
</script>

<div class="contentContainer">
	<h1 class="headline">Fundraising Events</h1>
	<div class="eventContainer">
		<h2>Annual Fall Gala - Saturday, September 13th, 2025</h2>

		<a
			href="https://my.onecause.com/event/organizations/bee21985-19be-42a8-8329-908f8efc6b46/events/vevt:e94694e2-ee64-471f-b6a9-a753d4488d9d/home/story"
			target="_blank"
			rel="noopener noreferrer"
			class="eventLink"
		>
			<p>Click here to register</p>
			<Image source="EsFundraiser" altText="Annual Fall Gala" />
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
