export const handleConvertToLocale = (lang: string) => {
  let result = lang;

  switch (lang) {
    case "nl":
      result = "nl-BE";
      break;
    case "fr":
      result = "fr-BE";
      break;
    case "en":
      result = "en";
      break;
  }

  return result;
};

export async function withError<T>(
  promise: Promise<T>,
): Promise<[Error | undefined, T | undefined]> {
  try {
    const result = await promise;
    return [undefined, result];
  } catch (err) {
    return [err as Error, undefined];
  }
}
