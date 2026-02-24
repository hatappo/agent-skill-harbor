<script lang="ts">
	import type { UsagePolicy, Visibility } from '$lib/types';
	import type { FilterState } from '$lib/utils/filter';

	interface Props {
		filters: FilterState;
		onchange: (filters: FilterState) => void;
	}

	let { filters, onchange }: Props = $props();

	const policyOptions: { value: UsagePolicy; label: string; color: string }[] = [
		{ value: 'required', label: 'Required', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' },
		{ value: 'recommended', label: 'Recommended', color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' },
		{ value: 'discouraged', label: 'Discouraged', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700' },
		{ value: 'prohibited', label: 'Prohibited', color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' },
		{ value: 'none', label: 'Unclassified', color: 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600' }
	];

	const visibilityOptions: { value: Visibility; label: string }[] = [
		{ value: 'public', label: 'Public' },
		{ value: 'private', label: 'Private' },
		{ value: 'internal', label: 'Internal' }
	];

	function toggleStatus(status: UsagePolicy) {
		const statuses = filters.statuses.includes(status)
			? filters.statuses.filter((s) => s !== status)
			: [...filters.statuses, status];
		onchange({ ...filters, statuses });
	}

	function toggleVisibility(visibility: Visibility) {
		const visibilities = filters.visibilities.includes(visibility)
			? filters.visibilities.filter((v) => v !== visibility)
			: [...filters.visibilities, visibility];
		onchange({ ...filters, visibilities });
	}

	let hasActiveFilters = $derived(filters.statuses.length > 0 || filters.visibilities.length > 0);

	function clearAll() {
		onchange({ statuses: [], visibilities: [] });
	}
</script>

<div class="flex flex-wrap items-center gap-3">
	<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>

	<!-- Usage policy filters -->
	{#each policyOptions as opt}
		<button
			onclick={() => toggleStatus(opt.value)}
			class="rounded-full border px-3 py-1 text-xs font-medium transition-colors {filters.statuses.includes(opt.value)
				? opt.color + ' ring-1 ring-offset-1 dark:ring-offset-gray-950'
				: 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}"
		>
			{opt.label}
		</button>
	{/each}

	<span class="mx-1 text-gray-300 dark:text-gray-600">|</span>

	<!-- Visibility filters -->
	{#each visibilityOptions as opt}
		<button
			onclick={() => toggleVisibility(opt.value)}
			class="rounded-full border px-3 py-1 text-xs font-medium transition-colors {filters.visibilities.includes(opt.value)
				? 'border-indigo-300 bg-indigo-100 text-indigo-800 ring-1 ring-offset-1 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-offset-gray-950'
				: 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}"
		>
			{opt.label}
		</button>
	{/each}

	{#if hasActiveFilters}
		<button
			onclick={clearAll}
			class="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			Clear all
		</button>
	{/if}
</div>
