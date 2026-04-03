export const toClassName = (...values: (boolean | string | undefined)[]) => {
  return values.filter(Boolean).join(' ');
};

export const handleGenerateInitialsFromName = (name: string) => {
  if (name) return name.charAt(0);
  return name;
};

export const handleFormatDate = (
  date: string,
  dict: { enum?: { date?: { month?: Record<string, string> } } },
) => {
  const dateObject = new Date(date);
  return `${dateObject.getDate()} ${dict.enum?.date?.month?.[dateObject.getMonth()]} ${dateObject.getFullYear()}`;
};

export const handleConvertToLocale = (lang: string) => {
  let result = lang;

  switch (lang) {
    case 'nl':
      result = 'nl-BE';
      break;
    case 'fr':
      result = 'fr-BE';
      break;
    case 'en':
      result = 'en';
      break;
  }

  return result;
};

export const convertDateToHHmm = (dateObj: Date) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.error('Invalid input: Please provide a valid Date object.');
    return '';
  }

  const hours = `0${dateObj.getHours()}`.slice(-2);
  const minutes = `0${dateObj.getMinutes()}`.slice(-2);

  return `${hours}:${minutes}`;
};

export const sortByDate = <T extends { date: Date | string }>(
  items: T[],
  order: 'asc' | 'desc' = 'asc',
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return order === 'asc'
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
};

export const slugify = (inputString: string): string => {
  return inputString
    .toLowerCase()
    .replace(/[^a-z0-9\s\-/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};
