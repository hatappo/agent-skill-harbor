<script lang="ts">
	import { base } from '$app/paths';
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<header class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
		<a href="{base}/" class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
			Agent Skill Harbor
		</a>
		<nav class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
			<a href="{base}/" class="hover:text-gray-900 dark:hover:text-gray-200">Catalog</a>
			<ThemeToggle />
		</nav>
	</div>
</header>
