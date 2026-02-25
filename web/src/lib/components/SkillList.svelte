<script lang="ts">
	import type { FlatSkillEntry } from '$lib/types';
	import { t } from '$lib/i18n';
	import SkillCard from './SkillCard.svelte';

	interface Props {
		skills: FlatSkillEntry[];
	}

	let { skills }: Props = $props();
</script>

{#if skills.length === 0}
	<div class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
		<p class="text-gray-500 dark:text-gray-400">{$t('skillList.empty')}</p>
	</div>
{:else}
	<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		{#each skills as skill (skill.key)}
			<SkillCard {skill} />
		{/each}
	</div>
{/if}
