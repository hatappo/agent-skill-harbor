<script lang="ts">
	import type { UsagePolicy } from '$lib/types';

	interface Props {
		status: UsagePolicy;
	}

	let { status }: Props = $props();

	const styles: Record<UsagePolicy, string> = {
		required: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
		recommended: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
		discouraged: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
		prohibited: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
		none: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
	};

	const labels: Record<UsagePolicy, string> = {
		required: 'Required',
		recommended: 'Recommended',
		discouraged: 'Discouraged',
		prohibited: 'Prohibited',
		none: 'Unclassified'
	};
</script>

<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {styles[status]}">
	{labels[status]}
</span>
