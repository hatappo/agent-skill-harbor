# セットアップガイド

組織に Agent Skill Harbor をデプロイする手順を説明します。

## 前提条件

- GitHub Organization
- Node.js 22+
- pnpm 10+

## ステップ 1: リポジトリのクローン

このリポジトリを組織内に**プライベート**リポジトリとしてクローンします。

```bash
git clone https://github.com/your-org/agent-skill-harbor.git
cd agent-skill-harbor
pnpm install
```

## ステップ 2: GitHub シークレットと変数の設定

リポジトリの **Settings > Secrets and variables > Actions** を開きます。

### リポジトリ変数

| 変数 | 説明 | 例 |
|------|------|-----|
| `GITHUB_ORG` | GitHub Organization 名 | `my-org` |

### リポジトリシークレット

| シークレット | 説明 |
|------------|------|
| `ORG_GITHUB_TOKEN` | Organization 内リポジトリの `repo` スコープを持つ Personal Access Token (classic) または GitHub App トークン |

トークンには、SKILL.md ファイルをスキャンするために Organization 内の全リポジトリへの読み取りアクセスが必要です。

## ステップ 3: GitHub Pages の有効化

1. **Settings > Pages** を開く
2. **Source** を **GitHub Actions** に設定
3. Internal リポジトリの場合、ページは Organization メンバーのみアクセス可能になります

## ステップ 4: 初回スキル収集

1. **Actions > Collect Skills** を開く
2. **Run workflow** をクリックして初回収集をトリガー
3. ワークフローが Org 内の全リポジトリから SKILL.md ファイルをスキャンします
4. 収集されたデータは `data/` ディレクトリにコミットされます

## ステップ 5: ガバナンスポリシーの設定

`data/governance.yaml` を編集して、組織のスキルポリシーを定義します:

```yaml
version: "1"

defaults:
  org_skills: "none"
  public_skills: "none"

policies:
  - slug: "your-skill-repo"
    source: "org"
    status: "required"       # required | recommended | deprecated | prohibited | none
    note: "このステータスの理由"
    updated_by: "team-name"
    updated_at: "2026-02-24T00:00:00Z"
```

変更をコミット・プッシュすると、デプロイワークフローが自動的に Web UI を再ビルドします。

## ステップ 6: 公開スキルの追加 (オプション)

Claude Code のスラッシュコマンドで公開スキルを追加できます:

```
/manage-skill add owner/repo
```

または `data/skills/public/{owner}_{repo}/skill.yaml` を手動で作成します。

## ローカル開発

```bash
# YAML データからカタログをビルド
pnpm run build:catalog

# カタログを web/static にコピー (開発サーバー用)
cp data/catalog.json web/static/catalog.json

# 開発サーバーの起動
pnpm dev
```

## ワークフロー概要

```
┌──────────────────────────────┐
│  Collect Skills (定期実行)     │
│  - Org リポジトリをスキャン      │
│  - SKILL.md をパース           │
│  - YAML に書き出し             │
│  - catalog.json を生成         │
│  - コミット & プッシュ          │
└────────┬─────────────────────┘
         │ トリガー
         ▼
┌──────────────────────────────┐
│  Deploy Pages                │
│  - SvelteKit をビルド          │
│  - GitHub Pages にデプロイ     │
└──────────────────────────────┘
```
