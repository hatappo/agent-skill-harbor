import type { FlatSkillEntry, UsagePolicy, Visibility } from '$lib/types';

export type OrgOwnership = 'org' | 'community';

export interface FilterState {
	statuses: UsagePolicy[];
	visibilities: Visibility[];
	orgOwnerships: OrgOwnership[];
}

export const defaultFilterState: FilterState = {
	statuses: [],
	visibilities: [],
	orgOwnerships: []
};

export function filterSkills(skills: FlatSkillEntry[], filters: FilterState): FlatSkillEntry[] {
	return skills.filter((skill) => {
		if (filters.statuses.length > 0 && !filters.statuses.includes(skill.usagePolicy as UsagePolicy)) {
			return false;
		}
		if (filters.visibilities.length > 0 && !filters.visibilities.includes(skill.visibility as Visibility)) {
			return false;
		}
		if (filters.orgOwnerships.length > 0) {
			const ownership: OrgOwnership = skill.isOrgOwned ? 'org' : 'community';
			if (!filters.orgOwnerships.includes(ownership)) {
				return false;
			}
		}
		return true;
	});
}
