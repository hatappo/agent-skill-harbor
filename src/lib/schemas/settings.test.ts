import assert from 'node:assert/strict';
import test from 'node:test';
import { settingsSchema } from './settings.js';

test('settingsSchema uses danger as the default highlight intent', () => {
	const settings = settingsSchema.parse({});
	assert.deepEqual(settings.catalog.skill.highlight_intents, ['danger']);
});

test('settingsSchema accepts configured highlight intents', () => {
	const settings = settingsSchema.parse({
		catalog: {
			skill: {
				highlight_intents: ['warn', 'danger'],
			},
		},
	});
	assert.deepEqual(settings.catalog.skill.highlight_intents, ['warn', 'danger']);
});

test('settingsSchema rejects invalid highlight intents', () => {
	assert.throws(() =>
		settingsSchema.parse({
			catalog: {
				skill: {
					highlight_intents: ['critical'],
				},
			},
		}),
	);
});
