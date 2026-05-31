import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * Base (./base.js) already provides js.configs.recommended, prettier, and the
 * type-aware typescript-eslint config; this layer only adds React-specific rules.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      // Includes the React Compiler diagnostic suite (refs, static-components,
      // immutability, purity, set-state-in-render, error-boundaries, memoization),
      // which enforces several react-guidelines principles (Ch. 5, 6, 9, 15, 16).
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      // react-guidelines Ch. 6 — never define component functions inside render.
      "react/no-unstable-nested-components": "error",
      // react-guidelines Ch. 8 — pass stable, memoized Context values.
      "react/jsx-no-constructed-context-values": "error",
    },
  },
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "sibling"],
          pathGroups: [
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "*", group: "external", position: "after" },
            { pattern: "./*", group: "sibling", position: "after" },
          ],
          pathGroupsExcludedImportTypes: [],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
];
