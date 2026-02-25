export type UsagePolicy = 'required' | 'recommended' | 'discouraged' | 'prohibited' | 'none';
export type Visibility = 'public' | 'private' | 'internal';

export interface SkillMetadata {
	usagePolicy: UsagePolicy;
	note?: string;
}

export interface CatalogSkillEntry {
	tree_sha: string | null;
	frontmatter: Record<string, unknown>;
	files: string[];
}

export interface RepositoryEntry {
	visibility: Visibility;
	repo_sha?: string;
	collected_at?: string;
	skills: Record<string, CatalogSkillEntry>;
}

export interface Catalog {
	repositories: Record<string, RepositoryEntry>;
}

export interface FlatSkillEntry {
	key: string;
	repoKey: string;
	skillPath: string;
	platform: string;
	owner: string;
	repo: string;
	visibility: Visibility;
	isOrgOwned: boolean;
	frontmatter: Record<string, unknown>;
	files: string[];
	excerpt: string;
	usagePolicy: UsagePolicy;
	note?: string;
}

export interface FlatCatalog {
	generated_at: string;
	skills: FlatSkillEntry[];
}
