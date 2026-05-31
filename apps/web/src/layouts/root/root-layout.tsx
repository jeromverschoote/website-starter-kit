import { Suspense } from 'react';

import localFont from 'next/font/local';

import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

import { dir } from 'i18next';
import { ViewTransitions } from 'next-view-transitions';

import i18n from 'config/i18n';

import { toClassName } from 'helpers/format';

import Providers from 'components/providers';

import { styles } from '.';

const font = localFont({
  src: '../../app/fonts/manrope.ttf',
  weight: '100 900',
});

type TProps = {
  children: React.ReactNode;
};

const RootLayout = (props: TProps) => {
  const { children } = props;

  return (
    <Suspense>
      <ViewTransitions>
        <html
          lang={i18n.defaultLocale}
          dir={dir(i18n.defaultLocale)}
          suppressHydrationWarning
          className={styles.html}
        >
          {process.env.GOOGLE_TAG_MANAGER_ID && (
            <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID} />
          )}
          {process.env.GOOGLE_ANALYTICS_ID && (
            <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
          )}

          <body className={toClassName(font.className, styles.body)}>
            <a href="#main-content" className={styles.skipLink}>
              Skip to main content
            </a>
            <Providers>
              <main id="main-content">{children}</main>
            </Providers>
          </body>
        </html>
      </ViewTransitions>
    </Suspense>
  );
};

export default RootLayout;
