<script>
	export let isToggled = false;
	const toggle = () => {
		const body = document.querySelector('body');
		// @ts-ignore
		const classes = body.classList;

		if (classes.contains('dark')) {
			localStorage.setItem('theme', 'light');
			classes.remove('dark');
			classes.add('light');
			isToggled = false;
		} else {
			classes.remove('light');
			classes.add('dark');
			localStorage.setItem('theme', 'dark');
			isToggled = true;
		}
	};
</script>

<button on:click={toggle} class={isToggled ? 'themeToggle' : 'themeToggle dark'} />

<style lang="scss">
	button {
		--width: 40px;
		--height: calc(var(--width) / 2);
		--radius: calc(var(--height) / 2);
		display: flex;
		position: relative;
		width: var(--width);
		height: var(--height);
		border-radius: var(--radius);
		border: 1px inset var(--backgroundColor);
		background-color: var(--fontColor);
		transition: background-color 0.3s ease-in-out;
		margin-left: 20px;
		&:after {
			content: '';
			position: absolute;
			top: -2px;
			left: -1px;
			width: var(--height);
			height: var(--height);
			border-radius: var(--radius);
			border: 1px inset var(--fontColor);
			background-color: var(--backgroundColor);
			box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
			transition: all 0.3s ease-in-out;
		}
		&.dark::after {
			transform: translate3d(100%, 0, 0);
		}
	}
</style>
