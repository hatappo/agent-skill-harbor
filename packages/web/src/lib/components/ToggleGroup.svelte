<script lang="ts" generics="T extends string">
	import type { Component } from 'svelte';

	type ToggleItem<TValue extends string> = {
		value: TValue;
		label: string;
		icon?: Component<{ class?: string }>;
	};

	type ButtonState = 'active' | 'idle' | 'hidden';

	let {
		items,
		selected,
		onSelect,
	}: {
		items: ToggleItem<T>[];
		selected: T;
		onSelect: (value: T) => void;
	} = $props();

	let expanded = $state(false);
	let hideTimeout: ReturnType<typeof setTimeout>;

	function show() {
		clearTimeout(hideTimeout);
		expanded = true;
	}

	function hide() {
		hideTimeout = setTimeout(() => {
			expanded = false;
		}, 0);
	}

	function getButtonState(itemValue: T): ButtonState {
		if (selected === itemValue) return 'active';
		if (expanded) return 'idle';
		return 'hidden';
	}

	function buttonClass(state: ButtonState): string {
		const base = 'rounded-md py-1 transition-[max-width,opacity,padding] duration-200';

		if (state === 'active') {
			return `${base} bg-white px-1.5 text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100`;
		}

		if (state === 'idle') {
			return `${base} px-1.5 text-gray-500 opacity-100 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`;
		}

		return `${base} max-w-0 overflow-hidden px-0 opacity-0`;
	}
</script>

<div
	role="group"
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
	class="flex items-center rounded-lg border border-gray-200 bg-gray-100 p-0.5 dark:border-gray-700 dark:bg-gray-800"
>
	{#each items as item (item.value)}
		<button
			onclick={() => onSelect(item.value)}
			class={buttonClass(getButtonState(item.value))}
			title={item.label}
			aria-label={item.label}
		>
			{#if item.icon}
				<item.icon class="h-4 w-4" />
			{:else}
				<span class="text-[11px] font-medium leading-none">{item.label}</span>
			{/if}
		</button>
	{/each}
</div>
