import {
  ControlsIcon,
  DocumentTextIcon,
  HomeIcon,
  MasterDetailIcon,
  MenuIcon,
  PinIcon,
  SearchIcon,
  SplitHorizontalIcon,
  TargetIcon,
  ThumbsUpIcon,
} from '@sanity/icons';
import type { ComponentType } from 'react';
import type { DocumentDefinition } from 'sanity';

export { sectionEntries as sections } from './sections';
export type { SectionEntry } from './sections';

import homeLayoutPage from './models/pages/home/home-layout-page-model';
import homeMetadataPage from './models/pages/home/home-metadata-page-model';

import postCollection from './models/collections/post-collection-model';

import announcementSettings from './models/settings/announcement-settings-model';
import ctaSettings from './models/settings/cta-settings-model';
import footerSettings from './models/settings/footer-settings-model';
import generalSettings from './models/settings/general-settings-model';
import legalSettings from './models/settings/legal-settings-model';
import metaSettings from './models/settings/meta-settings-model';
import navigationSettings from './models/settings/navigation-settings-model';
import socialsSettings from './models/settings/socials-settings-model';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PageEntry = {
  id: string;
  title: string;
  icon: ComponentType;
  layout: { model: DocumentDefinition; icon: ComponentType };
  metadata: { model: DocumentDefinition; icon: ComponentType };
  localized?: boolean;
};

export type CollectionEntry = {
  model: DocumentDefinition;
  title: string;
  icon: ComponentType;
  localized?: boolean;
};

export type SettingEntry = {
  model: DocumentDefinition;
  title: string;
  icon: ComponentType;
  singleton: boolean;
  localized?: boolean;
};

// ─── Registry ─────────────────────────────────────────────────────────────────
// This is the single file to update when adding a new page or collection type.
// sanity.config.ts and main-structure.ts derive everything from these arrays.

export const pages: PageEntry[] = [
  {
    id: 'home-page',
    title: 'Home',
    icon: HomeIcon,
    layout: { model: homeLayoutPage, icon: MasterDetailIcon },
    metadata: { model: homeMetadataPage, icon: SearchIcon },
    localized: true,
  },
  // Add new pages here — e.g.:
  // {
  //   id: 'about-page',
  //   title: 'About',
  //   icon: UserIcon,
  //   layout:   { model: aboutLayoutPage,   icon: MasterDetailIcon },
  //   metadata: { model: aboutMetadataPage, icon: SearchIcon },
  //   localized: true,
  // },
];

export const collections: CollectionEntry[] = [
  {
    model: postCollection,
    title: 'Posts',
    icon: DocumentTextIcon,
    localized: true,
  },
  // Add new collections here — e.g.:
  // { model: caseCollection, title: 'Cases', icon: CaseIcon, localized: true },
];

export const settings: SettingEntry[] = [
  {
    model: generalSettings,
    title: 'General',
    icon: ControlsIcon,
    singleton: true,
  },
  {
    model: metaSettings,
    title: 'Meta & SEO',
    icon: SearchIcon,
    singleton: true,
  },
  {
    model: navigationSettings,
    title: 'Navigation',
    icon: MenuIcon,
    singleton: true,
    localized: true,
  },
  {
    model: announcementSettings,
    title: 'Announcements',
    icon: PinIcon,
    singleton: false,
  },
  {
    model: socialsSettings,
    title: 'Socials',
    icon: ThumbsUpIcon,
    singleton: false,
  },
  {
    model: ctaSettings,
    title: 'CTA',
    icon: TargetIcon,
    singleton: true,
    localized: true,
  },
  {
    model: legalSettings,
    title: 'Documents',
    icon: DocumentTextIcon,
    singleton: false,
  },
  {
    model: footerSettings,
    title: 'Footer',
    icon: SplitHorizontalIcon,
    singleton: true,
    localized: true,
  },
];
