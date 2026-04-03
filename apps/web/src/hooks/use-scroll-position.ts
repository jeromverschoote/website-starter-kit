import { useEffect, useState } from 'react';

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  function handleScroll() {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const windowScroll = document.documentElement.scrollTop;

    const scrolled = (windowScroll / height) * 100;

    setScrollPosition(scrolled);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const scrollTo = (targetY: number) => {
    if (typeof window === 'undefined') return;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  return { scrollPosition, scrollTo };
};

export { useScrollPosition };
