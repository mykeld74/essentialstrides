<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import Portal from '$components/portal.svelte';
	export let isOpen = false;
	export let modalName = 'default';
	function openModal() {
		isOpen = true;
	}
	function closeModal() {
		isOpen = false;
		localStorage.setItem(modalName, '1');
	}
</script>

<div on:click={openModal}><slot name="trigger" /></div>

{#if isOpen}
	<Portal>
		<div class="modalWrapper" transition:fade>
			<div class="modalBackground" on:click={closeModal} />
			<div class="modalContent" transition:fly={{ opacity: 0, y: 500 }}>
				<p class="modalHeader"><slot name="header" /></p>
				<div class="modalBody">
					<slot name="content" />
				</div>
				<button class="modalCloseButton" on:click={closeModal}
					><p class="modalCloseText">&times;</p></button
				>
			</div>
		</div>
	</Portal>
{/if}

<style lang="scss">
	:global(.modalWrapper) {
		position: fixed;
		width: 100%;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 500;
	}
	:global(.modalBackground) {
		position: absolute;
		inset: 0;
		background: var(--fontColor);
		opacity: 0.8;
		z-index: 501;

		cursor: pointer;
	}
	:global(.modalContent) {
		position: relative;
		background-color: var(--backgroundColor);
		color: var(--fontColor);
		padding: 20px;
		border-radius: 10px;
		width: 96vw;
		max-width: 960px;
		z-index: 502;
	}
	:global(.modalCloseButton) {
		position: absolute;
		top: -20px;
		right: -20px;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primaryColor);
		color: #fff;
		border: 3px solid var(--fontColor);
		cursor: pointer;
		z-index: 503;
	}
	:global(.modalCloseText) {
		margin: 3px 0 0 0;
		padding: 0;
		font-size: 60px;
		color: var(--fontColor);
	}
</style>
