<script context="module">
	export const prerender = true;
</script>

<script>
	import ContactForm from '$components/contactForm.svelte';
</script>

<div class="contentContainer">
	<ContactForm />
</div>

<style>
	.contentContainer {
		min-height: calc(100vh - 100px);
	}
</style>
