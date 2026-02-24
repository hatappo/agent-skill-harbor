<script lang="ts">
	import type { SkillEntry } from '$lib/types';
	import GovernanceBadge from './GovernanceBadge.svelte';
	import { base } from '$app/paths';

	interface Props {
		skill: SkillEntry;
	}

	let { skill }: Props = $props();

	let sourceLabel = $derived(skill.source === 'org' ? 'Org' : 'Public');
	let sourceStyle = $derived(
		skill.source === 'org'
			? 'bg-indigo-50 text-indigo-700'
			: 'bg-teal-50 text-teal-700'
	);
</script>

<a
	href="{base}/skills/{skill.slug}/"
	class="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
>
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1">
			<h3 class="truncate text-lg font-semibold text-gray-900">
				{skill.skill.name}
			</h3>
			<p class="mt-1 line-clamp-2 text-sm text-gray-600">
				{skill.skill.description}
			</p>
		</div>
		<div class="flex shrink-0 flex-col items-end gap-1.5">
			<GovernanceBadge status={skill.governance.status} />
			<span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {sourceStyle}">
				{sourceLabel}
			</span>
		</div>
	</div>

	<div class="mt-3 flex items-center gap-4 text-xs text-gray-500">
		<span>{skill.repository.owner}/{skill.repository.name}</span>
		{#if skill.skill.metadata?.author}
			<span>by {skill.skill.metadata.author}</span>
		{/if}
		{#if skill.skill.metadata?.version}
			<span>v{skill.skill.metadata.version}</span>
		{/if}
	</div>
</a>
