import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const response = await fetch('/catalog.json');
	const catalog = await response.json();
	const skill = catalog.skills.find(/** @param {any} s */ (s) => s.slug === params.slug);

	if (!skill) {
		throw error(404, 'Skill not found');
	}

	return { skill };
}
