import { renderHook, waitFor } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { useDictionary } from './use-dictionary';

// next/navigation is aliased to a mock whose useParams returns { locale: 'en' }.
describe('useDictionary', () => {
  it('loads the dictionary for the active locale', async () => {
    const { result } = renderHook(() => useDictionary());

    expect(result.current.dictionary).toBeUndefined();

    await waitFor(() => {
      expect(result.current.dictionary).toBeDefined();
    });
    expect(result.current.dictionary).toBeTypeOf('object');
  });
});
