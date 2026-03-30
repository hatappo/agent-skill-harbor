<script lang="ts">
	import { t } from '$lib/i18n';

	let { data } = $props();

	let repoFullName = $derived(data.repoFullName ?? null);
</script>

<div class="space-y-8">
	<section>
		<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Project</h2>
		<ul class="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
			<li>
				<span class="font-medium text-gray-900 dark:text-gray-100">{$t('settings.overview.repository')}:</span>
				{#if repoFullName}
					<a
						href="https://github.com/{repoFullName}"
						target="_blank"
						rel="noopener noreferrer"
						class="ml-1 text-blue-600 hover:underline dark:text-blue-400"
					>
						{repoFullName}
					</a>
				{:else}
					<span class="ml-1 text-gray-500 dark:text-gray-400">-</span>
				{/if}
			</li>
		</ul>
	</section>
</div>
