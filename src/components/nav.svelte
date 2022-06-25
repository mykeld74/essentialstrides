<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	const delayInterval = 50;

	const navItems = [
		{
			name: 'Home',
			link: '/',
			order: 0
		},
		{
			name: 'Meet the Founders',
			link: '/founders',
			order: 1
		},
		{
			name: 'Contact',
			link: '/contact',
			order: 2
		},
		{
			name: 'Donate',
			link: '/donate',
			order: 3
		}
	];

	export let isOpen = false;
</script>

<button on:click={() => (isOpen = !isOpen)} class={isOpen ? 'navButton close' : 'navButton'}>
	<div class="faIcon">
		{#if isOpen}
			<div class="close">
				<svg viewBox="0 0 254 248" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect
						x="41.6116"
						y="0.256348"
						width="300"
						height="50"
						rx="25"
						transform="rotate(45 41.6116 0.256348)"
						class="icon"
					/>
					<rect
						x="0.256348"
						y="212.388"
						width="300"
						height="50"
						rx="25"
						transform="rotate(-45 0.256348 212.388)"
						class="icon"
					/>
				</svg>
			</div>
		{:else}
			<div class="bars">
				<svg viewBox="0 0 300 252" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="300" height="50" rx="25" class="icon" />
					<rect y="101" width="300" height="50" rx="25" class="icon" />
					<rect y="202" width="300" height="50" rx="25" class="icon" />
				</svg>
			</div>
		{/if}
	</div>
</button>
{#if isOpen}
	<div class="navOverlay" transition:fade on:click={() => (isOpen = false)} />
	<div id="navContainer" transition:fly={{ x: 300, duration: 500 }}>
		<nav on:click={() => (isOpen = false)}>
			<ul>
				{#each navItems as navItem, i}
					<li
						transition:fly={{
							x: 100,
							y: 50,
							duration: 200,
							delay: delayInterval * navItem.order
						}}
						class="navItem"
					>
						<a href={navItem.link} class="navItem"
							>{navItem.name}
							<span class="iconContainer">
								<svg viewBox="0 0 450 440" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										class="arrow"
										d="M281.372 9.15117C272.497 -1.42573 256.728 -2.80537 246.151 6.06963C235.574 14.9449 234.195 30.7137 243.07 41.2906L372.047 195H25C11.1929 195 0 206.193 0 220C0 233.807 11.1929 245 25 245H372.008L243.07 398.662C234.195 409.239 235.574 425.008 246.151 433.883C256.728 442.758 272.497 441.378 281.372 430.802L442.069 239.29C443.173 237.975 444.118 236.579 444.906 235.126C448.103 230.926 450 225.685 450 220C450 214.368 448.138 209.171 444.995 204.991C444.189 203.479 443.214 202.027 442.069 200.662L281.372 9.15117Z"
									/>
								</svg>
							</span></a
						>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
{/if}

<style lang="scss">
	.navOverlay {
		position: fixed;
		width: 100vw;
		height: 100vh;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
	}
	#navContainer {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		max-width: 300px;
		background: var(--secondaryColor);
		height: 100vh;
		padding: 85px 0 0 20px;
		z-index: 900;
		a {
			color: var(--navTextColor);
			text-decoration: none;
		}
	}
	.navButton {
		background: var(--secondaryColor);
		color: var(--navTextColor);
		border-radius: 50%;
		border: none;
		font-size: 42px;
		padding: 0;
		width: 60px;
		height: 60px;
		position: absolute;
		top: 72px;
		right: 10px;
		outline: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 902;
		transition: all 0.33s ease-in-out;

		&.close {
			top: 10px;
			right: 260px;
			width: 50px;
			height: 50px;
			border: 2px solid var(--baseColor);
			border-radius: 50%;
		}
	}
	.faIcon {
		margin: 0;
		padding: 0;
		width: 32px;
	}
	.iconContainer {
		width: 16px;
		transition: all 0.33s ease-in-out;
		margin-left: var(--arrowMargin);
		svg {
			width: 100%;
		}
	}
	.arrow,
	.icon {
		fill: var(--navTextColor);
	}

	ul {
		list-style: none;
		margin-left: 0;
		padding-left: 0;
	}
	.navItem {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;

		&:hover {
			--arrowMargin: 30px;
		}
	}

	nav {
		width: 100%;
		height: 100%;
		overflow: scroll;
	}
</style>
