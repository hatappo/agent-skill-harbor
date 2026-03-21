import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		'src/catalog-store': 'src/catalog-store.ts',
		'src/resolved-from': 'src/resolved-from.ts',
	},
	format: 'esm',
	target: 'node24',
	outDir: 'dist',
	clean: true,
	splitting: false,
	dts: true,
});
