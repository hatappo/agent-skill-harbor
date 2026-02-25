<script lang="ts">
	import { theme, setTheme, type ThemeMode } from '$lib/stores/theme';
	import { t } from '$lib/i18n';

	const modes: { mode: ThemeMode; labelKey: string }[] = [
		{ mode: 'light', labelKey: 'theme.light' },
		{ mode: 'dark', labelKey: 'theme.dark' },
		{ mode: 'system', labelKey: 'theme.system' }
	];

	let expanded = $state(false);
	let hideTimeout: ReturnType<typeof setTimeout>;

	function show() {
		clearTimeout(hideTimeout);
		expanded = true;
	}

	function hide() {
		hideTimeout = setTimeout(() => {
			expanded = false;
		}, 0);
	}
</script>

<div
	role="group"
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
	class="flex items-center rounded-lg border border-gray-200 bg-gray-100 p-0.5 dark:border-gray-700 dark:bg-gray-800"
>
	{#each modes as { mode, labelKey }}
		<button
			onclick={() => setTheme(mode)}
			class="rounded-md py-1 transition-all duration-200 {$theme === mode
				? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100 px-1.5'
				: expanded
					? 'px-1.5 text-gray-500 opacity-100 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
					: 'max-w-0 overflow-hidden px-0 opacity-0'}"
			title={$t(labelKey)}
			aria-label={$t(labelKey)}
		>
			{#if mode === 'light'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="5" />
					<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
				</svg>
			{:else if mode === 'dark'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			{:else}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
					<path d="M8 21h8M12 17v4" />
				</svg>
			{/if}
		</button>
	{/each}
</div>
