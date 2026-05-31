# New-repo init checklist

Run through this after creating a new repository from this template. Each item
maps to a real placeholder, secret, or config in the codebase.

> **Tip:** most of this is automated. Grab the template with
> `npx degit jeromverschoote/website-starter-kit my-app` (or the GitHub "Use this
> template" button), then `yarn install` and run `yarn init:project` (add
> `--git-init` after a degit clone to start a fresh repo). Headless:
> `yarn init:project --non-interactive --name <slug> --sanity-id <id> --git-init --protect --verify`.
> It handles the mechanical steps and prints whatever is left; `--dry-run`
> previews without writing. The items below are the source of truth and manual
> fallback.

## 1. Environment
- [ ] Copy [`.env.example`](../.env.example) → `.env` and
      [`apps/sanity/.env.example`](../apps/sanity/.env.example) → `apps/sanity/.env`,
      then fill in values. (`.env` is already gitignored.)

## 2. Project identity
- [ ] Rename `"name"` in [`package.json`](../package.json) (`website-starter-kit` → your project).
- [ ] Replace the `"Starter"` title / `appleWebApp` defaults in [`apps/web/src/app/layout.ts`](../apps/web/src/app/layout.ts).
- [ ] Replace the placeholder sitemap slugs `['about', 'contact']` in [`apps/web/src/app/sitemap.ts`](../apps/web/src/app/sitemap.ts).
- [ ] Set `AUTHOR_NAME`, `AUTHOR_URL`, and `NEXT_SITEMAP_BASE_DOMAIN_URL` (defaults to `https://www.example.com`).
- [ ] Add a `README.md` (the template has none).

## 3. Sanity CMS
- [ ] Create a Sanity project; set `SANITY_STUDIO_PROJECT_ID` (+ dataset, defaults to `production`) in both `.env` files.
- [ ] Set `SANITY_REVALIDATE_SECRET` for ISR webhooks.
- [ ] Generate types: `yarn workspace @repo/sanity types:generate`.

## 4. Integrations (fill if used, otherwise remove the code paths)
- [ ] Analytics: `NEXT_PUBLIC_POSTHOG_KEY`/`_HOST`, `GOOGLE_TAG_MANAGER_ID`, `GOOGLE_ANALYTICS_ID`.
- [ ] Contact form: `NOTION_API_TOKEN`, `NOTION_CONTACT_REQUESTS_DATABASE_ID`, `SLACK_WEBHOOK_URL`.
- [ ] Rate limiting: `UPSTASH_REDIS_REST_URL`/`_TOKEN`.
- [ ] API auth: `NEXT_WEBHOOK_API_TOKEN`, `API_ACCESS_TOKEN`.

## 5. CI & repo protection (per-repo — does NOT carry over from the template)
- [ ] Add **GitHub Actions secrets** for everything CI needs to install/build:
      `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET_ID`, plus any build-time
      vars listed in `turbo.json`'s `globalEnv`.
- [ ] Create the `development` branch (the pre-push hook and PR flow assume `main` ← PR ← `development`).
- [ ] Apply branch protection to the new repo's `main`:
  ```bash
  gh api -X PUT repos/<OWNER>/<REPO>/branches/main/protection \
    -H "Accept: application/vnd.github+json" --input - <<'JSON'
  { "required_status_checks": { "strict": true, "checks": [
      { "context": "Verify Code Quality" },
      { "context": "Run End-to-End Tests" },
      { "context": "Verify Bundle Size" } ] },
    "enforce_admins": true,
    "required_pull_request_reviews": { "required_approving_review_count": 0 },
    "restrictions": null, "allow_force_pushes": false, "allow_deletions": false }
  JSON
  ```

## 6. Install & verify a green baseline
- [ ] `yarn install` (runs `husky` via `prepare`, wiring up the pre-push hook).
- [ ] `yarn verify` — the single "done" gate (lint → check-types → test).
- [ ] `yarn workspace @repo/web build` (also covered by the CI bundle-size job).
- [ ] Re-baseline the bundle budget in `apps/web/.size-limit.json` (currently `2.35 MB`) once the app's real size is known.

## 7. Fill the empty gates
- [ ] Add real Playwright specs under `apps/web/src/test/e2e/` — the e2e gate currently passes vacuously (`--pass-with-no-tests`).
