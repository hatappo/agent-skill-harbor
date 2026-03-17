---
name: pr-standards
description: "Create well-structured pull requests with proper titles, descriptions, and test plans. Use when preparing or reviewing pull requests."
metadata:
  tags: git, pull-request, standards, workflow
---

Pull request titles must follow the Conventional Commits format: `<type>(<scope>): <short description>` where type is one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, or `chore`. Keep titles under 72 characters and write them in imperative mood ("add user authentication" not "added user authentication"). The scope should identify the affected module or component. If a PR addresses a tracked issue, include the reference in the description body rather than the title to keep titles scannable.

The PR description should follow the team template: start with a **Summary** section containing 2-3 bullet points explaining what changed and why, followed by a **Test Plan** section with a checklist of manual or automated verification steps. Include a **Breaking Changes** section when modifying public APIs or shared contracts, listing the affected consumers and migration steps. Add screenshots or screen recordings for UI changes, and link related PRs or design documents in a **References** section. If the change is behind a feature flag, note the flag name and its default state.

Keep PRs focused on a single concern and aim for fewer than 400 lines of logic changes. If a feature requires more, split it into a stack of dependent PRs with clear sequencing notes. Request reviewers who own the affected code areas and add at least one reviewer from outside the immediate team for cross-domain changes. Respond to all review comments before requesting re-review, marking resolved threads explicitly. Rebase onto the target branch rather than merge commits to maintain a linear history, and squash fixup commits before final merge.
