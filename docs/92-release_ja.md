# リリース

公開パッケージのリリース手順を説明します。

## 対象パッケージ

- `agent-skill-harbor`: `harbor` 実行ファイル、テンプレート、command dispatch を含む公開 wrapper package
- `agent-skill-harbor-collector`: 公開 collect runtime package
- `agent-skill-harbor-post-collect`: 公開 post-collect runtime package
- `agent-skill-harbor-web`: SvelteKit アプリ本体と Web ビルド依存を含む公開 Web パッケージ

## リリース方針

- 変更が入った package だけを release します。
- 複数 package を release する場合は、runtime package を wrapper package より先に publish します。
- reusable workflow の変更は npm ではなく、この repository の git tag で publish します。

複数 package をまとめて release する場合の推奨順:

1. `agent-skill-harbor-web`
2. `agent-skill-harbor-collector`
3. `agent-skill-harbor-post-collect`
4. `agent-skill-harbor`

## リリースチェックリスト

### 共通

1. 今回 release する package を決める。
2. その package の `package.json` だけを bump する。
3. 必要に応じて changelog を更新する。
4. `collector` または `post-collect` を release する前に、npm には publish しない内部 package である `packages/shared-internal/` を検証する。

```bash
pnpm --dir packages/shared-internal verify
pnpm --dir packages/shared-internal build
```

### `agent-skill-harbor-web` を release するとき

```bash
pnpm install --no-frozen-lockfile
pnpm --dir packages/web verify
pnpm --dir packages/web build
cd packages/web
# npm pack  # `files` / README / package 構成を変更したときのみ
npm publish --access public
cd ..
git tag web-v<version>
```

### `agent-skill-harbor-collector` を release するとき

```bash
pnpm install --no-frozen-lockfile
pnpm --dir packages/collector verify
pnpm --dir packages/collector build
cd packages/collector
npm publish --access public
cd ..
git tag collector-v<version>
```

### `agent-skill-harbor-post-collect` を release するとき

```bash
pnpm install --no-frozen-lockfile
pnpm --dir packages/post-collect verify
pnpm --dir packages/post-collect build
cd packages/post-collect
npm publish --access public
cd ..
git tag post-collect-v<version>
```

### `agent-skill-harbor` を release するとき

```bash
pnpm install --no-frozen-lockfile
pnpm --dir packages/cli verify
pnpm --dir packages/cli build
node packages/cli/dist/bin/cli.js build
cd packages/cli
# npm pack  # `files` / bin / templates / README を変更したときのみ
npm publish --access public
cd ..
git tag cli-v<version>
```

### 複数 package を release するとき

1. 先に `agent-skill-harbor-web` を release する。
2. `agent-skill-harbor-collector` と `agent-skill-harbor-post-collect` を必要に応じて release する。
3. metadata や templates が変わった場合だけ最後に `agent-skill-harbor` を release する。
4. 公開対象の package が利用可能になったことを確認してから git tag を作成する。

## タグ方針

- repository 全体で 1 つの version tag を使うのではなく、package ごとの git tag を使います。
- CLI release の tag は `cli-vX.Y.Z` を使います。
- Web release の tag は `web-vX.Y.Z` を使います。
- Collector release の tag は `collector-vX.Y.Z` を使います。
- Post-collect release の tag は `post-collect-vX.Y.Z` を使います。
- reusable workflow の tag には、`wf-v0`、`wf-v0.14`、`wf-v0.14.0` のような専用 tag を使います。

## Reusable Workflow Tag

- 生成される `CollectSkills` workflow は `skill-mill/agent-skill-harbor/.github/workflows/collect.yml@wf-v0` を呼び出します。
- reusable workflow の更新は npm publish 不要ですが、参照されている workflow tag の更新または新規作成が必要です。
- `wf-v0` は後方互換を保てる範囲の変更だけで動かすようにします。
- caller 側との互換性期待が大きく変わる場合だけ、新しい major workflow tag を作ります。

## Workflow Action Pin 更新

- Harbor では、reusable workflow と生成される deploy workflow template の外部 GitHub Action を commit SHA で pin します。
- まず更新候補を dry-run で確認します:
  - `pnpm actions:check` では、生成される `CollectSkills` caller workflow に対する ref 更新候補も表示されることがあります。
  - その reusable workflow ref 更新は無視してください。template は意図的に `@wf-v0` を維持しており、`actions:pin` 実行後にその ref を元へ戻します。

```bash
pnpm actions:check
```

- 差分をレビューして問題なければ反映します:

```bash
pnpm actions:pin
```

- 現在の更新フローは意図的にハイブリッドです。
  - `actions-up` が大半の外部 action を `--mode minor` と `--min-age 7` 付きで更新します。
  - `pnpm/action-setup` だけは、この repository では `actions-up` が安定して追跡できないため、手動更新の対象として扱います。
- `actions/upload-artifact` と `actions/download-artifact` は、手動確認のうえで現在の新しい major line に pin してあり、今後の自動確認もその major line から継続します。
- `pnpm actions:check` は、手動確認用に `pnpm/action-setup` の最新 v4 release も表示します。
- `pnpm/action-setup` を更新するときは、意図して current major line のまま保ちつつ、release を確認してから pinned SHA を手動で置き換えてください。

## バージョニング方針

- `packages/cli/package.json`、`packages/collector/package.json`、`packages/post-collect/package.json`、`packages/web/package.json` は公開 package として独立して version を管理します。
- `packages/shared-internal/package.json` は非公開の内部 package です。monorepo 内では version を揃えますが、npm には publish しません。
- `packages/cli/templates/init/package.template.json` と `packages/cli/templates/init/tools/harbor/*/package.template.json` は、publish したい package version と整合するよう保ちます。

## 補足

- Web の実行時依存は `packages/web/package.json` に置きます。
- wrapper 専用の実行時依存は `packages/cli/package.json` に置きます。
- collect 専用の実行時依存は `packages/collector/package.json` に置きます。
- post-collect 専用の実行時依存は `packages/post-collect/package.json` に置きます。
- この workspace では package ごとの release に対して `pnpm publish` が安定して動かなかったため、現時点では各 package directory に移動して `npm publish` を直接実行するワークアラウンドを採用します。
- Vite の chunk size warning は現状では既知のものとして扱います。手動で chunk を分ける検証により、残っている重さの主因は `three` だと分かったため、graph 実装をさらに深く最適化しない限り、追加の chunk 分割設定は常用しません。
