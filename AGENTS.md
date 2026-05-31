# Agent Instructions

## Definition of done

Run **`yarn verify`** (turbo: `lint` → `check-types` → `test`, cached and
affected-only) and make sure it passes before handing back any change. This is
the single "done" gate; it's also what the pre-push hook runs. CI additionally
enforces coverage, e2e, and bundle size.

## Delivering changes (task → PR)

`main` is protected — never commit to it directly. Ship every change as one
bounded PR: branch from `development` → implement → `yarn verify` (green) → open
a PR into `main`. The `new-feature` skill codifies this loop end to end, and
`.github/PULL_REQUEST_TEMPLATE.md` is the PR body. The PR (gated by CI + branch
protection), not the local edit, is the unit of work.

## New repository setup

This is a template. When working in a repository that was just created from it —
or whenever the user asks to "set up", "initialize", or "bootstrap" the project —
run the initializer and then work through anything it lists as remaining:

```bash
yarn init:project            # interactive
# or, headless / agent-driven:
yarn init:project --non-interactive --name <slug> --sanity-id <id> --protect --verify
```

The script (`scripts/init-project.ts`) and the human-readable
[`docs/init-checklist.md`](docs/init-checklist.md) cover the same steps. A repo is
"fresh" while the root `package.json` name is still `website-starter-kit`; once
renamed, setup is considered done. Proactively surface this — do not wait to be
pointed at it.

## Scaffolding new units

Do not hand-roll the files for repeatable units — run the generator. Each
encodes this repo's layout, naming, and registration so output is identical
whether a human or an agent runs it:

- `turbo gen component` — UI component in `packages/ui` (+ package.json export)
- `turbo gen view --args <feature>` — page/view in `apps/web` (+ route + dictionary keys)
- `turbo gen section --args <name>` — Sanity section in `apps/sanity` (+ schema index)
- `turbo gen data-source --args <name>` — data module in `packages/data` (+ export)

The `scaffold` skill documents the prompts/args; run `turbo gen` to list them.

## Component & view structure

Follow the structural conventions in [`docs/component-guidelines.md`](docs/component-guidelines.md)
for every component, section, view, and layout: a folder per component with a
sibling `.styles.ts` and `index.ts`, a view's sections under `_components/` with
co-located `.queries.ts`, async server-component sections that own their Sanity
fetch, page composition with `<Suspense>`, and `loading`/`error`/`not-found`
route handlers that delegate to `layouts/`. Scaffold components with `turbo gen`.

## React guidelines

All React code written in this project follows the engineering guidelines in [`docs/react-guidelines.md`](docs/react-guidelines.md).

The 12 principles below cover the common case — apply them by default; you do **not** need to open the full guide for routine work. When you need depth on a specific pattern (the full rationale, code examples, edge cases), invoke the `react-guidelines` skill, which loads the full doc on demand. Bullets marked _(lint-enforced)_ are also caught by ESLint, so the linter is the source of truth for those.

- Move state down to the smallest subtree that needs it (Ch. 1)
- Pass heavy UI as stable `children` or slot props to avoid re-renders on frequent state updates (Ch. 2)
- Use element slots instead of boolean/string config flags (Ch. 3)
- Use render props when the parent needs to inject live state into a slot (Ch. 4)
- Only memoize (`useMemo`, `useCallback`, `React.memo`) after profiling — never preemptively; keep dependency arrays correct _(deps lint-enforced)_ (Ch. 5)
- Never define component functions inside another component's render _(lint-enforced)_ (Ch. 6)
- Prefer custom hooks for shared logic; use HOCs only for render-time decorators (Ch. 7)
- Split Context into separate value and operations providers; pass stable, memoized values _(lint-enforced)_ (Ch. 8)
- Use refs for DOM access and mutable non-render values; never mutate `ref.current` during render _(lint-enforced)_ (Ch. 9)
- Always include an `AbortController` cleanup or ignore flag in `useEffect` data fetches (Ch. 15)
- Wrap every distinct UI region in an `ErrorBoundary`; never leave render errors uncaught (Ch. 16)
