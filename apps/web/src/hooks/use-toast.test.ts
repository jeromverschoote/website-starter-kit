import { act, renderHook } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { reducer, toast, useToast } from './use-toast';

// Test the pure reducer in isolation
describe('reducer', () => {
  const empty = { toasts: [] };

  it('ADD_TOAST prepends a toast', () => {
    const newToast = { id: '1', title: 'Hello', open: true } as any;
    const state = reducer(empty, { type: 'ADD_TOAST', toast: newToast });
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0]!.id).toBe('1');
  });

  it('ADD_TOAST respects the limit of 1', () => {
    const first = { id: '1', title: 'First', open: true } as any;
    const second = { id: '2', title: 'Second', open: true } as any;
    let state = reducer(empty, { type: 'ADD_TOAST', toast: first });
    state = reducer(state, { type: 'ADD_TOAST', toast: second });
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0]!.id).toBe('2');
  });

  it('UPDATE_TOAST updates a toast by id', () => {
    const initial = { toasts: [{ id: '1', title: 'Old', open: true }] } as any;
    const state = reducer(initial, {
      type: 'UPDATE_TOAST',
      toast: { id: '1', title: 'New' } as any,
    });
    expect(state.toasts[0]!.title).toBe('New');
  });

  it('DISMISS_TOAST sets open to false for a specific id', () => {
    const initial = { toasts: [{ id: '1', title: 'Hi', open: true }] } as any;
    const state = reducer(initial, { type: 'DISMISS_TOAST', toastId: '1' });
    expect(state.toasts[0]!.open).toBe(false);
  });

  it('DISMISS_TOAST sets open to false for all toasts when no id is given', () => {
    const initial = {
      toasts: [
        { id: '1', open: true },
        { id: '2', open: true },
      ],
    } as any;
    const state = reducer(initial, { type: 'DISMISS_TOAST' });
    expect(state.toasts.every((t) => !t.open)).toBe(true);
  });

  it('REMOVE_TOAST removes a toast by id', () => {
    const initial = { toasts: [{ id: '1', title: 'Hi', open: true }] } as any;
    const state = reducer(initial, { type: 'REMOVE_TOAST', toastId: '1' });
    expect(state.toasts).toHaveLength(0);
  });

  it('REMOVE_TOAST with no id clears all toasts', () => {
    const initial = {
      toasts: [
        { id: '1', open: true },
        { id: '2', open: true },
      ],
    } as any;
    const state = reducer(initial, { type: 'REMOVE_TOAST' });
    expect(state.toasts).toHaveLength(0);
  });
});

// Test the hook against the shared in-memory store
describe('useToast', () => {
  it('adds a toast via the toast() helper', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Test toast' });
    });

    expect(result.current.toasts.some((t) => t.title === 'Test toast')).toBe(
      true,
    );
  });

  it('dismisses a toast by id', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      ({ id: toastId } = toast({ title: 'Dismissable' }));
    });

    act(() => {
      result.current.dismiss(toastId!);
    });

    const dismissed = result.current.toasts.find((t) => t.id === toastId!);
    expect(dismissed?.open).toBe(false);
  });
});
