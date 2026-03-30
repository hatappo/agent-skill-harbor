import assert from 'node:assert/strict';
import test from 'node:test';
import type { PluginLabelEntry } from '$lib/types';
import { hasHighlightedPluginIntent } from './plugin-intents.js';

const labels: PluginLabelEntry[] = [
	{ plugin_id: 'builtin.detect-drift', label: 'Drifted', intent: 'danger' },
	{ plugin_id: 'builtin.audit-skill-scanner', label: 'Reviewed', intent: 'success' },
];

test('hasHighlightedPluginIntent returns true when any plugin label matches configured intents', () => {
	assert.equal(hasHighlightedPluginIntent(labels, ['danger']), true);
	assert.equal(hasHighlightedPluginIntent(labels, ['warn', 'danger']), true);
});

test('hasHighlightedPluginIntent returns false when there is no matching intent', () => {
	assert.equal(hasHighlightedPluginIntent(labels, ['warn']), false);
	assert.equal(hasHighlightedPluginIntent(undefined, ['danger']), false);
	assert.equal(hasHighlightedPluginIntent([], ['danger']), false);
});
