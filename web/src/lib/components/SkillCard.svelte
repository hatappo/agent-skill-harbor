<script lang="ts">
	import type { FlatSkillEntry, UsagePolicy } from '$lib/types';
	import GovernanceBadge from './GovernanceBadge.svelte';
	import { base } from '$app/paths';

	interface Props {
		skill: FlatSkillEntry;
	}

	let { skill }: Props = $props();

	let visibilityStyle = $derived(
		skill.visibility === 'public'
			? 'bg-teal-50 text-teal-700'
			: skill.visibility === 'internal'
				? 'bg-amber-50 text-amber-700'
				: 'bg-indigo-50 text-indigo-700'
	);

	let skillName = $derived(String(skill.frontmatter.name ?? skill.repo));
	let skillDescription = $derived(String(skill.frontmatter.description ?? ''));
	let metadata = $derived((skill.frontmatter.metadata ?? {}) as Record<string, unknown>);

</script>

<a
	href="{base}/skills/{skill.key}/"
	class="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
>
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1">
			<h3 class="truncate text-lg font-semibold text-gray-900">
				{skillName}
			</h3>
			<p class="mt-1 line-clamp-4 text-sm text-gray-600">
				{skillDescription}
			</p>
		</div>
		<div class="flex shrink-0 flex-col items-end gap-1.5">
			<GovernanceBadge status={skill.usagePolicy as UsagePolicy} />
			<span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {visibilityStyle}">
				{skill.visibility}
			</span>
		</div>
	</div>

	<div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
		<span class="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600">
			{skill.platform}
		</span>
		<span>{skill.owner}</span>
		<span>{skill.owner}/{skill.repo}</span>
		{#if metadata.author}
			<span>by {metadata.author}</span>
		{/if}
		{#if metadata.version}
			<span>v{metadata.version}</span>
		{/if}
	</div>
</a>
