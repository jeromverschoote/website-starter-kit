# Claude Code Instructions

## React guidelines

All React code written in this project must follow the engineering guidelines in [`docs/react-guidelines.md`](docs/react-guidelines.md).

Read that document before writing or modifying any React component, hook, or utility. Key principles to apply by default:

- Move state down to the smallest subtree that needs it (Ch. 1)
- Pass heavy UI as stable `children` or slot props to avoid re-renders on frequent state updates (Ch. 2)
- Use element slots instead of boolean/string config flags (Ch. 3)
- Use render props when the parent needs to inject live state into a slot (Ch. 4)
- Only memoize (`useMemo`, `useCallback`, `React.memo`) after profiling — never preemptively (Ch. 5)
- Never define component functions inside another component's render (Ch. 6)
- Prefer custom hooks for shared logic; use HOCs only for render-time decorators (Ch. 7)
- Split Context into separate value and operations providers; memoize operations (Ch. 8)
- Use refs for DOM access and mutable non-render values; never mutate `ref.current` during render (Ch. 9)
- Always include an `AbortController` cleanup or ignore flag in `useEffect` data fetches (Ch. 15)
- Wrap every distinct UI region in an `ErrorBoundary`; never leave render errors uncaught (Ch. 16)
