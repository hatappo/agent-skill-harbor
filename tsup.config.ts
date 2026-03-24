import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		'bin/cli': 'bin/cli.ts',
		'src/cli/commands/build': 'src/cli/commands/build.js',
		'src/cli/commands/deploy': 'src/cli/commands/deploy.js',
		'src/cli/commands/dev': 'src/cli/commands/dev.js',
		'src/cli/paths': 'src/cli/paths.ts',
		'src/cli/commands/init': 'src/cli/commands/init.ts',
		'src/cli/commands/preview': 'src/cli/commands/preview.js',
		'src/cli/commands/setup': 'src/cli/commands/setup.ts',
		'src/cli/setup': 'src/cli/setup.ts',
	},
	format: 'esm',
	target: 'node24',
	outDir: 'dist',
	clean: true,
	splitting: false,
});
