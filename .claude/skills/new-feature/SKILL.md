---
name: new-feature
description: Deliver a change as one bounded, reviewable PR — branch from development, implement, run `yarn verify` green, and open a pull request into main. Use whenever the user asks to build/add a feature, fix a bug, or make a change in this repo and wants it shipped the standard way (the task→PR loop).
---

# New feature → PR loop

Every change ships as one small, reviewable PR. `main` is protected (PR-only,
CI-gated), so never commit to it directly. Work the loop:

## 1. Branch from an up-to-date base

`development` is the integration base, kept current with `main`:

```bash
git fetch origin
git checkout development
git merge --ff-only origin/main      # keep development current with main
git checkout -b <type>/<short-slug>  # type: feat | fix | chore | refactor
```

If `development` doesn't exist yet, branch from `main`. If the `--ff-only` merge
fails (development diverged), reconcile before branching.

## 2. Implement

- Scaffold repeatable units with `turbo gen` — never hand-roll (see the
  `scaffold` skill: `component`, `view`, `section`, `data-source`).
- Follow [`docs/component-guidelines.md`](../../../docs/component-guidelines.md)
  (structure) and [`docs/react-guidelines.md`](../../../docs/react-guidelines.md).
- Keep it focused — one bounded unit of work per PR.

## 3. Verify — the definition of done

```bash
yarn verify            # lint → check-types → test (cached); must be green
# yarn verify:affected # faster local loop: only packages changed vs the base
```

Fix everything red before opening the PR.

## 4. Open the PR (into main)

```bash
git add -A && git commit -m "<type>: <summary>"
git push -u origin <branch>          # pre-push hook re-runs yarn verify
gh pr create --base main --title "<type>: <summary>" --body "<fill the template>"
```

Fill the body following `.github/PULL_REQUEST_TEMPLATE.md` (what & why, changes,
checklist). CI (lint/types/test + e2e + bundle-size) and branch protection gate
the merge.

## 5. Hand off

Report the PR URL and the CI result. Merge only once CI is green and the user
approves (squash). The PR — not the local edit — is the unit of work.
