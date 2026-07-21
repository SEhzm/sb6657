---
name: project-commit
description: Use for this repository when the user asks to commit changes. Before committing, inspect the working tree, resolve ambiguous scope with the user, verify version metadata and changelog sync, run build, optionally run lint for source changes, then stage only intended files and commit with a Conventional Commits message that prefers a concise Chinese subject.
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
    - Read `docs/版本策略.md` and confirm the major/minor/patch decision follows its historical and upgrade rules.
    - Ensure these describe the same major, minor, patch, and release date:
        - `package.json` and root `package-lock.json` versions: `major.minor.patch+yyyymmdd`.
        - `src/apis/httpInstance.ts` export `sbVersion`: `Vmajor.minor.patch.yyyymmdd`.
        - Release heading in `docs/更新日志.md`: `## 版本【Vmajor.minor.patch.yyyymmdd】`.
    - If code changed and metadata is missing or inconsistent, update it before committing.
    - Pure documentation-only changes do not require version updates unless the user requests them or the docs are user-visible release content.
5. Verify before commit:
    - Run `npm run build`; do not commit if build fails unless the user explicitly approves committing a known-broken state.
    - Run `npm run lint` for source changes when practical. Lint should exit successfully with the ESLint 9 flat config; if it fails due to touched code, fix it or ask before committing. Existing warnings may remain as historical technical debt.
    - Unless the user explicitly requests it in the current task, do not run `npm run dev`, `npm run preview`, or another project server; do not open or control a browser; and do not use screenshots, recordings, or pixel comparison as pre-commit verification. UI visual acceptance is performed manually by the user.
6. Choose a Conventional Commits message:
    - Format: `type: subject`.
    - Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
    - Prefer a concise Chinese subject for this Chinese project; use English only when a technical term or ecosystem convention is clearer.
    - Examples: `feat: 添加屏蔽词投稿入口`, `fix: 修复移动端搜索弹窗溢出`, `docs: 更新 agent 工作说明`.
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
