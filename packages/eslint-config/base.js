import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.strictTypeChecked,
  {
    // Type-aware linting. projectService auto-discovers the nearest tsconfig
    // for each file relative to the package being linted (cwd).
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // Numbers stringify safely and are idiomatic in template literals; keep
      // the rest of the strict default (no nullish/objects/etc. in templates).
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
    },
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    // Config files and other plain JS aren't part of any tsconfig, so turn off
    // the type-aware rules for them to avoid "file not in project" errors.
    files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.config.{ts,mts,cts}"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // Test files and mocks are excluded from the build tsconfig and use loose
    // typing for mocks, so type-aware linting both fails to parse them and adds
    // low-value noise. Lint them with the non-type-aware rule set.
    files: [
      "**/*.{test,spec}.{ts,tsx}",
      "**/test/**/*.{ts,tsx}",
      "**/__mocks__/**",
    ],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // Non-null assertions are a pragmatic convenience in test/mock code.
    files: [
      "**/*.{test,spec}.{ts,tsx}",
      "**/test/**/*.{ts,tsx}",
      "**/__mocks__/**",
    ],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    ignores: ["dist/**"],
  },
];
