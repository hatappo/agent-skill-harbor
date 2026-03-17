---
name: new-dev-setup
description: "Guide new developers through local development environment setup. Use when onboarding new team members or setting up a fresh development machine."
metadata:
  tags: onboarding, setup, development-environment, getting-started
---

Before cloning any repository, ensure the following prerequisites are installed: Node.js (use the version specified in `.node-version` or `.nvmrc` via nvm/fnm), Python 3.11+ (managed through pyenv), Docker Desktop with at least 8GB memory allocated, and Git configured with SSH keys registered in the organization's GitHub account. Install the project's recommended VS Code extensions listed in `.vscode/extensions.json` and apply the shared workspace settings. Run `corepack enable` to activate the correct package manager version (pnpm/yarn) without manual installation.

After cloning, copy `.env.example` to `.env` and populate secrets by running the team's vault pull command (`vault-cli pull --env=dev`) or requesting values from the team lead. Run the bootstrap script (`make setup` or `npm run setup:dev`) which will install dependencies, run database migrations, seed development data, and verify that all required services are reachable. If Docker Compose services fail to start, check that no other process is binding to ports 3000, 5432, or 6379, and ensure Docker has sufficient resources allocated in its settings.

Common troubleshooting steps: if `node-gyp` fails during installation, install the platform's build tools (`xcode-select --install` on macOS or `build-essential` on Ubuntu). If database migrations fail, ensure the PostgreSQL container is fully healthy before retrying — the `pg_isready` check in the health probe may need a longer interval on slower machines. For M-series Mac users, verify that all Docker images support `linux/arm64` or enable Rosetta emulation in Docker Desktop settings. When all checks pass, run the full test suite with `npm test` or `pytest` to confirm the environment is correctly configured before starting development work.
