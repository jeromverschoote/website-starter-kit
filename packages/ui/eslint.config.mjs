import { config } from '@repo/eslint-config/react-internal';

export default [
  // turbo/** holds plop generator tooling, not package source (and lives outside
  // the package tsconfig), so it is not linted as app code.
  { ignores: ['coverage/**', 'postcss.config.mjs', 'turbo/**'] },
  ...config,
  {
    // TypeScript enforces prop types — disable the redundant JS rule
    // import/named produces false positives for packages with complex re-exports
    rules: {
      'react/prop-types': 'off',
      'import/named': 'off',
    },
  },
];
