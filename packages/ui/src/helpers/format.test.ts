import { describe, expect, it } from "vitest";

import {
  handleConvertFormDataToObject,
  handleConvertToLocale,
  handleGenerateInitialsFromName,
  toClassName,
} from "./format";

describe("toClassName", () => {
  it("joins multiple class names", () => {
    expect(toClassName("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(toClassName("foo", false, undefined, "bar")).toBe("foo bar");
  });

  it("returns an empty string when all values are falsy", () => {
    expect(toClassName(false, undefined)).toBe("");
  });
});

describe("handleGenerateInitialsFromName", () => {
  it("returns the first character of the name", () => {
    expect(handleGenerateInitialsFromName("Bob")).toBe("B");
  });

  it("returns an empty string unchanged", () => {
    expect(handleGenerateInitialsFromName("")).toBe("");
  });
});

describe("handleConvertFormDataToObject", () => {
  it("converts FormData entries to a plain object", () => {
    const formData = new FormData();
    formData.append("name", "Alice");
    formData.append("role", "admin");

    const result = handleConvertFormDataToObject<{
      name: string;
      role: string;
    }>(formData);

    expect(result).toEqual({ name: "Alice", role: "admin" });
  });

  it("returns an empty object for empty FormData", () => {
    expect(handleConvertFormDataToObject(new FormData())).toEqual({});
  });
});

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
