import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    // TypeScript enforces prop types and named imports — disable redundant JS rules
    rules: {
      'react/prop-types': 'off',
      'import/named': 'off',
    },
  },
  {
    // Relax rules for test and mock files
    files: ['**/__mocks__/**', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
