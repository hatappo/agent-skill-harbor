import { error } from '@sveltejs/kit';
import { getSkillBody, loadCatalog } from '$lib/server/catalog';

export const prerender = 'auto';

export const entries = () => {
	const { skills } = loadCatalog();
	return skills.map((skill) => ({ path: skill.key }));
};

export const load = ({ params }) => {
	const { skills, freshPeriodDays } = loadCatalog();
	const path = params.path.replace(/\/+$/, '');
	const skill = skills.find((s) => s.key === path);

	if (!skill) throw error(404, 'Skill not found');

	return { skill, allSkills: skills, body: getSkillBody(skill.key), freshPeriodDays };
};
