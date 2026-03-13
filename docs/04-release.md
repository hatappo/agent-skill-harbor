# Release

This document describes the release workflow for the published packages.

## Packages

- `agent-skill-harbor-web`: Published web package containing the SvelteKit app source and web build dependencies
- `agent-skill-harbor`: Published CLI package containing the `harbor` executable, templates, and collector runtime

## Release Order

Always publish in this order:

1. `agent-skill-harbor-web`
2. `agent-skill-harbor`

The CLI package depends on the published `agent-skill-harbor-web` version, so releasing the CLI first can create a broken install window.

## Release Checklist

1. Update versions consistently in the root `package.json` and `web/package.json`.
2. Update changelog entries as needed.
3. Run:

```bash
pnpm install --no-frozen-lockfile
pnpm build:cli
pnpm lint
pnpm check
node dist/bin/cli.js build
pnpm pack
pnpm --filter agent-skill-harbor-web pack
```

4. Publish `agent-skill-harbor-web`.
5. Publish `agent-skill-harbor`.
6. Create the git tag after both packages are ready to consume.

## Version Scripts And Hooks

- `pnpm versions:sync`: Syncs the root version into `web/package.json` and keeps the init template on the `{{PACKAGE_VERSION}}` placeholder.
- `pnpm versions:check`: Verifies that root/web/template version references are aligned.
- `preversion`: Runs `pnpm versions:check` before `pnpm version ...` mutates package versions.
- `version`: Runs `pnpm versions:sync`, runs `pnpm versions:check` again, and stages `package.json`, `web/package.json`, `templates/init/package.template.json`, and `pnpm-lock.yaml` so the generated updates are included in the version commit.
- `prepack`: Runs `pnpm versions:check` before packing/publishing.

In other words, `pnpm version patch|minor|major` still uses pnpm's built-in version command. The `preversion` and `version` scripts are lifecycle hooks that add synchronization and validation around that command.

## Notes

- The root tarball should depend on `agent-skill-harbor-web` with the same release line.
- Web runtime dependencies belong in `web/package.json`.
- CLI-only runtime dependencies belong in the root `package.json`.
