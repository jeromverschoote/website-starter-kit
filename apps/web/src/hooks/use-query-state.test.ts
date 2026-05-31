import { act, renderHook } from '@testing-library/react';
import { useLenis } from 'lenis/react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useQueryState } from './use-query-state';

// vi.mock / vi.hoisted are hoisted above the imports above by vitest.
const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/en/about',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('lenis/react', () => ({ useLenis: vi.fn(() => null) }));

describe('useQueryState', () => {
  afterEach(() => vi.clearAllMocks());

  it('reads the current filter from the query string (null when absent)', () => {
    const { result } = renderHook(() => useQueryState());
    expect(result.current.filter).toBeNull();
  });

  it('replaces the URL with the filter when Lenis is absent', () => {
    const { result } = renderHook(() => useQueryState());
    act(() => result.current.setFilter('news'));
    expect(replace).toHaveBeenCalledWith('/en/about?filter=news', {
      scroll: false,
    });
  });

  it('clears the filter when called without a value', () => {
    const { result } = renderHook(() => useQueryState());
    act(() => result.current.setFilter());
    expect(replace).toHaveBeenCalledWith('/en/about', { scroll: false });
  });

  it('preserves scroll position via Lenis when available', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    vi.useFakeTimers();
    const lenis = {
      animatedScroll: 120,
      stop: vi.fn(),
      start: vi.fn(),
      scrollTo: vi.fn(),
    };
    vi.mocked(useLenis).mockReturnValue(lenis as never);

    const { result } = renderHook(() => useQueryState());
    act(() => result.current.setFilter('news'));

    expect(lenis.stop).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/en/about?filter=news', {
      scroll: false,
    });
    act(() => vi.runAllTimers());
    expect(lenis.start).toHaveBeenCalled();
    expect(lenis.scrollTo).toHaveBeenCalledWith(120, { immediate: true });

    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});
