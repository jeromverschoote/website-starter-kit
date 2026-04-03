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
      '@fortawesome/react-fontawesome': mocks('fontawesome.tsx'),
      '@fortawesome/fontawesome-svg-core': mocks('fontawesome-core.ts'),
      '@fortawesome/pro-solid-svg-icons': mocks('fontawesome-icons.ts'),
      '@fortawesome/pro-regular-svg-icons': mocks('fontawesome-icons.ts'),
      '@fortawesome/pro-light-svg-icons': mocks('fontawesome-icons.ts'),
      '@fortawesome/free-brands-svg-icons': mocks('fontawesome-icons.ts'),
      '@fortawesome/sharp-light-svg-icons': mocks('fontawesome-icons.ts'),
      '@fortawesome/sharp-solid-svg-icons': mocks('fontawesome-icons.ts'),
      '@portabletext/react': mocks('portabletext.tsx'),
      'react-plock': mocks('react-plock.tsx'),
      'next/link': mocks('next-link.tsx'),
    },
  },
});
