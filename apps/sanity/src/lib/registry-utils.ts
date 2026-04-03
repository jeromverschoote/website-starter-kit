import {
  ComposeIcon,
  CogIcon,
  DashboardIcon,
  MasterDetailIcon,
  SearchIcon,
} from '@sanity/icons';
import type { StructureBuilder } from 'sanity/structure';
import type { DocumentDefinition, ObjectDefinition } from 'sanity';

import type { CollectionEntry, PageEntry, SettingEntry } from '../registry';

// ─── Model derivation ─────────────────────────────────────────────────────────

/** Flat array of all document and object definitions — passed to schema.types in sanity.config.ts */
export const deriveAllModels = (
  pages: PageEntry[],
  collections: CollectionEntry[],
  settings: SettingEntry[],
  sections: ObjectDefinition[] = [],
): (DocumentDefinition | ObjectDefinition)[] => [
  ...pages.flatMap((p) => [p.layout.model, p.metadata.model]),
  ...collections.map((c) => c.model),
  ...settings.map((s) => s.model),
  ...sections,
];

/** Set of all singleton document type names — used to restrict actions in sanity.config.ts */
export const deriveSingletonTypes = (
  pages: PageEntry[],
  settings: SettingEntry[],
): Set<string> =>
  new Set([
    ...pages.flatMap((p) => [p.layout.model.name, p.metadata.model.name]),
    ...settings.filter((s) => s.singleton).map((s) => s.model.name),
  ]);

/** Array of all localized document type names — passed to documentInternationalization plugin */
export const deriveLocalizedTypes = (
  pages: PageEntry[],
  collections: CollectionEntry[],
  settings: SettingEntry[],
): string[] => [
  ...pages
    .filter((p) => p.localized)
    .flatMap((p) => [p.layout.model.name, p.metadata.model.name]),
  ...collections.filter((c) => c.localized).map((c) => c.model.name),
  ...settings.filter((s) => s.localized).map((s) => s.model.name),
];

// ─── Structure builder ────────────────────────────────────────────────────────

/** Builds the full Sanity Studio navigation tree from the registry */
export const buildStructure = (
  pages: PageEntry[],
  collections: CollectionEntry[],
  settings: SettingEntry[],
) =>
  (S: StructureBuilder) =>
    S.list()
      .title('Content')
      .items([
        // Pages
        S.listItem()
          .title('Pages')
          .id('pages')
          .icon(DashboardIcon)
          .child(
            S.list()
              .title('Pages')
              .items(
                pages.map((page) =>
                  S.listItem()
                    .title(page.title)
                    .id(page.id)
                    .icon(page.icon)
                    .child(
                      S.list()
                        .title(page.title)
                        .items([
                          S.listItem()
                            .title('Layout')
                            .id(page.layout.model.name)
                            .icon(MasterDetailIcon)
                            .child(
                              S.document()
                                .schemaType(page.layout.model.name)
                                .documentId(page.layout.model.name)
                                .title('Layout'),
                            ),
                          S.listItem()
                            .title('Metadata & SEO')
                            .id(page.metadata.model.name)
                            .icon(SearchIcon)
                            .child(
                              S.document()
                                .schemaType(page.metadata.model.name)
                                .documentId(page.metadata.model.name)
                                .title('Metadata & SEO'),
                            ),
                        ]),
                    ),
                ),
              ),
          ),

        // Collections
        S.listItem()
          .title('Collections')
          .id('collections')
          .icon(ComposeIcon)
          .child(
            S.list()
              .title('Collections')
              .items(
                collections.map((collection) =>
                  S.documentTypeListItem(collection.model.name)
                    .title(collection.title)
                    .icon(collection.icon),
                ),
              ),
          ),

        // Settings
        S.listItem()
          .title('Settings')
          .id('settings')
          .icon(CogIcon)
          .child(
            S.list()
              .title('Settings')
              .items(
                settings.map((setting) =>
                  setting.singleton
                    ? S.listItem()
                        .title(setting.title)
                        .id(setting.model.name)
                        .icon(setting.icon)
                        .child(
                          S.document()
                            .schemaType(setting.model.name)
                            .documentId(setting.model.name)
                            .title(setting.title),
                        )
                    : S.documentTypeListItem(setting.model.name)
                        .title(setting.title)
                        .icon(setting.icon),
                ),
              ),
          ),
      ]);
