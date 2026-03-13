import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const rootPackagePath = join(projectRoot, 'package.json');
const webPackagePath = join(projectRoot, 'web', 'package.json');
const templatePackagePath = join(projectRoot, 'templates', 'init', 'package.template.json');

function readJson<T>(filePath: string): T {
	return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

const rootPackage = readJson<Record<string, any>>(rootPackagePath);
const webPackage = readJson<Record<string, any>>(webPackagePath);
const templateRaw = readFileSync(templatePackagePath, 'utf-8');

const errors: string[] = [];
const rootVersion = rootPackage.version;

if (webPackage.version !== rootVersion) {
	errors.push(`web/package.json version (${webPackage.version}) does not match root package.json version (${rootVersion})`);
}

if (!templateRaw.includes('"agent-skill-harbor": "^{{PACKAGE_VERSION}}"')) {
	errors.push('templates/init/package.template.json must use ^{{PACKAGE_VERSION}} placeholder');
}

if (!rootPackage.dependencies || rootPackage.dependencies['agent-skill-harbor-web'] !== `workspace:^${rootVersion}`) {
	errors.push(`package.json dependency agent-skill-harbor-web must be workspace:^${rootVersion}`);
}

if (errors.length > 0) {
	for (const error of errors) {
		console.error(`Version check failed: ${error}`);
	}
	process.exit(1);
}

console.log(`Version check passed: ${rootVersion}`);
