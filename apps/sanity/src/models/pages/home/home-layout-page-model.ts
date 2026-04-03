import { defineField } from 'sanity';

import asHomeLayoutPageModel from '../../../hocs/as-home-layout-page-model';
import { allSectionModels } from '../../../sections';

export default asHomeLayoutPageModel({
  name: 'home-layout-page',
  title: 'Home — Layout',

  // Pass sections to enable the page builder.
  // Editors can add, remove, and reorder sections in the studio.
  sections: allSectionModels,

  // Add page-specific fields below.
  // The heroSection (title + description) is already included by the HOC.
  fields: [
    defineField({
      name: 'featuredPosts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post-collection' }] }],
      title: 'Featured posts',
      description: 'Select posts to highlight on the homepage.',
    }),
  ],
});
