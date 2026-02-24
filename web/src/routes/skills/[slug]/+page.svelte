<script lang="ts">
	import GovernanceBadge from '$lib/components/GovernanceBadge.svelte';
	import type { SkillEntry } from '$lib/types';
	import { base } from '$app/paths';

	interface Props {
		data: { skill: SkillEntry };
	}

	let { data }: Props = $props();
	let skill = $derived(data.skill);
</script>

<svelte:head>
	<title>{skill.skill.name} - Skill Warehouse</title>
	<meta name="description" content={skill.skill.description} />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm text-gray-500">
		<a href="{base}/" class="hover:text-gray-700">Catalog</a>
		<span class="mx-2">/</span>
		<span class="text-gray-900">{skill.skill.name}</span>
	</nav>

	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-start justify-between gap-4">
			<h1 class="text-3xl font-bold text-gray-900">{skill.skill.name}</h1>
			<GovernanceBadge status={skill.governance.status} />
		</div>
		<p class="mt-3 text-lg text-gray-600">{skill.skill.description}</p>
	</div>

	<!-- Info Grid -->
	<div class="mb-8 grid gap-6 sm:grid-cols-2">
		<!-- Repository -->
		<div class="rounded-lg border border-gray-200 bg-white p-5">
			<h2 class="mb-3 text-sm font-medium text-gray-500">Repository</h2>
			<a
				href={skill.repository.url}
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-600 hover:text-blue-800 hover:underline"
			>
				{skill.repository.owner}/{skill.repository.name}
			</a>
			<p class="mt-1 text-sm text-gray-500">Branch: {skill.repository.default_branch}</p>
		</div>

		<!-- Metadata -->
		<div class="rounded-lg border border-gray-200 bg-white p-5">
			<h2 class="mb-3 text-sm font-medium text-gray-500">Details</h2>
			<dl class="space-y-1.5 text-sm">
				<div class="flex gap-2">
					<dt class="text-gray-500">Source:</dt>
					<dd class="font-medium text-gray-900">{skill.source === 'org' ? 'Organization' : 'Public'}</dd>
				</div>
				{#if skill.skill.metadata?.author}
					<div class="flex gap-2">
						<dt class="text-gray-500">Author:</dt>
						<dd class="font-medium text-gray-900">{skill.skill.metadata.author}</dd>
					</div>
				{/if}
				{#if skill.skill.metadata?.version}
					<div class="flex gap-2">
						<dt class="text-gray-500">Version:</dt>
						<dd class="font-medium text-gray-900">{skill.skill.metadata.version}</dd>
					</div>
				{/if}
				<div class="flex gap-2">
					<dt class="text-gray-500">Collected:</dt>
					<dd class="font-medium text-gray-900">{new Date(skill.collected_at).toLocaleDateString('ja-JP')}</dd>
				</div>
			</dl>
		</div>
	</div>

	<!-- Governance -->
	{#if skill.governance.note}
		<div class="mb-8 rounded-lg border border-gray-200 bg-white p-5">
			<h2 class="mb-3 text-sm font-medium text-gray-500">Governance</h2>
			<div class="flex items-start gap-3">
				<GovernanceBadge status={skill.governance.status} />
				<p class="text-sm text-gray-700">{skill.governance.note}</p>
			</div>
		</div>
	{/if}

	<!-- Instructions Preview -->
	{#if skill.instructions_preview}
		<div class="mb-8 rounded-lg border border-gray-200 bg-white p-5">
			<h2 class="mb-3 text-sm font-medium text-gray-500">Instructions Preview</h2>
			<pre class="whitespace-pre-wrap text-sm text-gray-700">{skill.instructions_preview}</pre>
		</div>
	{/if}

	<!-- Files -->
	{#if skill.files.length > 0}
		<div class="rounded-lg border border-gray-200 bg-white p-5">
			<h2 class="mb-3 text-sm font-medium text-gray-500">Files</h2>
			<ul class="space-y-1">
				{#each skill.files as file}
					<li class="text-sm font-mono text-gray-700">{file}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
