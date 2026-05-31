import { useCallback, useEffect } from 'react';

export const useKeyPress = (key: string, effect: () => void) => {
  const callback = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === key) {
        effect();
      }
    },
    [effect, key],
  );

  useEffect(() => {
    document.addEventListener('keydown', callback);
    return () => { document.removeEventListener('keydown', callback); };
  }, [callback, key]);
};
