<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	const delayInterval = 100;

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
			name: 'Past Trips',
			link: '/past-trips',
			order: 2
		},
		{
			name: 'Contact',
			link: '/contact',
			order: 3
		},
		{
			name: 'Donate or Volunteer',
			link: '/donate',
			order: 4
		},
		{
			name: 'Fundraising Events',
			link: '/fundraising-events',
			order: 5
		},
		{
			name: 'Special Thank You',
			link: '/donors',
			order: 6
		}
	];

	export let isOpen = false;
</script>

<button on:click={() => (isOpen = !isOpen)} class={isOpen ? 'navButton close' : 'navButton'}>
	<div class="faIcon">
		{#if isOpen}
			<div class="close">
				<svg viewBox="0 0 315 315" fill="none" xmlns="http://www.w3.org/2000/svg">
					<line
						x1="36.3553"
						y1="39"
						x2="273.943"
						y2="276.588"
						stroke="black"
						stroke-width="50"
						stroke-linecap="round"
						class="icon"
					/>
					<line
						x1="42"
						y1="276.588"
						x2="279.588"
						y2="38.9999"
						stroke="black"
						stroke-width="50"
						stroke-linecap="round"
						class="icon"
					/>
				</svg>
			</div>
		{:else}
			<div class="bars">
				<svg viewBox="0 0 315 315" fill="none" xmlns="http://www.w3.org/2000/svg">
					<line
						x1="31"
						y1="65"
						x2="281"
						y2="65"
						stroke="black"
						stroke-width="50"
						stroke-linecap="round"
						class="icon topLine"
					/>
					<line
						x1="31"
						y1="170"
						x2="281"
						y2="170"
						stroke="black"
						stroke-width="50"
						stroke-linecap="round"
						class="icon middleLine"
					/>
					<line
						x1="31"
						y1="275"
						x2="281"
						y2="275"
						stroke="black"
						stroke-width="50"
						stroke-linecap="round"
						class="icon bottomLine"
					/>
				</svg>
			</div>
		{/if}
	</div>
</button>
{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="navOverlay" transition:fade on:click={() => (isOpen = false)} />
	<div id="navContainer" transition:fly={{ x: 300, duration: 500 }}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<nav on:click={() => (isOpen = false)}>
			<ul>
				{#each navItems as navItem, i}
					<li
						in:fly={{
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
		top: 110px;
		right: 30px;
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
		stroke: var(--navTextColor);
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
		// overflow: scroll;
	}
</style>
