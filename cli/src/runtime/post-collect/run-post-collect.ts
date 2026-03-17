import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { dump as yamlDump, load as yamlLoad } from 'js-yaml';
import { tsImport } from 'tsx/esm/api';
import { auditStaticPlugin } from './plugins/audit-static.js';
import { detectDriftPlugin } from './plugins/detect-drift.js';
import type {
	BuiltinPostCollectPlugin,
	LabelIntent,
	PostCollectCatalog,
	PostCollectPluginConfig,
	PostCollectPluginContext,
	PostCollectPluginModule,
	PostCollectPluginResult,
	PostCollectSettings,
} from './types.js';

const BUILTIN_PLUGINS = new Map<string, BuiltinPostCollectPlugin>([
	[detectDriftPlugin.id, detectDriftPlugin],
	[auditStaticPlugin.id, auditStaticPlugin],
]);

interface RawSettings {
	post_collect?: {
		plugins?: PostCollectPluginConfig[];
	};
}

interface SavedPluginOutput extends PostCollectPluginResult {
	plugin: {
		id: string;
		generated_at: string;
		collect_id?: string;
	};
}

function loadPostCollectSettings(projectRoot: string): PostCollectSettings {
	const settingsPath = join(projectRoot, 'config', 'harbor.yaml');
	if (!existsSync(settingsPath)) {
		return { plugins: [{ id: 'detect-drift' }] };
	}
	try {
		const raw = yamlLoad(readFileSync(settingsPath, 'utf-8')) as RawSettings | null;
		return {
			plugins: raw?.post_collect?.plugins ?? [{ id: 'detect-drift' }],
		};
	} catch {
		return { plugins: [{ id: 'detect-drift' }] };
	}
}

function validateIntent(intent: string | undefined): LabelIntent {
	if (intent === 'neutral' || intent === 'info' || intent === 'success' || intent === 'warn' || intent === 'danger') {
		return intent;
	}
	return 'neutral';
}

function normalizePluginResult(result: PostCollectPluginResult | null | undefined): PostCollectPluginResult {
	const next: PostCollectPluginResult = {};
	if (result?.summary) next.summary = String(result.summary);
	if (result?.label_intents) {
		next.label_intents = Object.fromEntries(
			Object.entries(result.label_intents).map(([label, intent]) => [label, validateIntent(intent)]),
		);
	}
	if (result?.results) {
		next.results = Object.fromEntries(
			Object.entries(result.results).map(([skillKey, value]) => [skillKey, value && typeof value === 'object' ? value : {}]),
		);
	}
	return next;
}

async function loadUserPlugin(projectRoot: string, pluginPath: string): Promise<PostCollectPluginModule> {
	const modulePath = isAbsolute(pluginPath) ? pluginPath : resolve(projectRoot, pluginPath);
	const imported = (await tsImport(modulePath, import.meta.url)) as Partial<PostCollectPluginModule> & {
		default?: Partial<PostCollectPluginModule>;
	};
	const candidate = imported.default?.run ? imported.default : imported;
	if (typeof candidate.run !== 'function') {
		throw new Error(`Plugin "${pluginPath}" must export run(context).`);
	}
	return candidate as PostCollectPluginModule;
}

function savePluginOutput(projectRoot: string, pluginId: string, collectId: string | null, result: PostCollectPluginResult): void {
	const outputPath = join(projectRoot, 'data', 'plugins', `${pluginId}.yaml`);
	mkdirSync(dirname(outputPath), { recursive: true });
	const payload: SavedPluginOutput = {
		plugin: {
			id: pluginId,
			generated_at: new Date().toISOString(),
			...(collectId ? { collect_id: collectId } : {}),
		},
		...result,
	};
	writeFileSync(outputPath, yamlDump(payload, { lineWidth: 120, noRefs: true }));
}

export interface RunPostCollectOptions {
	projectRoot: string;
	collectId?: string | null;
	catalog: PostCollectCatalog;
	log?: boolean;
	plugins?: PostCollectPluginConfig[];
}

export async function runPostCollect(options: RunPostCollectOptions): Promise<void> {
	const log = options.log ?? true;
	const settings = loadPostCollectSettings(options.projectRoot);
	const plugins = options.plugins ?? settings.plugins;
	const contextBase: Omit<PostCollectPluginContext, 'plugin_id'> = {
		schema_version: 1,
		project_root: options.projectRoot,
		collect_id: options.collectId ?? null,
		paths: {
			data_dir: join(options.projectRoot, 'data'),
			catalog_yaml: join(options.projectRoot, 'data', 'skills.yaml'),
			skills_dir: join(options.projectRoot, 'data', 'skills'),
			collects_yaml: join(options.projectRoot, 'data', 'collects.yaml'),
		},
		catalog: options.catalog,
	};

	if (plugins.length === 0) {
		if (log) console.log('No post_collect plugins configured. Skipping.');
		return;
	}

	if (log) console.log(`Running post_collect plugins: ${plugins.map((plugin) => plugin.id).join(', ')}`);

	for (const plugin of plugins) {
		const builtIn = BUILTIN_PLUGINS.get(plugin.id);
		const context: PostCollectPluginContext = { ...contextBase, plugin_id: plugin.id };
		if (log) console.log(`  -> ${plugin.id}`);
		const pluginPath = plugin.path;
		if (!builtIn && !pluginPath) {
			throw new Error(`Post-collect plugin "${plugin.id}" requires a path.`);
		}
		const result = builtIn
			? await builtIn.run(context)
			: await (await loadUserPlugin(options.projectRoot, pluginPath!)).run(context);
		savePluginOutput(options.projectRoot, plugin.id, options.collectId ?? null, normalizePluginResult(result));
	}
}
