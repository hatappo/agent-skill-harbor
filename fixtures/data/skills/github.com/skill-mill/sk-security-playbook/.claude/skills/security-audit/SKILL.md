---
name: security-audit
description: "Perform security audits on web applications and APIs. Use when reviewing code for OWASP Top 10 vulnerabilities or conducting security assessments."
metadata:
  tags: security, audit, owasp, vulnerability, appsec
---

When conducting a security audit, systematically evaluate the application against the OWASP Top 10 categories: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable and Outdated Components, Identification and Authentication Failures, Software and Data Integrity Failures, Security Logging and Monitoring Failures, and Server-Side Request Forgery. For each category, inspect the relevant code paths, configuration files, and data flows. Pay special attention to authentication boundaries, authorization checks on every endpoint, and input validation at trust boundaries.

Follow secure coding guidelines throughout the review. Ensure all user inputs are validated and sanitized before use in SQL queries, shell commands, file paths, or HTML output. Verify that cryptographic operations use current algorithms (AES-256-GCM, bcrypt/argon2 for passwords, TLS 1.2+) and that secrets are never hardcoded. Check that error messages do not leak internal implementation details, stack traces, or database schema information to end users.

Prioritize remediation based on exploitability and impact. Critical findings such as SQL injection, authentication bypass, or remote code execution should be addressed immediately before deployment. High-severity issues like cross-site scripting, insecure direct object references, or missing rate limiting should be resolved within the current sprint. Medium and low findings related to security headers, cookie flags, or verbose logging can be scheduled for the next release cycle. Document all findings with reproduction steps, affected code locations, and recommended fixes.
