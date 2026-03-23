import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		'src/cli/commands/post-collect': 'src/cli/commands/post-collect.ts',
		'src/runtime/post-collect': 'src/runtime/post-collect.ts',
	},
	format: 'esm',
	target: 'node24',
	outDir: 'dist',
	clean: true,
	splitting: false,
	noExternal: ['agent-skill-harbor-shared-internal'],
});
