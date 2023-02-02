<script>
	import Img from '$components/image.svelte';
</script>

<svelte:head>
	<title>Essential Strides</title>
</svelte:head>

<div class="heroContainer" />

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
			<Img source="Peru2022/Peru07" altText="Happy kid" />
			<Img source="Peru2022/Peru67" altText="Baby's foot" />
			<Img source="Peru2022/Peru40" altText="Baby's foot" />
		</div>
	</div>
</div>

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
</style>
