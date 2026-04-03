import { documentInternationalization } from '@sanity/document-internationalization';
import { visionTool } from '@sanity/vision';
import { media as mediaTool } from 'sanity-plugin-media';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { enhancedGroupsDefinition } from './src/helpers';
import {
  buildStructure,
  deriveAllModels,
  deriveLocalizedTypes,
  deriveSingletonTypes,
} from './src/lib/registry-utils';
import { collections, pages, settings } from './src/registry';
import { allSectionModels } from './src/sections';
import Logo from './src/components/logo';

// ─── Derive everything from the registry ──────────────────────────────────────

const singletonTypes = deriveSingletonTypes(pages, settings);
const localizedTypes = deriveLocalizedTypes(pages, collections, settings);
const allModels = deriveAllModels(
  pages,
  collections,
  settings,
  allSectionModels,
);

const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

// ─── Supported languages ──────────────────────────────────────────────────────
// Add more languages here as needed.

const supportedLanguages = [{ id: 'en', title: 'English' }];

// ─── Config ───────────────────────────────────────────────────────────────────

export default defineConfig({
  icon: Logo,

  name: 'content-studio',
  title: 'Content Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET_ID as string,

  plugins: [
    structureTool({
      structure: buildStructure(pages, collections, settings),
      title: 'Content',
    }),

    mediaTool(),

    visionTool({ title: 'Debug' }),

    documentInternationalization({
      supportedLanguages,
      schemaTypes: localizedTypes,
    }),
  ],

  schema: {
    types: [...enhancedGroupsDefinition(allModels)],

    // Prevent singleton types from appearing in the global "New document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Restrict available actions for singleton documents
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,

    // Hide language-specific "New document" options created by the i18n plugin
    newDocumentOptions: (prev) =>
      prev.filter(
        (item) =>
          !supportedLanguages.some((lang) =>
            item.templateId?.endsWith(`__i18n_${lang.id}`),
          ),
      ),
  },
});
