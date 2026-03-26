<p align="center"><a href="./README.md">en</a> | <a href="./README_ja.md">ja</a></p>

# Agent Skill Harbor

Agent Skill Harbor は、チームと組織のためのスキル管理プラットフォームです。

複数のリポジトリにまたがる AI agent skills を収集・共有・監査・公開できるようにし、来歴追跡、ガバナンス支援、安全性確認を組み込みで提供します。

スキルは基本的にテキスト成果物であり、Git に自然に置けるものだという前提に立ち、serverless、DB-less、Git- and GitHub-native な構成で設計されています。

## スクリーンショット

|                                                             カードビュー                                                              |                                                             リストビュー                                                              |
| :-----------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: |
| ![カードビュー](https://raw.githubusercontent.com/skill-mill/agent-skill-harbor/main/docs/img/agent-skill-harbor-screenshot-card.png) | ![リストビュー](https://raw.githubusercontent.com/skill-mill/agent-skill-harbor/main/docs/img/agent-skill-harbor-screenshot-list.png) |

### 統計ビュー

![統計ビュー](https://raw.githubusercontent.com/skill-mill/agent-skill-harbor/main/docs/img/agent-skill-harbor-screenshot-stats.png)

### グラフビュー

![グラフビュー](https://raw.githubusercontent.com/skill-mill/agent-skill-harbor/main/docs/img/agent-skill-harbor-screenshot-graph.gif)

## 機能

- スキルカタログ化: 複数リポジトリの AI agent skills を収集して公開できる
- ガバナンス: 推奨・非推奨・禁止スキルを明示できる
- 来歴追跡: コピー元や導入元を追跡できる
- スキル解析: `builtin.audit-skill-scanner` plugin が収集したスキルを解析し安全性を監査
- Slack 通知: `builtin.notify-slack` plugin で収集・集計後のサマリを通知

## 技術的な特長

- Serverless: カタログ UI は prerender 済みの静的 Web アプリ
- DB-less ＆ Git Native: 収集結果は `data/` に YAML/JSON で保存し、Git に commit する
- GitHub Native: GitHub Actions でデータ更新し GitHub Pages でホストする

デモサイト:

- https://skill-mill.github.io/agent-skill-harbor-demo/

## クイックスタート

```bash
npx agent-skill-harbor init my-skill-harbor
cd my-skill-harbor

pnpm install
pnpm install --dir collector

# .env で GH_ORG を設定

gh auth login && GH_TOKEN=$(gh auth token) pnpm collect
# あるいは .env で GH_TOKEN を設定してから:
# pnpm collect
pnpm dev
```

`pnpm install` は root package (`agent-skill-harbor`) を入れます。  
`pnpm install --dir collector` は `pnpm collect` / `pnpm post-collect` に必要な collector runtime を入れます。

## CLI コマンド

インストール後のメイン CLI は `harbor` または `agent-skill-harbor` として利用できます。

| コマンド                   | 説明                                 |
| -------------------------- | ------------------------------------ |
| `harbor init [dir]`        | 新しいプロジェクトを生成             |
| `harbor setup <plugin-id>` | 任意 plugin 用の runtime file を生成 |

日常的な project 操作は、生成される root scripts から実行します。

```bash
pnpm collect
pnpm post-collect
pnpm dev
pnpm build
pnpm preview
```

## 組織セットアップ

1. `npx agent-skill-harbor init` でプロジェクトを作成
2. Organization 内の private repository に push
3. GitHub Actions secret として `GH_TOKEN` を設定
4. GitHub Pages または Cloudflare Pages を有効化
5. 生成された `CollectSkills` workflow を一度実行

生成される `CollectSkills` workflow は、`wf-v0` に pin された Harbor の reusable workflow を呼ぶ薄い caller です。

reusable workflow の中では:

- `collect` job で `collector/` core だけを install して収集
- `post_collect` job で収集 artifact を復元し、再度 `collector/` core を install した上で、有効な optional plugin manifest だけ追加 install
- 最終的な `data/` を commit

という構造になっています。これにより、GitHub 収集と optional な post-collect 依存を分離できます。

詳細は [組織セットアップ](docs/01-organization-setup_ja.md) を参照してください。

## プロジェクト構成

```sh
my-skill-harbor/
├── .github/workflows/
│
├── config/
│   ├── harbor.yaml         # アプリケーションの全般的設定
│   └── governance.yaml     # 追加のガバナンス設定
│
├── collector/              # スキル収集バッチ処理
│   ├── package.json
│   └── plugins/
│       └── <plugin-id>/    # プラグインごとのマニフェストやコード
│
├── data/
│   ├── assets/
│   ├── collects.yaml       # スキル収集処理の履歴
│   ├── plugins/            # プラグインごとの成果物
│   ├── skills.yaml         # 収集したスキルの一覧
│   └── skills/             # 収集したスキルのファイルのキャッシュ
│
├── .env
│
├── guide/
│
└── package.json            # Web UI のマニフェスト
```

補足:

- root `package.json` は `agent-skill-harbor` だけに依存
- `collector/package.json` は `agent-skill-harbor-collector` 用の Harbor 管理 manifest
- optional plugin manifest と example user-defined plugin は `collector/plugins/<plugin-id>/` に置く

## Post-Collect Plugins

組み込み plugin は `config/harbor.yaml` で有効化します。

例:

- `builtin.detect-drift`
- `builtin.notify-slack`
- `builtin.audit-promptfoo-security`
- `builtin.audit-skill-scanner`

optional な runtime file は `harbor setup` で生成します。

```bash
harbor setup example-user-defined-plugin
harbor setup builtin.audit-promptfoo-security
harbor setup builtin.audit-skill-scanner
```

生成先は `collector/plugins/<plugin-id>/` です。

詳細は [Post-Collect Plugins](docs/03-post-collect-plugins_ja.md) を参照してください。

## ドキュメント

- [組織セットアップ](docs/01-organization-setup_ja.md)
- [スキルカタログガイド](docs/02-skill-catalog_ja.md)
- [Post-Collect Plugins](docs/03-post-collect-plugins_ja.md)
- [ガバナンスガイド](docs/04-governance-guide_ja.md)
- [ローカル開発](docs/91-local-development_ja.md)
- [リリース](docs/92-release_ja.md)

## FAQ

### Git にデータを大量に追加して問題ありませんか？

はい。Harbor が主に保存するのは YAML、JSON、Markdown、収集したスキルファイルなどのテキストデータです。画像や動画のような大きなマルチメディアファイルを前提としておらず、総量も限られているため、Git の圧縮がよく効きます。

GitHub の公式ドキュメントでも、リポジトリは理想的には 1 GB 未満、少なくとも 5 GB 未満に保つことが強く推奨されています。Harbor の用途では、大きな非テキスト資産や無関係な大量データを意図的に入れない限り、そこへ達することはまずありません。

参考: [About large files on GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)

### チームや組織向けとのことですが、個人で使ってもよいですか？

はい、まったく問題ありません。自分のリポジトリ群にあるスキルを収集し、管理し、カタログ化する用途にも使えます。

注意点はホスティングです。個人利用だと GitHub Pages を Private にできないため、生成されたサイトは自分で安全に管理できる別の場所にホスティングすることになるはずです。要望が多ければ、その用途向けのドキュメントやワークフローもより明示的に整備できます。

あるいは気にせず自分のスキルカタログを公開するというのも良いと思います。それは個人の自由です。

### `SKILL.md` の YAML フロントマターに独自のプロパティを追加してもよいのですか？

はい、問題ありません。[Agent Skills](https://agentskills.io/) の仕様はエージェント間で共通化されていますが、**標準で定義されていない YAML フロントマターのキーに制限はありません**。実運用でも各社のエージェントが独自のプロパティを持ち、未知のプロパティは基本的に無視されます。

また、Harbor が扱う `_from` プロパティが消費するトークンは、通常 10〜20 トークン程度です。ひとつのプロジェクトで読み込まれるスキルが数十件あったとしても、影響はごく軽微です。

## ライセンス

MIT
