'use client';

import { ReactNode, useEffect } from 'react';

import { PostHogProvider as Provider } from 'posthog-js/react';

// eslint-disable-next-line import/no-named-as-default
import posthog from 'posthog-js';

// import PostHogPageView from 'components/posthog-pageview/posthog-pageview';

type TProps = {
  children: ReactNode;
};

const PostHogProvider = (props: TProps) => {
  const { children } = props;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
        person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
      });
    }
  }, []);

  return (
    <Provider client={posthog}>
      {/* <PostHogPageView /> */}
      {children}
    </Provider>
  );
};

export default PostHogProvider;
