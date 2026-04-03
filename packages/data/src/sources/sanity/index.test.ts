import { describe, it, expect, vi, beforeEach } from 'vitest';

import sanity from './index';

vi.mock('../../config/sanity', () => ({
  client: {
    fetch: vi.fn(),
  },
}));

import { client } from '../../config/sanity';

const mockClient = client as { fetch: ReturnType<typeof vi.fn> };

describe('sanity source', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('returns [undefined, data] on success', async () => {
      const data = [{ _id: '1', title: 'Test' }];
      mockClient.fetch.mockResolvedValue(data);

      const [error, result] = await sanity.get('*[_type == "test"]');

      expect(error).toBeUndefined();
      expect(result).toEqual(data);
      expect(mockClient.fetch).toHaveBeenCalledWith('*[_type == "test"]', undefined);
    });

    it('returns [Error, undefined] when fetch throws', async () => {
      const fetchError = new Error('Network error');
      mockClient.fetch.mockRejectedValue(fetchError);

      const [error, result] = await sanity.get('*[_type == "test"]');

      expect(error).toBe(fetchError);
      expect(result).toBeUndefined();
    });

    it('passes through the query string to client.fetch', async () => {
      mockClient.fetch.mockResolvedValue([]);
      const query = '*[_type == "page" && language == "en"]';

      await sanity.get(query);

      expect(mockClient.fetch).toHaveBeenCalledWith(query, undefined);
    });
  });
});
