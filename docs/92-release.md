# Release

This document describes the release workflow for the published packages.

## Packages

- `agent-skill-harbor`: Thin published wrapper package containing the `harbor` executable, templates, and command dispatch
- `agent-skill-harbor-collector`: Published collect runtime package
- `agent-skill-harbor-post-collect`: Published post-collect runtime package
- `agent-skill-harbor-web`: Published web package containing the SvelteKit app source and web build dependencies

## Release Strategy

- Release only the package that changed.
- If multiple packages changed, publish runtime packages before the wrapper package.
- Publish reusable workflow changes through git tags in this repository, not through npm.

Recommended order when several packages changed:

1. `agent-skill-harbor-web`
2. `agent-skill-harbor-collector`
3. `agent-skill-harbor-post-collect`
4. `agent-skill-harbor`

## Release Checklist

### Shared

1. Decide which package is being released.
2. Bump only that package version in its own `package.json`.
3. Update changelog entries as needed.
4. Verify `packages/shared-internal/` before releasing `collector` or `post-collect`, because both public packages depend on it even though it is not published to npm.

```bash
pnpm --dir packages/shared-internal verify
pnpm --dir packages/shared-internal build
```

### Releasing `agent-skill-harbor-web`

```bash
pnpm install --no-frozen-lockfile
pnpm --dir packages/web verify
pnpm --dir packages/web build
cd packages/web
# npm pack  # Only when changing files/README/package contents
npm publish --access public
cd ..
git tag web-v<version>
```

### Releasing `agent-skill-harbor-collector`

```bash
pnpm install --no-frozen-lockfile
pnpm --dir packages/collector verify
pnpm --dir packages/collector build
cd packages/collector
npm publish --access public
cd ..
git tag collector-v<version>
```

### Releasing `agent-skill-harbor-post-collect`

```bash
pnpm install --no-frozen-lockfile
pnpm --dir packages/post-collect verify
pnpm --dir packages/post-collect build
cd packages/post-collect
npm publish --access public
cd ..
git tag post-collect-v<version>
```

### Releasing `agent-skill-harbor`

```bash
pnpm install --no-frozen-lockfile
pnpm --dir packages/cli verify
pnpm --dir packages/cli build
node packages/cli/dist/bin/cli.js build
cd packages/cli
# npm pack  # Only when changing files/bin/templates/README
npm publish --access public
cd ..
git tag cli-v<version>
```

### Releasing multiple packages

1. Release `agent-skill-harbor-web` first.
2. Release `agent-skill-harbor-collector` and/or `agent-skill-harbor-post-collect`.
3. Release `agent-skill-harbor` last if its metadata or templates changed.
4. Create tags after the published package set is ready to consume.

## Tagging

- Use package-specific git tags instead of a single repository-wide version tag.
- CLI releases use `cli-vX.Y.Z`.
- Web releases use `web-vX.Y.Z`.
- Collector releases use `collector-vX.Y.Z`.
- Post-collect releases use `post-collect-vX.Y.Z`.
- Reusable workflow releases use dedicated tags such as `wf-v0`, `wf-v0.14`, or `wf-v0.14.0`.

## Reusable Workflow Tags

- Generated `CollectSkills` workflows call `skill-mill/agent-skill-harbor/.github/workflows/collect.yml@wf-v0`.
- Updating the reusable workflow does not require an npm publish, but it does require moving or creating the referenced workflow tag.
- Move `wf-v0` only for non-breaking workflow changes.
- Create a new major workflow tag only when caller compatibility expectations change materially.

## Workflow Action Pins

- Harbor keeps external GitHub Actions pinned by commit SHA in both the reusable workflow and the generated deploy workflow templates.
- Before updating those pins, run:
  - `pnpm actions:check` may also show a proposed ref bump for the generated `CollectSkills` caller workflow.
  - Ignore that reusable-workflow ref update. The template intentionally stays on `@wf-v0`, and `actions:pin` restores it after running `actions-up`.

```bash
pnpm actions:check
```

- Apply the updates only after reviewing the proposed diff:

```bash
pnpm actions:pin
```

- The current update flow is intentionally hybrid:
  - `actions-up` updates most external actions with `--mode minor` and `--min-age 7`.
  - `pnpm/action-setup` remains a documented manual follow-up, because `actions-up` does not track that action reliably in this repository.
- `actions/upload-artifact` and `actions/download-artifact` are intentionally pinned on their current newer major lines after manual review, so future automated checks continue from those majors.
- `pnpm actions:check` also prints the latest `pnpm/action-setup` v4 release so you can decide whether the manually pinned SHA should be updated.
- When you update `pnpm/action-setup`, keep it on the current major line intentionally and replace the pinned SHA by hand after reviewing the release.

## Versioning Notes

- `packages/cli/package.json`, `packages/collector/package.json`, `packages/post-collect/package.json`, and `packages/web/package.json` version independently as public packages.
- `packages/shared-internal/package.json` is a private internal package. Keep its version aligned within the monorepo, but do not publish it to npm.
- `packages/cli/templates/init/package.template.json` and `packages/cli/templates/init/tools/harbor/*/package.template.json` must stay aligned with the package versions you intend to publish.

## Notes

- Web runtime dependencies belong in `packages/web/package.json`.
- Wrapper-only runtime dependencies belong in `packages/cli/package.json`.
- Collect-only runtime dependencies belong in `packages/collector/package.json`.
- Post-collect-only runtime dependencies belong in `packages/post-collect/package.json`.
- In this workspace, `pnpm publish` did not behave reliably for per-package releases, so the current workaround is to run `npm publish` directly from each package directory.
- The Vite chunk-size warning is currently expected. A manual chunking experiment showed that most of the remaining weight comes from `three`, so we are not keeping extra chunk-splitting config unless we decide to optimize the graph implementation more deeply.
