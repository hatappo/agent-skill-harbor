---
name: linting-guide
description: "Configure and troubleshoot linting rules for TypeScript, JavaScript, and Python projects. Use when setting up or fixing linter configurations."
metadata:
  tags: linting, eslint, prettier, ruff, code-quality
---

For TypeScript and JavaScript projects, use ESLint for code quality rules and Prettier exclusively for formatting — never enable ESLint's stylistic rules when Prettier is present, as they will conflict. Start with `@typescript-eslint/recommended` and `eslint:recommended` presets, then layer on project-specific overrides sparingly. Install `eslint-config-prettier` to disable all formatting-related ESLint rules, and run Prettier as the final step in the linting pipeline. Define all configuration in `eslint.config.mjs` (flat config format) rather than the legacy `.eslintrc` cascade to avoid resolution ambiguity.

For Python projects, adopt Ruff as both the linter and formatter to replace the Flake8 + Black + isort toolchain. Configure Ruff in `pyproject.toml` under `[tool.ruff]`, enabling rule sets like `E` (pycodestyle), `F` (pyflakes), `I` (isort), `UP` (pyupgrade), and `B` (flake8-bugbear). Set `target-version` to the project's minimum supported Python version and define `line-length` to match the team standard (typically 88 or 120). Use `per-file-ignores` to relax rules in test files and migration scripts where strictness is counterproductive.

When conflicts arise between linters, identify which tool owns the rule category and disable the duplicate in the other tool. Run linters in CI as a required check with `--max-warnings 0` to prevent gradual degradation. To create custom ESLint rules, use the `RuleCreator` utility from `@typescript-eslint/utils` and accompany each rule with test cases using `RuleTester`. For gradual adoption of new rules in existing codebases, use the `--fix` flag to auto-correct what is safe, then suppress remaining violations with inline comments and track them as tech debt tickets.
