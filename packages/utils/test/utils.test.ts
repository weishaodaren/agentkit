import { describe, it, expect } from "vitest";
import { generateId, delay, hasKey, compact } from "../src";

describe("generateId", () => {
  it("returns a valid UUID", () => {
    const id = generateId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("returns unique values on consecutive calls", () => {
    expect(generateId()).not.toBe(generateId());
  });
});

describe("delay", () => {
  it("resolves after the given milliseconds", async () => {
    const start = Date.now();
    await delay(20);
    expect(Date.now() - start).toBeGreaterThanOrEqual(15);
  });
});

describe("hasKey", () => {
  it("returns true for existing keys", () => {
    expect(hasKey({ a: 1 }, "a")).toBe(true);
  });

  it("returns false for missing keys", () => {
    expect(hasKey({ a: 1 }, "b")).toBe(false);
  });

  it("narrows the key type for type-safe access", () => {
    const obj: Record<string, unknown> = { a: 1 };
    if (hasKey(obj, "a")) {
      expect(obj.a).toBe(1);
    }
  });
});

describe("compact", () => {
  it("removes null and undefined values", () => {
    const result = compact({ a: 1, b: null, c: undefined, d: "x", e: 0 });
    expect(result).toEqual({ a: 1, d: "x", e: 0 });
  });

  it("preserves falsy but defined values (0, empty string, false)", () => {
    const result = compact({ a: 0, b: "", c: false });
    expect(result).toEqual({ a: 0, b: "", c: false });
  });
});
