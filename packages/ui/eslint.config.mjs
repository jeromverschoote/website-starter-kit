import { config } from '@repo/eslint-config/react-internal';

export default [
  { ignores: ['coverage/**', 'postcss.config.mjs'] },
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
