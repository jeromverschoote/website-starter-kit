import { http, HttpResponse } from 'msw';

export const upstashHandlers = [
  http.post(/https:\/\/.+\.upstash\.io\/.*/, () => {
    return HttpResponse.json([{ result: 1 }]);
  }),
];
