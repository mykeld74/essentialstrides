<script>
	import { onMount } from 'svelte';
	import '$css/styles.scss';
	import Img from '$components/image.svelte';
	import Nav from '$components/nav.svelte';
	import ThemeToggle from '$components/themeToggle.svelte';
	const currentYear = new Date().getFullYear();
	let isToggled = false;

	onMount(() => {
		let hasPreference = localStorage.getItem('theme') !== null;
		let themePreference = localStorage.getItem('theme') || 'light';
		const CheckTheme = () => {
			if (hasPreference && themePreference === 'dark') {
				// @ts-ignore
				document.querySelector('body').classList.add('dark');
				isToggled = true;
			} else if (hasPreference && themePreference === 'light') {
				// @ts-ignore
				document.querySelector('body').classList.add('light');
				isToggled = false;
			} else {
				if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
					// @ts-ignore
					document.querySelector('body').classList.add('dark');
					isToggled = true;
				}
			}
		};
		CheckTheme();
	});
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
	<div class="themeToggle"><ThemeToggle {isToggled} /></div>
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
		position: relative;
	}
	.themeToggle {
		position: absolute;
		right: 10px;
		top: 10px;
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
	}
	.copyright {
		font-size: 14px;
		color: var(--fontColor);
	}
</style>
