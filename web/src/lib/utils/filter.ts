import type { GovernanceStatus, SkillEntry, SkillSource } from '$lib/types';

export interface FilterState {
	statuses: GovernanceStatus[];
	sources: SkillSource[];
}

export const defaultFilterState: FilterState = {
	statuses: [],
	sources: []
};

export function filterSkills(skills: SkillEntry[], filters: FilterState): SkillEntry[] {
	return skills.filter((skill) => {
		if (filters.statuses.length > 0 && !filters.statuses.includes(skill.governance.status)) {
			return false;
		}
		if (filters.sources.length > 0 && !filters.sources.includes(skill.source)) {
			return false;
		}
		return true;
	});
}
