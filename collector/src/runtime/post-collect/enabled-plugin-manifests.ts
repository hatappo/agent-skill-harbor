import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load as yamlLoad } from 'js-yaml';

interface RawPostCollectPluginConfig {
	id?: unknown;
}

interface RawSettings {
	post_collect?: {
		plugins?: RawPostCollectPluginConfig[];
	};
}

export interface EnabledPluginManifestInfo {
	enabledPluginIds: string[];
	hasPython: boolean;
}

export function detectEnabledPluginManifests(projectRoot: string): EnabledPluginManifestInfo {
	const configPath = join(projectRoot, 'config', 'harbor.yaml');
	if (!existsSync(configPath)) {
		return { enabledPluginIds: [], hasPython: false };
	}

	const raw = yamlLoad(readFileSync(configPath, 'utf8')) as RawSettings | null;
	const plugins = Array.isArray(raw?.post_collect?.plugins) ? raw.post_collect.plugins : [];
	const enabledPluginIds = plugins
		.map((plugin) => (plugin && typeof plugin === 'object' && typeof plugin.id === 'string' ? plugin.id : null))
		.filter((pluginId): pluginId is string => Boolean(pluginId));

	const hasPython = enabledPluginIds.some((pluginId) =>
		existsSync(join(projectRoot, 'collector', 'plugins', pluginId, 'requirements.txt')),
	);

	return { enabledPluginIds, hasPython };
}
