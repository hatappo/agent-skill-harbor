import { packageRoot, userRoot } from '../paths.js';
import { scaffoldSamplePlugin } from '../gen.js';

export async function runCommand(argv = process.argv.slice(3)): Promise<void> {
	const target = argv[0];

	if (target !== 'sample-plugin') {
		console.error('Usage: harbor gen sample-plugin');
		process.exit(1);
		return;
	}

	try {
		const createdPath = scaffoldSamplePlugin(packageRoot, userRoot);
		console.log('Generated sample plugin.');
		console.log(`  Path: ${createdPath}`);
		console.log('  Next: uncomment `- id: sample_plugin` in config/harbor.yaml');
	} catch (error: any) {
		console.error(error?.message ?? String(error));
		process.exit(1);
	}
}
