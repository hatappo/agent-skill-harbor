import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		'src/cli/commands/collect': 'src/cli/commands/collect.ts',
		'src/runtime/collect-org-skills': 'src/runtime/collect-org-skills.ts',
		'src/runtime/collects': 'src/runtime/collects.ts',
	},
	format: 'esm',
	target: 'node24',
	outDir: 'dist',
	clean: true,
	splitting: false,
});
