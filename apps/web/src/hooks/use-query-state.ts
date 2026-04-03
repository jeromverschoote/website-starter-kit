'use client';

import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useLenis } from 'lenis/react';

export function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const lenis = useLenis();

  const filter = params.get('filter') || null;

  const setFilter = useCallback(
    (value?: string) => {
      if (!lenis) {
        router.replace(value ? `${pathname}?filter=${value}` : pathname, {
          scroll: false,
        });
        return;
      }

      const currentPos = lenis.animatedScroll;

      lenis.stop();

      const current = new URLSearchParams(params.toString());
      if (value === undefined) current.delete('filter');
      else current.set('filter', value);

      const query = current.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      router.replace(url, { scroll: false });

      requestAnimationFrame(() => {
        // Restart Lenis after navigating. 300 is tested minimum
        setTimeout(() => {
          lenis.start();
        }, 300);

        lenis.scrollTo(currentPos, { immediate: true });
      });
    },
    [pathname, params, router, lenis],
  );

  return { filter, setFilter };
}
