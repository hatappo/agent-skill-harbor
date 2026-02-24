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

	return { skill };
}
