<script lang="ts">
	import { background, setBackground, type BackgroundMode } from '$lib/stores/background';
	import { t } from '$lib/i18n';
	import ToggleGroup from '$lib/components/ToggleGroup.svelte';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Droplets from '@lucide/svelte/icons/droplets';
	import Minus from '@lucide/svelte/icons/minus';

	const modes: { value: BackgroundMode; label: string; icon: typeof Minus }[] = [
		{ value: 'none', label: 'background.none', icon: Minus },
		{ value: 'stars', label: 'background.stars', icon: Sparkles },
		{ value: 'ripples', label: 'background.ripples', icon: Droplets },
	];
</script>

<ToggleGroup
	items={modes.map(({ value, label, icon }) => ({ value, label: $t(label), icon }))}
	selected={$background}
	onSelect={setBackground}
/>
