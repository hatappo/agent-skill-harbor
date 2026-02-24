<script lang="ts">
	import GovernanceBadge from '$lib/components/GovernanceBadge.svelte';
	import type { FlatSkillEntry, UsagePolicy } from '$lib/types';
	import { base } from '$app/paths';

	interface Props {
		data: { skill: FlatSkillEntry };
	}

	let { data }: Props = $props();
	let skill = $derived(data.skill);

	let skillName = $derived(String(skill.frontmatter.name ?? skill.repo));
	let skillDescription = $derived(String(skill.frontmatter.description ?? ''));
	let repoUrl = $derived(`https://${skill.repoKey}`);
	let skillFileUrl = $derived(
		skill.skillPath === 'SKILL.md'
			? `https://${skill.repoKey}/blob/HEAD/SKILL.md`
			: `https://${skill.repoKey}/tree/HEAD/${skill.skillPath.replace(/\/SKILL\.md$/, '')}`
	);
	let metadata = $derived((skill.frontmatter.metadata ?? {}) as Record<string, unknown>);
	let excerpt = $derived(
		skill.frontmatter._excerpt ? String(skill.frontmatter._excerpt) : ''
	);
	let fromHistory = $derived(
		Array.isArray(skill.frontmatter._from) ? skill.frontmatter._from.map(String) : []
	);
</script>

<svelte:head>
	<title>{skillName} - Agent Skill Harbor</title>
	<meta name="description" content={skillDescription} />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Breadcrumb -->
	<nav class="mb-6 text-sm text-gray-500 dark:text-gray-400">
		<a href="{base}/" class="hover:text-gray-700 dark:hover:text-gray-200">Catalog</a>
		<span class="mx-2">/</span>
		<span class="text-gray-900 dark:text-gray-100">{skillName}</span>
	</nav>

	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-start justify-between gap-4">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{skillName}</h1>
			<GovernanceBadge status={skill.usagePolicy as UsagePolicy} />
		</div>
		<p class="mt-3 text-lg text-gray-600 dark:text-gray-400">{skillDescription}</p>
		<div class="mt-4 flex flex-wrap items-center gap-3">
			<a
				href={repoUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
			>
				<svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
					<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
				</svg>
				View Repository
			</a>
			<a
				href={skillFileUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
					<path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
				</svg>
				View SKILL.md
			</a>
		</div>
	</div>

	<!-- Info Grid -->
	<div class="mb-8 grid gap-6 sm:grid-cols-2">
		<!-- Metadata -->
		<div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
			<h2 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Details</h2>
			<dl class="space-y-1.5 text-sm">
				<div class="flex gap-2">
					<dt class="text-gray-500 dark:text-gray-400">Repository:</dt>
					<dd class="font-medium text-gray-900 dark:text-gray-100">{skill.owner}/{skill.repo}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="text-gray-500 dark:text-gray-400">Skill path:</dt>
					<dd class="font-medium text-gray-900 dark:text-gray-100">{skill.skillPath}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="text-gray-500 dark:text-gray-400">Platform:</dt>
					<dd class="font-medium text-gray-900 dark:text-gray-100">{skill.platform}</dd>
				</div>
				<div class="flex gap-2">
					<dt class="text-gray-500 dark:text-gray-400">Visibility:</dt>
					<dd class="font-medium text-gray-900 dark:text-gray-100">{skill.visibility}</dd>
				</div>
				{#if metadata.author}
					<div class="flex gap-2">
						<dt class="text-gray-500 dark:text-gray-400">Author:</dt>
						<dd class="font-medium text-gray-900 dark:text-gray-100">{metadata.author}</dd>
					</div>
				{/if}
				{#if metadata.version}
					<div class="flex gap-2">
						<dt class="text-gray-500 dark:text-gray-400">Version:</dt>
						<dd class="font-medium text-gray-900 dark:text-gray-100">{metadata.version}</dd>
					</div>
				{/if}
			</dl>
		</div>

		<!-- Governance -->
		<div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
			<h2 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Governance</h2>
			<div class="flex items-center gap-3">
				<GovernanceBadge status={skill.usagePolicy as UsagePolicy} />
			</div>
			{#if skill.note}
				<p class="mt-3 text-sm text-gray-700 dark:text-gray-300">{skill.note}</p>
			{/if}
		</div>
	</div>

	<!-- Source History -->
	{#if fromHistory.length > 0}
		<div class="mb-8 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
			<h2 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Source History</h2>
			<ol class="list-decimal space-y-1 pl-5">
				{#each fromHistory as url}
					<li>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
						>
							{url}
						</a>
					</li>
				{/each}
			</ol>
		</div>
	{/if}

	<!-- Excerpt -->
	{#if excerpt}
		<div class="mb-8 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
			<h2 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Skill Instructions (excerpt)</h2>
			<pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 dark:text-gray-300">{excerpt}</pre>
		</div>
	{/if}

	<!-- Files -->
	{#if skill.files && skill.files.length > 0}
		<div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
			<h2 class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Files ({skill.files.length})</h2>
			<ul class="space-y-1">
				{#each skill.files as file}
					<li>
						<a
							href="https://{skill.repoKey}/blob/HEAD/{file}"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
						>
							<svg class="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
							</svg>
							{file}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
