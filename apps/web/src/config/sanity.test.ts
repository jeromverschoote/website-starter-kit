import { afterEach, describe, expect, it, vi } from 'vitest';

import sanity from './sanity';

describe('sanity.get', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns [undefined, data] on a successful fetch', async () => {
    const data = [{ _id: '1', title: 'Hello' }];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: () => Promise.resolve(data) }),
    );

    const [error, result] = await sanity.get('*[_type == "post"]');

    expect(error).toBeUndefined();
    expect(result).toEqual(data);
  });

  it('returns [error, undefined] when the fetch throws', async () => {
    const failure = new Error('network down');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(failure));

    const [error, result] = await sanity.get('*');

    expect(error).toBe(failure);
    expect(result).toBeUndefined();
  });

  it('encodes the query into the request URL', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve([]) });
    vi.stubGlobal('fetch', fetchMock);

    await sanity.get('*[_type == "post"]');

    const calledUrl = fetchMock.mock.calls[0]![0] as string;
    expect(calledUrl).toContain(encodeURIComponent('*[_type == "post"]'));
  });
});
