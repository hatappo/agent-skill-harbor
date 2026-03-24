import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { userRoot } from '../paths.js';
import { detectEnabledPluginManifests } from '../../runtime/post-collect/enabled-plugin-manifests.js';

interface Args {
	output?: string;
}

function parseArgs(argv: string[]): Args {
	let output: string | undefined;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === '--output') {
			output = argv[i + 1];
			i++;
			continue;
		}
		if (arg.startsWith('--output=')) {
			output = arg.slice('--output='.length);
			continue;
		}
		throw new Error(`Unknown option: ${arg}`);
	}

	return { output };
}

export async function runCommand(argv: string[] = process.argv.slice(2)): Promise<void> {
	try {
		const args = parseArgs(argv);
		const info = detectEnabledPluginManifests(userRoot);

		if (args.output) {
			writeFileSync(resolve(userRoot, args.output), info.enabledPluginIds.join('\n'));
		}

		process.stdout.write(JSON.stringify(info));
	} catch (e: any) {
		const message = e instanceof Error ? e.message : String(e);
		if (message) console.error(`Error: ${message}`);
		process.exit(e.status ?? 1);
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	await runCommand(process.argv.slice(2));
}
