import { setupServer } from 'msw/node';

import { notionHandlers } from './handlers/notion.handlers';
import { sanityHandlers } from './handlers/sanity.handlers';
import { upstashHandlers } from './handlers/upstash.handlers';

export const server = setupServer(
  ...sanityHandlers,
  ...notionHandlers,
  ...upstashHandlers,
);
