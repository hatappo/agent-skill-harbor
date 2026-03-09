import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { webRoot, userRoot } from '../paths.js';

const viteCli = resolve(webRoot, 'node_modules/vite/bin/vite.js');

console.log(`Starting development server...`);
console.log(`  Project root: ${userRoot}`);

try {
	execFileSync(process.execPath, [viteCli, 'dev'], {
		cwd: webRoot,
		stdio: 'inherit',
		env: {
			...process.env,
			SKILL_HARBOR_ROOT: userRoot,
		},
	});
} catch (e: any) {
	process.exit(e.status ?? 1);
}
