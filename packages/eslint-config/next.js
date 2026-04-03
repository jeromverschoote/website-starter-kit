import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
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
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
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
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
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
