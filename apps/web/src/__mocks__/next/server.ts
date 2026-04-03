import { vi } from 'vitest';

export const NextResponse = {
  redirect: vi.fn((url: URL) => ({ type: 'redirect', url: url.toString() })),
  next: vi.fn(() => ({ type: 'next' })),
};
