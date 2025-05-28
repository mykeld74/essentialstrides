<script>
	import Img from '$components/image.svelte';
</script>

<svelte:head>
	<title>Essential Strides</title>
</svelte:head>

<div class="heroContainer" />

<button class="scrubsPartnershipBanner" popovertarget="scrubsPartnershipDialog">
	<p class="scrubsPartnershipBannerText">
		Essential Strides is proud to partner with Rise Scrubs -- Learn More...
	</p>
</button>

<!-- <div class="titleBar"><h1>Essential Strides</h1></div> -->
<div class="contentContainer">
	<div class="intro">
		<div class="introText">
			<h2>Who We Are:</h2>
			<p>
				Dr. Kevin Blue and Dr. Lauren Molchan founded Essential Strides in 2021. Essential Strides
				is a medical mission nonprofit organization aimed at treating lower extremity conditions
				that limit or prevent the ability to walk. The goal of the Essential Strides is to provide
				surgical and educational services to underserved communities across the globe.
			</p>
		</div>
		<div class="or"><Img source="Peru2022/Peru68" altText="Operating Room" /></div>
	</div>

	<div class="whyWeExist">
		<h2>Why We Exist:</h2>
		<p>
			Pain free gait is a luxury many of take for granted. Thousands of people across the world live
			with congenital anomalies or neglected trauma leaving them unable to walk or with limited and
			painful mobility. These conditions prevent children from playing with their peers or parents
			from working and providing for their families. These disabilities are correctable with the
			right care. However, many of these people live remotely and have no access to the advanced
			care or reconstructive surgical services they would require to return to fuller functioning.
			The mission of Essential Strides is to provide this surgical and follow up care to ensure
			these patients’ mobility is restored. We work with local physicians in the areas of our
			missions to ensure a more lasting impact to the local communities and patients we treat. We
			help train and educate doctors of the regions we visit in the surgical techniques that we use.
			These doctors will also help provide the follow up care for the patients moving forward. We
			plan to maintain close relationships with our medical peers abroad throughout the year as part
			of an ongoing partnership.
		</p>
		<div class="feetImages">
			<Img source="Peru2022/Peru22" altText="Happy kid" />
			<Img source="Peru2022/Peru67" altText="Baby's foot" />
			<Img source="Peru2022/Peru40" altText="Baby's foot" />
		</div>
	</div>
</div>

<dialog id="scrubsPartnershipDialog" popover>
	<div class="scrubsPartnershipDialogHeader">
		<Img source="Rise_Logo" altText="Rise Scrubs" />
		<h2>Rise Scrubs Partnership</h2>
	</div>
	<div class="scrubsPartnershipDialogContent">
		<div class="scrubsPartnershipDialogText">
			<p>
				Shop <a href="https://risescrubs.com">risescrubs.com</a> and receive 20% off your order when
				you enter code
				<span>ESSENTIALSTRIDES20</span> at checkout.
			</p>
			<p>
				For every purchase made with this code, Rise Scrubs will donate 5% back to Essential Strides
				Foundation
			</p>
		</div>
		<div class="scrubsPartnershipDialogImage">
			<Img source="PeopleInScrubs" altText="Rise Scrubs" />
		</div>
	</div>
</dialog>

<style lang="scss">
	.heroContainer {
		width: 100%;
		height: 70vw;
		max-height: 75vh;
		background: url('https://res.cloudinary.com/bigbeardeddev/image/upload/f_auto,q_auto/essentialstrides/babyHand')
			50% 50% / cover no-repeat;
		border-bottom: 3px solid var(--secondaryColor);
	}

	.intro {
		display: flex;
		margin: 20px 0 0 0;
		@media (max-width: 910px) {
			flex-direction: column;
		}
	}
	.introText {
		width: 60%;
		margin-right: 20px;
		@media (max-width: 910px) {
			width: 100%;
			margin-right: 0;
		}
	}
	.or {
		width: 40%;
		@media (max-width: 910px) {
			width: 100%;
		}
	}
	h2 {
		text-decoration: underline;
	}
	.feetImages {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}
	.scrubsPartnershipBanner {
		width: 100%;
		border: none;
		background-color: var(--secondaryColor);
		color: var(--navTextColor);
		padding: 10px;
		text-align: center;
		cursor: pointer;
	}
	.scrubsPartnershipBannerText {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.scrubsPartnershipDialogHeader {
		display: grid;
		grid-template-columns: 1fr 4fr 1fr;
		gap: 3rem;
		width: 80%;
		margin: 0 auto 20px;
		h2 {
			text-align: center;
		}
	}
	#scrubsPartnershipDialog {
		opacity: 0;
		scale: 0.5;
		background: var(--secondaryColor);
		color: var(--navTextColor);
		width: calc(100vw - 2rem);
		height: fit-content;
		max-width: 800px;
		border-radius: 1rem;
		padding: 2rem;
		transition: all 0.5s ease-in-out;
		transition-behavior: allow-discrete;
		&::backdrop {
			opacity: 0;
			transition: opacity 0.25s ease-in-out;
			transition-behavior: allow-discrete;
		}
		&:popover-open {
			opacity: 1;
			scale: 1;
			transition: opacity 0.5s ease-in-out;
			transition-behavior: allow-discrete;

			@starting-style {
				opacity: 0;
				scale: 0.5;
			}
			&::backdrop {
				opacity: 1;
				background: oklch(0 0 0 / 0.5);
				transition: opacity 0.25s ease-in-out;
				transition-behavior: allow-discrete;
				@starting-style {
					opacity: 0;
				}
			}
		}
	}

	.scrubsPartnershipDialogContent {
		display: grid;
		grid-template-columns: 3fr 1fr;
	}
</style>
