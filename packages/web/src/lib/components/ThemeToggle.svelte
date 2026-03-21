<script lang="ts">
	import { theme, setTheme, type ThemeMode } from '$lib/stores/theme';
	import { t } from '$lib/i18n';
	import ToggleGroup from '$lib/components/ToggleGroup.svelte';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Monitor from '@lucide/svelte/icons/monitor';

	const modes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
		{ value: 'light', label: 'theme.light', icon: Sun },
		{ value: 'dark', label: 'theme.dark', icon: Moon },
		{ value: 'system', label: 'theme.system', icon: Monitor },
	];
</script>

<ToggleGroup
	items={modes.map(({ value, label, icon }) => ({ value, label: $t(label), icon }))}
	selected={$theme}
	onSelect={setTheme}
/>
