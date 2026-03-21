const sharedTypeScriptRules = {
	'no-unused-vars': 'off',
	'@typescript-eslint/no-unused-vars': 'off',
	'@typescript-eslint/no-explicit-any': 'off',
};

export function createTypeScriptEslintConfig(tseslint, files) {
	return tseslint.config(
		{
			ignores: ['dist/**'],
		},
		...tseslint.configs.recommended,
		{
			files,
			rules: sharedTypeScriptRules,
		},
	);
}
