<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import SkillList from '$lib/components/SkillList.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';
	import type { FlatCatalog, UsagePolicy, Visibility } from '$lib/types';
	import { createSearchIndex, searchSkills } from '$lib/utils/search';
	import { filterSkills, type FilterState } from '$lib/utils/filter';

	interface Props {
		data: { catalog: FlatCatalog };
	}

	let { data }: Props = $props();
	let allSkills = $derived(data.catalog.skills);
	let searchIndex = $derived(createSearchIndex(allSkills));

	// Client-side state
	let query = $state('');
	let filters = $state<FilterState>({ statuses: [], visibilities: [] });

	// Read initial state from URL on mount
	$effect(() => {
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			query = params.get('q') ?? '';
			filters = {
				statuses: (params.get('status')?.split(',').filter(Boolean) ?? []) as UsagePolicy[],
				visibilities: (params.get('visibility')?.split(',').filter(Boolean) ?? []) as Visibility[]
			};
		}
	});

	// Compute displayed skills
	let displayedSkills = $derived.by(() => {
		let result = query ? searchSkills(searchIndex, query) : allSkills;
		result = filterSkills(result, filters);
		return result;
	});

	function updateUrl(newQuery: string, newFilters: FilterState) {
		if (!browser) return;
		const params = new URLSearchParams();
		if (newQuery) params.set('q', newQuery);
		if (newFilters.statuses.length) params.set('status', newFilters.statuses.join(','));
		if (newFilters.visibilities.length) params.set('visibility', newFilters.visibilities.join(','));
		const search = params.toString();
		goto(`${base}/${search ? '?' + search : ''}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function handleSearch(value: string) {
		query = value;
		updateUrl(value, filters);
	}

	function handleFilterChange(newFilters: FilterState) {
		filters = newFilters;
		updateUrl(query, newFilters);
	}

	let hasFilters = $derived(query !== '' || filters.statuses.length > 0 || filters.visibilities.length > 0);
</script>

<svelte:head>
	<title>Agent Skill Harbor</title>
	<meta name="description" content="Internal agent skill catalog and governance" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Skill Catalog</h1>
		<p class="mt-2 text-gray-600">
			{allSkills.length} skill{allSkills.length !== 1 ? 's' : ''} registered
		</p>
	</div>

	<div class="mb-6 space-y-4">
		<SearchBar value={query} onchange={handleSearch} />
		<FilterPanel {filters} onchange={handleFilterChange} />
	</div>

	{#if hasFilters}
		<p class="mb-4 text-sm text-gray-500">
			Showing {displayedSkills.length} of {allSkills.length} skills
		</p>
	{/if}

	<SkillList skills={displayedSkills} />
</div>
