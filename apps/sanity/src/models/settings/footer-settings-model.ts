import { defineField } from 'sanity';
import asSettingsModel from '../../hocs/as-settings-model';

export default asSettingsModel({
  name: 'footer-settings',
  localized: true,

  fields: [
    defineField({
      name: 'logo',
      type: 'image',
      title: 'Logo',
      description:
        'A simplified or alternate version of your logo displayed in the footer. Reinforces brand identity at the bottom of every page.',
    }),
    defineField({
      name: 'credits',
      type: 'string',
      title: 'Credits',
      description:
        'Copyright line shown at the bottom of the footer. Use {year} as a placeholder for the current year.',
      placeholder: '{year} © My Brand. All rights reserved.',
    }),
  ],
});
