# Post-Collect Plugins

Agent Skill Harbor では、各 `collect` の後に plugin を実行できます。

## ビルトインプラグイン

現在のビルトインプラグインは次の 3 つです。

- `builtin.detect-drift`
- `builtin.audit-static`
- `builtin.audit-promptfoo-security`

`config/harbor.yaml` で設定します。

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

`post_collect.plugins[]` では、共通して次のキーを使えます。

- `id`: plugin id
- `short_label`: フィルターやテーブル見出しに使う任意の短縮名
- `config`: plugin 固有の任意設定オブジェクト

`config` は意図的に汎用のままです。Harbor はこれを `context.plugin_config` として plugin にそのまま渡し、解釈は各 plugin 側に委ねます。全 plugin 共通の schema はありません。

## ユーザー定義プラグイン

ユーザー定義 plugin は任意機能で、次の場所から探索されます。

- `plugins/<id>/index.mjs`
- `plugins/<id>/index.js`
- `plugins/<id>/index.ts`

探索順は `mjs`、`js`、`ts` です。

plugin id には小文字英数字、`-`、`_` だけを使えます。

サンプル plugin を生成するには:

```bash
harbor gen sample-plugin
```

その後、`config/harbor.yaml` の `sample_plugin` をアンコメントしてください。

## プラグイン出力

各 plugin の実行結果は次に履歴として保存されます。

- `data/plugins/<plugin-id>.yaml`

各ファイルには新しい順で複数回分が保存され、`data/collects.yaml` の `collect_id` と対応付けられます。

主な出力フィールド:

- `summary`: 実行結果の概要テキスト
- `label_intents`: 各ラベルに対する UI 表示用の intent（色分け）マッピング
- `results`: スキルパスをキーとしたスキルごとの結果

### `label_intents` の値一覧

| 値        | 色       | 用途例                  |
| --------- | -------- | ----------------------- |
| `neutral` | グレー   | デフォルト / 不明な状態 |
| `info`    | 青       | 情報提供レベルの検出    |
| `success` | 緑       | 合格 / 同期済み         |
| `warn`    | アンバー | 警告 / 要確認           |
| `danger`  | 赤       | 失敗 / 重大な問題       |

各 skill ごとの `results` では:

- `label`: バッジやフィルター用の短いラベル
- `raw`: 詳細画面に出す自由文
- その他のキー: そのまま保持され、詳細画面で raw 表示されます

`builtin.audit-promptfoo-security` は追加で次のような値を持つことがあります。

- `report_path`: その skill の最新 HTML レポートへの公開パス
- `findings`: 脆弱性 ID ごとの件数
- `reasons`: 脆弱性 ID ごとに grouped した promptfoo の理由文

## 副成果物

plugin は主成果物の YAML 以外にも、副作用としてファイルを出力できます。

それらを web アプリと一緒に配布したい場合は、次の場所に出力してください。

- `data/plugin-reports/<plugin-id>/...`

これらのファイルは plugin result schema の一部として Harbor が管理するのではなく、plugin 実装自身が安定したパス規約で生成・更新します。

`harbor build` 実行時には、Harbor が `data/plugin-reports/` を web のビルド成果物へコピーします。UI からリンクしたい HTML レポートなどはこの仕組みを使います。

## Web UI での扱い

- Card / List / Skill detail では、最新 `collect_id` に一致する plugin 出力だけを使います
- Stats では `collect_id` ごとの plugin 履歴を使います
- `short_label` が設定されていれば、フィルター名やテーブル見出しに使われます
- `data/plugin-reports/` 配下のファイルは `harbor build` 時に web のビルド成果物へコピーされます

## ワークフロー

生成される `CollectSkills` workflow では、次の順で実行します。

1. `collect`
2. `post-collect --collect-id ...`

これにより、収集処理と post-collect 処理を分離し、後段だけ再実行しやすくしています。
