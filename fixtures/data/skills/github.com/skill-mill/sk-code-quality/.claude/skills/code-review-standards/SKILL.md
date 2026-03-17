---
name: code-review-standards
description: "Apply team code review standards and checklists during pull request reviews. Use when reviewing code changes or preparing code for review."
metadata:
  tags: code-review, quality, standards, pull-request
---

When reviewing code, evaluate changes across four severity levels: **Critical** (security vulnerabilities, data loss risks, broken functionality), **Major** (performance regressions, missing error handling, incorrect business logic), **Minor** (naming inconsistencies, missing documentation, suboptimal patterns), and **Nit** (formatting preferences, stylistic suggestions). Always prefix comments with the severity level so authors can prioritize fixes efficiently. Block merging only for Critical and Major issues; Minor and Nit items can be addressed in follow-up PRs if the author acknowledges them.

Focus review attention on these key areas: error handling completeness (are all failure paths covered?), input validation (are boundaries and edge cases handled?), test coverage (do new tests exercise both happy and unhappy paths?), and backward compatibility (will existing consumers break?). Check that database queries are indexed appropriately, API responses maintain their contract, and sensitive data is never logged or exposed. For frontend changes, verify accessibility attributes, responsive behavior, and that no user-visible strings are hardcoded outside the localization system.

Write review feedback as questions or suggestions rather than commands — prefer "Could we extract this into a helper function for reuse?" over "Extract this into a helper." When requesting changes, explain the reasoning and, where possible, link to the relevant section of the team's coding standards or provide a brief code snippet illustrating the preferred approach. Approve promptly once critical concerns are addressed; avoid blocking on subjective preferences. If a PR is too large to review effectively (exceeding roughly 400 lines of logic changes), request that it be split into smaller, independently reviewable units.
