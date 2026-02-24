import { load as yamlLoad } from 'js-yaml';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(import.meta.dirname, '..', 'data');
const ORG_SKILLS_DIR = join(DATA_DIR, 'skills', 'org');
const PUBLIC_SKILLS_DIR = join(DATA_DIR, 'skills', 'public');
const GOVERNANCE_PATH = join(DATA_DIR, 'governance.yaml');
const CATALOG_PATH = join(DATA_DIR, 'catalog.json');

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

interface SkillEntry {
	slug: string;
	source: string;
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
	};
	collected_at: string;
}

function loadGovernance(): GovernanceConfig {
	if (!existsSync(GOVERNANCE_PATH)) {
		return { version: '1', defaults: { org_skills: 'none', public_skills: 'none' }, policies: [] };
	}
	return yamlLoad(readFileSync(GOVERNANCE_PATH, 'utf-8')) as GovernanceConfig;
}

function loadSkillsFromDir(dir: string): SkillEntry[] {
	if (!existsSync(dir)) return [];

	const entries: SkillEntry[] = [];

	for (const name of readdirSync(dir)) {
		const skillPath = join(dir, name, 'skill.yaml');
		if (!existsSync(skillPath)) continue;

		try {
			const data = yamlLoad(readFileSync(skillPath, 'utf-8')) as SkillEntry;
			entries.push(data);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.error(`  [skip] ${name}: ${message}`);
		}
	}

	return entries;
}

function applyGovernance(skills: SkillEntry[], governance: GovernanceConfig): SkillEntry[] {
	return skills.map((skill) => {
		const policy = governance.policies.find(
			(p) => p.slug === skill.slug && p.source === skill.source
		);

		if (policy) {
			return {
				...skill,
				governance: {
					status: policy.status,
					note: policy.note
				}
			};
		}

		// Apply defaults
		const defaultStatus =
			skill.source === 'org'
				? governance.defaults.org_skills
				: governance.defaults.public_skills;

		return {
			...skill,
			governance: {
				...skill.governance,
				status: skill.governance?.status ?? defaultStatus
			}
		};
	});
}

function main(): void {
	console.log('Building skill catalog...');

	const governance = loadGovernance();

	// Load skills from both directories
	const orgSkills = loadSkillsFromDir(ORG_SKILLS_DIR);
	console.log(`  Loaded ${orgSkills.length} org skill(s)`);

	const publicSkills = loadSkillsFromDir(PUBLIC_SKILLS_DIR);
	console.log(`  Loaded ${publicSkills.length} public skill(s)`);

	const allSkills = [...orgSkills, ...publicSkills];

	// Apply latest governance policies
	const skillsWithGovernance = applyGovernance(allSkills, governance);

	// Sort by name
	skillsWithGovernance.sort((a, b) => a.skill.name.localeCompare(b.skill.name));

	// Build catalog
	const catalog = {
		generated_at: new Date().toISOString(),
		skills: skillsWithGovernance.map((s) => ({
			slug: s.slug,
			source: s.source,
			repository: s.repository,
			skill: s.skill,
			instructions_preview: s.instructions_preview,
			files: s.files,
			governance: s.governance,
			collected_at: s.collected_at
		}))
	};

	writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n');
	console.log(`\nCatalog written to ${CATALOG_PATH} (${catalog.skills.length} skills)`);
}

main();
