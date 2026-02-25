---
name: manage-skill
description: Manage skills in the Agent Skill Harbor catalog. Add, remove, list skills, or update governance policy.
---

# Agent Skill Harbor - Manage Skills

You are managing the Agent Skill Harbor skill catalog. All changes are local and should be submitted as a PR.

## Directory Structure

Actual SKILL.md files are stored under `data/skills/github.com/{owner}/{repo}/{skill-path}/SKILL.md`.

Examples:
- `data/skills/github.com/anthropics/prompt-library/SKILL.md` (root-level)
- `data/skills/github.com/example-org/code-review/.claude/skills/review/SKILL.md` (nested)

## File Locations

- Skill files: `data/skills/github.com/{owner}/{repo}/...SKILL.md`
- Catalog: `data/catalog.yaml` (operational metadata + frontmatter; git-tracked)
- Governance: `config/governance.yaml`
- Web JSON: `web/static/catalog.json` (auto-generated, git-ignored)

## Actions

Parse the user's intent and execute the appropriate action below.

### Add a Skill

When the user wants to add a skill (e.g., `add owner/repo` or `add owner/repo .claude/skills/review/SKILL.md`):

1. Validate the GitHub repository exists by checking its URL
2. Determine the skill path: if the user specifies a path, use it; otherwise default to root-level (`SKILL.md`)
3. Fetch the SKILL.md from the repository
4. Add `_from` to the SKILL.md frontmatter with the source URL (e.g., `_from: ["https://github.com/{owner}/{repo}"]`). If `_from` already exists, append the URL (avoid duplicates).
5. Save it to `data/skills/github.com/{owner}/{repo}/{skill-path}/SKILL.md`
6. Add an entry to `data/catalog.yaml`:

```yaml
repositories:
  github.com/{owner}/{repo}:
    visibility: "public"  # or "private" / "internal"
    collected_at: "{current ISO timestamp}"
    skills:
      {skill-path}/SKILL.md:
        tree_sha: null
        frontmatter: {}
        files:
          - {skill-path}/SKILL.md
```

7. Run `pnpm run build:catalog` to update the catalog with frontmatter from the SKILL.md

### Remove a Skill

When the user wants to remove a skill (e.g., `remove owner/repo` or `remove owner/repo .claude/skills/review/SKILL.md`):

1. Delete the SKILL.md file (and its directory if empty)
2. Remove the skill entry from `data/catalog.yaml`
3. If no skills remain for the repo, remove the entire repo entry
4. Remove any matching entry from `config/governance.yaml`

### List Skills

When the user wants to list registered skills:

1. Read `data/catalog.yaml`
2. Display a table with: key, name (from frontmatter), usage_policy (from governance)

### Update Governance Policy

When the user wants to change governance (e.g., `govern github.com/owner/repo/SKILL.md recommended "reason"`):

Valid usage_policy values: `recommended`, `discouraged`, `prohibited`, `none`

1. Read `config/governance.yaml`
2. Find or create an entry with the key (format: `github.com/{owner}/{repo}/{skill-file-path}`)
3. Set `usage_policy` and optionally `note`
4. If usage_policy is `none`, remove the entry from governance.yaml
5. Write back `config/governance.yaml`

## Key Format

The skill key is: `github.com/{owner}/{repo}/{skill-file-path}`

Examples:
- `github.com/example-org/code-review/.claude/skills/review/SKILL.md`
- `github.com/anthropics/prompt-library/SKILL.md`

This key is used consistently in `catalog.yaml`, `governance.yaml`, and the Web UI URL.

## Important Notes

- All changes are made to local files only
- Remind the user to create a PR to apply changes
- After making changes, run `pnpm run build:catalog` to regenerate the catalog
