export const handleConvertFormDataToObject = <T>(formData: FormData) => {
  let data = {};
  const keys = formData.keys();
  for (const key of keys) {
    data = { ...data, [key]: formData.get(key) };
  }
  return data as T;
};

export const handleConvertObjectToFormData = (object: {
  [key: string]: FormDataEntryValue;
}) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (value !== undefined) {
      formData.append(key, value);
    }
  });
  return formData;
};
