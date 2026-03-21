import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolvePackageRoot(): string {
	// Source runs resolve from packages/cli/src/cli, while built runs resolve from
	// packages/cli/dist/src/cli. Check both candidate parents and pick the one that
	// still contains the package metadata and templates.
	for (const candidate of [resolve(__dirname, '../..'), resolve(__dirname, '../../..')]) {
		if (existsSync(resolve(candidate, 'package.json')) && existsSync(resolve(candidate, 'templates'))) {
			return candidate;
		}
	}
	throw new Error('Failed to resolve CLI package root.');
}

/** Root of the installed CLI package (where dist/, templates/ live) */
export const packageRoot = resolvePackageRoot();

/** The user's project directory (CWD) */
export const userRoot = process.env.SKILL_HARBOR_USER_ROOT || process.cwd();
