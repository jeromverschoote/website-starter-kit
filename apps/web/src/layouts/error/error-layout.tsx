'use client';

import Link from 'next/link';

import enDictionary from 'dictionaries/en.json';

import { styles } from '.';

// Error boundaries are client components and receive { error, reset } from
// Next.js. This generic layout links back home; wire up `reset` for a retry
// button if you prefer. Client components can't call getDictionary, so it reads
// the default-locale dictionary directly.
const ErrorLayout = () => {
  const t = enDictionary.layout.error;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t.heading}</h1>
      <p className={styles.description}>{t.description}</p>
      <Link className={styles.button} href="/">
        {t.button}
      </Link>
    </section>
  );
};

export default ErrorLayout;
