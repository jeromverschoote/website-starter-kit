import sanity from '@repo/data/sanity';

import { getDictionary, type TLocale } from 'config/i18n';

import { styles } from '.';
import { homeHeroQuery } from '../../home-landing-page.queries';

type TProps = { params: Promise<{ locale: TLocale }> };

type THomeHero = { heroSection?: { title?: string; description?: string } };

/**
 * Async server component that owns its own Sanity fetch and renders gracefully
 * when there is no data. Fetch translations and CMS data in parallel.
 */
const HeroSection = async (props: TProps) => {
  const { params } = props;
  const { locale } = await params;

  const [t, [error, data]] = await Promise.all([
    getDictionary(locale),
    sanity.get<THomeHero>(homeHeroQuery, { locale }),
  ]);

  if (error) {
    console.error(JSON.stringify(error));
  }

  const hero = data?.[0]?.heroSection;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{hero?.title ?? t.view.home.hero.heading}</h1>
      <p className={styles.description}>
        {hero?.description ?? t.view.home.hero.description}
      </p>
    </section>
  );
};

export default HeroSection;
