import { error } from '@sveltejs/kit';

export const prerender = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const response = await fetch('/catalog.json');
	const catalog = await response.json();

	const path = params.path.replace(/\/+$/, '');
	const skill = catalog.skills.find(/** @param {any} s */ (s) => s.key === path);

	if (!skill) {
		throw error(404, 'Skill not found');
	}

	// Fetch full skill body from per-skill static file
	const skillDir = path.replace(/\/SKILL\.md$/, '');
	let body = '';
	try {
		const bodyRes = await fetch(`/skills/${skillDir}/body.md`);
		if (bodyRes.ok) {
			body = await bodyRes.text();
		}
	} catch {
		// body file may not exist
	}

	return { skill, allSkills: catalog.skills, body };
}
