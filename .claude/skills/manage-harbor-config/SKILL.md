---
name: manage-harbor-config
description: Manage harbor configuration in config/harbor.yaml. View or update collector and catalog settings.
---

# Manage Harbor Config

You are managing the harbor configuration for Agent Skill Harbor.

## File

- **Config**: `config/harbor.yaml`
- **Zod schema**: `web/src/lib/schemas/settings.ts`

## Schema

```typescript
collector: {
  exclude_forks: boolean          // default: true — skip forked repositories
  excluded_repos: string[]        // default: [] — repository names to skip
  include_origin_repos: boolean   // default: true — collect origin repos referenced by _from
  included_extra_repos: string[]  // default: [] — additional repo URLs to collect
  history_limit: number           // default: 50 — max entries in collect-history.yaml (0 = unlimited)
}

catalog: {
  skill: {
    fresh_period_days: number     // default: 7 — days to show "New" badge (0 = disable)
  }
}
```

## Actions

Parse the user's intent and execute the appropriate action below.

### Show Config

When the user wants to view the current configuration:

1. Read `config/harbor.yaml`
2. Display settings in a readable format

### Update Setting

When the user wants to change a setting (e.g., `set history_limit 100`, `set exclude_forks false`):

1. Read `config/harbor.yaml`
2. Update the specified field
3. Validate the value against the schema (type and constraints)
4. Write back `config/harbor.yaml`

### Add Excluded Repo

When the user wants to exclude a repository (e.g., `exclude some-repo`):

1. Read `config/harbor.yaml`
2. Add the repo name to `collector.excluded_repos` (avoid duplicates)
3. Write back `config/harbor.yaml`

### Remove Excluded Repo

When the user wants to stop excluding a repository:

1. Read `config/harbor.yaml`
2. Remove the repo name from `collector.excluded_repos`
3. Write back `config/harbor.yaml`

### Add Extra Repo

When the user wants to add an additional repository (e.g., `add-extra https://github.com/owner/repo`):

1. Read `config/harbor.yaml`
2. Add the URL to `collector.included_extra_repos` (avoid duplicates)
3. Write back `config/harbor.yaml`

### Remove Extra Repo

When the user wants to remove an additional repository:

1. Read `config/harbor.yaml`
2. Remove the URL from `collector.included_extra_repos`
3. Write back `config/harbor.yaml`

## Important Notes

- All changes are made to local files only
- Remind the user to create a PR to apply changes
- After making changes, run `pnpm run build:catalog` to regenerate the catalog
