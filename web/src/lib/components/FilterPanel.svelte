<script lang="ts">
	import type { UsagePolicy, Visibility } from '$lib/types';
	import type { FilterState, OrgOwnership } from '$lib/utils/filter';
	import { t } from '$lib/i18n';
	import * as Tooltip from '$lib/components/ui/tooltip';

	interface Props {
		filters: FilterState;
		onchange: (filters: FilterState) => void;
	}

	let { filters, onchange }: Props = $props();

	const policyOptions: { value: UsagePolicy; labelKey: string; tooltipKey: string; color: string }[] = [
		{ value: 'recommended', labelKey: 'governance.recommended', tooltipKey: 'governance.recommendedTip', color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' },
		{ value: 'discouraged', labelKey: 'governance.discouraged', tooltipKey: 'governance.discouragedTip', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700' },
		{ value: 'prohibited', labelKey: 'governance.prohibited', tooltipKey: 'governance.prohibitedTip', color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' },
		{ value: 'none', labelKey: 'governance.unclassified', tooltipKey: 'governance.unclassifiedTip', color: 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600' }
	];

	const visibilityOptions: { value: Visibility; labelKey: string; tooltipKey: string }[] = [
		{ value: 'public', labelKey: 'common.visibility.public', tooltipKey: 'common.visibility.publicTip' },
		{ value: 'private', labelKey: 'common.visibility.private', tooltipKey: 'common.visibility.privateTip' },
		{ value: 'internal', labelKey: 'common.visibility.internal', tooltipKey: 'common.visibility.internalTip' }
	];

	const orgOwnershipOptions: { value: OrgOwnership; labelKey: string; tooltipKey: string }[] = [
		{ value: 'org', labelKey: 'common.orgOwnership.org', tooltipKey: 'common.orgOwnership.orgTip' },
		{ value: 'community', labelKey: 'common.orgOwnership.community', tooltipKey: 'common.orgOwnership.communityTip' }
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

	function toggleOrgOwnership(ownership: OrgOwnership) {
		const orgOwnerships = filters.orgOwnerships.includes(ownership)
			? filters.orgOwnerships.filter((o) => o !== ownership)
			: [...filters.orgOwnerships, ownership];
		onchange({ ...filters, orgOwnerships });
	}

	let hasActiveFilters = $derived(filters.statuses.length > 0 || filters.visibilities.length > 0 || filters.orgOwnerships.length > 0);

	function clearAll() {
		onchange({ statuses: [], visibilities: [], orgOwnerships: [] });
	}
</script>

<div class="flex flex-wrap items-center gap-3">
	<span class="text-sm font-medium text-gray-700 dark:text-gray-300">{$t('filter.label')}</span>

	<!-- Usage policy filters -->
	{#each policyOptions as opt}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						onclick={() => toggleStatus(opt.value)}
						class="rounded-full border px-3 py-1 text-xs font-medium transition-colors {filters.statuses.includes(opt.value)
							? opt.color + ' ring-1 ring-offset-1 dark:ring-offset-gray-950'
							: 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}"
					>
						{$t(opt.labelKey)}
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>{$t(opt.tooltipKey)}</Tooltip.Content>
		</Tooltip.Root>
	{/each}

	<span class="mx-1 text-gray-300 dark:text-gray-600">|</span>

	<!-- Visibility filters -->
	{#each visibilityOptions as opt}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						onclick={() => toggleVisibility(opt.value)}
						class="rounded-full border px-3 py-1 text-xs font-medium transition-colors {filters.visibilities.includes(opt.value)
							? 'border-indigo-300 bg-indigo-100 text-indigo-800 ring-1 ring-offset-1 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-offset-gray-950'
							: 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}"
					>
						{$t(opt.labelKey)}
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>{$t(opt.tooltipKey)}</Tooltip.Content>
		</Tooltip.Root>
	{/each}

	<span class="mx-1 text-gray-300 dark:text-gray-600">|</span>

	<!-- Org ownership filters -->
	{#each orgOwnershipOptions as opt}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						onclick={() => toggleOrgOwnership(opt.value)}
						class="rounded-full border px-3 py-1 text-xs font-medium transition-colors {filters.orgOwnerships.includes(opt.value)
							? 'border-blue-300 bg-blue-100 text-blue-800 ring-1 ring-offset-1 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-offset-gray-950'
							: 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}"
					>
						{$t(opt.labelKey)}
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>{$t(opt.tooltipKey)}</Tooltip.Content>
		</Tooltip.Root>
	{/each}

	{#if hasActiveFilters}
		<button
			onclick={clearAll}
			class="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			{$t('filter.clearAll')}
		</button>
	{/if}
</div>
