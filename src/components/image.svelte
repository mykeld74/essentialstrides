<script lang="ts">
	// import { image, initialize } from 'svelte-cloudinary';
	export let source: string;
	export let altText: string;

	// initialize({ cloud_name: 'mykeld74' });

	let src = `https://res.cloudinary.com/bigbeardeddev/image/upload/f_auto,q_auto/essentialstrides/${source}`;
</script>

<!-- <img use:image={{ src, bind: true, lazy: true }} alt={altTag} class={source} /> -->

<img {src} alt={altText} class={source} loading="lazy" />

<style>
	img {
		width: 100%;
	}
</style>
