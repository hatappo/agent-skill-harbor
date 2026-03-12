<script lang="ts">
	interface DataPoint {
		label: string;
		value: number;
	}

	interface Props {
		data: DataPoint[];
		height?: number;
	}

	let { data, height = 200 }: Props = $props();

	const padding = { top: 20, right: 20, bottom: 30, left: 50 };

	let chartWidth = $state(600);
	let containerEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!containerEl) return;
		const observer = new ResizeObserver((entries) => {
			chartWidth = entries[0].contentRect.width;
		});
		observer.observe(containerEl);
		return () => observer.disconnect();
	});

	let computed = $derived.by(() => {
		if (data.length === 0) return null;

		const values = data.map((d) => d.value);
		const minVal = Math.min(...values);
		const maxVal = Math.max(...values);
		const range = maxVal - minVal || 1;

		const innerWidth = chartWidth - padding.left - padding.right;
		const innerHeight = height - padding.top - padding.bottom;

		const points = data.map((d, i) => {
			const x = padding.left + (data.length > 1 ? (i / (data.length - 1)) * innerWidth : innerWidth / 2);
			const y = padding.top + innerHeight - ((d.value - minVal) / range) * innerHeight;
			return { x, y, ...d };
		});

		const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

		const areaPath =
			linePath +
			` L${points[points.length - 1].x},${padding.top + innerHeight}` +
			` L${points[0].x},${padding.top + innerHeight} Z`;

		// Y-axis ticks (5 ticks)
		const tickCount = 5;
		const yTicks = Array.from({ length: tickCount }, (_, i) => {
			const val = minVal + (range * i) / (tickCount - 1);
			const y = padding.top + innerHeight - ((val - minVal) / range) * innerHeight;
			return { value: Math.round(val), y };
		});

		// X-axis labels (show up to 8 evenly spaced)
		const maxLabels = Math.min(8, data.length);
		const step = data.length > 1 ? Math.max(1, Math.floor((data.length - 1) / (maxLabels - 1))) : 1;
		const xLabels = points.filter((_, i) => i % step === 0 || i === data.length - 1);

		return { points, linePath, areaPath, yTicks, xLabels, innerHeight };
	});
</script>

<div bind:this={containerEl} class="w-full">
	{#if computed && data.length > 1}
		<svg width={chartWidth} {height} class="overflow-visible">
			<!-- Y-axis grid lines -->
			{#each computed.yTicks as tick}
				<line
					x1={padding.left}
					y1={tick.y}
					x2={chartWidth - padding.right}
					y2={tick.y}
					class="stroke-gray-200 dark:stroke-gray-700"
					stroke-width="1"
				/>
				<text
					x={padding.left - 8}
					y={tick.y}
					text-anchor="end"
					dominant-baseline="middle"
					class="fill-gray-400 text-xs dark:fill-gray-500"
				>
					{tick.value}
				</text>
			{/each}

			<!-- Area fill -->
			<path d={computed.areaPath} class="fill-blue-100/50 dark:fill-blue-900/20" />

			<!-- Line -->
			<path d={computed.linePath} fill="none" class="stroke-blue-500 dark:stroke-blue-400" stroke-width="2" />

			<!-- Data points -->
			{#each computed.points as point}
				<circle cx={point.x} cy={point.y} r="3" class="fill-blue-500 dark:fill-blue-400" />
			{/each}

			<!-- X-axis labels -->
			{#each computed.xLabels as point}
				<text
					x={point.x}
					y={padding.top + computed.innerHeight + 20}
					text-anchor="middle"
					class="fill-gray-400 text-xs dark:fill-gray-500"
				>
					{point.label}
				</text>
			{/each}
		</svg>
	{:else if data.length === 1}
		<div class="flex items-center justify-center" style="height: {height}px">
			<span class="text-3xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">{data[0].value}</span>
		</div>
	{:else}
		<div class="flex items-center justify-center text-gray-400 dark:text-gray-500" style="height: {height}px">
			No data
		</div>
	{/if}
</div>
