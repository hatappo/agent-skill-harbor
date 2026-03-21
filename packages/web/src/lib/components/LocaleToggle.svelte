<script lang="ts">
	import { locale, setLocale, type Locale } from '$lib/i18n';
	import ToggleGroup from '$lib/components/ToggleGroup.svelte';

	const locales: { value: Locale; label: string }[] = [
		{ value: 'en', label: 'EN' },
		{ value: 'ja', label: 'JA' },
	];
</script>

<ToggleGroup items={locales} selected={$locale} onSelect={setLocale} />
