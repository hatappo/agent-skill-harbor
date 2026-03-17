import type { BuiltinPostCollectPlugin, LabelIntent, PostCollectPluginResult } from '../types.js';
import { analyzeStaticSkill } from './audit-static-core.js';

function mapLabelIntent(label: string): LabelIntent {
	switch (label) {
		case 'Pass':
			return 'success';
		case 'Info':
			return 'info';
		case 'Warn':
			return 'warn';
		case 'Fail':
			return 'danger';
		default:
			return 'neutral';
	}
}

function mapAuditLabel(value: 'pass' | 'info' | 'warn' | 'fail'): string {
	switch (value) {
		case 'pass':
			return 'Pass';
		case 'info':
			return 'Info';
		case 'warn':
			return 'Warn';
		case 'fail':
			return 'Fail';
	}
}

export const auditStaticPlugin: BuiltinPostCollectPlugin = {
	id: 'builtin.audit-static',
	run(context): PostCollectPluginResult {
		const results: NonNullable<PostCollectPluginResult['results']> = {};

		for (const [repoKey, repoEntry] of Object.entries(context.catalog.repositories)) {
			for (const skillPath of Object.keys(repoEntry.skills)) {
				const skillKey = `${repoKey}/${skillPath}`;
				const audit = analyzeStaticSkill(context.project_root, skillKey);
				const label = mapAuditLabel(audit.result);
				results[skillKey] = {
					label,
					raw: audit.summary ?? undefined,
					findings: audit.findings ?? [],
				};
			}
		}

		return {
			summary: `${Object.keys(results).length} skill(s) scanned by the static audit plugin.`,
			label_intents: Object.fromEntries(
				(['Pass', 'Info', 'Warn', 'Fail'] as const).map((label) => [label, mapLabelIntent(label)]),
			),
			results,
		};
	},
};
