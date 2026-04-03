import { client } from "../../config/sanity";

import { withError } from "../../helpers/format";

type WithErrorResult<T> = Promise<[Error | undefined, T | undefined]>;

const get = <T>(query: string, params?: Record<string, unknown>): WithErrorResult<T[]> => {
  return withError(client.fetch(query, params));
};

const sanity = {
  get,
};

export default sanity;
