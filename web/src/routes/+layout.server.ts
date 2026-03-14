import { loadCatalog, loadCollectHistory, loadSettingsConfig } from '$lib/server/catalog';

export const prerender = true;
export const trailingSlash = 'never';

export const load = () => {
	const { orgName, repoFullName, freshPeriodDays, skills, repos } = loadCatalog();
	const collections = loadCollectHistory();
	const settings = loadSettingsConfig();
	return { orgName, repoFullName, freshPeriodDays, skills, repos, collections, settings };
};
