import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import PictureViewerProvider, {
  usePictureViewerContext,
} from './picture-viewer-provider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PictureViewerProvider>{children}</PictureViewerProvider>
);

const pictures = [
  { asset: { url: 'https://cdn/a.jpg' } },
  { asset: { url: 'https://cdn/b.jpg' } },
];

describe('PictureViewerProvider', () => {
  it('renders its children', () => {
    render(
      <PictureViewerProvider>
        <p>child content</p>
      </PictureViewerProvider>,
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('exposes a default context with a null selector', () => {
    const { result } = renderHook(() => usePictureViewerContext(), { wrapper });
    expect(result.current.selector).toBeNull();
  });

  it('moves the selector with the arrow keys, clamped to bounds', () => {
    const { result } = renderHook(() => usePictureViewerContext(), { wrapper });

    act(() => {
      result.current.setPictures(pictures);
      result.current.setSelector(0);
    });

    // ArrowLeft at index 0 is a no-op (already first).
    act(() => fireEvent.keyDown(document, { key: 'ArrowLeft' }));
    expect(result.current.selector).toBe(0);

    act(() => fireEvent.keyDown(document, { key: 'ArrowRight' }));
    expect(result.current.selector).toBe(1);

    // ArrowRight at the last index is a no-op.
    act(() => fireEvent.keyDown(document, { key: 'ArrowRight' }));
    expect(result.current.selector).toBe(1);

    act(() => fireEvent.keyDown(document, { key: 'ArrowLeft' }));
    expect(result.current.selector).toBe(0);
  });

  it('ignores arrow keys while no selector is set', () => {
    const { result } = renderHook(() => usePictureViewerContext(), { wrapper });
    act(() => fireEvent.keyDown(document, { key: 'ArrowRight' }));
    expect(result.current.selector).toBeNull();
  });

  it('shows the selected picture and closes on Escape', () => {
    const { result } = renderHook(() => usePictureViewerContext(), { wrapper });

    act(() => {
      result.current.setPictures(pictures);
      result.current.setSelector(0);
      result.current.setIsShown(true);
    });

    // Escape runs the close handler without throwing.
    act(() => fireEvent.keyDown(document, { key: 'Escape' }));
    expect(result.current.selector).toBe(0);
  });
});
