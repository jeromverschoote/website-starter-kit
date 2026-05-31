# Delegating work (async / remote)

The safety foundation is in place — `turbo gen` scaffolding, the `yarn verify`
gate, green-gate CI, branch protection, and PR review. That makes it safe to
hand **bounded chores** to Claude Code remote/background runs that open PRs you
approve from your phone, while you keep architectural and exploratory work at
the keyboard.

## The split

**Delegate to a remote/background run** (bounded, mechanical, verifiable):

- A new Sanity section from an agreed model — `turbo gen section` + register it.
- Copy / dictionary updates (`apps/web/src/dictionaries/*.json`, content strings).
- Dependency bumps (patch/minor) followed by `yarn verify`.
- Scaffolded units (`turbo gen component | view | data-source`) from a clear spec.
- Mechanical refactors with a clear, testable definition of done.

**Keep at the keyboard** (architectural / exploratory):

- Data-model / schema design and new domain modeling.
- Cross-cutting refactors, **major** dependency upgrades, build / CI / infra changes.
- Anything where the spec is fuzzy or the blast radius is wide.

Rule of thumb: if you can write the definition of done in a sentence and
`yarn verify` can confirm it, it's delegable.

## Why it's safe now

- Every delegated run follows the [`new-feature`](../.claude/skills/new-feature/SKILL.md)
  loop: branch from `development` → implement → `yarn verify` → open a PR.
- `yarn verify` (lint → check-types → test) is the local gate; CI re-runs it
  affected-only, plus e2e and bundle-size.
- `main` is protected — nothing merges without green CI and your review.
- So the worst case of an unattended run is a **red PR you decline** — never a
  broken `main`.

## How to delegate

- **Ad-hoc:** start a Claude Code remote/background run with a bounded task; it
  works the `new-feature` loop and opens a PR.
- **Recurring:** schedule a routine (e.g. a weekly dependency-bump PR) so the
  chore runs itself and lands a PR for review.
- **Review + approve (squash) from your phone** once CI is green.
