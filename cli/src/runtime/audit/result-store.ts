import { dump as yamlDump, load as yamlLoad } from 'js-yaml';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import type { AuditResultsYaml } from './types.js';

export function loadAuditResults(filePath: string): AuditResultsYaml {
	const legacyPath = filePath.replace(/report\.yaml$/, 'audit-results.yaml');
	const sourcePath = existsSync(filePath) ? filePath : legacyPath;

	if (!existsSync(sourcePath)) {
		return { results: {} };
	}
	try {
		const raw = yamlLoad(readFileSync(sourcePath, 'utf-8')) as AuditResultsYaml | null;
		return raw?.results ? raw : { results: {} };
	} catch {
		return { results: {} };
	}
}

export function saveAuditResults(filePath: string, results: AuditResultsYaml): void {
	writeFileSync(filePath, yamlDump(results, { lineWidth: 120, noRefs: true }));
	const legacyPath = filePath.replace(/report\.yaml$/, 'audit-results.yaml');
	if (legacyPath !== filePath && existsSync(legacyPath)) {
		unlinkSync(legacyPath);
	}
}
