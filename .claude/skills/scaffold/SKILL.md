---
name: scaffold
description: Scaffold new in-project units (UI components, and more over time) with `turbo gen` instead of hand-rolling files. Use whenever creating a new UI component in packages/ui, or when the user asks to "add/create a component". Generators encode this repo's file layout, naming, and exports registration so output is consistent every time.
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

## Other units

Generators for views/pages, Sanity sections/models, and data sources follow the
same pattern and live in each workspace's `turbo/generators/config.ts`. Run
`turbo gen` with no name to see everything available.
