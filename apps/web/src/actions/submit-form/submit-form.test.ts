import { describe, expect, it } from 'vitest';

import { handleSubmitForm } from './submit-form';

const formData = (entries: Record<string, string>): FormData => {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.append(key, value);
  return data;
};

describe('handleSubmitForm', () => {
  it('returns a success response for valid input', async () => {
    const result = await handleSubmitForm(
      formData({ name: 'Jerom', email: 'jerom@example.com' }),
      { locale: 'en' },
    );
    expect(result.status).toBe('success');
    expect(result.errors).toBeUndefined();
  });

  it('returns field errors for missing and invalid input', async () => {
    const result = await handleSubmitForm(formData({ email: 'not-an-email' }), {
      locale: 'en',
    });
    expect(result.status).toBe('error');
    expect(result.errors).toMatchObject({ name: 'required', email: 'invalid' });
  });
});
