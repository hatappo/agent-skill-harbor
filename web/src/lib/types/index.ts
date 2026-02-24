export type GovernanceStatus = 'required' | 'recommended' | 'deprecated' | 'prohibited' | 'none';
export type SkillSource = 'org' | 'public';

export interface Repository {
	owner: string;
	name: string;
	url: string;
	default_branch: string;
}

export interface SkillMeta {
	name: string;
	description: string;
	metadata?: Record<string, string>;
}

export interface Governance {
	status: GovernanceStatus;
	note?: string;
	updated_by?: string;
	updated_at?: string;
}

export interface SkillEntry {
	slug: string;
	source: SkillSource;
	repository: Repository;
	skill: SkillMeta;
	instructions_preview: string;
	files: string[];
	governance: Governance;
	collected_at: string;
}

export interface Catalog {
	generated_at: string;
	skills: SkillEntry[];
}
