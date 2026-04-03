import { defineField } from 'sanity';
import asSettingsModel from '../../hocs/as-settings-model';

export default asSettingsModel({
  name: 'general-settings',

  fields: [
    defineField({
      name: 'logo',
      type: 'image',

      title: 'Logo',
      description:
        'The primary visual representation of your brand or organization, typically displayed in the website header and across key branding elements. It should reflect your identity, values, and mission.',

      validation: (rule) => rule.required().error(),
    }),
    defineField({
      name: 'info',
      type: 'object',

      title: 'Info',
      description:
        'General identifying and contact information for an organization. This set of fields can be used for display on the website, administrative purposes, or internal reference.',

      fields: [
        {
          name: 'name',
          type: 'string',

          title: 'Name',
          description: 'The full name of the organization.',
        },
        {
          name: 'address',
          type: 'string',

          title: 'Address',
          description: ' The physical or mailing address for correspondence.',
        },
        {
          name: 'telephoneNumber',
          type: 'string',

          title: 'Telephone number',
          description:
            'A phone number for direct communication, including country code if applicable.',
        },
        {
          name: 'vatNumber',
          type: 'string',

          title: 'VAT number',
          description:
            'The Value Added Tax identification number, if applicable, for business or legal purposes.',
        },
      ],
    }),
  ],
});
