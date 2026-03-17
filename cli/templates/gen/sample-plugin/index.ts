export async function run(context: {
	catalog: {
		repositories: Record<
			string,
			{
				skills: Record<string, { tree_sha: string | null }>;
			}
		>;
	};
}) {
	const results: Record<string, { label: string; raw: string }> = {};

	for (const [repoKey, repoEntry] of Object.entries(context.catalog.repositories)) {
		for (const skillPath of Object.keys(repoEntry.skills)) {
			const skillKey = `${repoKey}/${skillPath}`;
			results[skillKey] = {
				label: 'Sample',
				raw: 'This is a sample post-collect plugin result.',
			};
		}
	}

	return {
		summary: `Generated sample output for ${Object.keys(results).length} skill(s).`,
		label_intents: {
			Sample: 'info' as const,
		},
		results,
	};
}
