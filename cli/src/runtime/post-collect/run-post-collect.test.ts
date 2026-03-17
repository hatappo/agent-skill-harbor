import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { dump as yamlDump, load as yamlLoad } from 'js-yaml';
import { runPostCollect } from './run-post-collect.js';

function writeSkill(root: string, repoKey: string, skillPath: string, content: string): void {
	const fullPath = join(root, 'data', 'skills', repoKey, skillPath);
	mkdirSync(join(fullPath, '..'), { recursive: true });
	writeFileSync(fullPath, content);
}

test('runPostCollect saves detect-drift output', async () => {
	const root = mkdtempSync(join(tmpdir(), 'post-collect-'));
	mkdirSync(join(root, 'data'), { recursive: true });

	const catalog = {
		repositories: {
			'github.com/example/copy': {
				visibility: 'public',
				skills: {
					'skills/tooling/SKILL.md': {
						tree_sha: 'copy-tree',
						resolved_from: 'github.com/example/origin@abc123',
					},
				},
			},
			'github.com/example/origin': {
				visibility: 'public',
				skills: {
					'upstream/tooling/SKILL.md': {
						tree_sha: 'abc123456789',
					},
				},
			},
		},
	};

	writeFileSync(join(root, 'data', 'skills.yaml'), yamlDump(catalog));
	writeSkill(root, 'github.com/example/copy', 'skills/tooling/SKILL.md', '---\nname: tooling\n---\ncopy');
	writeSkill(root, 'github.com/example/origin', 'upstream/tooling/SKILL.md', '---\nname: tooling\n---\norigin');

	await runPostCollect({
		projectRoot: root,
		collectId: 'collect-1',
		catalog,
		log: false,
		plugins: [{ id: 'detect-drift' }],
	});

	const output = yamlLoad(readFileSync(join(root, 'data', 'plugins', 'detect-drift.yaml'), 'utf-8')) as {
		results: Record<string, { label?: string }>;
	};
	assert.equal(output.results['github.com/example/copy/skills/tooling/SKILL.md']?.label, 'In sync');
});

test('runPostCollect loads local ts plugin with tsx', async () => {
	const root = mkdtempSync(join(tmpdir(), 'post-collect-ts-'));
	mkdirSync(join(root, 'config'), { recursive: true });
	mkdirSync(join(root, 'scripts', 'plugins'), { recursive: true });
	mkdirSync(join(root, 'data'), { recursive: true });

	writeFileSync(
		join(root, 'scripts', 'plugins', 'company-policy.ts'),
		[
			"export async function run(context) {",
			"  return {",
			"    summary: `checked ${Object.keys(context.catalog.repositories).length} repo(s)`,",
			"    results: {",
			"      'github.com/example/demo/tools/SKILL.md': { label: 'Reviewed', raw: 'plugin ok' }",
			'    }',
			'  };',
			'}',
			'',
		].join('\n'),
	);

	await runPostCollect({
		projectRoot: root,
		collectId: 'collect-2',
		catalog: {
			repositories: {
				'github.com/example/demo': {
					visibility: 'public',
					skills: {
						'tools/SKILL.md': {
							tree_sha: 'tree',
						},
					},
				},
			},
		},
		log: false,
		plugins: [{ id: 'company-policy', path: './scripts/plugins/company-policy.ts' }],
	});

	const output = yamlLoad(readFileSync(join(root, 'data', 'plugins', 'company-policy.yaml'), 'utf-8')) as {
		summary?: string;
		results?: Record<string, { label?: string; raw?: string }>;
	};
	assert.equal(output.summary, 'checked 1 repo(s)');
	assert.deepEqual(output.results?.['github.com/example/demo/tools/SKILL.md'], {
		label: 'Reviewed',
		raw: 'plugin ok',
	});
});
