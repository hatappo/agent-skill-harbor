import { resolve } from 'node:path';
import { isExecutedDirectly, loadOptionalEnvFile, logRuntimeErrorAndExit } from '../shared/runtime-command-support.js';
import { userRoot } from '../shared/runtime-paths.js';
import { runPostCollectCli } from './post-collect.js';

export async function runPostCollectCommand(argv: string[] = []): Promise<void> {
	console.log('Running post_collect plugins...');
	console.log(`  Project root: ${userRoot}`);

	try {
		const envFile = resolve(userRoot, '.env');
		loadOptionalEnvFile(envFile);
		await runPostCollectCli(argv);
	} catch (error: unknown) {
		logRuntimeErrorAndExit(error);
	}
}

if (isExecutedDirectly(import.meta.url)) {
	await runPostCollectCommand(process.argv.slice(2));
}
