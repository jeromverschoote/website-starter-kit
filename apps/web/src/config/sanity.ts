type WithErrorResult<T> = Promise<[Error | undefined, T | undefined]>;

const get = async <T>(query: string): WithErrorResult<T[]> => {
  const url = `https://${process.env.SANITY_STUDIO_PROJECT_ID}.api.sanity.io/2025-10-25/data/query/${process.env.SANITY_STUDIO_DATASET_ID}?query=${encodeURIComponent(
    query,
  )}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}),
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return [undefined, result];
  } catch (err) {
    return [err as Error, undefined];
  }
};

const sanity = {
  get,
};

export default sanity;
