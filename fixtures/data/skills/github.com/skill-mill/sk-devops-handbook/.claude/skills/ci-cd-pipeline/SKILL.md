---
name: ci-cd-pipeline
description: "Design and configure CI/CD pipelines for automated testing and deployment. Use when setting up GitHub Actions, GitLab CI, or similar CI/CD systems."
metadata:
  tags: ci-cd, github-actions, automation, deployment, testing
---

Structure pipeline stages in a clear progression: install dependencies, lint and format check, run unit tests, run integration tests, build artifacts, and deploy. Each stage should fail fast — place the quickest checks (linting, type checking) earliest in the pipeline to provide rapid feedback. Use matrix builds to test across multiple language versions, operating systems, or dependency sets in parallel. Configure branch-based workflows so that pull requests run the full test suite, main branch pushes trigger staging deployments, and tagged releases deploy to production.

Optimize pipeline execution time through aggressive caching. Cache package manager directories (node_modules, .pip-cache, target/) keyed by the lockfile hash so that dependency installation is skipped when lockfiles have not changed. Cache build artifacts and compiled outputs between stages within the same workflow run. For monorepos, implement path-based filtering so that changes to service-a only trigger service-a's pipeline, not the entire repository's. Set concurrency limits to cancel in-progress runs when a new commit is pushed to the same branch, avoiding wasted compute on outdated code.

Manage secrets securely within the CI environment. Store sensitive values (API keys, deployment credentials, signing keys) as encrypted repository or organization secrets, never in workflow files. Use short-lived credentials through OIDC federation with cloud providers (AWS, GCP, Azure) instead of long-lived access keys. Implement deployment gates that require manual approval for production deployments, with optional automatic approval for staging. Configure status checks as required on protected branches so that merging is blocked until the full pipeline passes, and set up notifications to alert the team on pipeline failures through Slack or email integrations.
