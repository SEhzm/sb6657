---
name: project-commit
description: Use for this repository when the user asks to commit changes. Before committing, inspect the working tree, resolve ambiguous scope with the user, verify version metadata and changelog sync, run build, optionally run lint for source changes, then stage only intended files and commit with a Conventional Commits message.
---

# Project Commit

## Core Rule

Commit only when the user asks for a commit. If the working tree contains unrelated changes, unclear ownership, failing checks, missing version updates for code changes, or an ambiguous commit scope/message, stop and ask the user before staging or committing.

## Pre-Commit Workflow

1. Read `AGENTS.md`.
2. Inspect the working tree:
   - Run `git status --short`.
   - Review relevant diffs before deciding scope.
   - Identify files changed by the current task versus unrelated existing changes.
3. Resolve ambiguity:
   - Ask the user which files to include if scope is unclear.
   - Ask before including unrelated changes.
   - Ask before committing when verification fails or cannot be run.
4. Check release metadata for code changes:
   - Read the current local date.
   - Expected version format is `YY.MM.DD`.
   - Ensure these match exactly:
     - `package.json` field `"version"`.
     - `src/apis/httpInstance.ts` export `sbVersion`.
     - Today's heading in `docs/更新日志.md`: `## 版本【YY.MM.DD】`.
   - If code changed and metadata is missing or inconsistent, update it before committing.
   - Pure documentation-only changes do not require version updates unless the user requests them or the docs are user-visible release content.
5. Verify before commit:
   - Run `npm run build`; do not commit if build fails unless the user explicitly approves committing a known-broken state.
   - Run `npm run lint` for source changes when practical. Lint should exit successfully with the ESLint 9 flat config; if it fails due to touched code, fix it or ask before committing. Existing warnings may remain as historical technical debt.
6. Choose a Conventional Commits message:
   - Format: `type: subject`.
   - Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
   - Use a concise Chinese or English subject, such as `feat: 添加屏蔽词投稿入口` or `docs: 更新 agent 工作说明`.
   - Use `type!:` or a `BREAKING CHANGE:` body only for breaking changes.
7. Stage only intended files.
8. Run `git status --short` again to confirm staged scope.
9. Create the commit.
10. Final response should include the commit message, checks run, and any files intentionally left uncommitted.

## Stop Conditions

- No explicit user request to commit.
- Unrelated changed files cannot be separated confidently.
- Version metadata is inconsistent after a code change.
- `npm run build` fails and the user has not approved committing anyway.
- Commit message type or scope is unclear and cannot be inferred from the diff.
