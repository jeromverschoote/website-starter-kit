import type { NextRequest } from 'next/server';

import { describe, expect, it } from 'vitest';


import { proxy } from './proxy';

const makeRequest = (pathname: string): NextRequest =>
  ({
    nextUrl: { pathname },
    url: `http://localhost:3000${pathname}`,
    headers: new Headers({ 'accept-language': 'en' }),
  }) as unknown as NextRequest;

describe('proxy', () => {
  it('ignores asset/metadata paths without redirecting', () => {
    expect(proxy(makeRequest('/favicon.ico'))).toBeUndefined();
  });

  it('does not redirect a path that already has a locale', () => {
    expect(proxy(makeRequest('/en/products'))).toBeUndefined();
  });

  it('redirects a locale-less path to the matched locale', () => {
    const result = proxy(makeRequest('/products')) as unknown as {
      type: string;
      url: string;
    };
    expect(result.type).toBe('redirect');
    expect(result.url).toContain('/en/products');
  });

  it('applies configured redirects', () => {
    const result = proxy(makeRequest('/homepage')) as unknown as {
      type: string;
      url: string;
    };
    expect(result.type).toBe('redirect');
    expect(result.url).toContain('/en/');
  });
});
