import Fuse from 'fuse.js';
import type { SkillEntry } from '$lib/types';

const fuseOptions: Fuse.IFuseOptions<SkillEntry> = {
	keys: [
		{ name: 'skill.name', weight: 3 },
		{ name: 'skill.description', weight: 2 },
		{ name: 'skill.metadata.author', weight: 1 },
		{ name: 'repository.name', weight: 1 }
	],
	threshold: 0.3,
	includeScore: true
};

export function createSearchIndex(skills: SkillEntry[]): Fuse<SkillEntry> {
	return new Fuse(skills, fuseOptions);
}

export function searchSkills(fuse: Fuse<SkillEntry>, query: string): SkillEntry[] {
	if (!query.trim()) return [];
	return fuse.search(query).map((result) => result.item);
}
