import { loadCatalog, loadCollectHistory } from '$lib/server/catalog';

export const prerender = true;
export const trailingSlash = 'always';

export const load = () => {
	const { orgName, repoFullName, freshPeriodDays, skills, repos } = loadCatalog();
	const collections = loadCollectHistory();
	return { orgName, repoFullName, freshPeriodDays, skills, repos, collections };
};
