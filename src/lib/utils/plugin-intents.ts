import type { LabelIntent, PluginLabelEntry } from '$lib/types';

export function hasHighlightedPluginIntent(
	pluginLabels: PluginLabelEntry[] | undefined,
	highlightIntents: Iterable<LabelIntent>,
): boolean {
	if (!pluginLabels || pluginLabels.length === 0) return false;
	const intentSet = new Set(highlightIntents);
	if (intentSet.size === 0) return false;
	return pluginLabels.some((entry) => intentSet.has(entry.intent));
}
