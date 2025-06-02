<script>
	import Image from '$components/image.svelte';
</script>

<div class="contentContainer">
	<h1>
		We would like to extend a special thank you to all of our donors! Our success wouldn’t be
		posisble without the generosity of these organizations and individuals.
	</h1>

	<div class="donorLogoContainer">
		<div class="donorContainer">
			<div class="logoContainer">
				<Image source="HemaClear" altText="Hemaclear Logo" />
			</div>
			<!-- <p class="donorName">Hemaclear</p> -->
		</div>
		<div class="donorContainer">
			<div class="logoContainer">
				<Image source="Turner" altText="Turner Imaging" />
			</div>
			<!-- <p class="donorName">Turner Imaging</p> -->
		</div>
		<div class="donorContainer">
			<div class="donor">
				<div class="logoContainer">
					<Image source="OrthoSolutions" altText="OrthoSolutions Logo" />
				</div>
				<!-- <p class="donorName">OrthoSolutions</p> -->
			</div>
		</div>
		<div class="donorContainer">
			<div class="donor">
				<div class="logoContainer">
					<Image source="Ossio" altText="Ossio Logo" />
				</div>
				<!-- <p class="donorName">Ossio</p> -->
			</div>
		</div>
		<div class="donorContainer">
			<div class="donor">
				<div class="logoContainer">
					<Image source="Occ" altText="Occ Logo" />
				</div>
				<!-- <p class="donorName">Occ Surgery Center</p> -->
			</div>
		</div>
		<div class="donorContainer">
			<div class="donor">
				<div class="logoContainer">
					<Image source="SmithAndNephew" altText="Smith And Nephew Logo" />
				</div>
				<!-- <p class="donorName">Smith & Nephew</p> -->
			</div>
		</div>
		<div class="donorContainer">
			<div class="donor">
				<div class="logoContainer riseLogo">
					<Image source="RiseLogo" altText="Rise Scrubs Logo" />
				</div>
				<!-- <p class="donorName">Smith & Nephew</p> -->
			</div>
		</div>
	</div>
	<ul class="donorContainer">
		<li>CFAS: Colorado Foot and Ankle Society</li>
		<li>Micheal Atterbury</li>
	</ul>
</div>

<style lang="scss">
	.contentContainer {
		min-height: calc(100vh - 100px);
	}
	h1 {
		margin-top: 30px;
	}

	.donorLogoContainer {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-gap: 20px;
		align-items: center;
		background: #fff;
		padding: 20px;
	}
	// .riseLogo {
	// 	width: 250px;
	// 	height: auto;
	// 	object-fit: contain;
	// }
</style>
