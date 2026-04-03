import { http, HttpResponse } from 'msw';

const SANITY_URL = /https:\/\/.+\.api\.sanity\.io\/.+\/data\/query\/.+/;

export const sanityHandlers = [
  http.get(SANITY_URL, () => {
    return HttpResponse.json({ result: [] });
  }),
];
