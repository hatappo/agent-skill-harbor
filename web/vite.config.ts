import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);
const projectRoot = process.env.SKILL_HARBOR_ROOT || resolve(import.meta.dirname, '..');
const webPackageRoot = resolve(import.meta.dirname);
const svelteKitRoot = dirname(require.resolve('@sveltejs/kit/package.json'));

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	envDir: projectRoot,
	define: {
		__PROJECT_ROOT__: JSON.stringify(projectRoot),
		__WEB_PACKAGE_ROOT__: JSON.stringify(webPackageRoot),
	},
	server: {
		fs: {
			allow: [projectRoot, webPackageRoot, svelteKitRoot],
		},
	},
	ssr: { external: ['gray-matter'] },
});
