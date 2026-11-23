import { defineConfig } from 'vitest/config';

import path from 'path';


const mocks = (name: string) =>
  path.resolve(__dirname, `src/test/__mocks__/${name}`);

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    typecheck: { tsconfig: './tsconfig.test.json' },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/**/*.styles.ts',
        'src/**/index.ts',
        'src/types/**',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      helpers: path.resolve(__dirname, 'src/helpers'),
      '@portabletext/react': mocks('portabletext.tsx'),
      'react-plock': mocks('react-plock.tsx'),
      'next/link': mocks('next-link.tsx'),
    },
  },
});
