import { renderHook } from '@testing-library/react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useKeyPress } from './use-key-press';

describe('useKeyPress', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls the effect when the target key is pressed', () => {
    const effect = vi.fn();
    renderHook(() => { useKeyPress('Escape', effect); });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(effect).toHaveBeenCalledOnce();
  });

  it('does not call the effect for a different key', () => {
    const effect = vi.fn();
    renderHook(() => { useKeyPress('Escape', effect); });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(effect).not.toHaveBeenCalled();
  });

  it('removes the event listener on unmount', () => {
    const effect = vi.fn();
    const { unmount } = renderHook(() => { useKeyPress('Escape', effect); });

    unmount();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(effect).not.toHaveBeenCalled();
  });

  it('calls effect multiple times on repeated key presses', () => {
    const effect = vi.fn();
    renderHook(() => { useKeyPress('Enter', effect); });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(effect).toHaveBeenCalledTimes(2);
  });
});
