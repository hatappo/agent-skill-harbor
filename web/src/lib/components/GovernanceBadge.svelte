<script lang="ts">
	import type { UsagePolicy } from '$lib/types';

	interface Props {
		status: UsagePolicy;
	}

	let { status }: Props = $props();

	const styles: Record<UsagePolicy, string> = {
		required: 'bg-blue-100 text-blue-800 border-blue-200',
		recommended: 'bg-green-100 text-green-800 border-green-200',
		discouraged: 'bg-amber-100 text-amber-800 border-amber-200',
		prohibited: 'bg-red-100 text-red-800 border-red-200',
		none: 'bg-gray-100 text-gray-600 border-gray-200'
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
