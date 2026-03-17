---
name: dependency-scanner
description: "Scan and audit project dependencies for known vulnerabilities. Use when evaluating third-party package security or updating dependencies."
metadata:
  tags: security, dependencies, npm-audit, supply-chain, cve
---

Run ecosystem-specific audit commands to identify known vulnerabilities in project dependencies. For Node.js projects, use `npm audit` or `yarn audit` and review the JSON output for severity levels. For Python, use `pip-audit` or `safety check` against the installed packages or requirements file. For Rust projects, run `cargo audit` against the advisory database. Always check both direct and transitive dependencies, as vulnerabilities deep in the dependency tree can be equally dangerous.

Interpret CVE scores using the CVSS v3 framework: Critical (9.0-10.0) vulnerabilities with network-exploitable vectors require immediate patching, High (7.0-8.9) should be addressed within days, Medium (4.0-6.9) within the current release cycle, and Low (0.1-3.9) can be tracked for future updates. When evaluating whether a CVE affects your application, consider the specific code paths used — a vulnerability in an unused feature of a library may be lower priority than the score suggests. Cross-reference findings with the GitHub Advisory Database and NVD for the most current information.

For upgrade strategies, prefer minor and patch version bumps that include security fixes without breaking changes. Use lockfiles (package-lock.json, yarn.lock, Pipfile.lock, Cargo.lock) consistently and commit them to version control to ensure reproducible builds. When a major version upgrade is required, review the changelog for breaking changes and run the full test suite after upgrading. Configure automated tools like Dependabot or Renovate to create pull requests for security updates, and set up CI checks that fail builds when critical vulnerabilities are detected in dependencies.
