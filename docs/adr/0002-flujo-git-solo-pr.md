# Git workflow: everything through Pull Request, protected main

Nothing gets pushed straight to `main`: every change arrives through a branch + Pull Request reviewed and approved by the architect (Kevin), who also has authority to revert commits that break the rules — an explicit requirement of the course syllabus. The PR is the quality gate: green lint, code rules met, and human review before merge.

## Consequences

- Commit messages use conventional format with type in English and description in Spanish (`feat: agrega gráfico de pedidos por estado`).
- Push, PR, and merge of a branch require explicit, written authorization from the team member who owns it.
