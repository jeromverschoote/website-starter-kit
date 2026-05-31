import { Suspense } from 'react';

import type { TLocale } from 'config/i18n';

import HeroSection from './_components/hero-section';

import { styles } from '.';

type TProps = { params: Promise<{ locale: TLocale }> };

/**
 * Page component: composes sections, does no fetching itself. Each section is
 * an async server component that owns its data — wrap them in <Suspense> so
 * they stream independently. See docs/component-guidelines.md.
 */
const HomeLandingPage = (props: TProps) => {
  const { params } = props;

  return (
    <Suspense fallback={<div className={styles.heroFallback} />}>
      <HeroSection params={params} />
    </Suspense>
  );
};

export default HomeLandingPage;
