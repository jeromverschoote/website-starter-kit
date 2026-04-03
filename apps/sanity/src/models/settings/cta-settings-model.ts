import { defineField } from 'sanity';
import asSettingsModel from '../../hocs/as-settings-model';
import UrlInput from '../../components/url-input';

export default asSettingsModel({
  name: 'cta-settings',
  title: 'Call-to-action',
  localized: true,

  fields: [
    defineField({
      name: 'title',
      type: 'string',

      title: 'Title',
      description:
        'The title provides a short, compelling headline that clearly communicates the purpose of the call-to-action (CTA), motivating visitors to take immediate action.',
      placeholder: 'Subscribe to our Newsletter',
    }),
    defineField({
      name: 'description',
      type: 'text',

      title: 'Description',
      description:
        'The call-to-action description provides additional context or persuasive details that support the headline and button label. It clearly explains the value or benefit users will gain by performing the intended action, encouraging higher engagement and conversions.',
      placeholder:
        'Join over 10,000 subscribers to receive weekly insights, exclusive offers, and tips directly in your inbox.',
    }),
    defineField({
      name: 'button',
      type: 'object',

      title: 'Button',

      fields: [
        {
          name: 'link',
          type: 'object',

          title: 'Link',
          description:
            'A link that directs users to a specific page or resource after clicking the CTA button. It provides immediate access to relevant content, promotions, or offers highlighted in the call-to-action, driving user engagement and conversions.',

          fields: [
            {
              name: 'url',
              type: 'string',
            },
            {
              name: 'isExternal',
              type: 'boolean',
            },
          ],

          components: {
            input: UrlInput as any,
          },
        },
        {
          name: 'label',
          type: 'string',
          title: 'Label',
          description:
            'The button label is a concise, actionable phrase displayed on the CTA button, prompting visitors to click and complete the intended action.',
          placeholder: 'Subscribe Now',
        },
      ],
    }),
  ],
});
