import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function isExecutedDirectly(importMetaUrl: string, argv1 = process.argv[1]): boolean {
	if (!argv1) return false;

	try {
		return realpathSync(argv1) === realpathSync(fileURLToPath(importMetaUrl));
	} catch {
		return fileURLToPath(importMetaUrl) === resolve(argv1);
	}
}
