import { loadCatalog } from '$lib/server/catalog';

export const prerender = true;
export const trailingSlash = 'always';

export const load = () => {
	const { orgName, freshPeriodDays, skills } = loadCatalog();
	return { orgName, freshPeriodDays, skills };
};
