import { http, HttpResponse } from 'msw';

export const notionHandlers = [
  http.post('https://api.notion.com/v1/pages', () => {
    return HttpResponse.json({
      id: 'mock-page-id',
      object: 'page',
      created_time: new Date().toISOString(),
    });
  }),
];
