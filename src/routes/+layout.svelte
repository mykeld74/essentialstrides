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
	<div class="footerBlock">
		<p>19284 Cottonwood Drive</p>
		<p>Suite 201b</p>
		<p>Parker, CO 80138</p>
		<a href="tel:7205159315"><p>720-515-9315</p></a>
		<a href="mailto:contact@essentialstrides.org"><p>contact@essentialstrides.org</p></a>
	</div>
	<div class="footerBlock socialContainer">
		<div class="socialIcon">
			<a
				href="https://www.instagram.com/essentialstrides/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><path
						class="icon"
						d="M15.233 5.488c-.843-.038-1.097-.046-3.233-.046s-2.389.008-3.232.046c-2.17.099-3.181 1.127-3.279 3.279-.039.844-.048 1.097-.048 3.233s.009 2.389.047 3.233c.099 2.148 1.106 3.18 3.279 3.279.843.038 1.097.047 3.233.047 2.137 0 2.39-.008 3.233-.046 2.17-.099 3.18-1.129 3.279-3.279.038-.844.046-1.097.046-3.233s-.008-2.389-.046-3.232c-.099-2.153-1.111-3.182-3.279-3.281zm-3.233 10.62c-2.269 0-4.108-1.839-4.108-4.108 0-2.269 1.84-4.108 4.108-4.108s4.108 1.839 4.108 4.108c0 2.269-1.839 4.108-4.108 4.108zm4.271-7.418c-.53 0-.96-.43-.96-.96s.43-.96.96-.96.96.43.96.96-.43.96-.96.96zm-1.604 3.31c0 1.473-1.194 2.667-2.667 2.667s-2.667-1.194-2.667-2.667c0-1.473 1.194-2.667 2.667-2.667s2.667 1.194 2.667 2.667zm4.333-12h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm.952 15.298c-.132 2.909-1.751 4.521-4.653 4.654-.854.039-1.126.048-3.299.048s-2.444-.009-3.298-.048c-2.908-.133-4.52-1.748-4.654-4.654-.039-.853-.048-1.125-.048-3.298 0-2.172.009-2.445.048-3.298.134-2.908 1.748-4.521 4.654-4.653.854-.04 1.125-.049 3.298-.049s2.445.009 3.299.048c2.908.133 4.523 1.751 4.653 4.653.039.854.048 1.127.048 3.299 0 2.173-.009 2.445-.048 3.298z"
					/>
				</svg>
			</a>
		</div>
		<div class="socialIcon">
			<a
				href="https://www.linkedin.com/company/essential-strides/about/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					><path
						class="icon"
						d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
					/>
				</svg>
			</a>
		</div>
	</div>
	<div class="footerBlock copyrightBlock">
		<p class="copyright">
			&copy; {currentYear} All content and images are property of Essential Strides
		</p>
	</div>
</footer>

<style lang="scss">
	.navContainer {
		width: 100%;
		background: var(--secondaryColor);
	}

	header {
		padding: 20px 0;
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
		max-width: 360px;
		margin: 0 auto;
	}
	footer {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		padding: 20px 0;
		background: var(--primaryColor);
		margin-top: 60px;
		gap: 20px;
		overflow: hidden;
		p {
			font-size: 14px;
		}
	}
	.footerBlock {
		p {
			line-height: 1.3;
			margin: 0;
		}
		a {
			color: var(--fontColor);
			text-decoration: none;
			&:hover {
				text-decoration: underline;
			}
		}
	}
	.copyright {
		color: var(--fontColor);
	}
	.icon {
		fill: var(--fontColor);
	}
	.footerBlock {
		padding: 0 20px;
		&.copyrightBlock {
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}
	.socialIcon {
		width: 40px;
	}
	.socialContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 50px;
	}
</style>
