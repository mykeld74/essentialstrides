<script context="module">
	export const prerender = true;
</script>

<script>
	import ContactForm from '$components/contactForm.svelte';
</script>

<svelte:head><title>Contact Us | Essential Strides</title></svelte:head>

<div class="contentContainer">
	<h1>Please complete the form below and we will get back to you soon.</h1>
	<ContactForm />
</div>

<style>
	.contentContainer {
		min-height: calc(100vh - 100px);
	}
</style>
