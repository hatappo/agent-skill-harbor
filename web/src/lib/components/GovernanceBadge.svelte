<script lang="ts">
	import type { GovernanceStatus } from '$lib/types';

	interface Props {
		status: GovernanceStatus;
	}

	let { status }: Props = $props();

	const styles: Record<GovernanceStatus, string> = {
		required: 'bg-blue-100 text-blue-800 border-blue-200',
		recommended: 'bg-green-100 text-green-800 border-green-200',
		deprecated: 'bg-amber-100 text-amber-800 border-amber-200',
		prohibited: 'bg-red-100 text-red-800 border-red-200',
		none: 'bg-gray-100 text-gray-600 border-gray-200'
	};

	const labels: Record<GovernanceStatus, string> = {
		required: 'Required',
		recommended: 'Recommended',
		deprecated: 'Deprecated',
		prohibited: 'Prohibited',
		none: 'Unclassified'
	};
</script>

<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {styles[status]}">
	{labels[status]}
</span>
