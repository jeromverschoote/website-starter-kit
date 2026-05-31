import { useState, useEffect, useCallback } from 'react';

import { useParams } from 'next/navigation';

import { getDictionary, TDictionary } from 'config/i18n';

export const useDictionary = () => {
  const [dictionary, setDictionary] = useState<TDictionary | undefined>();
  const params = useParams();

  const { locale } = params;

  const handleFetchDictionary = useCallback(async () => {
    const result = await getDictionary(locale as string);
    setDictionary(result);
  }, [locale]);

  useEffect(() => {
    // Async, locale-dependent data fetch — setState runs after the await, not
    // synchronously, so it does not trigger the cascading renders the rule guards.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void handleFetchDictionary();
  }, [handleFetchDictionary]);

  return { dictionary };
};
