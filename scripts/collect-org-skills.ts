import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';
import { dump as yamlDump, load as yamlLoad } from 'js-yaml';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(import.meta.dirname, '..', 'data');
const ORG_SKILLS_DIR = join(DATA_DIR, 'skills', 'org');
const GOVERNANCE_PATH = join(DATA_DIR, 'governance.yaml');
const PREVIEW_LENGTH = 500;

interface GovernancePolicy {
	slug: string;
	source: string;
	status: string;
	note?: string;
	updated_by?: string;
	updated_at?: string;
}

interface GovernanceConfig {
	version: string;
	defaults: {
		org_skills: string;
		public_skills: string;
	};
	policies: GovernancePolicy[];
}

interface SkillData {
	slug: string;
	source: 'org' | 'public';
	repository: {
		owner: string;
		name: string;
		url: string;
		default_branch: string;
	};
	skill: {
		name: string;
		description: string;
		metadata?: Record<string, string>;
	};
	instructions_preview: string;
	files: string[];
	governance: {
		status: string;
		note?: string;
		updated_by?: string;
		updated_at?: string;
	};
	collected_at: string;
	skill_md_sha: string;
}

function loadGovernance(): GovernanceConfig {
	if (!existsSync(GOVERNANCE_PATH)) {
		return { version: '1', defaults: { org_skills: 'none', public_skills: 'none' }, policies: [] };
	}
	return yamlLoad(readFileSync(GOVERNANCE_PATH, 'utf-8')) as GovernanceConfig;
}

function findGovernancePolicy(
	governance: GovernanceConfig,
	slug: string,
	source: 'org' | 'public'
): GovernancePolicy | undefined {
	return governance.policies.find((p) => p.slug === slug && p.source === source);
}

function loadExistingSkill(repoName: string): SkillData | null {
	const skillPath = join(ORG_SKILLS_DIR, repoName, 'skill.yaml');
	if (!existsSync(skillPath)) return null;
	try {
		return yamlLoad(readFileSync(skillPath, 'utf-8')) as SkillData;
	} catch {
		return null;
	}
}

function saveSkill(repoName: string, skill: SkillData): void {
	const dir = join(ORG_SKILLS_DIR, repoName);
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
	writeFileSync(join(dir, 'skill.yaml'), yamlDump(skill, { lineWidth: 120, noRefs: true }));
}

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkRateLimit(octokit: Octokit): Promise<void> {
	const { data } = await octokit.rateLimit.get();
	const remaining = data.resources.core.remaining;
	const resetAt = data.resources.core.reset * 1000;

	if (remaining < 100) {
		const waitMs = resetAt - Date.now() + 1000;
		if (waitMs > 0) {
			console.log(`Rate limit low (${remaining} remaining). Waiting ${Math.ceil(waitMs / 1000)}s...`);
			await sleep(waitMs);
		}
	}
}

interface SkillFileInfo {
	path: string;
	sha: string;
}

async function findSkillFiles(
	octokit: Octokit,
	owner: string,
	repo: string
): Promise<SkillFileInfo[]> {
	const files: SkillFileInfo[] = [];

	// Check root SKILL.md
	try {
		const { data } = await octokit.repos.getContent({ owner, repo, path: 'SKILL.md' });
		if (!Array.isArray(data) && data.type === 'file') {
			files.push({ path: 'SKILL.md', sha: data.sha });
		}
	} catch {
		// Not found at root
	}

	// Check .claude/skills/*/SKILL.md
	try {
		const { data } = await octokit.repos.getContent({ owner, repo, path: '.claude/skills' });
		if (Array.isArray(data)) {
			for (const item of data) {
				if (item.type === 'dir') {
					try {
						const { data: skillFile } = await octokit.repos.getContent({
							owner,
							repo,
							path: `${item.path}/SKILL.md`
						});
						if (!Array.isArray(skillFile) && skillFile.type === 'file') {
							files.push({ path: `${item.path}/SKILL.md`, sha: skillFile.sha });
						}
					} catch {
						// No SKILL.md in this skill directory
					}
				}
			}
		}
	} catch {
		// No .claude/skills directory
	}

	return files;
}

async function fetchFileContent(
	octokit: Octokit,
	owner: string,
	repo: string,
	path: string
): Promise<string> {
	const { data } = await octokit.repos.getContent({ owner, repo, path });
	if (Array.isArray(data) || data.type !== 'file' || !data.content) {
		throw new Error(`Unexpected response for ${path}`);
	}
	return Buffer.from(data.content, 'base64').toString('utf-8');
}

function parseSkillMd(content: string): { frontmatter: Record<string, unknown>; body: string } {
	const parsed = matter(content);
	return {
		frontmatter: parsed.data as Record<string, unknown>,
		body: parsed.content.trim()
	};
}

async function main(): Promise<void> {
	const token = process.env.GITHUB_TOKEN;
	const org = process.env.GITHUB_ORG;

	if (!token || !org) {
		console.error('Error: GITHUB_TOKEN and GITHUB_ORG environment variables are required.');
		process.exit(1);
	}

	const octokit = new Octokit({ auth: token });
	const governance = loadGovernance();

	console.log(`Collecting skills from organization: ${org}`);

	// Fetch all repositories in the org
	const repos: Array<{ name: string; default_branch: string; html_url: string }> = [];
	let page = 1;

	while (true) {
		await checkRateLimit(octokit);
		const { data } = await octokit.repos.listForOrg({
			org,
			type: 'all',
			per_page: 100,
			page
		});

		if (data.length === 0) break;

		for (const repo of data) {
			repos.push({
				name: repo.name,
				default_branch: repo.default_branch ?? 'main',
				html_url: repo.html_url
			});
		}

		page++;
	}

	console.log(`Found ${repos.length} repositories`);

	let collectedCount = 0;
	let skippedCount = 0;

	for (const repo of repos) {
		try {
			await checkRateLimit(octokit);
			const skillFiles = await findSkillFiles(octokit, org, repo.name);

			if (skillFiles.length === 0) {
				continue;
			}

			// Use first SKILL.md found (root takes priority)
			const primarySkillFile = skillFiles[0];

			// Check if already collected with same SHA
			const existing = loadExistingSkill(repo.name);
			if (existing && existing.skill_md_sha === primarySkillFile.sha) {
				// Update governance only
				const policy = findGovernancePolicy(governance, repo.name, 'org');
				const governanceStatus = policy
					? { status: policy.status, note: policy.note, updated_by: policy.updated_by, updated_at: policy.updated_at }
					: { status: governance.defaults.org_skills };

				if (JSON.stringify(existing.governance) !== JSON.stringify(governanceStatus)) {
					existing.governance = governanceStatus;
					saveSkill(repo.name, existing);
					console.log(`  [governance] ${repo.name}`);
				} else {
					skippedCount++;
				}
				continue;
			}

			// Fetch and parse SKILL.md
			const content = await fetchFileContent(octokit, org, repo.name, primarySkillFile.path);
			const { frontmatter, body } = parseSkillMd(content);

			// Build governance
			const policy = findGovernancePolicy(governance, repo.name, 'org');
			const governanceData = policy
				? { status: policy.status, note: policy.note, updated_by: policy.updated_by, updated_at: policy.updated_at }
				: { status: governance.defaults.org_skills };

			// Extract metadata (all frontmatter fields except name/description)
			const { name, description, ...restMeta } = frontmatter;
			const metadata: Record<string, string> = {};
			for (const [key, value] of Object.entries(restMeta)) {
				if (typeof value === 'string') {
					metadata[key] = value;
				}
			}

			const skillData: SkillData = {
				slug: repo.name,
				source: 'org',
				repository: {
					owner: org,
					name: repo.name,
					url: repo.html_url,
					default_branch: repo.default_branch
				},
				skill: {
					name: (name as string) ?? repo.name,
					description: (description as string) ?? '',
					...(Object.keys(metadata).length > 0 ? { metadata } : {})
				},
				instructions_preview: body.slice(0, PREVIEW_LENGTH),
				files: skillFiles.map((f) => f.path),
				governance: governanceData,
				collected_at: new Date().toISOString(),
				skill_md_sha: primarySkillFile.sha
			};

			saveSkill(repo.name, skillData);
			collectedCount++;
			console.log(`  [collected] ${repo.name} (${skillFiles.length} skill file(s))`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.error(`  [error] ${repo.name}: ${message}`);
		}
	}

	console.log(`\nDone: ${collectedCount} collected, ${skippedCount} unchanged`);
}

main();
