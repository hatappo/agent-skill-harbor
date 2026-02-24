---
name: manage-skill
description: Manage public skills in the Skill Warehouse catalog. Add, remove, list public skills, or update governance status.
---

# Skill Warehouse - Manage Skills

You are managing the Skill Warehouse public skill catalog. All changes are local and should be submitted as a PR.

## File Locations

- Public skill data: `data/skills/public/{owner}_{repo}/skill.yaml`
- Governance policies: `data/governance.yaml`
- Catalog (auto-generated): `data/catalog.json`

## Actions

Parse the user's intent and execute the appropriate action below.

### Add a Public Skill

When the user wants to add a public skill (e.g., `add owner/repo`):

1. Validate the GitHub repository exists by checking its URL
2. Create directory `data/skills/public/{owner}_{repo}/`
3. Create `data/skills/public/{owner}_{repo}/skill.yaml` with this structure:

```yaml
slug: "{owner}_{repo}"
source: "public"
repository:
  owner: "{owner}"
  name: "{repo}"
  url: "https://github.com/{owner}/{repo}"
  default_branch: "main"
skill:
  name: "{name from SKILL.md or repo name}"
  description: "{description from SKILL.md or repo description}"
instructions_preview: ""
files:
  - "SKILL.md"
governance:
  status: "none"
collected_at: "{current ISO timestamp}"
skill_md_sha: ""
```

4. If possible, fetch the SKILL.md from the repository to populate `name`, `description`, `instructions_preview`, and `metadata` fields.

### Remove a Public Skill

When the user wants to remove a public skill (e.g., `remove owner/repo`):

1. Delete the directory `data/skills/public/{owner}_{repo}/`
2. Remove any matching entry from `data/governance.yaml` policies array

### List Public Skills

When the user wants to list registered public skills:

1. Read all `skill.yaml` files under `data/skills/public/`
2. Display a table with: slug, name, governance status, repository URL

### Update Governance Status

When the user wants to change governance (e.g., `govern {slug} required "reason"`):

Valid statuses: `required`, `recommended`, `deprecated`, `prohibited`, `none`

1. Read `data/governance.yaml`
2. Find or create a policy entry matching the slug
3. Update the status, note, updated_by, and updated_at fields
4. Write back `data/governance.yaml`

## Important Notes

- All changes are made to local files only
- Remind the user to create a PR to apply changes
- After making changes, run `pnpm run build:catalog` to regenerate the catalog
- The slug for public skills uses the format `{owner}_{repo}`
