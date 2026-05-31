import { Fragment } from 'react';

import {
  sectionComponents,
  type TSection,
  type TSectionComponent,
} from './registry';

type TProps = {
  sections: TSection[];
  locale?: string;
  /** Override the registry — primarily for testing. */
  components?: Record<string, TSectionComponent>;
};

/**
 * Renders an ordered array of Sanity sections by mapping each section's
 * `_type` to a registered React component. Unregistered types are skipped, and
 * sections with a `sectionId` are wrapped in an anchor element for deep-linking.
 */
const DynamicSections = (props: TProps) => {
  const { sections, locale, components = sectionComponents } = props;

  if (!sections.length) {
    return null;
  }

  return (
    <>
      {sections.map((section) => {
        const Component = components[section._type];

        if (!Component) {
          return null;
        }

        const element = <Component section={section} locale={locale} />;

        return section.sectionId ? (
          <div key={section._key} id={section.sectionId}>
            {element}
          </div>
        ) : (
          <Fragment key={section._key}>{element}</Fragment>
        );
      })}
    </>
  );
};

export default DynamicSections;
