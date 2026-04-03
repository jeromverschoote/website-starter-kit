import { describe, it, expect } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('filters out falsy values', () => {
    expect(cn('a', false, undefined, null, 'c')).toBe('a c');
  });

  it('supports conditional object syntax', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500');
  });

  it('returns empty string when all inputs are falsy', () => {
    expect(cn(false, undefined, null)).toBe('');
  });
});
