import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const rootPackagePath = join(projectRoot, 'package.json');
const webPackagePath = join(projectRoot, 'web', 'package.json');
const templatePackagePath = join(projectRoot, 'templates', 'init', 'package.template.json');

function readJson<T>(filePath: string): T {
	return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

function writeJson(filePath: string, value: unknown): void {
	writeFileSync(filePath, `${JSON.stringify(value, null, '\t')}\n`);
}

const rootPackage = readJson<Record<string, any>>(rootPackagePath);
const version = rootPackage.version;

if (typeof version !== 'string' || version.length === 0) {
	throw new Error('Root package.json version is missing');
}

rootPackage.dependencies = {
	...(rootPackage.dependencies ?? {}),
	'agent-skill-harbor-web': `workspace:^${version}`,
};
writeJson(rootPackagePath, rootPackage);

const webPackage = readJson<Record<string, any>>(webPackagePath);
webPackage.version = version;
writeJson(webPackagePath, webPackage);

const templateRaw = readFileSync(templatePackagePath, 'utf-8');
const nextTemplate = templateRaw.replace(/\^([0-9]+\.[0-9]+\.[0-9]+|\{\{PACKAGE_VERSION\}\})/g, '^{{PACKAGE_VERSION}}');
writeFileSync(templatePackagePath, nextTemplate);

console.log(`Synchronized versions to ${version}`);
console.log(`  - package.json dependency agent-skill-harbor-web -> workspace:^${version}`);
console.log(`  - web/package.json`);
console.log(`  - templates/init/package.template.json uses {{PACKAGE_VERSION}} placeholder`);
