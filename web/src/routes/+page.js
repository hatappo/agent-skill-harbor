/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/catalog.json');
	const catalog = await response.json();
	return { catalog };
}
