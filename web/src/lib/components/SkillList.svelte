<script lang="ts">
	import type { SkillEntry } from '$lib/types';
	import SkillCard from './SkillCard.svelte';

	interface Props {
		skills: SkillEntry[];
	}

	let { skills }: Props = $props();
</script>

{#if skills.length === 0}
	<div class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
		<p class="text-gray-500">No skills found matching your criteria.</p>
	</div>
{:else}
	<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		{#each skills as skill (skill.slug)}
			<SkillCard {skill} />
		{/each}
	</div>
{/if}
