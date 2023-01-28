<script lang="ts">
	import { onMount } from 'svelte';
</script>

<svelte:head>
	<title>Donations | Essential Strides</title>
</svelte:head>

<div class="contentContainer">
	<h1>Donate Today</h1>
	<p>You can donate to Essential Strides through PayPal using the button below:</p>
	<div class="donateContainer">
		<form class="donateForm" action="https://www.paypal.com/donate" method="post" target="_top">
			<input type="hidden" name="hosted_button_id" value="8BAWSDN2LS4FL" />
			<input
				type="image"
				src="https://res.cloudinary.com/bigbeardeddev/image/upload/v1674927958/essentialstrides/donateButton.png"
				name="submit"
				title="PayPal - The safer, easier way to pay online!"
				alt="Donate with PayPal button"
			/>
			<img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
		</form>
	</div>

	<p>Or if you prefer you can mail checks to:</p>
	<p>19284 Cottonwood Drive <br />Suite 201B<br />Parker, CO 80138</p>

	<h2>Where your donations go:</h2>
	<p>
		As a volunteer medical mission group, we are responsible for purchasing all the required
		surgical tools and postoperative supplies, such as antibiotics, walking aids, and bandage
		supplies the patients may need afterward. We also would like to like make a lasting contribution
		to the hosting clinics in Moyobamba by providing equipment and renovations they require such as:
		repairing x-ray equipment, repairing anesthesia machines, and providing more patient beds.
		Additionally, we plan on providing wages to local Peruvian workers aiding our mission.
		Therefore, any donations would be applied to these costs and necessary supplies to make our trip
		successful. We are passionate about this project and greatly thank you for your generosity.
	</p>

	<p>We are an established 501(c)(3) organization and can provide receipts for your records.</p>
	<hr />
	<h2>Volunteer</h2>
	<p>
		We accept volunteers to help with everything from fundraising efforts, supply collection, and
		providing medical care during our trips. We have a team of surgeons, anesthesiologist and
		nursing staff on each international trip. If you are interesting in volunteering with Essential
		Strides, please contact us at <a class="emailLink" href="mailto:contact@essentialstrides.org"
			>contact@essentialstrides.org</a
		> to apply today!
	</p>
</div>

<style lang="scss">
	.contentContainer {
		min-height: calc(100vh - 100px);
	}
	h1 {
		margin-top: 30px;
		text-decoration: underline;
	}
	h2 {
		text-decoration: underline;
	}
	.donateContainer {
		width: calc(100% - 40px);
		display: flex;
		justify-content: center;
	}
	.donateForm {
		width: 100%;
		max-width: 300px;
		input {
			width: 100%;
		}
	}
	.emailLink {
		color: var(--secondaryColor);
	}
</style>
