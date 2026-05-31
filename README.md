# website-starter-kit

A production-ready **Next.js + Sanity** monorepo template — Turborepo, Yarn
workspaces, a shared UI library, strict type-aware linting, and a CI backbone
(lint → types → unit → e2e → bundle-size).

> **Creating a new project?** Don't clone-and-edit by hand. Use the scaffold:
> see [Quick start](#quick-start). Agents: read [`AGENTS.md`](AGENTS.md) first.

## Quick start

Pick one way to get a copy, then run the initializer.

**A — degit (no git history, cleanest):**

```bash
npx degit jeromverschoote/website-starter-kit my-app
cd my-app
yarn install
yarn init:project --git-init        # interactive prompts; --git-init starts a fresh repo
```

**B — GitHub "Use this template" button**, then clone your new repo:

```bash
git clone <your-new-repo-url> my-app && cd my-app
yarn install
yarn init:project                   # history already fresh; creates the development branch
```

`yarn init:project` renames the workspace, creates `.env` files from the
examples, swaps the placeholder title, scaffolds a README, sets up the
`development` branch, and prints any remaining manual steps. Flags let you run it
headless:

```bash
yarn init:project --non-interactive --name my-app --title "My App" \
  --sanity-id <id> --git-init --protect --verify
```

Use `--dry-run` to preview without writing, `--protect` to apply GitHub branch
protection (needs an authenticated `gh` CLI), and `--verify` to run the full
check suite. The full manual fallback lives in
[`docs/init-checklist.md`](docs/init-checklist.md).

## Prerequisites

- **Node** ≥ 18 (CI runs on 24)
- **Yarn** 1.x (Classic) — this repo's `packageManager`
- A **Sanity** account (free) for the CMS
- Optional: **`gh`** CLI for branch protection; accounts for PostHog / Notion /
  Upstash if you use those integrations
- `@fortawesome/*` packages install from a private registry; the token is
  preconfigured in [`.npmrc`](.npmrc) — no action needed

## Environment variables

Copy the examples and fill them in (the initializer does this for you):

```bash
cp .env.example .env
cp apps/sanity/.env.example apps/sanity/.env
```

[`.env.example`](.env.example) documents every variable, grouped by concern:
Sanity CMS, site metadata (author, base URL), analytics (PostHog, GTM, GA),
the contact form (Notion, Slack), rate limiting (Upstash), and API auth. In CI
and on your host, set the same values as secrets.

## Common commands

| Command | What it does |
|---|---|
| `yarn dev` | Run everything in dev (Turbo) |
| `yarn workspace @repo/web dev` | Next.js app only (port 3000) |
| `yarn workspace @repo/sanity dev` | Sanity Studio |
| `yarn lint` | Lint (type-aware ESLint, errors fail) |
| `yarn workspace @repo/web check-types` | TypeScript check |
| `yarn test` | Unit/component tests (Vitest) |
| `yarn workspace @repo/web test:e2e` | Playwright e2e |
| `yarn workspace @repo/web build` | Production build |
| `yarn workspace @repo/sanity types:generate` | Regenerate Sanity types |
| `yarn init:project` | Scaffold a new project from this template |

## Project structure

```
apps/
  web/            Next.js app (App Router)
  sanity/         Sanity Studio
packages/
  ui/             Shared React component library
  data/           Data layer
  eslint-config/  Shared flat ESLint configs (base / react-internal / next)
  tailwind-config/  Shared Tailwind config
  typescript-config/  Shared tsconfig presets
docs/
  init-checklist.md     New-repo setup checklist
  react-guidelines.md   React engineering guidelines
```

## Conventions

- **React:** follow [`docs/react-guidelines.md`](docs/react-guidelines.md). The
  enforceable rules are wired into ESLint; the rest is in that guide (load on
  demand via the `react-guidelines` skill).
- **Branching:** `main` is protected — work on `development`, open a PR. CI must
  pass before merge.
- **Agents:** [`AGENTS.md`](AGENTS.md) is the source of truth (`CLAUDE.md`
  re-exports it).
