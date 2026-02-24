# Setup Guide

This guide explains how to deploy Agent Skill Harbor for your organization.

## Prerequisites

- GitHub Organization
- Node.js 22+
- pnpm 10+

## Step 1: Clone the Repository

Clone this repository as a **private** repository within your organization.

```bash
git clone https://github.com/your-org/agent-skill-harbor.git
cd agent-skill-harbor
pnpm install
```

## Step 2: Configure GitHub Secrets and Variables

Go to your repository's **Settings > Secrets and variables > Actions**.

### Repository Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_ORG` | Your GitHub organization name | `my-org` |

### Repository Secrets

| Secret | Description |
|--------|-------------|
| `ORG_GITHUB_TOKEN` | Personal Access Token (classic) or GitHub App token with `repo` scope for your organization |

The token needs read access to all repositories in the organization to scan for SKILL.md files.

## Step 3: Enable GitHub Pages

1. Go to **Settings > Pages**
2. Set **Source** to **GitHub Actions**
3. For internal repositories, the page will be accessible only to organization members

## Step 4: Initial Skill Collection

1. Go to **Actions > Collect Skills**
2. Click **Run workflow** to trigger the first collection
3. The workflow will scan all org repositories for SKILL.md files
4. Collected data will be committed to the `data/` directory

## Step 5: Configure Governance Policies

Edit `data/governance.yaml` to define your organization's skill policies:

```yaml
version: "1"

defaults:
  org_skills: "none"
  public_skills: "none"

policies:
  - slug: "your-skill-repo"
    source: "org"
    status: "required"       # required | recommended | deprecated | prohibited | none
    note: "Reason for this status"
    updated_by: "team-name"
    updated_at: "2026-02-24T00:00:00Z"
```

Commit and push the changes. The deploy workflow will automatically rebuild the web UI.

## Step 6: Add Public Skills (Optional)

Use the Claude Code slash command to add public skills:

```
/manage-skill add owner/repo
```

Or manually create `data/skills/public/{owner}_{repo}/skill.yaml`.

## Local Development

```bash
# Build catalog from YAML data
pnpm run build:catalog

# Copy catalog to web static (needed for dev server)
cp data/catalog.json web/static/catalog.json

# Start development server
pnpm dev
```

## Workflow Overview

```
┌─────────────────────────┐
│  Collect Skills (cron)  │
│  - Scan org repos       │
│  - Parse SKILL.md       │
│  - Write YAML           │
│  - Build catalog.json   │
│  - Commit & push        │
└────────┬────────────────┘
         │ triggers
         ▼
┌─────────────────────────┐
│  Deploy Pages           │
│  - Build SvelteKit      │
│  - Deploy to GH Pages   │
└─────────────────────────┘
```
