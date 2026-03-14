<script lang="ts">
	import { t } from '$lib/i18n';

	let { data } = $props();
</script>

<div class="space-y-8">
	<!-- Collector Section -->
	<section>
		<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
			{$t('settings.collector.title')}
		</h2>
		<div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
			<table class="w-full">
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					<!-- exclude_forks -->
					<tr>
						<td class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							{$t('settings.collector.exclude_forks')}
						</td>
						<td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
							{#if data.settings.collector.exclude_forks}
								<span class="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
									<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									{$t('settings.enabled')}
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500">
									<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
										<path
											d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
										/>
									</svg>
									{$t('settings.disabled')}
								</span>
							{/if}
						</td>
					</tr>
					<!-- include_origin_repos -->
					<tr>
						<td class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							{$t('settings.collector.include_origin_repos')}
						</td>
						<td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
							{#if data.settings.collector.include_origin_repos}
								<span class="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
									<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
									{$t('settings.enabled')}
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500">
									<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
										<path
											d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
										/>
									</svg>
									{$t('settings.disabled')}
								</span>
							{/if}
						</td>
					</tr>
					<!-- excluded_repos -->
					<tr>
						<td class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							{$t('settings.collector.excluded_repos')}
						</td>
						<td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
							{#if data.settings.collector.excluded_repos.length > 0}
								<ul class="list-inside list-disc space-y-0.5">
									{#each data.settings.collector.excluded_repos as repo}
										<li>
											{#if data.orgName}
												<a
													href="https://github.com/{data.orgName}/{repo}"
													target="_blank"
													rel="noopener noreferrer"
													class="text-blue-600 hover:underline dark:text-blue-400">{repo}</a
												>
											{:else}
												{repo}
											{/if}
										</li>
									{/each}
								</ul>
							{:else}
								<span class="text-gray-400 dark:text-gray-500">{$t('settings.empty_list')}</span>
							{/if}
						</td>
					</tr>
					<!-- included_extra_repos -->
					<tr>
						<td class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							{$t('settings.collector.included_extra_repos')}
						</td>
						<td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
							{#if data.settings.collector.included_extra_repos.length > 0}
								<ul class="list-inside list-disc space-y-0.5">
									{#each data.settings.collector.included_extra_repos as url}
										<li>
											{#if url.startsWith('https://') || url.startsWith('http://')}
												<a
													href={url}
													target="_blank"
													rel="noopener noreferrer"
													class="text-blue-600 hover:underline dark:text-blue-400">{url}</a
												>
											{:else}
												{url}
											{/if}
										</li>
									{/each}
								</ul>
							{:else}
								<span class="text-gray-400 dark:text-gray-500">{$t('settings.empty_list')}</span>
							{/if}
						</td>
					</tr>
					<!-- history_limit -->
					<tr>
						<td class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							{$t('settings.collector.history_limit')}
						</td>
						<td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
							{data.settings.collector.history_limit}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<!-- Catalog Section -->
	<section>
		<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
			{$t('settings.catalog.title')}
		</h2>
		<div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
			<table class="w-full">
				<tbody>
					<tr>
						<td class="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							{$t('settings.catalog.fresh_period_days')}
						</td>
						<td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
							{data.settings.catalog.skill.fresh_period_days}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</div>
