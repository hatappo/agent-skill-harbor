import { loadSettingsConfig, loadGovernanceConfig } from '$lib/server/catalog';

export const load = () => {
	return {
		settings: loadSettingsConfig(),
		governance: loadGovernanceConfig(),
	};
};
