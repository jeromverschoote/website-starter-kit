import { describe, expect, it } from "vitest";

import { handleConvertToLocale, withError } from "./format";

describe("handleConvertToLocale", () => {
  it("converts nl to nl-BE", () =>
    expect(handleConvertToLocale("nl")).toBe("nl-BE"));
  it("converts fr to fr-BE", () =>
    expect(handleConvertToLocale("fr")).toBe("fr-BE"));
  it("returns en unchanged", () =>
    expect(handleConvertToLocale("en")).toBe("en"));
  it("returns an unknown language unchanged", () =>
    expect(handleConvertToLocale("de")).toBe("de"));
});

describe("withError", () => {
  it("returns [undefined, data] when the promise resolves", async () => {
    const [error, data] = await withError(Promise.resolve("ok"));
    expect(error).toBeUndefined();
    expect(data).toBe("ok");
  });

  it("returns [error, undefined] when the promise rejects", async () => {
    const err = new Error("boom");
    const [error, data] = await withError(Promise.reject(err));
    expect(error).toBe(err);
    expect(data).toBeUndefined();
  });

  it("works with object payloads", async () => {
    const payload = { id: 1, name: "test" };
    const [error, data] = await withError(Promise.resolve(payload));
    expect(error).toBeUndefined();
    expect(data).toEqual(payload);
  });
});
