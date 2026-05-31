'use server';

import { getDictionary, type TLocale } from 'config/i18n';

export type TFormResponse = {
  status: 'success' | 'error';
  message: { title: string; description: string };
  errors?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const asString = (value: FormDataEntryValue | null): string =>
  typeof value === 'string' ? value.trim() : '';

const validate = (formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  const name = asString(formData.get('name'));
  const email = asString(formData.get('email'));

  if (!name) errors.name = 'required';
  if (!email) errors.email = 'required';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'invalid';

  return errors;
};

/**
 * Example server action. Demonstrates the pattern: validate → (side effects) →
 * typed, locale-aware response. Replace the fields and the side-effect block
 * with your own; keep the shape.
 */
export const handleSubmitForm = async (
  formData: FormData,
  options: { locale: TLocale },
): Promise<TFormResponse> => {
  const t = await getDictionary(options.locale);
  const errors = validate(formData);

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: {
        title: t.data.email.error.title,
        description: t.data.email.error.description,
      },
      errors,
    };
  }

  // Side effects (persist to a DB/CMS, send a notification, etc.) go here.

  return {
    status: 'success',
    message: {
      title: t.data.email.success.title,
      description: t.data.email.success.description,
    },
  };
};
