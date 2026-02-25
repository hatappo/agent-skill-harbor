import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	envDir: resolve(import.meta.dirname, '..'),
	define: {
		__PROJECT_ROOT__: JSON.stringify(resolve(import.meta.dirname, '..'))
	},
	ssr: { external: ['gray-matter'] }
});
