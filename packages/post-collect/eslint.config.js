import tseslint from 'typescript-eslint';
import { createTypeScriptEslintConfig } from '../../eslint.shared.js';

export default createTypeScriptEslintConfig(tseslint, ['src/**/*.ts']);
