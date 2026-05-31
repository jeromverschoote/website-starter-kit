import { describe, expect, it } from 'vitest';

import {
  handleConvertFormDataToObject,
  handleConvertObjectToFormData,
} from './form';

describe('handleConvertFormDataToObject', () => {
  it('converts every form field into an object', () => {
    const formData = new FormData();
    formData.append('name', 'Jerom');
    formData.append('email', 'a@b.com');

    expect(handleConvertFormDataToObject(formData)).toEqual({
      name: 'Jerom',
      email: 'a@b.com',
    });
  });

  it('returns an empty object for empty form data', () => {
    expect(handleConvertFormDataToObject(new FormData())).toEqual({});
  });
});

describe('handleConvertObjectToFormData', () => {
  it('appends each defined value to the form data', () => {
    const formData = handleConvertObjectToFormData({ name: 'Jerom', city: 'Ghent' });
    expect(formData.get('name')).toBe('Jerom');
    expect(formData.get('city')).toBe('Ghent');
  });

  it('skips undefined values', () => {
    const formData = handleConvertObjectToFormData({
      name: 'Jerom',
      missing: undefined as unknown as string,
    });
    expect(formData.get('name')).toBe('Jerom');
    expect(formData.has('missing')).toBe(false);
  });
});
