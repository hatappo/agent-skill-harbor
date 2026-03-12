---
name: manage-governance
description: Manage governance policies for skills in config/governance.yaml. Set, remove, or list usage policies.
---

# Manage Governance Policies

You are managing governance policies for the Agent Skill Harbor catalog.

## File

- **Config**: `config/governance.yaml`
- **Zod schema**: `web/src/lib/schemas/governance.ts`

## Schema

```typescript
usagePolicySchema: 'recommended' | 'discouraged' | 'prohibited' | 'none'

governancePolicySchema: {
  usage_policy: UsagePolicy
  note?: string
}

governanceSchema: {
  policies: Record<string, GovernancePolicySchema>  // key = skill path
}
```

## Key Format

Skill path key: `github.com/{owner}/{repo}/{skill-file-path}`

Examples:
- `github.com/example-org/code-review/.claude/skills/review/SKILL.md`
- `github.com/anthropics/prompt-library/SKILL.md`

## Actions

Parse the user's intent and execute the appropriate action below.

### Set Policy

When the user wants to set a governance policy (e.g., `govern github.com/owner/repo/SKILL.md recommended "reason"`):

1. Read `config/governance.yaml`
2. Find or create an entry under `policies` with the skill path key
3. Set `usage_policy` to one of: `recommended`, `discouraged`, `prohibited`
4. Optionally set `note`
5. Write back `config/governance.yaml`

### Remove Policy

When the user wants to remove a governance policy or set it to `none`:

1. Read `config/governance.yaml`
2. Remove the entry from `policies`
3. Write back `config/governance.yaml`

### List Policies

When the user wants to list governance policies:

1. Read `config/governance.yaml`
2. Display a table with: skill path, usage_policy, note

## Important Notes

- All changes are made to local files only
- Remind the user to create a PR to apply changes
- After making changes, run `pnpm run build:catalog` to regenerate the catalog
