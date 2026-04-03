import { Suspense } from 'react';

import PostHogProvider from 'providers/posthog/posthog-provider';
import ToastProvider from 'providers/toast-provider';

import i18n, { getDictionary } from 'config/i18n';

import CookieConsent from 'components/cookie-consent';
import SmoothScroll from 'components/smooth-scroll/smooth-scroll';

type TProps = {
  children: React.ReactNode;
};

const Providers = async (props: TProps) => {
  const { children } = props;

  const dictionary = await getDictionary(i18n.defaultLocale);

  return (
    <Suspense>
      <SmoothScroll>
        <PostHogProvider>
          {children}
          <CookieConsent dictionary={dictionary} />
          <ToastProvider />
        </PostHogProvider>
      </SmoothScroll>
    </Suspense>
  );
};

export default Providers;
