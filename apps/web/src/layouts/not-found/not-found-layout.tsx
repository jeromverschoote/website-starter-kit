import { headers } from 'next/headers';

import i18n, { getDictionary } from 'config/i18n';

import { styles } from '.';

const getLocale = async (): Promise<string> => {
  const list = await headers();
  const pathname = list.get('x-invoke-path') ?? list.get('next-url') ?? '';
  const first = pathname.split('/').filter(Boolean)[0] ?? '';
  return (i18n.locales as readonly string[]).includes(first)
    ? first
    : i18n.defaultLocale;
};

/** Generic 404 layout. Detects the locale from the request to localize text. */
const NotFoundLayout = async () => {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const notFound = t.layout.notFound;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{notFound.heading}</h1>
      <p className={styles.description}>{notFound.description}</p>
      <a className={styles.button} href={`/${locale}`}>
        {notFound.button}
      </a>
    </section>
  );
};

export default NotFoundLayout;
