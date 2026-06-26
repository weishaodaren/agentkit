import { cn } from "@/shared/cn";

describe("cn", () => {
  it("merges simple class strings", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("dedupes conflicting tailwind classes (twMerge)", () => {
    // twMerge: last conflicting class wins
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional values via clsx", () => {
    expect(cn("base", { hidden: true, visible: false })).toBe("base hidden");
    expect(cn("base", { hidden: false, visible: true })).toBe("base visible");
  });

  it("skips falsy values", () => {
    expect(cn("base", false, null, undefined, "", "end")).toBe("base end");
  });

  it("handles arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("combines twMerge + clsx", () => {
    // clsx merges objects/arrays, then twMerge resolves conflicts
    expect(cn("p-2", { "p-4": true, "m-1": true })).toBe("p-4 m-1");
  });
});
