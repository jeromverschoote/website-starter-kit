import { defineConfig } from 'vitest/config';

import path from 'path';

const src = (p: string) => path.resolve(__dirname, `src/${p}`);
const mocks = (name: string) =>
  path.resolve(__dirname, `src/__mocks__/${name}`);

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    typecheck: { tsconfig: './tsconfig.test.json' },
    exclude: ['**/node_modules/**', 'src/test/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/__mocks__/**',
        'src/**/*.styles.ts',
        'src/**/index.ts',
        'src/types/**',
        'src/app/**',
        'src/views/**',
        'src/layouts/**',
        'src/components/providers/**',
        'src/components/cursor/**',
        'src/components/smooth-scroll/**',
        'src/components/posthog-pageview/**',
      ],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 70,
        statements: 75,
      },
    },
  },
  resolve: {
    alias: {
      // path aliases matching tsconfig baseUrl: ./src
      helpers: src('helpers'),
      components: src('components'),
      config: src('config'),
      hooks: src('hooks'),
      actions: src('actions'),
      providers: src('providers'),
      // module mocks
      'motion/react': mocks('motion/react.tsx'),
      'next/link': mocks('next/link.tsx'),
      'next/image': mocks('next/image.tsx'),
      'next/navigation': mocks('next/navigation.ts'),
      'posthog-js': mocks('posthog-js.ts'),
      // existing mock
      '@repo/ui/toast': mocks('@repo/ui/toast.ts'),
      'lenis/react': mocks('lenis/react.ts'),
      'next/server': mocks('next/server.ts'),
    },
  },
  assetsInclude: ['**/*.svg'],
});
