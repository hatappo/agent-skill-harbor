<p align="center"><a href="./README.md">en</a> | <a href="./README_ja.md">ja</a></p>

# Agent Skill Harbor

> Know what your agents know.

組織向けの Agent Skill カタログ・ガバナンスツール。

## スクリーンショット

| スキルカタログ | スキル詳細 |
|:---:|:---:|
| ![スキルカタログ](docs/agent-skill-harbor-screenshot02.jpeg) | ![スキル詳細](docs/agent-skill-harbor-screenshot01.jpeg) |

## 概要

Agent Skill Harbor は、GitHub Organization 内のリポジトリから Agent Skill (SKILL.md) を収集し、ガバナンス管理機能を提供し、GitHub Pages 上でブラウズ可能なカタログを公開します。

- トレーサビリティ — 外部からインストールしたスキルも含め、すべてのスキルの出所・来歴を追跡可能
- 柔軟な監査 - 社内スキルの監査はプロンプトを柔軟に設定可能
- Serverless/DB-less — 社内スキルのクローリングと監査は GitHub Actions 、データは Git に YAML/JSON として保存し、GitHub Pages でプライベート・ホスティング
- 運用負荷なし/コスト最適 - 常時稼働リソースがないのでメンテナンスが楽で安価

## クイックスタート

### 前提条件

- Node.js 22+
- pnpm 10+

### 開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# YAML データからカタログをビルド
pnpm run build:catalog

# すべてをビルド (カタログ + Web)
pnpm run build
```

### 組織へのセットアップ

1. このリポジトリを組織内にプライベートとしてクローン
2. GitHub リポジトリの変数とシークレットを設定:
   - 変数 `GITHUB_ORG`: GitHub Organization 名
   - シークレット `ORG_GITHUB_TOKEN`: Organization の `repo` スコープを持つトークン
3. GitHub Pages を有効化 (Settings > Pages > Source: GitHub Actions)
4. `data/governance.yaml` を編集してガバナンスポリシーを定義
5. "Collect Skills" ワークフローを手動トリガーして初回収集を実行

## プロジェクト構成

```
├── data/                 # スキルデータ (YAML) とガバナンスポリシー
│   ├── skills/org/       # Org リポジトリから自動収集
│   ├── skills/public/    # 手動追加された公開スキル
│   └── governance.yaml   # ガバナンスポリシー定義
├── scripts/              # 収集・ビルドスクリプト
├── web/                  # SvelteKit フロントエンドアプリケーション
└── .github/workflows/    # GitHub Actions (収集 + デプロイ)
```

## スキルの来歴追跡

[agent-command-sync](https://github.com/hatappo/agent-command-sync) (`acs`) を使ってスキルのインストール・管理を行うと、SKILL.md frontmatter の `_from` 履歴が自動記録され、すべてのスキルの出所を追跡できます。

## ライセンス

MIT
