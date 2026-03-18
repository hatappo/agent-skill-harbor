# Local Development

## For Users (npm package)

If you created your project via `npx agent-skill-harbor init`:

```bash
pnpm install
pnpm dev          # Start development server
pnpm collect      # Collect skills from your org
pnpm build        # Build static site
pnpm preview      # Preview built site
```

These scripts call the `harbor` CLI under the hood.

## For Contributors (from source)

### Prerequisites

- Node.js 24+
- pnpm 10+

### Getting Started

```bash
git clone https://github.com/skill-mill/agent-skill-harbor.git
cd agent-skill-harbor
pnpm install
pnpm setup:dev    # Create .env and pull demo config/data/guide
# Edit .env: uncomment and set GH_TOKEN, GH_ORG
tsx cli/bin/cli.ts dev
```

The development server will start at `http://localhost:5173`.

`pnpm setup:dev` prepares the project root as follows (all generated folders are gitignored):

1. `cli/templates/init/.env.example` → `.env`
2. Download the `skill-mill/agent-skill-harbor-demo` archive from GitHub
3. Copy `config/` from the demo repo → `config/`
4. Copy `data/` from the demo repo → `data/`
5. Copy `guide/` from the demo repo → `guide/`

This command requires network access.

### Commands

```bash
tsx cli/bin/cli.ts dev        # Start development server
tsx cli/bin/cli.ts build      # Build the catalog site via CLI
tsx cli/bin/cli.ts preview    # Preview built site
cd web && pnpm check          # Type check web package
cd web && pnpm lint           # Lint web package
pnpm format       # Format all files with Prettier
pnpm --dir cli build          # Build CLI package (after modifying bin/ or src/)
GH_TOKEN=$(gh auth token) node cli/dist/bin/cli.js collect   # Collect skills from source
node cli/dist/bin/cli.js post-collect --collect-id <collect_id>
pnpm setup:dev                # Refresh local demo config/data/guide
```

The demo data includes `data/collects.yaml`, `data/skills.yaml`, and sample plugin outputs from the demo repository.

When running the built CLI from the source repository, execute it from the repository root so `config/` and `data/` resolve correctly.

### Project Structure

```
├── collector/             # Published collect runtime package
├── cli/
│   ├── bin/              # Thin harbor wrapper
│   ├── src/cli/          # init/gen and command dispatch
│   └── templates/        # Project scaffold templates bundled into the wrapper package
├── post-collect/         # Published post-collect runtime package
├── scripts/              # Development scripts (setup-dev, collect)
├── web/                  # SvelteKit frontend application
│   ├── src/cli/          # build/dev/preview/deploy command entrypoints
│   ├── src/lib/server/   # Server-side data loading (catalog, docs)
│   ├── src/routes/       # Pages (catalog, skill detail, graph, docs)
│   └── src/lib/i18n/     # Internationalization (en, ja)
├── guide/                # Demo guide content pulled by setup:dev
├── config/               # Human-managed settings (gitignored, created by setup:dev)
├── data/                 # Machine-generated skill data (gitignored, created by setup:dev)
└── docs/                 # Documentation
```

### Key Architecture

- **`SKILL_HARBOR_ROOT` environment variable**: Controls where data/config/docs are read from. When using the CLI, this is automatically set to the user's project directory. For development, it falls back to the repository root.
- **`web/vite.config.ts`**: Injects `__PROJECT_ROOT__` as a compile-time constant from `SKILL_HARBOR_ROOT`.
- **`web/src/lib/server/catalog.ts`**: Reads `data/skills.yaml` and `data/skills/` at build time for prerendering.
- **`adapter-static`**: All pages are prerendered to static HTML at build time. No server runtime needed.

### Package Layout

- **`agent-skill-harbor`**: Thin published wrapper package rooted at `cli/`. It provides the `harbor` executable, `init`, `gen`, templates, and command dispatch.
- **`agent-skill-harbor-collector`**: Published collect runtime package rooted at `collector/`.
- **`agent-skill-harbor-post-collect`**: Published post-collect runtime package rooted at `post-collect/`. Heavy dependencies such as `promptfoo` live here.
- **`agent-skill-harbor-web`**: Published SvelteKit web package rooted at `web/`. It also owns `build`, `dev`, `preview`, and `deploy`.
- **Install surface split**: Generated projects keep `tools/harbor/collector`, `tools/harbor/post-collect`, and `tools/harbor/web` so workflows can install only the dependencies they need.
- **Dependency ownership**: Web UI and SvelteKit dependencies belong in `web/package.json`. Collect-only runtime dependencies belong in `collector/package.json`. Post-collect-only runtime dependencies belong in `post-collect/package.json`. The root `package.json` is workspace-only.

### Release Notes

- Release only the package that changed.
- If both packages are released together, publish `agent-skill-harbor-web` first and `agent-skill-harbor` second.
- For the detailed release workflow, see [92-release.md](92-release.md).
