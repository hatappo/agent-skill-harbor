---
name: secrets-detection
description: "Detect hardcoded secrets, API keys, and credentials in source code. Use when scanning repositories for accidental secret exposure."
metadata:
  tags: security, secrets, credentials, scanning, compliance
---

Scan source code for common secret patterns including AWS access keys (AKIA prefix), GitHub tokens (ghp_/gho_/ghs_ prefixes), private keys (BEGIN RSA/EC/OPENSSH PRIVATE KEY), database connection strings with embedded passwords, JWT signing secrets, and generic high-entropy strings that may be API keys. Check configuration files (.env, config.yaml, docker-compose.yml), CI/CD definitions, and infrastructure-as-code templates where secrets are frequently hardcoded by mistake. Do not overlook test fixtures and documentation files, which sometimes contain real credentials.

Configure detection tools as pre-commit hooks to prevent secrets from entering the repository in the first place. Set up git-secrets with custom patterns for your organization's internal service credentials. For deeper historical scanning, use trufflehog to scan the full git history including deleted branches and force-pushed commits. Integrate gitleaks into the CI pipeline with a baseline file to suppress known false positives. Maintain an allowlist for test fixtures that use obviously fake values (e.g., `sk-test-xxxx`) while keeping the scanner strict for production-like patterns.

When a secret is confirmed leaked, follow the remediation playbook: immediately rotate the compromised credential through the provider's console or API, update all services that depend on it, and verify the rotation was successful. Remove the secret from the repository history using git-filter-repo or BFG Repo-Cleaner if the repository is not public — for public repositories, assume the secret is permanently compromised regardless of history rewriting. File an incident report documenting the exposure window, affected systems, and corrective actions taken. Update .gitignore and pre-commit configurations to prevent recurrence of the same pattern.
