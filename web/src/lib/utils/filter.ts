import type { FlatSkillEntry, UsagePolicy, Visibility } from '$lib/types';

export interface FilterState {
	statuses: UsagePolicy[];
	visibilities: Visibility[];
}

export const defaultFilterState: FilterState = {
	statuses: [],
	visibilities: []
};

export function filterSkills(skills: FlatSkillEntry[], filters: FilterState): FlatSkillEntry[] {
	return skills.filter((skill) => {
		if (filters.statuses.length > 0 && !filters.statuses.includes(skill.usagePolicy as UsagePolicy)) {
			return false;
		}
		if (filters.visibilities.length > 0 && !filters.visibilities.includes(skill.visibility as Visibility)) {
			return false;
		}
		return true;
	});
}
