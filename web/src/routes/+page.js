import { base } from '$app/paths';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch(`${base}/catalog.json`);
	const catalog = await response.json();
	return { catalog };
}
