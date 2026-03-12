<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import TrendChart from '$lib/components/TrendChart.svelte';
	import ViewTabs from '$lib/components/ViewTabs.svelte';
	import GovernanceBadge from '$lib/components/GovernanceBadge.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { CollectionEntry, FlatSkillEntry, RepoInfo, UsagePolicy } from '$lib/types';
	import { t } from '$lib/i18n';

	interface Props {
		data: {
			skills: FlatSkillEntry[];
			repos: RepoInfo[];
			collections: CollectionEntry[];
		};
	}

	let { data }: Props = $props();

	// Filters
	let ownerFilterValue = $state('__all__');
	let visibilityFilterValue = $state('__all__');

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const owner = params.get('owner');
		if (owner === 'org') ownerFilterValue = 'org';
		else if (owner === 'community') ownerFilterValue = 'community';
		else ownerFilterValue = '__all__';
		const vis = params.get('visibility');
		if (vis === 'public' || vis === 'private' || vis === 'internal') visibilityFilterValue = vis;
	});

	function updateUrl() {
		if (!browser) return;
		const params = new URLSearchParams();
		if (ownerFilterValue === 'org') params.set('owner', 'org');
		else if (ownerFilterValue === 'community') params.set('owner', 'community');
		if (visibilityFilterValue !== '__all__') params.set('visibility', visibilityFilterValue);
		const search = params.toString();
		const pathname = window.location.pathname;
		goto(`${pathname}${search ? '?' + search : ''}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function onOwnerFilterChange(value: string | undefined) {
		ownerFilterValue = value ?? '__all__';
		updateUrl();
	}

	function onVisibilityFilterChange(value: string | undefined) {
		visibilityFilterValue = value ?? '__all__';
		updateUrl();
	}

	let ownerFilter = $derived(ownerFilterValue !== '__all__' ? ownerFilterValue : null);
	let visibilityFilter = $derived(visibilityFilterValue !== '__all__' ? visibilityFilterValue : null);
	let isFiltered = $derived(ownerFilter !== null || visibilityFilter !== null);

	// Filtered data
	let filteredSkills = $derived.by(() => {
		let result = data.skills;
		if (ownerFilter) {
			result = result.filter((s) => (ownerFilter === 'org' ? s.isOrgOwned : !s.isOrgOwned));
		}
		if (visibilityFilter) {
			result = result.filter((s) => s.visibility === visibilityFilter);
		}
		return result;
	});

	let filteredRepos = $derived.by(() => {
		let result = data.repos;
		if (ownerFilter) {
			result = result.filter((r) => (ownerFilter === 'org' ? r.isOrgOwned : !r.isOrgOwned));
		}
		if (visibilityFilter) {
			result = result.filter((r) => r.visibility === visibilityFilter);
		}
		return result;
	});

	let latest = $derived(data.collections[0] ?? null);
	let previous = $derived(data.collections[1] ?? null);

	// KPI values
	let totalSkills = $derived(filteredSkills.length);
	let totalRepos = $derived(filteredRepos.length);
	let totalFiles = $derived(!isFiltered ? (latest?.files.collected ?? 0) : filteredSkills.reduce((sum, s) => sum + s.files.length, 0));
	let reposWithSkills = $derived(filteredRepos.filter((r) => r.skillCount > 0).length);
	let skillChange = $derived(!isFiltered && previous ? totalSkills - previous.skills.total : undefined);
	let repoChange = $derived(!isFiltered && previous ? totalRepos - previous.repos.total : undefined);

	let lastCollectedFormatted = $derived.by(() => {
		if (!latest) return '—';
		const d = new Date(latest.collected_at);
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
	});

	// Trend chart data (oldest first) — only shown when unfiltered
	let trendData = $derived.by(() => {
		if (isFiltered) return [];
		const reversed = [...data.collections].reverse();
		return reversed.map((c) => {
			const d = new Date(c.collected_at);
			return {
				label: `${d.getMonth() + 1}/${d.getDate()}`,
				value: c.skills.total,
			};
		});
	});

	// Breakdown
	let statusBreakdown = $derived.by(() => {
		const counts: Record<string, number> = { recommended: 0, discouraged: 0, prohibited: 0, none: 0 };
		for (const s of filteredSkills) {
			counts[s.usage_policy] = (counts[s.usage_policy] ?? 0) + 1;
		}
		return counts;
	});

	let visibilityBreakdown = $derived.by(() => {
		const counts: Record<string, number> = { public: 0, private: 0, internal: 0 };
		for (const s of filteredSkills) {
			counts[s.visibility] = (counts[s.visibility] ?? 0) + 1;
		}
		return counts;
	});

	let ownershipBreakdown = $derived.by(() => {
		let org = 0;
		let community = 0;
		for (const s of filteredSkills) {
			if (s.isOrgOwned) org++;
			else community++;
		}
		return { org, community };
	});

	let historyExpanded = $state(false);
	let displayedHistory = $derived(historyExpanded ? data.collections : data.collections.slice(0, 10));

	function formatDate(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}
</script>

<svelte:head>
	<title>{dev ? '(Dev) ' : ''}{$t('stats.pageTitle')}</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-6">
		<ViewTabs activeView="stats" />
	</div>

	<div class="mb-6 flex items-center gap-3">
		<span class="text-sm font-medium text-gray-700 dark:text-gray-300">{$t('filter.label')}</span>

		<!-- Owner select -->
		<Select.Root type="single" value={ownerFilterValue} onValueChange={onOwnerFilterChange}>
			<Select.Trigger
				size="sm"
				class="h-7 rounded-full border px-3 py-1 text-xs font-medium shadow-none {ownerFilter
					? 'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
					: 'border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'}"
			>
				{ownerFilter
					? $t(`common.orgOwnership.${ownerFilter}`)
					: $t('filter.allOwner')}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="__all__" label={$t('filter.all')} />
				<Select.Item value="org" label={$t('common.orgOwnership.org')} />
				<Select.Item value="community" label={$t('common.orgOwnership.community')} />
			</Select.Content>
		</Select.Root>

		<!-- Visibility select -->
		<Select.Root type="single" value={visibilityFilterValue} onValueChange={onVisibilityFilterChange}>
			<Select.Trigger
				size="sm"
				class="h-7 rounded-full border px-3 py-1 text-xs font-medium shadow-none {visibilityFilter
					? 'border-indigo-300 bg-indigo-100 text-indigo-800 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
					: 'border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'}"
			>
				{visibilityFilter
					? $t(`common.visibility.${visibilityFilter}`)
					: $t('filter.allVisibility')}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="__all__" label={$t('filter.all')} />
				<Select.Item value="public" label={$t('common.visibility.public')} />
				<Select.Item value="private" label={$t('common.visibility.private')} />
				<Select.Item value="internal" label={$t('common.visibility.internal')} />
			</Select.Content>
		</Select.Root>
	</div>

	<!-- KPI Cards -->
	<div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
		<StatCard label={$t('stats.totalSkills')} value={totalSkills} change={skillChange} />
		<StatCard
			label={$t('stats.totalRepos')}
			value={totalRepos}
			change={repoChange}
			sub={$t('stats.reposWithSkills', { count: reposWithSkills })}
		/>
		<StatCard label={$t('stats.totalFiles')} value={totalFiles.toLocaleString()} />
		<StatCard label={$t('stats.lastCollected')} value={lastCollectedFormatted} />
	</div>

	<!-- Trend Chart -->
	{#if trendData.length > 0}
		<div class="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<h2 class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">{$t('stats.skillTrend')}</h2>
			<TrendChart data={trendData} />
		</div>
	{/if}

	<!-- Breakdown -->
	<div class="mb-8 grid gap-4 sm:grid-cols-3">
		<!-- By Status -->
		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<h3 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">{$t('stats.byStatus')}</h3>
			<dl class="space-y-2">
				{#each Object.entries(statusBreakdown) as [status, count]}
					<div class="flex items-center justify-between">
						<GovernanceBadge status={status as UsagePolicy} />
						<span class="tabular-nums text-sm font-medium text-gray-900 dark:text-gray-100">{count}</span>
					</div>
				{/each}
			</dl>
		</div>

		<!-- By Visibility -->
		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<h3 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">{$t('stats.byVisibility')}</h3>
			<dl class="space-y-2">
				{#each Object.entries(visibilityBreakdown) as [vis, count]}
					{@const style =
						vis === 'public'
							? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
							: vis === 'internal'
								? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
								: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'}
					<div class="flex items-center justify-between">
						<span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {style}">
							{$t(`common.visibility.${vis}`)}
						</span>
						<span class="tabular-nums text-sm font-medium text-gray-900 dark:text-gray-100">{count}</span>
					</div>
				{/each}
			</dl>
		</div>

		<!-- By Ownership -->
		<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
			<h3 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">{$t('stats.byOwnership')}</h3>
			<dl class="space-y-2">
				<div class="flex items-center justify-between">
					<span
						class="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
					>
						{$t('common.orgOwnership.org')}
					</span>
					<span class="tabular-nums text-sm font-medium text-gray-900 dark:text-gray-100">
						{ownershipBreakdown.org}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span
						class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
					>
						{$t('common.orgOwnership.community')}
					</span>
					<span class="tabular-nums text-sm font-medium text-gray-900 dark:text-gray-100">
						{ownershipBreakdown.community}
					</span>
				</div>
			</dl>
		</div>
	</div>

	<!-- Collection History Table -->
	<div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
		<div class="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
			<h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">{$t('stats.collectHistory')}</h2>
		</div>
		{#if data.collections.length === 0}
			<div class="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
				{$t('stats.noHistory')}
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-800/50">
						<tr>
							<th
								class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
							>
								{$t('stats.date')}
							</th>
							<th
								class="hidden px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell"
							>
								{$t('stats.repos')}
							</th>
							<th
								class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
							>
								{$t('stats.skills')}
							</th>
							<th
								class="hidden px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell"
							>
								{$t('stats.files')}
							</th>
							<th
								class="hidden px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell"
							>
								{$t('stats.duration')}
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
						{#each displayedHistory as entry, i (entry.collected_at)}
							{@const prev = data.collections[i + 1]}
							{@const skillDiff = prev ? entry.skills.total - prev.skills.total : 0}
							<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
								<td class="whitespace-nowrap px-5 py-3 text-sm text-gray-900 dark:text-gray-100">
									{formatDate(entry.collected_at)}
								</td>
								<td
									class="hidden whitespace-nowrap px-5 py-3 text-right tabular-nums text-sm text-gray-500 dark:text-gray-400 sm:table-cell"
								>
									{entry.repos.total}
								</td>
								<td class="whitespace-nowrap px-5 py-3 text-right text-sm">
									<span class="tabular-nums font-medium text-gray-900 dark:text-gray-100">
										{entry.skills.total}
									</span>
									{#if skillDiff !== 0}
										<span
											class="ml-1 text-xs {skillDiff > 0
												? 'text-emerald-600 dark:text-emerald-400'
												: 'text-red-600 dark:text-red-400'}"
										>
											{skillDiff > 0 ? '+' : ''}{skillDiff}
										</span>
									{/if}
								</td>
								<td
									class="hidden whitespace-nowrap px-5 py-3 text-right tabular-nums text-sm text-gray-500 dark:text-gray-400 md:table-cell"
								>
									{entry.files.collected}
								</td>
								<td
									class="hidden whitespace-nowrap px-5 py-3 text-right tabular-nums text-sm text-gray-500 dark:text-gray-400 md:table-cell"
								>
									{entry.duration_sec}s
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if data.collections.length > 10}
				<div class="border-t border-gray-200 px-5 py-3 text-center dark:border-gray-700">
					<button
						onclick={() => (historyExpanded = !historyExpanded)}
						class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
					>
						{historyExpanded ? 'Show less' : `Show all (${data.collections.length})`}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>
