# Component Guidelines

Structural conventions for components, sections, views, and layouts in this
project. Apply them to every new unit. (For React performance/correctness rules,
see [`react-guidelines.md`](react-guidelines.md).)

---

## 1. Props typing

Declare a `type TProps` directly above the component — never inline, never in a
separate file.

```tsx
type TProps = {
  params: Promise<{ locale: TLocale }>;
};

const HeroSection = async (props: TProps) => { ... };
```

---

## 2. Styles

All Tailwind class strings live in a sibling `.styles.ts` file (default export of
a `styles` object). Never write Tailwind strings inline.

```ts
// hero-section.styles.ts
const styles = {
  container: 'flex min-h-screen flex-col items-center justify-center gap-4 p-8',
  heading: 'text-4xl font-bold',
};

export default styles;
```

```tsx
// hero-section.tsx
import { styles } from '.';

const HeroSection = () => <section className={styles.container}>...</section>;
```

---

## 3. File structure per component

Each component lives in its own folder:

```
component-name/
├── component-name.tsx        ← component
├── component-name.styles.ts  ← Tailwind class strings
└── index.ts                  ← re-export
```

```ts
// index.ts
export { default } from './component-name';
export { default as styles } from './component-name.styles';
```

Scaffold one with `turbo gen component` (see the `scaffold` skill) — it creates
this layout and registers the export.

A view's own sections live in a `_components/` subdirectory:

```
views/home/landing/
├── home-landing-page.tsx          ← composes sections (not async)
├── home-landing-page.queries.ts   ← GROQ for this view
├── home-landing-page.styles.ts
├── index.ts
└── _components/
    └── hero-section/              ← an async section that fetches its own data
```

---

## 4. Data fetching (async server components)

Each section is an `async` server component that owns its Sanity fetch. Data is
never passed down from the page — sections fetch independently.

```tsx
import sanity from '@repo/data/sanity';

import { getDictionary, type TLocale } from 'config/i18n';

type TProps = { params: Promise<{ locale: TLocale }> };

const HeroSection = async (props: TProps) => {
  const { locale } = await props.params;

  const [t, [error, data]] = await Promise.all([
    getDictionary(locale),
    sanity.get<THero>(heroQuery, { locale }),
  ]);

  if (error) {
    console.error(JSON.stringify(error));
  }

  const hero = data?.[0]?.heroSection;
  return <section>{hero?.title ?? t.view.home.hero.heading}</section>;
};
```

Rules:
- `sanity.get<T>()` returns `[Error | undefined, T[] | undefined]` — always
  destructure as `[error, data]`.
- Log errors with `console.error(JSON.stringify(error))` — never throw.
- Render gracefully when `data` is missing (`?? []` / `?? null` / a fallback).
- Fetch translations and CMS data in parallel with `Promise.all`.

---

## 5. GROQ queries

All queries for a view live in a sibling `.queries.ts` file, never inline.

```ts
// home-landing-page.queries.ts
export const homeHeroQuery = `
  *[_type == "home-layout-page" && language == $locale][0]{
    heroSection { title, description }
  }
`;
```

---

## 6. Translations

All visible text comes from `getDictionary(locale)` (or, in client components,
a direct dictionary import) — no hardcoded strings. Dictionary keys are grouped:

- `component.*` — shared UI components
- `view.*` — page/view-specific text
- `layout.*` — layout-level messages (error, not-found)
- `enum.*` — display labels for enum values

---

## 7. Page composition with Suspense

The page component does **no** fetching. It composes sections and wraps each in
`<Suspense>` so they stream independently.

```tsx
const HomeLandingPage = (props: TProps) => (
  <Suspense fallback={<div className={styles.heroFallback} />}>
    <HeroSection params={props.params} />
  </Suspense>
);
```

Give above-the-fold sections (e.g. the hero) a meaningful `fallback`;
below-the-fold sections can use `<Suspense>` without one.

Render a page-builder array of sections with `DynamicSections` (maps each
section's `_type` to a registered component — register components in
`components/dynamic-sections/registry.ts`).

---

## 8. Loading & error routes

Each `app/[locale]/` route segment delegates to a layout in `layouts/`:

- **`loading.tsx`** → `export { default } from 'layouts/loading';`
- **`error.tsx`** → `'use client';` then `export { default } from 'layouts/error';`
  (error boundaries must be client components; they receive `{ error, reset }`).
- **`not-found.tsx`** → re-exports `layouts/not-found` with route `metadata`.

---

## 9. General rules

- No preemptive `useMemo` / `useCallback` / `React.memo` — only after profiling.
- Use `@repo/ui/link` (or `next/link`) for navigation; `@repo/ui/button` for CTAs.
- Wrap distinct UI regions in an `ErrorBoundary` (see `react-guidelines.md` Ch. 16).
- Server actions live in `actions/<name>/`: validate → side effects → typed,
  locale-aware response (see `actions/submit-form` for the shape).
