import matter from 'gray-matter';
import { dump as yamlDump, load as yamlLoad } from 'js-yaml';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DATA_DIR = join(import.meta.dirname, '..', 'data');
const SKILLS_DIR = join(DATA_DIR, 'skills');
const GOVERNANCE_PATH = join(DATA_DIR, 'governance.yaml');
const CATALOG_YAML_PATH = join(DATA_DIR, 'catalog.yaml');
const WEB_CATALOG_PATH = join(import.meta.dirname, '..', 'web', 'static', 'catalog.json');

type UsagePolicy = 'required' | 'recommended' | 'discouraged' | 'prohibited' | 'none';

interface GovernanceEntry {
	usagePolicy: UsagePolicy;
	note?: string;
}

interface SkillEntry {
	tree_sha: string | null;
	frontmatter: Record<string, unknown>;
	files: string[];
}

interface RepositoryEntry {
	visibility: string;
	repo_sha?: string;
	collected_at?: string;
	skills: Record<string, SkillEntry>;
}

interface CatalogYaml {
	repositories: Record<string, RepositoryEntry>;
}

interface FlatSkillEntry {
	key: string;
	repoKey: string;
	skillPath: string;
	platform: string;
	owner: string;
	repo: string;
	visibility: string;
	frontmatter: Record<string, unknown>;
	files: string[];
	usagePolicy: string;
	note?: string;
}

interface DiscoveredSkill {
	frontmatter: Record<string, unknown>;
	files: string[];
}

function loadGovernance(): Record<string, GovernanceEntry> {
	if (!existsSync(GOVERNANCE_PATH)) {
		return {};
	}
	const raw = yamlLoad(readFileSync(GOVERNANCE_PATH, 'utf-8'));
	if (!raw || typeof raw !== 'object') return {};
	return raw as Record<string, GovernanceEntry>;
}

function loadExistingCatalog(): CatalogYaml {
	if (!existsSync(CATALOG_YAML_PATH)) {
		return { repositories: {} };
	}
	try {
		const raw = yamlLoad(readFileSync(CATALOG_YAML_PATH, 'utf-8')) as CatalogYaml;
		return raw?.repositories ? raw : { repositories: {} };
	} catch {
		return { repositories: {} };
	}
}

/**
 * Collect all files in a skill directory (relative to repoDir).
 * For root-level SKILL.md, returns just ["SKILL.md"].
 * For nested skills (e.g., .claude/skills/review/SKILL.md), returns all files in that directory.
 */
function collectSkillFiles(repoDir: string, skillPath: string): string[] {
	const skillDir = skillPath === 'SKILL.md' ? null : skillPath.replace(/\/SKILL\.md$/, '');

	if (!skillDir) {
		return ['SKILL.md'];
	}

	const fullSkillDir = join(repoDir, skillDir);
	if (!existsSync(fullSkillDir) || !statSync(fullSkillDir).isDirectory()) {
		return [skillPath];
	}

	const files: string[] = [];
	walkForFiles(fullSkillDir, skillDir, files);
	return files.sort();
}

function walkForFiles(currentDir: string, relPrefix: string, files: string[]): void {
	for (const entry of readdirSync(currentDir)) {
		if (entry.startsWith('_')) continue;
		const fullPath = join(currentDir, entry);
		const stat = statSync(fullPath);

		if (stat.isFile()) {
			files.push(`${relPrefix}/${entry}`);
		} else if (stat.isDirectory()) {
			walkForFiles(fullPath, `${relPrefix}/${entry}`, files);
		}
	}
}

/**
 * Walk a repo directory to find all SKILL.md files and parse their frontmatter + files.
 */
function findSkillMdFiles(repoDir: string): Record<string, DiscoveredSkill> {
	const skills: Record<string, DiscoveredSkill> = {};
	walkForSkillMd(repoDir, repoDir, skills);
	return skills;
}

function walkForSkillMd(
	baseDir: string,
	currentDir: string,
	skills: Record<string, DiscoveredSkill>
): void {
	for (const entry of readdirSync(currentDir)) {
		if (entry.startsWith('_')) continue;
		const fullPath = join(currentDir, entry);
		const stat = statSync(fullPath);

		if (stat.isFile() && entry === 'SKILL.md') {
			const relDir = relative(baseDir, currentDir);
			const skillPath = relDir ? `${relDir}/SKILL.md` : 'SKILL.md';

			try {
				const content = readFileSync(fullPath, 'utf-8');
				const parsed = matter(content);
				const body = parsed.content.trim();
				const frontmatter: Record<string, unknown> = {
					...parsed.data,
					...(body ? { _excerpt: body.slice(0, 500) } : {})
				};
				const files = collectSkillFiles(baseDir, skillPath);

				skills[skillPath] = { frontmatter, files };
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				console.error(`  [skip] ${fullPath}: ${message}`);
			}
		} else if (stat.isDirectory()) {
			walkForSkillMd(baseDir, fullPath, skills);
		}
	}
}

/**
 * Discover all repos under data/skills/github.com/ and merge with existing catalog metadata.
 */
function buildCatalog(existing: CatalogYaml): CatalogYaml {
	const catalog: CatalogYaml = { repositories: {} };

	const platformDir = join(SKILLS_DIR, 'github.com');
	if (!existsSync(platformDir)) return catalog;

	for (const owner of readdirSync(platformDir)) {
		const ownerDir = join(platformDir, owner);
		if (!statSync(ownerDir).isDirectory()) continue;

		for (const repo of readdirSync(ownerDir)) {
			const repoDir = join(ownerDir, repo);
			if (!statSync(repoDir).isDirectory()) continue;

			const repoKey = `github.com/${owner}/${repo}`;
			const existingRepo = existing.repositories[repoKey];
			const freshSkills = findSkillMdFiles(repoDir);

			if (Object.keys(freshSkills).length === 0) continue;

			const mergedSkills: Record<string, SkillEntry> = {};
			for (const [skillPath, discovered] of Object.entries(freshSkills)) {
				const existingSkill = existingRepo?.skills?.[skillPath];
				mergedSkills[skillPath] = {
					tree_sha: (existingSkill as SkillEntry | undefined)?.tree_sha ?? null,
					frontmatter: discovered.frontmatter,
					files: discovered.files
				};
			}

			catalog.repositories[repoKey] = {
				visibility: existingRepo?.visibility ?? 'public',
				...(existingRepo?.repo_sha ? { repo_sha: existingRepo.repo_sha } : {}),
				...(existingRepo?.collected_at ? { collected_at: existingRepo.collected_at } : {}),
				skills: mergedSkills
			};
		}
	}

	return catalog;
}

function buildFlatCatalog(
	catalog: CatalogYaml,
	governance: Record<string, GovernanceEntry>
): { generated_at: string; skills: FlatSkillEntry[] } {
	const skills: FlatSkillEntry[] = [];

	for (const [repoKey, repoEntry] of Object.entries(catalog.repositories)) {
		const parts = repoKey.split('/');
		const platform = parts[0];
		const owner = parts[1];
		const repo = parts[2];

		for (const [skillPath, skillData] of Object.entries(repoEntry.skills)) {
			const key = `${repoKey}/${skillPath}`;
			const gov = governance[key];

			const entry: FlatSkillEntry = {
				key,
				repoKey,
				skillPath,
				platform,
				owner,
				repo,
				visibility: repoEntry.visibility,
				frontmatter: skillData.frontmatter,
				files: skillData.files,
				usagePolicy: gov?.usagePolicy ?? 'none',
				...(gov?.note ? { note: gov.note } : {})
			};

			skills.push(entry);
		}
	}

	skills.sort((a, b) => {
		const nameA = String(a.frontmatter.name ?? a.key).toLowerCase();
		const nameB = String(b.frontmatter.name ?? b.key).toLowerCase();
		return nameA.localeCompare(nameB);
	});

	return { generated_at: new Date().toISOString(), skills };
}

function main(): void {
	console.log('Building skill catalog...');

	const governance = loadGovernance();
	console.log(`  Loaded ${Object.keys(governance).length} governance policy(ies)`);

	const existing = loadExistingCatalog();
	const catalog = buildCatalog(existing);

	const repoCount = Object.keys(catalog.repositories).length;
	const skillCount = Object.values(catalog.repositories).reduce(
		(sum, r) => sum + Object.keys(r.skills).length,
		0
	);
	console.log(`  Discovered ${skillCount} skill(s) in ${repoCount} repository(ies)`);

	// Write catalog.yaml (preserving operational metadata, updating frontmatter)
	writeFileSync(CATALOG_YAML_PATH, yamlDump(catalog, { lineWidth: 120, noRefs: true }));
	console.log(`  Written ${CATALOG_YAML_PATH}`);

	// Generate web JSON
	const flatCatalog = buildFlatCatalog(catalog, governance);
	writeFileSync(WEB_CATALOG_PATH, JSON.stringify(flatCatalog, null, 2) + '\n');
	console.log(`  Written ${WEB_CATALOG_PATH}`);

	console.log(`\nDone: ${flatCatalog.skills.length} skills in catalog`);
}

main();
