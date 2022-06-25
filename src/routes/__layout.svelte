<script>
	import '$css/styles.scss';
	import Img from '$components/image.svelte';
	import Nav from '$components/nav.svelte';

	//get current year
	const currentYear = new Date().getFullYear();
</script>

<div class="navContainer">
	<Nav />
</div>
<header>
	<a href="/">
		<div class="logoContainer">
			<Img source="esLogo" altText="Essential Strides Logo" />
		</div>
	</a>
</header>
<slot />
<footer>
	<p class="copyright">
		&copy; {currentYear} All content and images are property of Essential Strides
	</p>
</footer>

<style lang="scss">
	.navContainer {
		width: 100%;
		background: var(--secondaryColor);
	}

	header {
		padding: 10px 0;
		border-bottom: 3px solid var(--secondaryColor);
	}
	.logoContainer {
		width: calc(100% - 40px);
		max-width: 300px;
		margin: 0 auto;
	}
	footer {
		padding: 20px;
		text-align: right;
		background: var(--primaryColor);
		color: #333;
	}
	.copyright {
		margin: 0 0 20px 0;
		font-size: 14px;
	}
</style>
