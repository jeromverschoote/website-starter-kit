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
    handleFetchDictionary();
  }, [handleFetchDictionary]);

  return { dictionary };
};
