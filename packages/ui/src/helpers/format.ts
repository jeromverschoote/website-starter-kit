export const toClassName = (...values: (boolean | string | undefined)[]) => {
  return values.filter(Boolean).join(" ");
};

export const handleGenerateInitialsFromName = (name: string) => {
  let result = name;

  if (name) {
    result = name.charAt(0);
  }

  return result;
};

export const handleConvertFormDataToObject = <T>(formData: FormData) => {
  let data = {};
  const keys = formData.keys();
  for (const key of keys) {
    data = { ...data, [key]: formData.get(key) };
  }
  return data as T;
};

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
