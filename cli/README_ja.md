<p align="center"><a href="./README.md">en</a> | <a href="./README_ja.md">ja</a></p>

# agent-skill-harbor

Agent Skill Harbor の CLI パッケージです。

## このパッケージに含まれるもの

- `harbor` / `agent-skill-harbor` 実行ファイル
- `harbor init` で使われるプロジェクト雛形テンプレート
- Skill Harbor プロジェクト向けの collect / build ランタイム
- `builtin.detect-drift` や `builtin.audit-static` などの built-in `post_collect` プラグイン

## クイックスタート

```bash
npx agent-skill-harbor init my-skill-harbor
cd my-skill-harbor
pnpm install
pnpm collect
pnpm dev
```

上の `pnpm collect` は、`init` で生成された Skill Harbor プロジェクト側のスクリプトです。CLI パッケージのリポジトリ自身で collector を実行する場合は、次のどちらかを使います。

```bash
pnpm --dir cli build
node cli/dist/bin/cli.js collect
```

あるいは、ビルドなしのローカル開発実行なら:

```bash
node --import tsx cli/bin/cli.ts collect
```

`post_collect` だけを単独で試す場合は次を使います。

```bash
node --import tsx cli/bin/cli.ts post-collect
```

ユーザー定義 plugin は `plugins/<id>/index.mjs`、次に `index.js`、最後に `index.ts` の順で解決されます。
サンプル plugin の雛形は `harbor gen sample-plugin` で生成できます。

製品全体の概要やドキュメントは、リポジトリの README を参照してください。

- https://github.com/skill-mill/agent-skill-harbor/blob/main/README_ja.md
