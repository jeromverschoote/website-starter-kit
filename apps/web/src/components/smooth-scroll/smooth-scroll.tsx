'use client';

import React, { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import ReactLenis, { useLenis } from 'lenis/react';

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, searchParams, lenis]);

  return (
    <ReactLenis root options={{ lerp: 0.15, smoothWheel: true, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
