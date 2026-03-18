# Post-Collect Plugins

Agent Skill Harbor can run plugins after each `collect`.

## Built-in Plugins

Harbor currently provides these built-in plugins:

- `builtin.detect-drift`
- `builtin.audit-static`
- `builtin.audit-promptfoo-security`

Configure them in `config/harbor.yaml`:

```yaml
post_collect:
  plugins:
    - id: builtin.detect-drift
      short_label: Drift
    - id: builtin.audit-static
      short_label: Audit
    - id: builtin.audit-promptfoo-security
      short_label: Security
      config:
        model: openai:gpt-5
        vulnerabilities:
          - prompt-injection
          - prompt-extraction
          - jailbreak
          - policy-violation
        risk_threshold: 1
        critical_threshold: 3
```

Each `post_collect.plugins[]` entry supports these common fields:

- `id`: plugin id
- `short_label`: optional short name used in filters and table headers
- `config`: optional plugin-specific configuration object

`config` is intentionally generic. Harbor passes it to the plugin as-is via `context.plugin_config`, and each plugin decides how to interpret it. There is no global schema shared by all plugins.

## User-Defined Plugins

User plugins are optional and discovered from:

- `plugins/<id>/index.mjs`
- `plugins/<id>/index.js`
- `plugins/<id>/index.ts`

Search order is `mjs`, then `js`, then `ts`.

Plugin ids must use lowercase letters, numbers, `-`, and `_`.

To generate the sample plugin scaffold:

```bash
harbor gen sample-plugin
```

Then uncomment `sample_plugin` in `config/harbor.yaml`.

## Plugin Output

Each plugin writes history entries to:

- `data/plugins/<plugin-id>.yaml`

Each file stores multiple runs, newest first. Entries are linked to `data/collects.yaml` by `collect_id`.

Output fields:

- `summary`: human-readable summary of the plugin run
- `label_intents`: maps each label to a visual intent used for coloring in the UI
- `results`: per-skill results keyed by skill path

### `label_intents` values

| Value     | Color | Usage example             |
| --------- | ----- | ------------------------- |
| `neutral` | Gray  | Default / unknown state   |
| `info`    | Blue  | Informational finding     |
| `success` | Green | Passed / in sync          |
| `warn`    | Amber | Warning / needs attention |
| `danger`  | Red   | Failed / critical issue   |

Within each skill result:

- `label`: short status label for badges and filters
- `raw`: free-form text for detail pages
- any additional keys: preserved and shown raw on the skill detail page

`builtin.audit-promptfoo-security` may also write:

- `report_path`: public path to the latest HTML report for that skill
- `findings`: counts by vulnerability id
- `reasons`: raw promptfoo reasons grouped by vulnerability id

## Secondary Artifacts

Plugins may produce files other than their main YAML output as a side effect.

If a plugin wants those files to be deployed with the web app, it should write them under:

- `data/plugin-reports/<plugin-id>/...`

Harbor does not manage these files as part of the plugin result schema. The plugin itself is responsible for creating and updating them using a stable path convention.

During `harbor build`, Harbor copies `data/plugin-reports/` into the web build output so those files can be linked from the UI.

## Web UI Behavior

- Card/List/Skill detail use plugin output only when it matches the latest `collect_id`
- Stats reads plugin output history by `collect_id`
- `short_label` is used for filter labels and table headers when configured
- files under `data/plugin-reports/` are copied into the web build output during `harbor build`

## Workflow

The generated `CollectSkills` workflow runs:

1. `collect`
2. `post-collect --collect-id ...`

This keeps collection and post-collection processing separate and rerunnable.
