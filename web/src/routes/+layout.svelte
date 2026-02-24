<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initTheme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		initTheme();
	});
</script>

<div class="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
