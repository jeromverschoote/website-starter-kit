---
name: react-guidelines
description: Full React engineering guidelines for this repo (16 chapters — performance, re-render control, Context, refs, data-fetching race conditions, error handling). Invoke when you need the full rationale, code examples, or edge cases behind a principle in AGENTS.md, or before a non-trivial component/hook refactor.
---

# React Guidelines (full reference)

The complete 16-chapter guide lives in [`docs/react-guidelines.md`](../../../docs/react-guidelines.md).

Read that file now (or jump to the specific chapter you need). The 12-bullet summary in `AGENTS.md`
is the quick-reference for routine work; this skill is the depth layer for when you need the full
rationale, code examples, or edge cases.

Chapter map:

1. Move state down to contain re-renders
2. Pass heavy UI as stable elements to avoid re-renders
3. Replace config flags with element slots
4. Use render props for explicit, stateful control
5. Memoization with `useMemo`, `useCallback`, `React.memo`
6. Deep dive into diffing and reconciliation
7. Higher-order components in a modern hooks world
8. Use React Context with stable values and operations
9. Refs — from storing data to imperative control
10. Closures in React — fresh state without breaking memoization
11. Advanced debouncing and throttling with refs
12. Escaping flicker with `useLayoutEffect`
13. React portals — escape stacking context traps
14. Client-side data fetching and orchestrating parallel loads
15. Data fetching and race conditions
16. Universal error handling in React

`docs/react-guidelines.md` is the single source of truth — this skill only points to it.
