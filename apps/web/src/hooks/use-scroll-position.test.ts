import { act, renderHook } from '@testing-library/react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollPosition } from './use-scroll-position';

describe('useScrollPosition', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initialises scrollPosition to 0', () => {
    const { result } = renderHook(() => useScrollPosition());
    expect(result.current.scrollPosition).toBe(0);
  });

  it('updates scrollPosition when a scroll event fires', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', {
      configurable: true,
      value: 400,
    });

    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // 400 / (1000 - 200) * 100 = 50
    expect(result.current.scrollPosition).toBe(50);
  });

  it('scrollTo calls window.scrollTo with smooth behaviour', () => {
    const scrollToSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {});
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      result.current.scrollTo(500);
    });

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' });
  });
});
