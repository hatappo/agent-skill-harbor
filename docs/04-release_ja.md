# リリース

公開パッケージのリリース手順を説明します。

## 対象パッケージ

- `agent-skill-harbor-web`: SvelteKit アプリ本体と Web ビルド依存を含む公開 Web パッケージ
- `agent-skill-harbor`: `harbor` 実行ファイル、テンプレート、collect ランタイムを含む公開 CLI パッケージ

## リリース順序

必ず次の順序で publish してください。

1. `agent-skill-harbor-web`
2. `agent-skill-harbor`

CLI パッケージは公開済みの `agent-skill-harbor-web` に依存するため、CLI を先に publish すると一時的に壊れたインストール状態が発生します。

## リリースチェックリスト

1. ルート `package.json` と `web/package.json` のバージョンを整合させる。
2. 必要に応じて changelog を更新する。
3. 次を実行する。

```bash
pnpm install --no-frozen-lockfile
pnpm build:cli
pnpm lint
pnpm check
node dist/bin/cli.js build
pnpm pack
pnpm --filter agent-skill-harbor-web pack
```

4. `agent-skill-harbor-web` を publish する。
5. `agent-skill-harbor` を publish する。
6. 両パッケージが利用可能になったことを確認してから git tag を作成する。

## バージョンスクリプトとフック

- `pnpm versions:sync`: ルート version を `web/package.json` に同期し、init テンプレートが `{{PACKAGE_VERSION}}` プレースホルダを使う状態を保ちます。
- `pnpm versions:check`: ルート・web・template のバージョン参照が揃っていることを検証します。
- `preversion`: `pnpm version ...` が package version を更新する前に `pnpm versions:check` を実行します。
- `version`: `pnpm versions:sync` と `pnpm versions:check` を実行し、`package.json`、`web/package.json`、`templates/init/package.template.json`、`pnpm-lock.yaml` を `git add` して、生成された変更が version commit に入るようにします。
- `prepack`: pack/publish 前に `pnpm versions:check` を実行します。

つまり `pnpm version patch|minor|major` 自体は pnpm のビルトインコマンドのままで、`preversion` と `version` はその前後に追加で動くライフサイクルフックです。

## 補足

- ルート tarball は同じリリース系列の `agent-skill-harbor-web` に依存している必要があります。
- Web の実行時依存は `web/package.json` に置きます。
- CLI 専用の実行時依存はルート `package.json` に置きます。
