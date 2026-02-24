<script lang="ts">
	import { theme, setTheme, type ThemeMode } from '$lib/stores/theme';

	const modes: { mode: ThemeMode; label: string }[] = [
		{ mode: 'light', label: 'Light' },
		{ mode: 'dark', label: 'Dark' },
		{ mode: 'system', label: 'System' }
	];
</script>

<div class="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-100 p-0.5 dark:border-gray-700 dark:bg-gray-800">
	{#each modes as { mode, label }}
		<button
			onclick={() => setTheme(mode)}
			class="rounded-md px-1.5 py-1 transition-colors {$theme === mode
				? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
				: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			title={label}
			aria-label={label}
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
