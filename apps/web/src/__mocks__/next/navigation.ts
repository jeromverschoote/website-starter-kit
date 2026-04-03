import { vi } from 'vitest';

export const usePathname = vi.fn(() => '/en/about');

export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
}));

export const useParams = vi.fn(() => ({ locale: 'en' }));

export const useSearchParams = vi.fn(() => new URLSearchParams());
