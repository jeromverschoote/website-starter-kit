import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";
import { config as baseConfig } from "./base.js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * Base (./base.js) already provides js.configs.recommended, prettier, and the
 * type-aware typescript-eslint config; this layer only adds Next/React rules.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...baseConfig,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-explicit-any": "warn",
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
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // "no-unused-vars": "off",
      // "import/no-dynamic-require": "warn",
      // "import/no-nodejs-modules": "warn",
      "import/no-unresolved": "off",
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            // "external",
            // "internal",
            // "unknown",
            // "parent",
            "sibling",
            // "index",
            // "object",
            // "type",
          ],
          pathGroups: [
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "next/**", group: "builtin", position: "after" },

            { pattern: "*", group: "external", position: "after" },

            // { pattern: "@repo/**", group: "internal", position: "after" },
            { pattern: "@repo/**", group: "internal", position: "after" },
            { pattern: "@*", group: "internal", position: "after" },

            { pattern: "config/**", group: "internal", position: "after" },
            { pattern: "helpers", group: "internal", position: "after" },
            { pattern: "helpers/**", group: "internal", position: "after" },
            { pattern: "types/**", group: "internal", position: "after" },
            { pattern: "hooks/**", group: "internal", position: "after" },
            { pattern: "components/**", group: "internal", position: "after" },

            // { patterns: "context", group: "internal", position: "after" },
            // { patterns: "context/**", group: "internal", position: "after" },
            // { patterns: "enums/**", group: "internal", position: "after" },
            // { patterns: "types/**", group: "internal", position: "after" },
            // { patterns: "hooks/**", group: "internal", position: "after" },
            // { patterns: "components/**", group: "internal", position: "after" },

            { pattern: "./*", group: "sibling", position: "after" },

            // {
            //   pattern: "enums/**",
            //   group: "internal",
            //   position: "after",
            // },
            // {
            //   pattern: "types/**",
            //   group: "internal",
            //   position: "after",
            // },
            // {
            //   pattern: "hooks/**",
            //   group: "internal",
            //   position: "after",
            // },
            // {
            //   pattern: "context",
            //   group: "internal",
            //   position: "after",
            // },
            // {
            //   pattern: "components/**",
            //   group: "internal",
            //   position: "after",
            // },
            // { pattern: "**/ui/**", group: "repo-ui", position: "after" },
          ],
          pathGroupsExcludedImportTypes: [],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
