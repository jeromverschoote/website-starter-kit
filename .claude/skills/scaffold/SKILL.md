---
name: scaffold
description: Scaffold new in-project units (UI component, page/view, Sanity section, data source) with `turbo gen` instead of hand-rolling files. Use whenever creating any of those in this repo, or when the user asks to "add/create a component/page/view/section/data source". Generators encode this repo's file layout, naming, and registration (package.json exports, schema index, dictionary keys) so output is consistent every time.
---

# Scaffolding with `turbo gen`

Do **not** hand-create the files for these units — run the generator. It encodes
the folder layout, naming, test/styles files, and `package.json` exports
registration, so the result is identical whether a human or an agent runs it.

## UI component (packages/ui)

Creates `src/components/<name>/` with `<name>.tsx`, `<name>.test.tsx`, `index.ts`,
optionally `<name>.styles.ts`, and registers `"./<name>"` in `packages/ui/package.json`
exports (so it imports as `@repo/ui/<name>`).

Interactive:

```bash
turbo gen component
```

Headless / agent-driven — pass prompt answers positionally via `--args`
(`<name>` then `<withStyles: true|false>`):

```bash
turbo gen component --args user-card false   # no styles file
turbo gen component --args hero-banner true   # include <name>.styles.ts
```

`<name>` must be kebab-case. After generating, fill in the component body and
extend the generated test. Then verify: `yarn workspace @repo/ui lint` and
`yarn workspace @repo/ui test`.

## Page / view (apps/web)

Creates `views/<feature>/landing/` (a `<feature>-landing-page.tsx` that composes
a `<Suspense>`'d async section, plus `.queries.ts`, `.styles.ts`, `index.ts`, and
a `_components/<feature>-intro/` async section that owns its Sanity fetch), the
matching `app/[locale]/<feature>/` route (`page.ts` + `loading.tsx`), and the
view's `view.<feature>` dictionary keys in `dictionaries/en.json`.

```bash
turbo gen view --args about     # <feature> (kebab-case)
```

## Sanity section (apps/sanity)

Creates `src/sections/<name>-section.ts` (a section schema via `asSectionModel`)
and registers it in `src/sections/index.ts` (import + `allSectionModels` +
`sectionEntries`). Pass the base name without the `-section` suffix.

```bash
turbo gen section --args feature-grid
```

## Data source (packages/data)

Creates `src/sources/<name>/` (an error-wrapped fetcher + test) and registers
`"./<name>"` in `packages/data/package.json` exports (imports as
`@repo/data/<name>`).

```bash
turbo gen data-source --args strapi
```

After generating any unit, fill in the body and verify with the workspace's
`lint` / `check-types` / `test`. Run `turbo gen` with no name to list everything.
