# React Engineering Guidelines

> Derived from 16-chapter internal training material covering performance, DX patterns, and reliability in React.

---

## Table of Contents

1. [Move State Down to Contain Re-renders](#1-move-state-down-to-contain-re-renders)
2. [Pass Heavy UI as Stable Elements to Avoid Re-renders](#2-pass-heavy-ui-as-stable-elements-to-avoid-re-renders)
3. [Replace Config Flags with Element Slots](#3-replace-config-flags-with-element-slots)
4. [Use Render Props for Explicit, Stateful Control](#4-use-render-props-for-explicit-stateful-control)
5. [Memoization with useMemo, useCallback, and React.memo](#5-memoization-with-usememo-usecallback-and-reactmemo)
6. [Deep Dive into Diffing and Reconciliation](#6-deep-dive-into-diffing-and-reconciliation)
7. [Higher-Order Components in a Modern Hooks World](#7-higher-order-components-in-a-modern-hooks-world)
8. [Use React Context with Stable Values and Operations](#8-use-react-context-with-stable-values-and-operations)
9. [Refs — From Storing Data to Imperative Control](#9-refs--from-storing-data-to-imperative-control)
10. [Closures in React — Fresh State without Breaking Memoization](#10-closures-in-react--fresh-state-without-breaking-memoization)
11. [Advanced Debouncing and Throttling with Refs](#11-advanced-debouncing-and-throttling-with-refs)
12. [Escaping Flicker with useLayoutEffect](#12-escaping-flicker-with-uselayouteffect)
13. [React Portals — Escape Stacking Context Traps](#13-react-portals--escape-stacking-context-traps)
14. [Client-side Data Fetching and Orchestrating Parallel Loads](#14-client-side-data-fetching-and-orchestrating-parallel-loads)
15. [Data Fetching and Race Conditions](#15-data-fetching-and-race-conditions)
16. [Universal Error Handling in React](#16-universal-error-handling-in-react)

---

## 1. Move State Down to Contain Re-renders

**Category:** Performance Optimization

### Why it matters

Re-renders are triggered by state updates, not by arbitrary code execution. Their cost includes component work, hook execution, and DOM diffing. Re-renders propagate **downward** from the component where the state lives — every child below that component re-renders, regardless of whether it uses the changed value.

A common pitfall: placing modal open/close state, scroll position, or any fast-changing value at a high level in the tree causes the entire subtree to re-render on every change.

> **Myth:** Props changes cause re-renders. Props are not the root cause — a child re-renders because its *parent* re-rendered, not because its props changed.

### The pattern

Place state as close as possible to the UI that actually uses it. If only a small subtree needs a piece of state, extract that subtree into its own component and own the state there.

```tsx
// Before: modal state lives at root, re-renders everything
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <HeavyContent />           {/* re-renders on every open/close */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)} />
      <button onClick={() => setIsOpen(true)}>Open</button>
    </>
  );
}

// After: modal state lives next to its UI
function ModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Modal open={isOpen} onClose={() => setIsOpen(false)} />
      <button onClick={() => setIsOpen(true)}>Open</button>
    </>
  );
}

function App() {
  return (
    <>
      <HeavyContent />    {/* never re-renders due to modal state */}
      <ModalTrigger />
    </>
  );
}
```

### Watch out for custom hooks

State updates inside custom hooks still re-render the calling component. A hook that manages a counter, form value, or subscription will trigger a re-render in every component that calls it — even if the component doesn't use the returned value.

### Checklist

1. Open React DevTools Profiler and record an interaction.
2. Find the component that triggered the update (the state owner).
3. Identify which subtree re-rendered as a result.
4. If that subtree is larger than needed, extract the state + minimal UI into a contained component.

### Key rules

- State updates are the sole trigger for re-renders.
- Re-renders flow downward, never upward.
- Move state down to confine updates to the smallest possible subtree.
- Custom hooks do not isolate re-renders — they participate in the calling component's render cycle.

---

## 2. Pass Heavy UI as Stable Elements to Avoid Re-renders

**Category:** Performance Optimization

### Why it matters

When a component owns both fast-changing state (e.g. scroll position) and heavy UI (e.g. an article body or media grid), every state update re-renders the heavy subtree even though it doesn't depend on that state. The result is visible jank on scroll, resize, or any frequent event.

### The pattern

Split the component into two: a **lightweight wrapper** that owns the dynamic state, and the **heavy content** passed in as `children` or a named slot prop. Because the heavy content is created outside the wrapper, React sees it as a stable element reference and skips re-rendering it.

```tsx
// Before: HeavyContent re-renders on every scroll
function ScrollContainer() {
  const [scrollY, setScrollY] = useState(0);
  return (
    <div onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}>
      <FloatingBlock style={{ top: scrollY }} />
      <HeavyContent />   {/* re-renders on every scroll event */}
    </div>
  );
}

// After: HeavyContent is passed in; only the wrapper re-renders
function ScrollWrapper({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  return (
    <div onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}>
      <FloatingBlock style={{ top: scrollY }} />
      {children}         {/* stable reference — not re-rendered */}
    </div>
  );
}

function Page() {
  return (
    <ScrollWrapper>
      <HeavyContent />
    </ScrollWrapper>
  );
}
```

### Key rules

- The wrapper owns the dynamic state and only the lightweight positional UI.
- Heavy content is passed as `children` or a prop — it is created in the parent's scope, so it stays stable.
- State updates in the wrapper re-render the wrapper, but not the stable elements passed into it.
- This is the complement to "move state down" — sometimes you can't move state down, so you lift the heavy content out instead.

---

## 3. Replace Config Flags with Element Slots

**Category:** DX Optimization

### Why it matters

As components grow, adding boolean/string props for every configuration variant (icons, avatars, leading/trailing content, sizes, colors) inflates the API. Each new flag adds props to type, document, and test. Small design changes require API updates. The component becomes hard to learn and brittle.

### The pattern

Accept **elements as props** ("element slots") instead of configuration flags. The caller constructs the element with whatever props it needs; the component just renders it in the right slot.

```tsx
// Before: props for every variation
<Card
  showLeadingIcon
  iconName="star"
  iconColor="gold"
  showAvatar
  avatarSrc="/user.png"
  showFooter
  footerText="Posted 2h ago"
/>

// After: callers pass configured elements
<Card
  leading={<StarIcon color="gold" />}
  avatar={<Avatar src="/user.png" />}
  footer={<span>Posted 2h ago</span>}
/>
```

```tsx
// Component implementation
function Card({
  leading,
  avatar,
  footer,
  children,
}: {
  leading?: React.ReactNode;
  avatar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      {leading && <div className="card-leading">{leading}</div>}
      {avatar && <div className="card-avatar">{avatar}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
```

### What to avoid

Don't use `React.cloneElement` to inject props into a passed element — it's implicit, breaks when the child API changes, and makes behavior hard to trace.

### Key rules

- Accept `React.ReactNode` slots instead of descriptive flags.
- Name slots semantically: `leading`, `trailing`, `icon`, `footer`, `actions`.
- The caller is responsible for configuring the element; the component is responsible for placing it.
- The same component now adapts to many layouts without any API growth.

---

## 4. Use Render Props for Explicit, Stateful Control

**Category:** DX Optimization

### Why it matters

Element slots work well when the parent just renders what the caller passes. But when the parent needs to **inject live state** or **enforce default values** into the slot, element slots fall short — the parent would need `cloneElement`, which is implicit and fragile. Render props solve this by making the injection explicit.

### The pattern

Instead of accepting a `ReactNode` slot, accept a **function** that the parent calls at render time, passing in whatever state or defaults the consumer needs.

```tsx
// Before: element slot — caller has no access to parent's state
<Dropdown icon={<ChevronIcon />} />

// After: render prop — caller receives open state from parent
<Dropdown
  renderIcon={({ isOpen }) => (
    <ChevronIcon direction={isOpen ? 'up' : 'down'} />
  )}
/>
```

```tsx
// Component implementation
function Dropdown({
  renderIcon,
  children,
}: {
  renderIcon?: (state: { isOpen: boolean }) => React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen((o) => !o)}>
        {renderIcon?.({ isOpen })}
        Toggle
      </button>
      {isOpen && <div className="dropdown-content">{children}</div>}
    </div>
  );
}
```

### When to use element slots vs render props

| Use element slots when... | Use render props when... |
|---|---|
| The parent just renders the element | The parent needs to pass state or defaults to the slot |
| No runtime data needs to flow in | The consumer needs to adapt based on parent state |
| Simple compositional layouts | Stateful or context-aware rendering |

### Key rules

- Render prop functions receive explicit, typed arguments — no guessing.
- No `cloneElement` hacks needed; the function call is the contract.
- Use `render*` naming (`renderIcon`, `renderHeader`, `renderEmpty`) for clarity.
- Render props and element slots are complementary tools, not competing ones.

---

## 5. Memoization with useMemo, useCallback, and React.memo

**Category:** Performance Optimization

### Why it matters

React compares objects, arrays, and functions by **reference**, not by value. On every render, inline-created non-primitives get new references, which invalidates hook dependency checks and breaks `React.memo` bail-outs. This causes downstream components to re-render even when the underlying data hasn't changed.

### The tools

**`useCallback`** — memoizes a function reference. Use when you need a stable function identity across renders (e.g. event handlers passed to memoized children or used as effect dependencies).

```tsx
// Re-created on every render — breaks React.memo on Child
const handleClick = () => doSomething(id);

// Stable reference — only changes when id changes
const handleClick = useCallback(() => doSomething(id), [id]);
```

**`useMemo`** — memoizes the result of a computation. Use when the computation is expensive or when you need a stable object/array reference.

```tsx
// New array reference on every render
const filtered = items.filter((i) => i.active);

// Stable reference — only recalculated when items changes
const filtered = useMemo(() => items.filter((i) => i.active), [items]);
```

**`React.memo`** — wraps a component to skip re-rendering when its props are shallowly equal. Only effective when the props themselves are stable (i.e. memoized).

```tsx
const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {
  // Only re-renders when items or onSelect reference changes
});
```

### The golden rule

`React.memo` + unstable props = no benefit. Always pair `React.memo` on a child with `useCallback`/`useMemo` in the parent for the props being passed.

### When NOT to memoize

Don't memoize everything by default. Memoization has overhead — React must store the previous values and run the equality check. Only apply it when:
- You've profiled and confirmed a re-render is causing a measurable perf problem.
- The dependency array is simple and won't cause more re-renders than it saves.

### Key rules

- `useCallback` ≈ stable function reference; `useMemo` ≈ stable computed value.
- Hook dependencies use `Object.is` (reference equality for objects/arrays/functions).
- `React.memo` is only effective when all props are reference-stable.
- Profile first, memoize second — premature memoization adds complexity without benefit.

---

## 6. Deep Dive into Diffing and Reconciliation

**Category:** React Internals

### Why it matters

Understanding how React decides whether to update or unmount a component lets you predict behavior, fix unexpected state resets, and design component trees that reconcile efficiently.

### The mental model: position and type

React does not track component instances by identity. It compares the **element at each position** in the returned tree between renders. The decision is:

- **Same position + same type** → React updates the existing component instance and preserves its state.
- **Same position + different type** → React unmounts the old component (destroying its state) and mounts a fresh one.

```tsx
// Renders a Counter at position 0 — state is preserved across renders
{isLoggedIn ? <Counter /> : <Counter />}

// Renders different types at position 0 — state is destroyed on switch
{isLoggedIn ? <UserCounter /> : <GuestCounter />}
```

### Keys change identity within lists

The `key` prop lets you tell React that a particular element has a stable logical identity across position changes. Changing a `key` forces unmount + remount (useful for resetting state). Keeping a `key` stable preserves state even when the element moves in a list.

```tsx
// State is lost when items reorder — keys match position, not identity
{items.map((item, i) => <Row key={i} item={item} />)}

// State follows the item — keys match logical identity
{items.map((item) => <Row key={item.id} item={item} />)}
```

### Practical implications

- Conditionally rendering different component types at the same position resets all state — intentional for forms, unintentional elsewhere.
- Never define component functions inside render — each render creates a new type reference, forcing remount on every parent re-render.
- Use stable `key` values derived from data identity, not array indices.

### Key rules

- React reconciles by position first, then type.
- Same type at same position = update + state preserved.
- Different type at same position = unmount + fresh mount + state lost.
- `key` overrides position-based identity for list items.
- Component definitions must be stable (not inline) to preserve identity.

---

## 7. Higher-Order Components in a Modern Hooks World

**Category:** DX Optimization

### Why it matters

A **Higher-Order Component (HOC)** is a function that takes a component and returns a new enhanced component. With the introduction of hooks, many HOC use cases moved to custom hooks — but HOCs remain the right tool for cross-cutting concerns that must wrap the render itself, such as permission guards, feature flags, and observability wrappers.

### The pattern

```tsx
// HOC: wraps a component with auth protection
function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthGuard(props: T) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
```

### When to use HOCs vs hooks

| Use a HOC when... | Use a custom hook when... |
|---|---|
| You need to conditionally render or replace the component | You need to share stateful logic between components |
| You need to wrap the render output (e.g. add a provider) | You need to expose values or handlers to the component |
| The enhancement is a gate or decorator on the component itself | The enhancement is behavior that lives *inside* the component |

### HOC conventions

- Name the HOC `with*` (e.g. `withAuth`, `withTracking`, `withErrorBoundary`).
- Name the returned wrapper with a descriptive `displayName` for DevTools visibility.
- Forward the `ref` using `React.forwardRef` if the wrapped component accepts one.
- Pass all props through with `{...props}` — HOCs should not consume props they don't own.

```tsx
function withAuth<T extends object>(Component: React.ComponentType<T>) {
  function AuthGuard(props: T) { /* ... */ }
  AuthGuard.displayName = `withAuth(${Component.displayName ?? Component.name})`;
  return AuthGuard;
}
```

### Key rules

- HOCs are still the right tool for render-time decorators and conditional rendering gates.
- For stateful logic sharing, prefer custom hooks.
- Always set `displayName` for debuggability.
- Use `React.forwardRef` when the wrapped component is used with refs.

---

## 8. Use React Context with Stable Values and Operations

**Category:** Performance Optimization

### Why it matters

Prop drilling — passing shared state through many intermediate components — inflates component APIs and causes unnecessary re-renders. Every component in the chain re-renders when the prop changes, even if it doesn't use it.

Context solves the drilling problem, but introduces its own re-render pitfall: **every consumer of a context re-renders when the context value changes**. Passing an unstable object (recreated on every render) as the context value makes every consumer re-render on every parent render.

### The pattern: split state and operations

The most common mistake is passing `{ state, dispatch }` as a single context value. When `state` changes, dispatch consumers re-render unnecessarily. The fix is to **split into two contexts**: one for values (changes frequently) and one for operations (stable, never changes).

```tsx
// Bad: every consumer re-renders on every state change
const StoreContext = createContext<{ count: number; increment: () => void } | null>(null);

// Good: split value and operations
const CountContext = createContext<number>(0);
const CountActionsContext = createContext<{ increment: () => void } | null>(null);

function StoreProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  // Memoize operations — stable reference, never triggers re-renders
  const actions = useMemo(
    () => ({ increment: () => setCount((c) => c + 1) }),
    []
  );

  return (
    <CountActionsContext.Provider value={actions}>
      <CountContext.Provider value={count}>
        {children}
      </CountContext.Provider>
    </CountActionsContext.Provider>
  );
}
```

Components that only call actions (e.g. a button) consume `CountActionsContext` and never re-render due to count changes.

### What to avoid

- Passing a plain object literal as the context value (e.g. `value={{ user, logout }}`). A new object is created on every render, so all consumers re-render even if neither `user` nor `logout` changed.
- Putting high-frequency state (e.g. scroll position, mouse coordinates) in context — context is not designed for that.

### Key rules

- Split context into "data" and "operations" to minimize consumer re-renders.
- Memoize the operations object with `useMemo` (empty deps) so it's stable.
- Only put state in context that genuinely needs to be shared across distant subtrees.
- Prefer colocation and prop drilling for shallow, localized state.

---

## 9. Refs — From Storing Data to Imperative Control

**Category:** Refs

### Why it matters

React abstracts the DOM, but some use cases genuinely require direct node access: focus management, scroll control, outside-click detection, element measurements, and third-party integrations. Refs are also useful for storing mutable values that should **not** trigger re-renders when they change.

### Two uses of refs

**1. DOM access** — attach a ref to a JSX element to get the underlying DOM node.

```tsx
function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input on mount
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="search" />;
}
```

**2. Mutable storage** — store a value that must persist across renders but should not cause a re-render when updated.

```tsx
function Timer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => tick(), 1000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  // ...
}
```

### Exposing refs from custom components

Use `React.forwardRef` to forward a ref down to a DOM node inside a custom component. Use `useImperativeHandle` to expose a limited imperative API instead of a raw DOM node.

```tsx
const FancyInput = React.forwardRef<HTMLInputElement, InputProps>(
  function FancyInput(props, ref) {
    return <input ref={ref} className="fancy" {...props} />;
  }
);
```

### What to avoid

- Reading or mutating `ref.current` during render — refs are for effects and event handlers.
- Using refs to store values that *should* cause a re-render when changed (use state instead).
- Using refs as a workaround to avoid restructuring component state.

### Key rules

- Use refs for DOM access, imperative actions (focus, scroll, select), and storing mutable non-render values (timers, previous values).
- `ref.current` mutations don't trigger re-renders — that's the point.
- Use `forwardRef` to let parent components access a child's DOM node.
- Use `useImperativeHandle` to expose a curated imperative API, not the raw node.

---

## 10. Closures in React — Fresh State without Breaking Memoization

**Category:** Bug Prevention

### Why it matters

Every inline handler, effect callback, and memoized function in React is a **closure**: it captures variables from the scope where it was created. The captured values are frozen at creation time — they don't update when state changes, unless a new function is created.

This creates two failure modes:
1. **Stale closures** — a memoized function or effect reads an outdated value because it captured an old render's state.
2. **Over-invalidation** — including every state variable in deps causes memoized values to refresh so often that memoization provides no benefit.

### The stale closure problem

```tsx
// Bug: count is stale inside the interval callback
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // Always logs the initial value
  }, 1000);
  return () => clearInterval(id);
}, []); // Empty deps — the callback captures count = 0 forever
```

### Solution 1: Add the variable to deps

The simplest fix when stale reads are the problem. The effect or callback re-creates whenever the value changes.

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // Always current
  }, 1000);
  return () => clearInterval(id);
}, [count]); // Re-creates the interval when count changes
```

### Solution 2: Use a ref to hold the latest value

When you need a **stable function** (e.g. for `React.memo` or an event listener) that also reads the latest state, store the latest value in a ref and read it inside the callback.

```tsx
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value; // Always sync to latest render
  return ref;
}

function Component({ onAction }: { onAction: () => void }) {
  const onActionRef = useLatest(onAction);

  // Stable function that always calls the latest onAction
  const handleClick = useCallback(() => {
    onActionRef.current();
  }, []); // No deps — the ref provides fresh access without instability

  return <button onClick={handleClick}>Act</button>;
}
```

### Key rules

- Every function in React (handlers, effects, memoized callbacks) is a closure.
- Closures capture values at creation time — they go stale if not updated.
- Lint with `eslint-plugin-react-hooks` — the exhaustive-deps rule catches most stale closure bugs.
- Use `useRef` + sync-on-render for stable callbacks that need fresh values without breaking memoization.

---

## 11. Advanced Debouncing and Throttling with Refs

**Category:** Data Optimization

### Why it matters

High-frequency events (keystrokes, scroll, resize, mousemove) can trigger many function calls per second. Running expensive work on every call wastes resources and degrades UX. Debouncing and throttling control how often the work executes.

### Debounce vs throttle

| | Debounce | Throttle |
|---|---|---|
| **Behavior** | Waits for inactivity, then fires once | Fires at most once per interval |
| **Best for** | Search inputs, validation, resize handlers | Autosave, live analytics, scroll tracking |
| **Guarantee** | Fires after the last event | Fires on a regular cadence |

### The React-safe approach: use refs

The key challenge in React is that a debounced/throttled function created inline is **recreated on every render**, which resets the timer. The fix is to store the debounce timer or the memoized function in a ref.

```tsx
function useDebounced<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): T {
  const fnRef = useRef(fn);
  fnRef.current = fn; // Always sync to latest

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    ((...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    }) as T,
    [delay] // Stable across renders; only resets if delay changes
  );
}
```

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const debouncedSearch = useDebounced(onSearch, 300);
  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
}
```

### What to avoid

- Creating `debounce(fn, 300)` inline in a component body — the timer resets on every render.
- Wrapping just the callback in `useCallback` without stabilizing the timer ref — the timer is the thing that needs to persist.

### Key rules

- Debounce for "fire after inactivity" (search, form validation).
- Throttle for "fire on a cadence" (scroll, autosave, analytics).
- Store timers and memoized wrappers in refs, not in component state.
- The inner function should read from a ref so it always has the latest value.

---

## 12. Escaping Flicker with useLayoutEffect

**Category:** Performance Optimization

### Why it matters

UIs that calculate layout based on DOM measurements (e.g. overflow menus, responsive tabs, tooltips) have a timing problem: the measurement happens after the first paint, so the browser shows the initial state briefly before the UI corrects itself. This produces a visible flash or "jank" — items appear then disappear, elements jump position.

### The cause

`useEffect` runs **after** the browser has painted the frame. Any DOM measurement inside `useEffect` happens too late — the user already saw the uncorrected layout.

```
Render → Commit DOM → Browser paints → useEffect fires → Measure → Update state → Re-render
                              ↑
                        User sees flicker here
```

### The fix: useLayoutEffect

`useLayoutEffect` runs **synchronously after DOM mutation but before the browser paints**. Measurements made here are applied before the user sees anything.

```
Render → Commit DOM → useLayoutEffect fires → Measure → Update state → Re-render → Browser paints
                                                                                          ↑
                                                                              User sees correct layout
```

```tsx
function OverflowMenu({ items }: { items: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Measure how many items fit — before the browser paints
    let count = 0;
    let totalWidth = 0;
    const children = Array.from(container.children);

    for (const child of children) {
      totalWidth += (child as HTMLElement).offsetWidth;
      if (totalWidth > container.offsetWidth) break;
      count++;
    }

    setVisibleCount(count);
  });

  return (
    <div ref={containerRef}>
      {items.slice(0, visibleCount).map((item) => <span key={item}>{item}</span>)}
      {visibleCount < items.length && <span>+{items.length - visibleCount}</span>}
    </div>
  );
}
```

### When to use useLayoutEffect vs useEffect

| `useLayoutEffect` | `useEffect` |
|---|---|
| DOM measurements that affect visible layout | Everything else |
| Avoiding visible flicker on initial render | Data fetching, subscriptions, timers |
| Synchronizing scroll/focus before paint | Side effects that don't need to block paint |

> `useLayoutEffect` blocks the browser from painting until it finishes. Use it only when necessary — it can hurt perceived performance if the work inside is expensive.

### Key rules

- Use `useLayoutEffect` only when you measure the DOM and apply results that affect the visible layout before first paint.
- Use `useEffect` for everything else.
- `useLayoutEffect` cannot run on the server — guard with an `isBrowser` check in SSR contexts.

---

## 13. React Portals — Escape Stacking Context Traps

**Category:** DX Optimization

### Why it matters

Overlays (modals, dropdowns, tooltips, toasts) need to render on top of all other UI. The common assumption is that `overflow: hidden` on a parent is the problem — but most stubborn overlay issues come from **stacking contexts**, which constrain `z-index` even on `position: fixed` elements.

Stacking contexts are created by: `transform`, `opacity < 1`, `filter`, `will-change`, `position: relative/absolute/fixed` with `z-index`, and more. Any ancestor with a stacking context traps descendants' `z-index` within that context.

### The fix: React Portals

`ReactDOM.createPortal` renders a React subtree into a different DOM node — typically `document.body` — while keeping it part of the React component tree (events bubble up through React's tree, not the DOM tree).

```tsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body  // Renders outside any stacking context
  );
}
```

### Key properties of portals

- **DOM position:** Renders at the target DOM node (e.g. `document.body`), outside the stacking context trap.
- **React tree position:** Still a child of the component that rendered it — context, state, and event bubbling all work normally.
- **Cleanup:** React automatically removes the portal when the component unmounts.

### When to use portals

- Modals and dialog overlays
- Dropdown menus that need to overflow scrollable containers
- Tooltips and popovers that must escape `overflow: hidden`
- Toast/notification systems
- Any UI that needs to render above all other content

### What to avoid

- Portaling everything by default — the DOM becomes hard to follow.
- Forgetting focus management inside portals (trap focus, restore on close).
- Portaling to a node that itself has a stacking context (`position: fixed` wrapper).

### Key rules

- The real enemy is stacking context, not `overflow: hidden`.
- `createPortal(children, target)` renders React children at a different DOM location.
- React context, state, and event bubbling still work through the React tree.
- Use portals for overlays; pair with focus trapping for accessibility.

---

## 14. Client-side Data Fetching and Orchestrating Parallel Loads

**Category:** Data Optimization

### Why it matters

Client-side data work falls into two distinct categories with different UX requirements:

- **Initial data:** drives the first meaningful paint. Should be available as early as possible, often kicked off at the route level.
- **On-demand data:** triggered by user actions (filters, pagination, search). Should update incrementally and feel responsive.

Treating them identically leads to waterfalls for initial loads and over-blocking for user interactions.

### Pattern: kick off parallel requests, not sequential ones

The most common performance mistake is sequential `await` chains when the requests are independent.

```tsx
// Bad: sequential — each request waits for the previous
async function loadDashboard() {
  const user = await fetchUser();
  const posts = await fetchPosts();    // waits for user unnecessarily
  const stats = await fetchStats();   // waits for posts unnecessarily
  return { user, posts, stats };
}

// Good: parallel — all requests fire simultaneously
async function loadDashboard() {
  const [user, posts, stats] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchStats(),
  ]);
  return { user, posts, stats };
}
```

### Pattern: waterfall-free route-level prefetching

Use loader functions (React Router, Next.js, TanStack Router) to start fetching before the component tree renders. The data is ready when the component mounts.

```tsx
// Start fetch before render
export async function loader() {
  return {
    posts: await fetchPosts(),
    categories: await fetchCategories(),
  };
}

// Component receives pre-fetched data
export function PostsPage() {
  const { posts, categories } = useLoaderData();
  // No loading states needed for initial data
}
```

### Pattern: optimistic updates for on-demand mutations

For user-triggered writes, update the UI immediately and reconcile with the server response. This makes interactions feel instant.

```tsx
function useLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => likePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previous = queryClient.getQueryData(['post', postId]);
      queryClient.setQueryData(['post', postId], (old) => ({
        ...old,
        liked: true,
        likeCount: old.likeCount + 1,
      }));
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['post', postId], context.previous);
    },
  });
}
```

### Key rules

- Always fire independent requests in parallel with `Promise.all`.
- Use route loaders to start initial data fetching before component render.
- On-demand data (triggered by user) should feel instant — consider optimistic updates.
- Show skeleton UIs, not spinners, for initial loads to reduce layout shift.

---

## 15. Data Fetching and Race Conditions

**Category:** Reliability Optimization

### Why it matters

When a user triggers multiple async requests in quick succession (typing a search query, clicking between tabs, changing filters), the responses arrive in an unpredictable order. The last response to arrive wins — but that might not be the last request sent. The result is stale data being displayed as if it were current.

```
User types "re" → request A fires
User types "rea" → request B fires
Request B resolves → displays "rea" results ✓
Request A resolves → overwrites with "re" results ✗ (stale!)
```

### Solution 1: AbortController (cancel previous requests)

Cancel the in-flight request when a new one starts. The browser stops the network request; the stale response never arrives.

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function search() {
    try {
      const results = await fetchSearch(query, { signal: controller.signal });
      setResults(results);
    } catch (error) {
      if (error.name === 'AbortError') return; // Ignore cancelled requests
      setError(error);
    }
  }

  search();

  return () => controller.abort(); // Cancel on next run or unmount
}, [query]);
```

### Solution 2: Ignore flag (discard stale responses)

When cancellation isn't possible (e.g. non-fetch async work), use an ignore flag to discard responses from superseded requests.

```tsx
useEffect(() => {
  let ignored = false;

  async function load() {
    const data = await someAsyncWork(query);
    if (!ignored) setData(data); // Only update if still the latest request
  }

  load();

  return () => { ignored = true; }; // Mark as stale on cleanup
}, [query]);
```

### Solution 3: Use a data fetching library

Libraries like TanStack Query, SWR, and RTK Query handle race conditions, deduplication, caching, and stale-while-revalidate out of the box. Prefer them over raw `useEffect` fetching in production apps.

```tsx
// TanStack Query handles race conditions automatically
const { data, isLoading } = useQuery({
  queryKey: ['search', query],
  queryFn: () => fetchSearch(query),
});
```

### Key rules

- Every `useEffect` that fetches data should return a cleanup that aborts or ignores the response.
- `AbortController` is the preferred mechanism for fetch-based requests.
- Use ignore flags for non-cancellable async work.
- In production apps, use a data-fetching library — they handle these edge cases by default.

---

## 16. Universal Error Handling in React

**Category:** Reliability Optimization

### Why it matters

An uncaught error during React's render phase causes the entire component tree to unmount and shows a blank screen. There is no automatic recovery. Proper error handling must be:

1. **Localized** — failures in one subtree should not crash the entire app.
2. **Predictable** — users should always see a meaningful fallback, not a blank page.
3. **Distinguishable** — render errors (component bugs) and async errors (network failures) require different handling.

### Render errors: Error Boundaries

Error boundaries are class components that catch errors thrown during rendering in their subtree. They cannot be written as function components (as of React 18).

```tsx
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportError(error, info); // Send to your error tracking service
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
```

Use the `react-error-boundary` package for a production-ready implementation with reset capabilities.

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<AppCrashFallback />}>
      <ErrorBoundary fallback={<SidebarError />}>
        <Sidebar />
      </ErrorBoundary>
      <ErrorBoundary fallback={<MainContentError />} onReset={refetch}>
        <MainContent />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
```

### Async errors: try/catch in event handlers and effects

Error boundaries do not catch errors in async code, event handlers, or `useEffect`. Handle these explicitly.

```tsx
async function handleSubmit() {
  try {
    await submitForm(data);
    setSuccess(true);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Submission failed');
  }
}
```

### Strategy: layered error boundaries

- **App-level boundary:** catches anything that slips through — shows a full-page crash screen.
- **Route-level boundaries:** isolates page-level failures so the shell (nav, header) stays functional.
- **Feature-level boundaries:** isolates widget failures (a broken chart doesn't crash the dashboard).

### Key rules

- React 16+ unmounts the entire tree on uncaught render errors — error boundaries are required for resilience.
- Use `react-error-boundary` rather than writing your own class component.
- Nest boundaries strategically: app → route → feature.
- Report errors in `componentDidCatch` / `onError` to your monitoring service (Sentry, Datadog, etc.).
- Async errors (fetch, event handlers) require explicit try/catch — error boundaries don't catch them.
- Always provide a fallback UI that lets the user recover (retry button, navigation link).
