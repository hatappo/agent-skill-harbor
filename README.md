<p align="center"><a href="./README.md">en</a> | <a href="./README_ja.md">ja</a></p>

# Skill Warehouse

Internal agent skill catalog and governance for organizations.

## Overview

Skill Warehouse collects Agent Skills (SKILL.md) from your GitHub Organization's repositories, provides governance controls, and serves a browsable catalog via GitHub Pages.

- **No database** - Data stored as YAML/JSON in Git
- **No backend** - Frontend-only web app (SvelteKit, prerendered)
- **GitHub-native** - GitHub Actions for collection, GitHub Pages for hosting

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build catalog from YAML data
pnpm run build:catalog

# Build everything (catalog + web)
pnpm run build
```

### Organization Setup

1. Clone this repository privately into your organization
2. Configure GitHub repository variables and secrets:
   - Variable `GITHUB_ORG`: Your GitHub organization name
   - Secret `ORG_GITHUB_TOKEN`: A token with `repo` scope for your organization
3. Enable GitHub Pages (Settings > Pages > Source: GitHub Actions)
4. Edit `data/governance.yaml` to define your governance policies
5. Trigger the "Collect Skills" workflow manually for initial collection

## Project Structure

```
├── data/                 # Skill data (YAML) and governance policies
│   ├── skills/org/       # Auto-collected from org repos
│   ├── skills/public/    # Manually added public skills
│   └── governance.yaml   # Governance policy definitions
├── scripts/              # Collection and build scripts
├── web/                  # SvelteKit frontend application
└── .github/workflows/    # GitHub Actions (collect + deploy)
```

## License

MIT
