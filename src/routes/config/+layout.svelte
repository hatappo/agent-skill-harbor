<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { t } from '$lib/i18n';

	let { children } = $props();

	const tabs = [
		{ id: 'overview', href: `${base}/config` },
		{ id: 'harbor', href: `${base}/config/harbor` },
		{ id: 'governance', href: `${base}/config/governance` },
	] as const;
</script>

<svelte:head>
	<title>Config - {$t('header.title')}</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-6">
		<nav class="relative inline-flex w-fit flex-wrap gap-x-1 gap-y-2">
			<span class="absolute bottom-0 left-1 right-1 h-px bg-gray-200 dark:bg-gray-700"></span>
			{#each tabs as tab}
				{@const active = $page.url.pathname === tab.href}
				<a
					href={tab.href}
					class="relative inline-flex min-w-fit items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-sm font-medium transition-colors sm:px-4 {active
						? 'text-blue-600 dark:text-blue-400'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
				>
					{$t(`settings.tabs.${tab.id}`)}
					{#if active}
						<span class="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
					{/if}
				</a>
			{/each}
		</nav>
	</div>

	{@render children()}
</div>
