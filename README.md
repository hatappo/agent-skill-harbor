<p align="center"><a href="./README.md">en</a> | <a href="./README_ja.md">ja</a></p>

# Agent Skill Harbor

Agent Skill Harbor is a skill management platform for teams and organizations.

It helps teams collect, share, audit, and publish AI agent skills across repositories, with provenance tracking, governance support, and safety checks built in.

It is designed to be serverless, DB-less, and Git- and GitHub-native, because skills are mostly text artifacts that already fit naturally in Git.

## Screenshots

|                                                             Card View                                                              |                                                             List View                                                              |
| :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
| ![Card View](https://raw.githubusercontent.com/skill-mill/agent-skill-harbor/main/docs/img/agent-skill-harbor-screenshot-card.png) | ![List View](https://raw.githubusercontent.com/skill-mill/agent-skill-harbor/main/docs/img/agent-skill-harbor-screenshot-list.png) |

### Stats View

![Stats View](https://raw.githubusercontent.com/skill-mill/agent-skill-harbor/main/docs/img/agent-skill-harbor-screenshot-stats.png)

### Graph View

![Graph View](https://raw.githubusercontent.com/skill-mill/agent-skill-harbor/main/docs/img/agent-skill-harbor-screenshot-graph.gif)

## Features

- Skill cataloging: collect and publish AI agent skills across repositories
- Governance: mark skills as recommended, discouraged, or prohibited
- Provenance: track copied or installed skills back to their origin
- Skill analysis: `builtin.audit-skill-scanner` analyzes collected skills and audits safety
- Slack notification: `builtin.notify-slack` sends post-collection summaries

## Technical Highlights

- Serverless: the catalog UI is a prerendered static web app
- DB-less & Git-native: collected data is stored in `data/` as YAML/JSON and committed back to Git
- GitHub-native: data is updated with GitHub Actions and hosted on GitHub Pages

Demo site:

- https://skill-mill.github.io/agent-skill-harbor-demo/

## Quick Start

```bash
npx agent-skill-harbor init my-skill-harbor
cd my-skill-harbor

pnpm install
pnpm install --dir collector

# edit .env and set GH_ORG

gh auth login && GH_TOKEN=$(gh auth token) pnpm collect
# Or edit .env and set GH_TOKEN, then run:
# pnpm collect
pnpm dev
```

`pnpm install` installs the root package (`agent-skill-harbor`) for CLI + web.  
`pnpm install --dir collector` installs the collector runtime used by `pnpm collect` and `pnpm post-collect`.

## CLI Commands

When installed, the main CLI is available as `harbor` or `agent-skill-harbor`.

| Command                    | Description                            |
| -------------------------- | -------------------------------------- |
| `harbor init [dir]`        | Scaffold a new project                 |
| `harbor setup <plugin-id>` | Scaffold optional plugin runtime files |

Daily project operations are exposed through the generated root scripts:

```bash
pnpm collect
pnpm post-collect
pnpm dev
pnpm build
pnpm preview
```

## Organization Setup

1. Create a new project with `npx agent-skill-harbor init`.
2. Push it to a private repository in your organization.
3. Configure `GH_TOKEN` as a GitHub Actions secret.
4. Enable GitHub Pages or Cloudflare Pages.
5. Run the generated `CollectSkills` workflow once.

The generated `CollectSkills` workflow is a thin caller pinned to Harbor's reusable workflow at `wf-v0`.

Inside the reusable workflow:

- `collect` installs only `collector/` core dependencies and runs collection
- `post_collect` restores the collected artifact, installs `collector/` core dependencies again, then installs only enabled optional plugin manifests
- the final `data/` directory is committed back to the repository

This keeps GitHub collection and optional post-collect dependencies structurally separate.

See [Organization Setup](docs/01-organization-setup.md) for details.

## Project Structure

```sh
my-skill-harbor/
├── .github/workflows/
│
├── config/
│   ├── harbor.yaml         # General application settings
│   └── governance.yaml     # Additional governance settings
│
├── collector/              # Batch processing for skill collection
│   ├── package.json
│   └── plugins/
│       └── <plugin-id>/    # Per-plugin manifests and code
│
├── data/
│   ├── assets/
│   ├── collects.yaml       # History of skill collection runs
│   ├── plugins/            # Outputs produced by each plugin
│   ├── skills.yaml         # Index of collected skills
│   └── skills/             # Cached files for collected skills
│
├── .env
│
├── guide/
│
└── package.json            # Manifest for the web UI
```

Notes:

- root `package.json` depends only on `agent-skill-harbor`
- `collector/package.json` is a Harbor-managed runtime manifest for `agent-skill-harbor-collector`
- optional plugin manifests and example user-defined plugins live under `collector/plugins/<plugin-id>/`

## Post-Collect Plugins

Built-in plugins are enabled from `config/harbor.yaml`.

Examples:

- `builtin.detect-drift`
- `builtin.notify-slack`
- `builtin.audit-promptfoo-security`
- `builtin.audit-skill-scanner`

Optional runtime files are scaffolded with `harbor setup`:

```bash
harbor setup example-user-defined-plugin
harbor setup builtin.audit-promptfoo-security
harbor setup builtin.audit-skill-scanner
```

Generated files go under `collector/plugins/<plugin-id>/`.

See [Post-Collect Plugins](docs/03-post-collect-plugins.md).

## Documentation

- [Organization Setup](docs/01-organization-setup.md)
- [Skill Catalog Guide](docs/02-skill-catalog.md)
- [Post-Collect Plugins](docs/03-post-collect-plugins.md)
- [Governance Guide](docs/04-governance-guide.md)
- [Local Development](docs/91-local-development.md)
- [Release](docs/92-release.md)

## FAQ

### Is it okay to store this much data in Git?

Yes. Harbor mainly stores text data such as YAML, JSON, Markdown, and cached skill files. It does not assume large multimedia assets like images or videos, and the total volume is usually limited enough that Git's compression works well.

GitHub's official documentation says repositories should ideally stay under 1 GB, and keeping them under 5 GB is strongly recommended. In Harbor's case, reaching that scale is highly unlikely unless you intentionally store large non-text assets or collect an unusually large amount of unrelated data.

See GitHub Docs: [About large files on GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)

### You say this is for teams and organizations. Can I use it personally?

Yes, absolutely. You can use Harbor to collect, manage, and catalog skills across your own repositories.

The main caveat is hosting. For personal use, GitHub Pages cannot be private, so you would likely want to host the generated site somewhere else you control securely. If there is enough demand, the documentation and workflows can be expanded to support that path more explicitly.

Or you may simply decide to publish your own skill catalog openly and not worry about that. That is entirely up to you.

### Can I add custom properties to the YAML frontmatter in `SKILL.md`?

Yes. The [Agent Skills](https://agentskills.io/) specification is shared across agents, but **there is no restriction on YAML frontmatter keys that are not defined by the standard**. In practice, agents often carry their own custom properties, and unknown properties are generally ignored.

Also, the `_from` property used by Harbor typically consumes only around 10 to 20 tokens. Even if a project loads dozens of skills, the impact is usually negligible.

## License

MIT
